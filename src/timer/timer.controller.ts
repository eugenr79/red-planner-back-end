import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TimerService } from './timer.service';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TimerSessionDto, TimerRoundDto } from './timer.dto';

@Controller('user/timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get('today')
  @Auth()
  async getToday(@CurrentUser('id') userId: string) {
    return this.timerService.getTodaySession(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@CurrentUser('id') userId: string) {
    return this.timerService.create(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('/round/:id')
  @Auth()
  async updateRound(
    @Param('id') id: string,
    @Body() dto: TimerRoundDto) {
    return this.timerService.updateRound(dto, id)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put('/:id')
  @Auth()
  async update(
    @Body() dto: TimerSessionDto,
    @CurrentUser('id') userId: string, 
    @Param('id') id: string) {
    return this.timerService.update(dto, id, userId)
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(
    @Param('id') id: string,
    @CurrentUser('id') userId: string) {
    return this.timerService.deleteSession(id, userId)
  }
}
