import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ExtrasService } from './extras.service';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { ApiOperation, ApiParam } from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { RolesUser } from 'src/users/enums/rolesUser.enum';
import { AuthOnlyUser } from 'src/auth/decorators/authOnlyUser.decorator';

@Controller('extras')
export class ExtrasController {
  constructor(private readonly extrasService: ExtrasService) {}

  @Post()
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Crear un nuevo extra' })
  create(@Body() createExtraDto: CreateExtraDto) {
    return this.extrasService.create(createExtraDto);
  }

  @Get()
  @AuthOnlyUser()
  @ApiOperation({ summary: 'Obtener todos los extras' })
  findAll() {
    return this.extrasService.findAll();
  }

  @Get(':id')
  @AuthOnlyUser()
  @ApiOperation({ summary: 'Obtener un extra por ID' })
  @ApiParam({ name: 'id', description: 'ID del extra' })
  findOne(@Param('id') id: string) {
    return this.extrasService.findOne(id);
  }

  @Patch(':id')
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Actualizar un extra' })
  @ApiParam({ name: 'id', description: 'ID del extra' })
  update(@Param('id') id: string, @Body() updateExtraDto: UpdateExtraDto) {
    return this.extrasService.update(id, updateExtraDto);
  }

  @Delete(':id')
  @Auth(RolesUser.ADMIN)
  @ApiOperation({ summary: 'Actualizar un extra' })
  @ApiParam({ name: 'id', description: 'ID del extra' })
  remove(@Param('id') id: string) {
    return this.extrasService.remove(id);
  }
}
