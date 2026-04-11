import { Injectable } from '@nestjs/common';
import { CHARACTER_SHEET_DEFAULTS, CHARACTER_SHEET_PATTERNS } from '../maps/character-sheet.map';
import {
  characterSheetSchema,
  type CharacterSheet,
} from '../schemas/character-sheet.schema';

@Injectable()
export class CharacterSheetParser {
  parse(text: string): CharacterSheet {
    const normalizedText = this.normalizeText(text);

    const rawNome = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.nome);
    const rawJogador = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.jogador);
    const rawDataCriacao = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.dataCriacao);
    const rawPp = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.pp);
    const rawPpParaGastar = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.ppParaGastar);
    const rawAparencia = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.aparencia);
    const rawCenario = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.cenario);
    const rawHistoria = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.historia);
    const rawAltura = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.altura);
    const rawPeso = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.peso);
    const rawCm = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.cm);
    const rawAnotacoes = this.extractSingleValue(normalizedText, CHARACTER_SHEET_PATTERNS.anotacoes);

    const rawTamanho = normalizedText.match(CHARACTER_SHEET_PATTERNS.tamanho);
    const rawInventarioSection = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.inventarioSection,
    );
    const rawMarcasPessoaisSection = this.extractSingleValue(
      normalizedText,
      CHARACTER_SHEET_PATTERNS.marcasPessoaisSection,
    );

    const parsedData: CharacterSheet = {
      nome: this.toOptionalString(rawNome),
      jogador: this.toOptionalString(rawJogador),
      dataCriacao: this.toOptionalString(rawDataCriacao),
      aparencia: this.toOptionalString(rawAparencia),
      cenario: this.toOptionalString(rawCenario),
      historia: this.toOptionalString(rawHistoria),

      tamanho: {
        largura: this.toNullableNumber(rawTamanho?.[1]),
        altura: this.toNullableNumber(rawTamanho?.[2]),
      },

      altura: this.toNullableNumber(rawAltura),
      peso: this.toNullableNumber(rawPeso),
      cm: this.toNullableNumber(rawCm),

      pp: this.toNullableNumber(rawPp),
      ppParaGastar: this.toNullableNumber(rawPpParaGastar),

      inventario: this.toStringList(rawInventarioSection) ?? [...CHARACTER_SHEET_DEFAULTS.inventario],
      marcasPessoais:
        this.toStringList(rawMarcasPessoaisSection) ?? [...CHARACTER_SHEET_DEFAULTS.marcasPessoais],

      anotacoes: this.toOptionalString(rawAnotacoes),
    };

    return characterSheetSchema.parse(parsedData);
  }

  private extractSingleValue(text: string, pattern: RegExp): string | undefined {
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
      .replace(/\n{3,}/g, '\n\n')
      .replace(/~\s*\d+\s+of\s+\d+\s*~/gi, '')
      .trim();
  }

  private toOptionalString(value?: string): string | undefined {
    const cleanedValue = this.cleanText(value);

    if (!cleanedValue) {
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
}