import bcrypt from 'bcryptjs'

export class AuthUtils {
  /**
   * Hash a password using bcrypt
   * @param password - Plain text password
   * @param saltRounds - Number of salt rounds (default: 10)
   * @returns Hashed password
   */
  static async hashPassword(password: string, saltRounds: number = 10): Promise<string> {
    return await bcrypt.hash(password, saltRounds)
  }

  /**
   * Verify a password against its hash
   * @param password - Plain text password to verify
   * @param hash - Hashed password to compare against
   * @returns True if password matches hash
   */
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  /**
   * Generate a random salt
   * @param saltRounds - Number of salt rounds (default: 10)
   * @returns Generated salt
   */
  static async generateSalt(saltRounds: number = 10): Promise<string> {
    return await bcrypt.genSalt(saltRounds)
  }
}
