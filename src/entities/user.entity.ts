import { Entity, PrimaryColumn, Column, BeforeInsert, Index } from 'typeorm';
import { randomUUID } from 'crypto';

@Index('IDX_USER_EMAIL', ['email'], { unique: true })
@Index('IDX_USER_APIKEY_ENCRYPTED', ['apiKeyEncrypted'], { unique: true })
@Index('IDX_USER_NAME', ['name'])
@Entity('users')
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  email: string;

  @Column('text')
  passwordHash: string;

  @Column('text')
  apiKeyEncrypted: string;

  @Column('timestamp')
  apiKeyCreatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  apiKeyExpiresAt: Date;

  @Column({ type: 'boolean', default: false })
  apiKeyRevoked: boolean;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @BeforeInsert()
  generateId() {
    this.id = randomUUID();
  }

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
  }

  // @BeforeInsert()
  // @BeforeUpdate()
  // async hashPassword() {
  //   if (!this.password) {
  //     this.passwordHash = await hashPassword(this.password);
  //   }
  // }

  // @BeforeInsert()
  // @BeforeUpdate()
  // encryptApiKey() {
  //   if (!this.apiKey) {
  //     this.apiKeyEncrypted = encryptApiKey(this.apiKey);
  //   }
  // }
}
