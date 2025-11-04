import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Alert } from '../../entities/alert.entity';
import type {
  AlertItem,
  PostAlertRequest,
  GetAlertsResponse,
  PostAlertResponse,
  DeleteAlertResponse,
} from './alerts.type';
import { AlertStatus } from '../../entities/alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertsRepository: Repository<Alert>,
  ) {}

  async postAlert(
    headers: Record<string, string>,
    dto: PostAlertRequest,
  ): Promise<PostAlertResponse> {
    const userId = headers['user-id'];

    const checkResult = await this.alertsRepository
      .createQueryBuilder('alert')
      .select('COUNT(alert.id)', 'totalCount')
      .addSelect(
        `SUM(
          CASE WHEN 
            alert."stockSymbol" = :stockSymbol AND
            alert."targetPrice" = :targetPrice AND
            alert."condition" = :condition
          THEN 1 ELSE 0 END
        )`,
        'duplicateCount',
      )
      .where('alert."userId" = :userId', { userId })
      .setParameters({
        stockSymbol: dto.stockSymbol,
        targetPrice: dto.targetPrice,
        condition: dto.condition,
        userId: userId,
      })
      .getRawOne<{ totalCount: string; duplicateCount: string }>();

    const totalCount = parseInt(checkResult?.totalCount || '0', 10);
    const duplicateCount = parseInt(checkResult?.duplicateCount || '0', 10);

    if (duplicateCount > 0) {
      throw new ConflictException(
        'Duplicate alert. Another alert exists with the same parameters.',
      );
    }

    if (totalCount >= 20) {
      throw new BadRequestException(
        'Maximum number of alerts (20) reached for this user.',
      );
    }

    try {
      const alert = this.alertsRepository.create({
        stockSymbol: dto.stockSymbol,
        targetPrice: dto.targetPrice,
        condition: dto.condition,
        status: AlertStatus.ACTIVE,
        userId: userId,
      });
      await this.alertsRepository.save(alert);
      return {
        message: 'Alert created successfully',
        item: alert,
      };
    } catch (error) {
      console.error('Error creating alert:', error);

      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as { code: string };
        if (driverError && driverError.code === '23505') {
          throw new ConflictException(
            'Duplicate alert. An alert with these parameters already exists.',
          );
        }
      }
      throw new BadRequestException('Failed to create alert');
    }
  }

  async getAlerts(headers: Record<string, string>): Promise<GetAlertsResponse> {
    const userId = headers['user-id'];

    const [alerts, count] = await this.alertsRepository.findAndCount({
      where: { userId },
      order: { stockSymbol: 'ASC' },
    });

    return { count, alerts };
  }

  async deleteAlert(
    headers: Record<string, string>,
    alertId: string,
  ): Promise<DeleteAlertResponse> {
    const userId = headers['user-id'];

    const alert = await this.alertsRepository.findOne({
      where: { id: alertId, userId },
    });

    if (!alert) {
      throw new NotFoundException('Alert not found');
    }

    const alertItemtoReturn: AlertItem = {
      id: alert.id,
      stockSymbol: alert.stockSymbol,
      targetPrice: alert.targetPrice,
      condition: alert.condition,
      status: alert.status,
    };

    await this.alertsRepository.remove(alert);
    return { message: 'Alert deleted successfully', item: alertItemtoReturn };
  }
}
