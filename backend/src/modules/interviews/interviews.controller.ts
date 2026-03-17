import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InterviewsService } from './interviews.service';
import { CreateInterviewDto } from './dto/create-interview.dto';
import { UpdateInterviewDto } from './dto/update-interview.dto';

@ApiTags('interviews')
@ApiBearerAuth()
@Controller('interviews')
export class InterviewsController {
  constructor(private readonly interviewsService: InterviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Programar una entrevista' })
  create(@Body() createInterviewDto: CreateInterviewDto) {
    return this.interviewsService.create(createInterviewDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las entrevistas' })
  findAll() {
    return this.interviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una entrevista por ID' })
  findOne(@Param('id') id: string) {
    return this.interviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar una entrevista' })
  update(@Param('id') id: string, @Body() updateInterviewDto: UpdateInterviewDto) {
    return this.interviewsService.update(id, updateInterviewDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar una entrevista' })
  remove(@Param('id') id: string) {
    return this.interviewsService.remove(id);
  }
}
