import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  createCipheriv,
  createDecipheriv,
  scryptSync,
  randomBytes,
  CipherGCM,
  DecipherGCM,
} from 'crypto';
import { compare, hash } from 'bcrypt';

@Injectable()
export class SecurityService implements OnModuleInit {
  private algorithm = 'aes-256-gcm';
  private ivLength = 16;
  private tagLength = 16;
  private tagPosition = this.ivLength;
  private encryptedPosition = this.ivLength + this.tagLength;
  private encryptionKey: Buffer;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const ENCRYPTION_KEY = this.configService.get<string>(
      'API_KEY_ENCRYPTION_SECRET',
    );
    if (!ENCRYPTION_KEY) {
      throw new Error(
        'API_KEY_ENCRYPTION_SECRET is not set in environment variables',
      );
    }
    this.encryptionKey = scryptSync(ENCRYPTION_KEY, 'salt', 32) as Buffer;
  }

  async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return compare(password, hash);
  }

  generateApiKey(): string {
    return randomBytes(32).toString('hex');
  }

  apiKeyExpirationDate(startDate: Date, daysValid: number): Date {
    const expirationDate = new Date(startDate);
    expirationDate.setDate(expirationDate.getDate() + daysValid);
    return expirationDate;
  }

  encryptApiKey(plainText: string): string {
    const iv = randomBytes(this.ivLength);

    const cipher = createCipheriv(
      this.algorithm,
      this.encryptionKey,
      iv,
    ) as CipherGCM;

    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, encrypted]).toString('hex');
  }

  decryptApiKey(cipherText: string): string {
    try {
      const cipherTextBuffer = Buffer.from(cipherText, 'hex');

      // Extract the components from the combined string
      const iv = cipherTextBuffer.subarray(0, this.ivLength);
      const tag = cipherTextBuffer.subarray(
        this.tagPosition,
        this.encryptedPosition,
      );
      const encrypted = cipherTextBuffer.subarray(this.encryptedPosition);

      // 3. Assert the type to DecipherGCM
      const decipher = createDecipheriv(
        this.algorithm,
        this.encryptionKey,
        iv,
      ) as DecipherGCM;

      decipher.setAuthTag(tag);

      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);
      return decrypted.toString('utf8');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to decrypt API key:', message);
      throw new Error('Invalid or tampered API key');
    }
  }
}
