import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TimeBlockDto } from 'src/time-block/dto/time-block.dto';

@Injectable()
export class TimeBlockService {
  constructor(private prisma: PrismaService) {}

  getAll(userId: string) {
    return this.prisma.timeBlock.findMany({
      where: {
        userId
      },
      orderBy: {
        order: 'asc'
      }
    })
  }

  async create(dto: TimeBlockDto, userId: string) {
    const timeBlock = {
      ...dto,
      user: {
        connect: {
          id: userId
        }
      }
    }
    return this.prisma.timeBlock.create({
      data: timeBlock
    })
  }

  async update(dto: Partial<TimeBlockDto>, timeBlockId: string, userId: string) {        
    return this.prisma.timeBlock.update({
      where: {
        userId,
        id: timeBlockId
      },
      data: dto
    })
  }

  async delete(timeBlockId: string) {    
    return this.prisma.timeBlock.delete({
      where: {
        id: timeBlockId
      }
    })
  }  

  async updateOrder(ids: string[]) {
    return this.prisma.$transaction(
      ids.map((id, order)=>
        this.prisma.timeBlock.update({
          where: {id},
          data: {order}
        }))
    )
  }

}
