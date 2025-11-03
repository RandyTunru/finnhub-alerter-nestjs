import {
  Entity,
  PrimaryColumn,
  Column,
  BeforeInsert,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { randomUUID } from 'crypto';
import { User } from './user.entity';

export enum Condition {
  GREATER_THAN = 'GREATER_THAN',
  LESS_THAN = 'LESS_THAN',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  TRIGGERED = 'TRIGGERED',
  PAUSED = 'PAUSED',
}

@Index('UQ_USER_ALERT', ['userId', 'stockSymbol', 'targetPrice', 'condition'], {
  unique: true,
})
@Index('IDX_ALERT_ID', ['id'])
@Index('IDX_ALERT_USER_ID', ['userId'])
@Index('IDX_ALERT_STOCK_SYMBOL', ['stockSymbol'])
@Index('IDX_ALERT_STATUS', ['status'])
@Entity('alerts')
export class Alert {
  @PrimaryColumn('uuid')
  id: string;

  @Column('text')
  stockSymbol: string;

  @Column('float')
  targetPrice: number;

  @Column({ type: 'enum', enum: Condition })
  condition: Condition;

  @Column({ type: 'enum', enum: AlertStatus, default: AlertStatus.ACTIVE })
  status: AlertStatus;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @BeforeInsert()
  generateId() {
    this.id = randomUUID();
  }
}
