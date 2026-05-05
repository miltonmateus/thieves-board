import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type QuestDocument = HydratedDocument<QuestModel>;

@Schema({ timestamps: true, collection: 'quests' })
export class QuestModel {
  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  description: string;
}

export const QuestSchema = SchemaFactory.createForClass(QuestModel);
