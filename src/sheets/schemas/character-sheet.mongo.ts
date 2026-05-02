import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CharacterSheetDocument = HydratedDocument<CharacterSheet>;

const resourceMongoSchema = {
  maximo: { type: Number, default: null },
  metade: { type: Number, default: null },
  atual: { type: Number, default: null },
};

const attributeMongoSchema = {
  base: { type: Number, default: null },
  atual: { type: Number, default: null },
};

const attributeWithMagnitudeMongoSchema = {
  ...attributeMongoSchema,
  comCm: { type: Number, default: null },
};

@Schema({ timestamps: true, collection: 'charactersheets' })
export class CharacterSheet {
  @Prop({ type: String, default: 't13' })
  sistema: 't13';

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

  @Prop({ type: Number, default: null })
  ncd: number | null;

  @Prop({ type: Number, default: null })
  nct: number | null;

  @Prop({ type: String })
  historia?: string;

  @Prop({
    type: {
      x: { type: Number, default: null },
      y: { type: Number, default: null },
    },
    default: {
      x: null,
      y: null,
    },
  })
  tamanho: {
    x: number | null;
    y: number | null;
  };

  @Prop({ type: Number, default: null })
  altura: number | null;

  @Prop({ type: Number, default: null })
  cm: number | null;

  @Prop({ type: Number, default: null })
  pp: number | null;

  @Prop({ type: Number, default: null })
  ppParaGastar: number | null;

  @Prop({
    type: {
      pv: resourceMongoSchema,
      pf: resourceMongoSchema,
      ex: resourceMongoSchema,
      velocidadeBase: { type: Number, default: null },
      velocidadeCorrida: { type: Number, default: null },
      reflexo: { type: Number, default: null },
      baseCarga: { type: Number, default: null },
      fatorCarga: { type: Number, default: null },
      defesas: { type: [Number], default: [] },
    },
    default: {
      pv: { maximo: null, metade: null, atual: null },
      pf: { maximo: null, metade: null, atual: null },
      ex: { maximo: null, metade: null, atual: null },
      velocidadeBase: null,
      velocidadeCorrida: null,
      reflexo: null,
      baseCarga: null,
      fatorCarga: null,
      defesas: [],
    },
  })
  capacidadesFisicas: {
    pv: { maximo: number | null; metade: number | null; atual: number | null };
    pf: { maximo: number | null; metade: number | null; atual: number | null };
    ex: { maximo: number | null; metade: number | null; atual: number | null };
    velocidadeBase: number | null;
    velocidadeCorrida: number | null;
    reflexo: number | null;
    baseCarga: number | null;
    fatorCarga: number | null;
    defesas: Array<number | null>;
  };

  @Prop({
    type: {
      fo: attributeWithMagnitudeMongoSchema,
      de: attributeMongoSchema,
      it: attributeMongoSchema,
      co: attributeWithMagnitudeMongoSchema,
    },
    default: {
      fo: { base: null, atual: null, comCm: null },
      de: { base: null, atual: null },
      it: { base: null, atual: null },
      co: { base: null, atual: null, comCm: null },
    },
  })
  atributos: {
    fo: { base: number | null; atual: number | null; comCm: number | null };
    de: { base: number | null; atual: number | null };
    it: { base: number | null; atual: number | null };
    co: { base: number | null; atual: number | null; comCm: number | null };
  };

  @Prop({
    type: {
      linguistica: { type: Number, default: null },
      logica: { type: Number, default: null },
      espacial: { type: Number, default: null },
      cinestesica: { type: Number, default: null },
      interpessoal: { type: Number, default: null },
      intrapessoal: { type: Number, default: null },
      naturalista: { type: Number, default: null },
      musical: { type: Number, default: null },
      exotica: { type: Number, default: null },
    },
    default: {
      linguistica: null,
      logica: null,
      espacial: null,
      cinestesica: null,
      interpessoal: null,
      intrapessoal: null,
      naturalista: null,
      musical: null,
      exotica: null,
    },
  })
  competencias: {
    linguistica: number | null;
    logica: number | null;
    espacial: number | null;
    cinestesica: number | null;
    interpessoal: number | null;
    intrapessoal: number | null;
    naturalista: number | null;
    musical: number | null;
    exotica: number | null;
  };

  @Prop({ type: [String], default: [] })
  memoriasCanonicas: string[];

  @Prop({ type: [String], default: [] })
  marcasPessoais: string[];

  @Prop({
    type: [
      {
        nome: { type: String },
        valor: { type: Number, default: null },
        peso: { type: Number, default: null },
        tipo: {
          type: String,
          enum: ['item-comum', 'item-magico'],
          default: 'item-comum',
        },
        fichaItemMagicoId: {
          type: MongooseSchema.Types.ObjectId,
          ref: 'MagicItemSheet',
          default: null,
        },
      },
    ],
    default: [],
  })
  inventario: Array<{
    nome?: string;
    valor: number | null;
    peso: number | null;
    tipo: 'item-comum' | 'item-magico';
    fichaItemMagicoId?: Types.ObjectId | null;
  }>;

  @Prop({ type: String })
  anotacoes?: string;
}

export const CharacterSheetSchema =
  SchemaFactory.createForClass(CharacterSheet);
