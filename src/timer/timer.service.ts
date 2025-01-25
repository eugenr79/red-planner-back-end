import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { TimerRoundDto, TimerSessionDto } from './timer.dto';

@Injectable()
export class TimerService {
  constructor(private user: UserService, private prisma: PrismaService) {}

  getTodaySession(userId: string) {
    const today = new Date().toISOString().split('T')[0]
    return this.prisma.pomodoroSession.findFirst({
      where: {
        createdAt: {
          gte: new Date(today)
        },
        userId
      },
      include: {
        rounds: {
          orderBy: {
            id: 'desc'
          }
        }
      }
    })
  }

  async create(userId: string) {
    const todaySession = await this.getTodaySession(userId)
    if (todaySession)
      return todaySession;
    
    const intervals = await this.user.getIntervals(userId)
    if (!intervals)
      throw new NotFoundException('Intervals not found')

    return this.prisma.pomodoroSession.create({
      data: {
        rounds: {
          createMany: {
            data: Array.from({length: intervals.intervalsCount}, ()=>({
              totalSeconds: 0
            }))
          }
        },
        user: {
          connect: {
            id: userId
          }
        }
      },
      include: {
        rounds: true
      }
    })
  }

  async update(dto: Partial<TimerSessionDto>, timerId: string, userId: string) {        
    return this.prisma.pomodoroSession.update({
      where: {
        userId,
        id: timerId
      },
      data: dto
    })
  }

  async updateRound(dto: Partial<TimerRoundDto>, roundId: string) {        
    return this.prisma.pomodoroRound.update({
      where: {
        id: roundId
      },
      data: dto
    })
  }
  
  async deleteSession(timerId: string, userId: string) {    
    return this.prisma.pomodoroSession.delete({
      where: {
        userId,        
        id: timerId
      }
    })
  }

}
