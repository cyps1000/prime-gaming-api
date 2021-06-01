import { Request } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";

/**
 * Imports services
 */
import { RequestError, ErrorTypes } from "./error";

/**
 * Imports models
 */
import { RefreshToken, Admin, User } from "../models";

/**
 * Imports types
 */
import { AccessToken } from "../routes/auth/types";

/**
 * Enables access to .env
 */
dotenv.config();

/**
 * Defines the barebones Payload interface
 */
interface Payload {
  id: string;
}

/**
 * Handles getting the token expiration time
 */
const getTokenExpTime = (
  env: string | undefined,
  type: "refresh" | "access"
) => {
  if (!env) {
    switch (type) {
      case "refresh":
        return 60 * 60 * 12; // 12 hours;
      case "access":
        return 60 * 30; // 30 minutes
      default:
        return 0;
    }
  }

  return parseInt(env);
};

/**
 * Defines the refresh token time
 */
const REFRESH_TOKEN_TIME = getTokenExpTime(
  process.env.REFRESH_TOKEN_EXP,
  "refresh"
);

/**
 * Defines the access token time
 */
const ACCESS_TOKEN_TIME = getTokenExpTime(
  process.env.ACCESS_TOKEN_EXP,
  "access"
);

/**
 * Defines the reource type
 */
type Resource = "user" | "admin";

/**
 * Defines the auth service
 */
export class AuthService {
  /**
   * Handles verifying the authorization header
   * Returns the access token and refresh token
   */
  static async verify(
    authorization?: string,
    config?: {
      refresh?: boolean;
      validate?: boolean;
      check?: Resource[];
    }
  ) {
    if (!authorization) {
      throw new RequestError(ErrorTypes.AuthorizationRequired);
    }

    /**
     * Verifies the jwt token
     */
    const token = jwt.verify(authorization, process.env.JWT_KEY!, {
      ignoreExpiration: true,
    });

    if (!token) {
      throw new RequestError(ErrorTypes.NotAuthorized);
    }

    /**
     * Defines the access token
     */
    const accessToken = token as AccessToken;

    /**
     * Gets the associated refresh token
     */
    const refreshToken = await RefreshToken.findById(accessToken.refreshToken);

    if (!refreshToken) {
      throw new RequestError(ErrorTypes.RefreshTokenExpired);
    }

    /**
     * Checks to see if the access token and the refresh token are validly linked
     */
    if (refreshToken.tokenId !== accessToken.tkId) {
      throw new RequestError(ErrorTypes.NotAuthorized);
    }

    /**
     * Checks if the access token is expired
     */
    const accessTokenExpired =
      new Date(accessToken.exp).getTime() < new Date().getTime() / 1000;

    /**
     * Checks if the verify is of type refresh (in which case the token can be expired)
     */
    const isRefresh = config ? config.refresh : false;

    if (accessTokenExpired && !isRefresh) {
      throw new RequestError(ErrorTypes.AccessTokenExpired);
    }

    /**
     * Checks the admin
     */
    if (config && config.validate && config.check) {
      /**
       * Should check admin account
       */
      const checkAdmin = config.check.includes("admin");

      /**
       * Should check only admin account
       */
      const adminOnly = checkAdmin && config.check.length === 1;

      /**
       * Should check user account
       */
      const checkUser = config.check.includes("user");

      /**
       * Defines the Admin token flag
       */
      const isAdminToken = accessToken.role === "prime-admin";

      if (checkUser || adminOnly) {
        if (isAdminToken && (checkAdmin || adminOnly || checkUser)) {
          /**
           * Searches for the admin in the db
           */
          const admin = await Admin.findById(accessToken.id);
          if (admin) return { accessToken, refreshToken };

          throw new RequestError(ErrorTypes.AccountNotFound);
        }

        if (adminOnly) throw new RequestError(ErrorTypes.NotAuthorized);

        /**
         * Searches for the user in the db
         */
        const user = await User.findById(accessToken.id);
        if (user) return { accessToken, refreshToken };

        throw new RequestError(ErrorTypes.AccountNotFound);
      }
    }

    return { accessToken, refreshToken };
  }

  /**
   * Handles refreshing the access token
   */
  static async refresh(authorization?: string) {
    if (!authorization) {
      throw new RequestError(ErrorTypes.AuthorizationRequired);
    }

    /**
     * Handles verifying the authorization header
     * @refresh flag will ensure that token can be expired
     */
    const { accessToken, refreshToken } = await this.verify(authorization, {
      refresh: true,
    });

    /**
     * Creates a token id
     */
    const tokenId = mongoose.Types.ObjectId().toHexString();

    /**
     * Defines the payload
     */
    const payload = {
      id: refreshToken.user,
      tkId: tokenId,
      role: accessToken.role,
      refreshToken: refreshToken.id,
    };

    /**
     * Creates an access token
     */
    const refreshedToken: unknown = this.sign<typeof payload>(payload, {
      expiresIn: ACCESS_TOKEN_TIME,
    });

    /**
     * Defines the new access token
     */
    const newAccessToken = refreshedToken as AccessToken;

    /**
     * Updates the token id inside the refresh token
     */
    refreshToken.tokenId = payload.tkId;

    await refreshToken.save();

    return { accessToken: newAccessToken, refreshToken };
  }

  /**
   * Handles creating a new access token
   */
  static sign<F extends Payload>(payload: F, options?: jwt.SignOptions) {
    return jwt.sign(payload, process.env.JWT_KEY!, options);
  }

  /**
   * Handles creating a new authentication
   * Creates a new refresh token and an access token
   */
  static async create<F extends Payload>(req: Request, payload: F) {
    /**
     * Creates a token id
     */
    const tokenId = mongoose.Types.ObjectId().toHexString();

    /**
     * Initializes the expires time for the refresh token
     */
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + REFRESH_TOKEN_TIME);

    /**
     * Creates the refresh token
     */
    const refreshTokenDoc = RefreshToken.build({
      user: payload.id,
      tokenId: tokenId,
      expiresAt: expiresAt,
      createdByIp: req.ip,
    });

    await refreshTokenDoc.save();

    /**
     * Defines the payload
     */
    const accessPayload = {
      ...payload,
      tkId: tokenId,
      refreshToken: refreshTokenDoc.id,
    };

    /**
     * Creates an access token
     */
    const _accessToken: unknown = this.sign<typeof accessPayload>(
      accessPayload,
      {
        expiresIn: ACCESS_TOKEN_TIME,
      }
    );

    const accessToken = _accessToken as AccessToken;

    return { accessToken, refreshToken: refreshTokenDoc };
  }

  /**
   * Handles getting the current user
   */
  static async getCurrentUser(token?: AccessToken) {
    if (!token) {
      throw new RequestError(ErrorTypes.TokenMissingFromReq);
    }

    /**
     * Initializes the current user
     */
    let currentUser: string = "";

    /**
     * Checks if the user is an admin
     */
    if (token.role === "prime-admin") {
      /**
       * Searches for the admin in the db
       */
      const admin = await Admin.findById(token.id);
      if (admin) {
        currentUser = admin.id;
        return { currentUser };
      }

      throw new RequestError(ErrorTypes.AccountNotFound);
    }

    /**
     * Searches for the user in the db
     */
    const user = await User.findById(token.id);
    if (user) {
      currentUser = user.id;
      return { currentUser };
    }

    throw new RequestError(ErrorTypes.AccountNotFound);
  }
}
