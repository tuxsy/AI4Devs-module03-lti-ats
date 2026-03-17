import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@Injectable()
export class CandidatesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCandidateDto: CreateCandidateDto) {
    return this.prisma.candidate.create({ data: createCandidateDto });
  }

  findAll() {
    return this.prisma.candidate.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const candidate = await this.prisma.candidate.findUnique({
      where: { id },
      include: { applications: { include: { job: true } } },
    });
    if (!candidate) throw new NotFoundException(`Candidate #${id} not found`);
    return candidate;
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto) {
    await this.findOne(id);
    return this.prisma.candidate.update({ where: { id }, data: updateCandidateDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.candidate.delete({ where: { id } });
  }
}
