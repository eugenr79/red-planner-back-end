import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from 'src/task/task.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  getAll(userId: string) {
    return this.prisma.task.findMany({
      where: {
        userId
      }
    })
  }

  async create(dto: TaskDto, userId: string) {
    const task = {
      ...dto,
      user: {
        connect: {
          id: userId
        }
      }
    }
    return this.prisma.task.create({
      data: task
    })
  }

  async update(dto: Partial<TaskDto>, taskId: string, userId: string) {        
    return this.prisma.task.update({
      where: {
        userId,
        id: taskId
      },
      data: dto
    })
  }

  async delete(taskId: string) {    
    return this.prisma.task.delete({
      where: {
        id: taskId
      }
    })
  }

  async getCompletedTasks(userId: string) {
    return await this.prisma.task.count({
      where: {
        userId,
        isCompleted: true
      }
    })
  }

  async getTasksFromDate(userId: string, date: Date) {
    return await this.prisma.task.count({
      where: {
        userId,
        createdAt: {
          gte: date.toISOString()
        }
      }
    })
  }

}
