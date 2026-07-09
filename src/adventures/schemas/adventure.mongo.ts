import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AdventureDocument = HydratedDocument<AdventureModel>;

@Schema({ timestamps: true, collection: 'adventures' })
export class AdventureModel {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  setting: string;

  @Prop({ type: String, required: true, trim: true })
  description: string;

  @Prop({ type: String, required: false, trim: true })
  gmNotes?: string;
}

export const AdventureSchema = SchemaFactory.createForClass(AdventureModel);
