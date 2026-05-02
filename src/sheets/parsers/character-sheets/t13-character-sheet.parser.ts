import { BadRequestException, Injectable } from '@nestjs/common';
import { formatZodValidationError } from '../../../common/errors/zod-validation-error';
import {
  CHARACTER_SHEET_DEFAULTS,
  CHARACTER_SHEET_PATTERNS,
} from '../../maps/character-sheets/t13-character-sheet.map';
import {
  characterSheetSchema,
  type CharacterSheet,
} from '../../schemas/character-sheet.schema';

@Injectable()
export class T13CharacterSheetParser {
  parse(text: string): CharacterSheet {
    const normalizedText = this.normalizeText(text);

    const rawNome = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.nome,
    );
    const rawJogador = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.jogador,
    );
    const rawDataCriacao = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.dataCriacao,
    );
    const rawPp = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.pp,
    );
    const rawPpParaGastar = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.ppParaGastar,
    );
    const rawAparencia = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.aparencia,
    );
    const rawCenario = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.cenario,
    );
    const rawNcd = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.ncd,
    );
    const rawNct = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.nct,
    );
    const rawHistoria = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.historia,
    );
    const rawAltura = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.altura,
    );
    const rawCm = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.cm,
    );
    const rawAnotacoes = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.anotacoes,
    );

    const rawTamanho = normalizedText.match(CHARACTER_SHEET_PATTERNS.tamanho);
    const rawInventarioSection = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.inventarioSection,
    );
    const rawInventoryAndPersonalMarksSection = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.inventarioMarcasPessoaisSection,
    );
    const rawMarcasPessoaisSection = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.marcasPessoaisSection,
    );
    const splitInventoryAndPersonalMarks =
      this.toInventoryAndPersonalMarksLists(
        rawInventoryAndPersonalMarksSection,
      );

    const parsedData: CharacterSheet = {
      sistema: 't13',

      nome: this.toOptionalString(rawNome),
      jogador: this.toOptionalString(rawJogador),
      dataCriacao: this.toOptionalDateString(rawDataCriacao),
      aparencia: this.toOptionalString(rawAparencia),
      cenario: this.toOptionalString(rawCenario),
      ncd: this.toNullableNumber(rawNcd),
      nct: this.toNullableNumber(rawNct),
      historia: this.toOptionalString(rawHistoria),

      tamanho: {
        x: this.toNullableNumber(rawTamanho?.[1]),
        y: this.toNullableNumber(rawTamanho?.[2]),
      },

      altura: this.toNullableNumber(rawAltura),
      cm: this.toNullableNumber(rawCm),

      pp: this.toNullableNumber(rawPp),
      ppParaGastar: this.toNullableNumber(rawPpParaGastar),

      capacidadesFisicas: this.createDefaultPhysicalCapacities(),
      atributos: this.createDefaultAttributes(),
      competencias: this.createDefaultCompetences(),
      memoriasCanonicas: [...CHARACTER_SHEET_DEFAULTS.memoriasCanonicas],
      marcasPessoais: splitInventoryAndPersonalMarks?.marcasPessoais ??
        this.toStringList(rawMarcasPessoaisSection) ?? [
          ...CHARACTER_SHEET_DEFAULTS.marcasPessoais,
        ],
      inventario: this.toInventoryItems(rawInventarioSection) ??
        splitInventoryAndPersonalMarks?.inventario.map((nome) => ({
          nome,
          valor: null,
          peso: null,
          tipo: 'item-comum' as const,
          fichaItemMagicoId: null,
        })) ?? [...CHARACTER_SHEET_DEFAULTS.inventario],

      anotacoes: this.toOptionalString(rawAnotacoes),
    };

    const result = characterSheetSchema.safeParse(parsedData);

    if (!result.success) {
      throw new BadRequestException(formatZodValidationError(result.error));
    }

    return result.data;
  }

  private extractSingleValue(
    text: string,
    pattern: RegExp,
  ): string | undefined {
    const match = text.match(pattern);

    if (!match?.[1]) {
      return undefined;
    }

    return match[1];
  }

  private normalizeText(text: string): string {
    return text
      .replace(/\r/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  private cleanText(value?: string): string {
    if (!value) {
      return '';
    }

    return value
      .replace(/_{2,}/g, ' ')
      .replace(/\[\s*PP\s*\]/gi, '')
      .replace(/\[\s*ND\s*\]/gi, '')
      .replace(/[ \t]+/g, ' ')
      .replace(/[ \t]*\n[ \t]*/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .replace(/~\s*\d+\s+of\s+\d+\s*~/gi, '')
      .trim();
  }

  private toOptionalString(value?: string): string | undefined {
    const cleanedValue = this.cleanFreeText(value);

    if (!cleanedValue) {
      return undefined;
    }

    return cleanedValue;
  }

  private cleanFreeText(value?: string): string {
    return this.cleanText(value)
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\bT13\b\s*/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private toOptionalDateString(value?: string): string | undefined {
    const cleanedValue = this.cleanText(value).replace(/\s*\/\s*/g, '/');

    if (!cleanedValue || cleanedValue === '//') {
      return undefined;
    }

    return cleanedValue;
  }

  private toNullableNumber(value?: string): number | null {
    const cleanedValue = this.cleanText(value);

    if (!cleanedValue) {
      return null;
    }

    const normalizedNumber = cleanedValue.replace(',', '.');
    const parsedNumber = Number(normalizedNumber);

    if (Number.isNaN(parsedNumber)) {
      return null;
    }

    return parsedNumber;
  }

  private toStringList(section?: string): string[] | undefined {
    const cleanedSection = this.cleanText(section);

    if (!cleanedSection) {
      return undefined;
    }

    const lines = cleanedSection
      .split('\n')
      .map((line) => this.cleanText(line))
      .map((line) => line.replace(/^-\s*/, ''))
      .filter((line) => line && line !== ':' && line !== '-');

    if (lines.length === 0) {
      return undefined;
    }

    return lines;
  }

  private toInventoryItems(section?: string):
    | Array<{
        nome?: string;
        valor: number | null;
        peso: number | null;
        tipo: 'item-comum';
        fichaItemMagicoId: null;
      }>
    | undefined {
    const lines = this.toStringList(section);

    if (!lines) {
      return undefined;
    }

    return lines.map((nome) => ({
      nome,
      valor: null,
      peso: null,
      tipo: 'item-comum',
      fichaItemMagicoId: null,
    }));
  }

  private toInventoryAndPersonalMarksLists(
    section?: string,
  ): { inventario: string[]; marcasPessoais: string[] } | undefined {
    const lines = this.toStringList(section);

    if (!lines) {
      return undefined;
    }

    const inventario: string[] = [];
    const marcasPessoais: string[] = [];

    for (const line of lines) {
      const splitLine = this.splitInventoryAndPersonalMarkLine(line);

      if (!splitLine) {
        continue;
      }

      if (splitLine.inventoryItem) {
        inventario.push(splitLine.inventoryItem);
      }

      if (splitLine.personalMark) {
        marcasPessoais.push(splitLine.personalMark);
      }
    }

    if (inventario.length === 0 && marcasPessoais.length === 0) {
      return undefined;
    }

    return {
      inventario,
      marcasPessoais,
    };
  }

  private createDefaultPhysicalCapacities(): CharacterSheet['capacidadesFisicas'] {
    return {
      pv: { maximo: null, metade: null, atual: null },
      pf: { maximo: null, metade: null, atual: null },
      ex: { maximo: null, metade: null, atual: null },
      velocidadeBase: null,
      velocidadeCorrida: null,
      reflexo: null,
      baseCarga: null,
      fatorCarga: null,
      defesas: [],
    };
  }

  private createDefaultAttributes(): CharacterSheet['atributos'] {
    return {
      fo: { base: null, atual: null, comCm: null },
      de: { base: null, atual: null },
      it: { base: null, atual: null },
      co: { base: null, atual: null, comCm: null },
    };
  }

  private createDefaultCompetences(): CharacterSheet['competencias'] {
    return {
      linguistica: null,
      logica: null,
      espacial: null,
      cinestesica: null,
      interpessoal: null,
      intrapessoal: null,
      naturalista: null,
      musical: null,
      exotica: null,
    };
  }

  private splitInventoryAndPersonalMarkLine(
    line: string,
  ): { inventoryItem?: string; personalMark?: string } | undefined {
    const cleanedLine = this.cleanListLine(line);

    if (!cleanedLine || this.isNoiseLine(cleanedLine)) {
      return undefined;
    }

    const separatorMatch = cleanedLine.match(
      /\s(?:\|\||—|-|\b[Oo0]\b|\b7\b)\s/,
    );

    if (!separatorMatch || separatorMatch.index === undefined) {
      return {
        inventoryItem: cleanedLine,
      };
    }

    const inventoryItem = this.cleanListLine(
      cleanedLine.slice(0, separatorMatch.index),
    );
    const personalMark = this.cleanListLine(
      cleanedLine.slice(separatorMatch.index + separatorMatch[0].length),
    );

    return {
      inventoryItem: inventoryItem || undefined,
      personalMark: personalMark || undefined,
    };
  }

  private cleanListLine(line: string): string {
    return line
      .replace(/^[=*"'“”\s-]+/, '')
      .replace(/^(?:[oO0]\s+)+/, '')
      .replace(/[|=_<>]+/g, ' ')
      .replace(/—{2,}/g, ' ')
      .replace(/\s+ok»?$/i, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  private isNoiseLine(line: string): boolean {
    return (
      line.length < 4 || /^[\W\d]+$/.test(line) || /^(rmDD1|tu\))$/i.test(line)
    );
  }
}
