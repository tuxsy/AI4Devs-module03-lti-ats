import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { InterviewStatus } from '@prisma/client';

export class CreateInterviewDto {
  @ApiProperty()
  @IsDateString()
  scheduledAt!: string;

  @ApiPropertyOptional({ enum: InterviewStatus })
  @IsOptional()
  @IsEnum(InterviewStatus)
  status?: InterviewStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;

  @ApiProperty()
  @IsUUID()
  applicationId!: string;

  @ApiProperty()
  @IsUUID()
  interviewerId!: string;
}
