import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CharacterSheetDocument = HydratedDocument<CharacterSheet>;

@Schema({ timestamps: true, collection: 'charactersheets' })
export class CharacterSheet {
  @Prop({ type: String })
  nome?: string;

  @Prop({ type: String })
  jogador?: string;

  @Prop({ type: String })
  dataCriacao?: string;

  @Prop({ type: String })
  aparencia?: string;

  @Prop({ type: String })
  cenario?: string;

  @Prop({ type: String })
  historia?: string;

  @Prop({
    type: {
      largura: { type: Number, default: null },
      altura: { type: Number, default: null },
    },
    default: {
      largura: null,
      altura: null,
    },
  })
  tamanho: {
    largura: number | null;
    altura: number | null;
  };

  @Prop({ type: Number, default: null })
  altura: number | null;

  @Prop({ type: Number, default: null })
  peso: number | null;

  @Prop({ type: Number, default: null })
  cm: number | null;

  @Prop({ type: Number, default: null })
  pp: number | null;

  @Prop({ type: Number, default: null })
  ppParaGastar: number | null;

  @Prop({ type: [String], default: [] })
  inventario: string[];

  @Prop({ type: [String], default: [] })
  marcasPessoais: string[];

  @Prop({ type: String })
  anotacoes?: string;
}

export const CharacterSheetSchema =
  SchemaFactory.createForClass(CharacterSheet);
