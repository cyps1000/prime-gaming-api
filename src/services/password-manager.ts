import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

/**
 * Promisifies the scrypt function
 */
const scryptAsync = promisify(scrypt);

/**
 * Defines the service
 * @see https://nodejs.org/api/crypto.html#crypto_crypto_scrypt_password_salt_keylen_options_callback
 */
export class PasswordManager {
  static passwordLength = 64;

  /**
   * Handles hashing the provided string
   */
  static async hash(password: string) {
    /**
     * Defines the password length
     */
    const pwLength = PasswordManager.passwordLength;

    /**
     * Generates cryptographically strong pseudorandom data.
     */
    const salt = randomBytes(16).toString("hex");

    /**
     * Derive the secret key from the password and the salt
     */
    const derivedKey = (await scryptAsync(password, salt, pwLength)) as Buffer;

    return `${derivedKey.toString("hex")}.${salt}`;
  }

  /**
   * Handles comparing the stored password with the supplied password
   */
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split(".");

    /**
     * Defines the password length
     */
    const pwLength = PasswordManager.passwordLength;

    /**
     * Derive the secret key from the supplied password and the salt
     */
    const derivedKey = (await scryptAsync(
      suppliedPassword,
      salt,
      pwLength
    )) as Buffer;

    return derivedKey.toString("hex") === hashedPassword;
  }
}
