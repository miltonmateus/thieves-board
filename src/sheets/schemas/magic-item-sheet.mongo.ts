import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MagicItemSheetDocument = HydratedDocument<MagicItemSheet>;

@Schema({ timestamps: true, collection: 'magicitemsheets' })
export class MagicItemSheet {
  @Prop({ type: String, required: true })
  nome: string;

  @Prop({ type: String, required: true })
  dataCriacao: string;

  @Prop({ type: String, required: true })
  categoriaPoder: string;

  @Prop({ type: String, required: true })
  situacaoAtual: string;

  @Prop({
    type: {
      maximos: { type: Number, required: true },
      atuais: { type: Number, required: true },
    },
    required: true,
  })
  pontosFadiga: {
    maximos: number;
    atuais: number;
  };

  @Prop({ type: Number, required: true, min: -3, max: 3 })
  nivelSintonia: number;

  @Prop({ type: String, required: true })
  tracoConsciencia: string;

  @Prop({ type: String, required: true })
  peso: string;

  @Prop({ type: String, required: true })
  material: string;

  @Prop({ type: String, required: true })
  dano: string;

  @Prop({ type: String, required: true })
  alcance: string;

  @Prop({ type: String, required: true })
  descricaoAlma: string;

  @Prop({ type: String, required: true })
  poderPrincipal: string;

  @Prop({ type: String, required: true })
  instabilidadesRiscos: string;

  @Prop({ type: String, required: true })
  efeitosPassivos: string;

  @Prop({ type: String, required: true })
  historico: string;
}

export const MagicItemSheetSchema =
  SchemaFactory.createForClass(MagicItemSheet);
