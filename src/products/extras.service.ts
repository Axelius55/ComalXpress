import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Extra } from './entities/extra.entity';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';

@Injectable()
export class ExtrasService {
  constructor(
    @InjectRepository(Extra)
    private readonly extraRepository: Repository<Extra>,
  ) {}

  async create(createExtraDto: CreateExtraDto) {
    const extra = this.extraRepository.create(createExtraDto);

    return this.extraRepository.save(extra);
  }

  findAll() {
    return this.extraRepository.find();
  }

  async findOne(id: string) {
    const extra = await this.extraRepository.findOneBy({ id });

    if (!extra) throw new NotFoundException(`Extra ${id} not found`);

    return extra;
  }

  async update(id: string, updateExtraDto: UpdateExtraDto) {
    const extra = await this.findOne(id);

    Object.assign(extra, updateExtraDto);

    return this.extraRepository.save(extra);
  }

  async remove(id: string) {
    const extra = await this.findOne(id);

    await this.extraRepository.remove(extra);

    return { message: 'Extra deleted' };
  }
}
