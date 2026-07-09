import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdventuresController } from './adventures.controller';
import { AdventuresService } from './adventures.service';
import { AdventureModel, AdventureSchema } from './schemas/adventure.mongo';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AdventureModel.name, schema: AdventureSchema },
    ]),
  ],
  controllers: [AdventuresController],
  providers: [AdventuresService],
})
export class AdventuresModule {}
