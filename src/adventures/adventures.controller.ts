import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  createAdventureSchema,
  type CreateAdventureInput,
} from './schemas/create-adventure.schema';
import { AdventuresService } from './adventures.service';

@Controller('adventures')
export class AdventuresController {
  constructor(private readonly adventuresService: AdventuresService) {}

  @Post()
  createAdventure(
    @Body(new ZodValidationPipe(createAdventureSchema))
    body: CreateAdventureInput,
  ) {
    return this.adventuresService.createAdventure(body);
  }

  @Get()
  getAllAdventures() {
    return this.adventuresService.getAllAdventures();
  }

  @Get(':id')
  getAdventureById(@Param('id') id: string) {
    return this.adventuresService.getAdventureById(id);
  }

  @Get(':id/master')
  getAdventureMasterView(@Param('id') id: string) {
    return this.adventuresService.getAdventureMasterView(id);
  }
}
