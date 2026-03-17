import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';

@ApiTags('candidates')
@ApiBearerAuth()
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un candidato' })
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(createCandidateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los candidatos' })
  findAll() {
    return this.candidatesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un candidato por ID' })
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un candidato' })
  update(@Param('id') id: string, @Body() updateCandidateDto: UpdateCandidateDto) {
    return this.candidatesService.update(id, updateCandidateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un candidato' })
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }
}
