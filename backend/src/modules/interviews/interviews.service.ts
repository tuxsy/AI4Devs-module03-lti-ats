import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@Injectable()
export class InterviewsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createInterviewDto: CreateInterviewDto) {
    return this.prisma.interview.create({ data: createInterviewDto });
  }

  findAll() {
    return this.prisma.interview.findMany({
      include: {
        application: { include: { candidate: true, job: true } },
        interviewer: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const interview = await this.prisma.interview.findUnique({
      where: { id },
      include: {
        application: { include: { candidate: true, job: true } },
        interviewer: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    if (!interview) throw new NotFoundException(`Interview #${id} not found`);
    return interview;
  }

  async update(id: string, updateInterviewDto: UpdateInterviewDto) {
    await this.findOne(id);
    return this.prisma.interview.update({ where: { id }, data: updateInterviewDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.interview.delete({ where: { id } });
  }
}
