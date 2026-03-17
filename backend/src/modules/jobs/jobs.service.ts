import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createJobDto: CreateJobDto) {
    return this.prisma.job.create({ data: createJobDto });
  }

  findAll() {
    return this.prisma.job.findMany({
      include: { recruiter: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        recruiter: { select: { id: true, firstName: true, lastName: true } },
        applications: true,
      },
    });
    if (!job) throw new NotFoundException(`Job #${id} not found`);
    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.findOne(id);
    return this.prisma.job.update({ where: { id }, data: updateJobDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.job.delete({ where: { id } });
  }
}
