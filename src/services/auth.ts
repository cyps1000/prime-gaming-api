import { Request } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

/**
 * Imports services
 */
import { NotAuthorizedError, BadRequestError, TokenError } from "./error";

/**
 * Imports models
 */
import { RefreshToken } from "../models";

/**
 * Imports types
 */
import { AccessToken } from "../routes/auth/types";

/**
 * Defines the barebones Payload interface
 */
interface Payload {
  id: string;
}

/**
 * Defines the refresh token time
 */
const REFRESH_TOKEN_TIME = 60 * 60 * 12; // 12 hours

/**
 * Defines the access token time
 */
const ACCESS_TOKEN_TIME = 60 * 30; // 30 min

/**
 * Defines the auth service
 */
export class AuthService {
  /**
   * Handles verifying the authorization header
   * Returns the access token and refresh token
   */
  static async verify(authorization?: string, config?: { refresh: boolean }) {
    if (!authorization) {
      throw new BadRequestError("You are not authorized.");
    }

    /**
     * Verifies the jwt token
     */
    const token = jwt.verify(authorization, process.env.JWT_KEY!, {
      ignoreExpiration: true,
    });

    if (!token) {
      throw new NotAuthorizedError();
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
      throw new BadRequestError("Token has expired.");
    }

    /**
     * Checks to see if the access token and the refresh token are validly linked
     */
    if (refreshToken.tokenId !== accessToken.tkId) {
      throw new NotAuthorizedError();
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
      throw new TokenError("Access token has expired");
    }

    return { accessToken, refreshToken };
  }

  /**
   * Handles refreshing the access token
   */
  static async refresh(authorization?: string) {
    if (!authorization) {
      throw new BadRequestError("You are not authorized.");
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
}
