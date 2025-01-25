import { Module } from '@nestjs/common';
import { TimerService } from './timer.service';
import { TimerController } from './timer.controller';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { TaskService } from 'src/task/task.service';

@Module({
  controllers: [TimerController],
  providers: [TimerService, TaskService, UserService, PrismaService],
  exports: [TimerService]
})
export class TimerModule {}
