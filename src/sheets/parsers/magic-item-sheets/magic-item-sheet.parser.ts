import { BadRequestException, Injectable } from '@nestjs/common';
import {
  MAGIC_ITEM_SHEET_LABELS,
  MAGIC_ITEM_SHEET_PATTERNS,
} from '../../maps/magic-item-sheets/magic-item-sheet.map';
import {
  magicItemSheetSchema,
  type MagicItemSheet,
} from '../../schemas/magic-item-sheet.schema';

@Injectable()
export class MagicItemSheetParser {
  parse(text: string): MagicItemSheet {
    const normalizedText = this.normalizeText(text);
    const lines = this.toLines(normalizedText);

    const parsedData = {
      nome: this.extractItemName(lines),
      dataCriacao: this.extractCreationDate(normalizedText, lines),
      categoriaPoder: this.extractPowerCategory(lines),
      situacaoAtual: this.extractCurrentStatus(lines),
      pontosFadiga: this.extractFatiguePoints(lines),
      nivelSintonia: this.extractAttunementLevel(lines),
      tracoConsciencia: this.extractConsciousnessTrait(lines),
      ...this.extractPhysicalAttributes(lines),
      ...this.extractDescriptionFields(lines),
      historico: this.extractHistory(normalizedText),
    };

    const result = magicItemSheetSchema.safeParse(parsedData);

    if (!result.success) {
      throw new BadRequestException(result.error.issues);
    }

    return result.data;
  }

  private normalizeText(text: string): string {
    return text
      .replace(/\r/g, '')
      .replace(/\u00A0/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .trim();
  }

  private toLines(text: string): string[] {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  }

  private extractSingleValue(
    text: string,
    pattern: RegExp,
  ): string | undefined {
    const match = text.match(pattern);

    return match?.[1]?.trim();
  }

  private extractCreationDate(
    text: string,
    lines: string[],
  ): string | undefined {
    return (
      this.extractSingleValue(text, MAGIC_ITEM_SHEET_PATTERNS.dataCriacao) ??
      lines.find((line) =>
        MAGIC_ITEM_SHEET_PATTERNS.dataCriacaoValue.test(line),
      )
    );
  }

  private extractItemName(lines: string[]): string | undefined {
    const dateIndex = this.findDateLineIndex(lines);
    const valueBeforeDate = this.findPreviousValueLine(lines, dateIndex);

    if (valueBeforeDate) {
      return valueBeforeDate;
    }

    return this.getNextValueAfterLabel(lines, MAGIC_ITEM_SHEET_LABELS.nome);
  }

  private extractPowerCategory(lines: string[]): string | undefined {
    const dateIndex = this.findDateLineIndex(lines);
    const categoryLabelIndex = this.findLabelIndex(
      lines,
      MAGIC_ITEM_SHEET_LABELS.categoriaPoder,
    );

    if (dateIndex > categoryLabelIndex) {
      return this.findNextValueLine(lines, dateIndex);
    }

    return this.getNextValueAfterLabel(
      lines,
      MAGIC_ITEM_SHEET_LABELS.categoriaPoder,
    );
  }

  private extractCurrentStatus(lines: string[]): string | undefined {
    const dateIndex = this.findDateLineIndex(lines);
    const statusLabelIndex = this.findLabelIndex(
      lines,
      MAGIC_ITEM_SHEET_LABELS.situacaoAtual,
    );

    if (statusLabelIndex > dateIndex) {
      return this.getPreviousValueBeforeLabel(
        lines,
        MAGIC_ITEM_SHEET_LABELS.situacaoAtual,
      );
    }

    const categoryValueIndex = this.findLineIndex(
      lines,
      this.extractPowerCategory(lines),
    );

    return this.findNextValueLine(lines, categoryValueIndex);
  }

  private extractFatiguePoints(
    lines: string[],
  ): { maximos: number; atuais: number } | undefined {
    const match = this.findFatigueAndAttunementMatch(lines);

    if (!match?.groups) {
      return undefined;
    }

    return {
      maximos: Number(match.groups.maximos),
      atuais: Number(match.groups.atuais),
    };
  }

  private extractAttunementLevel(lines: string[]): number | undefined {
    const rawAttunement =
      this.findFatigueAndAttunementMatch(lines)?.groups?.nivelSintonia;

    if (!rawAttunement) {
      return undefined;
    }

    return Number(rawAttunement);
  }

  private extractConsciousnessTrait(lines: string[]): string | undefined {
    const statusIndex = this.findLineIndex(
      lines,
      this.extractCurrentStatus(lines),
    );

    return this.findNextValueLine(lines, statusIndex);
  }

  private extractPhysicalAttributes(lines: string[]):
    | {
        peso?: string;
        material?: string;
        dano?: string;
        alcance?: string;
      }
    | undefined {
    const match = lines
      .map((line) => line.match(MAGIC_ITEM_SHEET_PATTERNS.atributosFisicos))
      .find((lineMatch) => lineMatch?.groups);

    if (!match?.groups) {
      return undefined;
    }

    return {
      peso: match.groups.peso,
      material: match.groups.material,
      dano: match.groups.dano,
      alcance: match.groups.alcance,
    };
  }

  private extractDescriptionFields(lines: string[]):
    | {
        descricaoAlma?: string;
        poderPrincipal?: string;
        instabilidadesRiscos?: string;
        efeitosPassivos?: string;
      }
    | undefined {
    const attributesIndex = lines.findIndex((line) =>
      MAGIC_ITEM_SHEET_PATTERNS.atributosFisicos.test(line),
    );

    if (attributesIndex === -1) {
      return undefined;
    }

    const descriptionLines = lines
      .slice(attributesIndex + 1)
      .filter((line) => !this.isPageMarker(line))
      .filter((line) => !this.isSecondPageMetadataLine(line));

    return {
      descricaoAlma: descriptionLines[0],
      poderPrincipal: descriptionLines[1],
      instabilidadesRiscos: descriptionLines[2],
      efeitosPassivos: descriptionLines[3],
    };
  }

  private extractHistory(text: string): string | undefined {
    return this.extractSingleValue(text, MAGIC_ITEM_SHEET_PATTERNS.historico);
  }

  private findFatigueAndAttunementMatch(
    lines: string[],
  ): RegExpMatchArray | undefined {
    return (
      lines
        .map((line) =>
          line.match(MAGIC_ITEM_SHEET_PATTERNS.pontosFadigaSintonia),
        )
        .find((lineMatch) => lineMatch?.groups) ?? undefined
    );
  }

  private getNextValueAfterLabel(
    lines: string[],
    labelPattern: RegExp,
  ): string | undefined {
    const labelIndex = this.findLabelIndex(lines, labelPattern);

    if (labelIndex === -1) {
      return undefined;
    }

    return this.findNextValueLine(lines, labelIndex);
  }

  private getPreviousValueBeforeLabel(
    lines: string[],
    labelPattern: RegExp,
  ): string | undefined {
    const labelIndex = this.findLabelIndex(lines, labelPattern);

    if (labelIndex <= 0) {
      return undefined;
    }

    return this.findPreviousValueLine(lines, labelIndex);
  }

  private findLabelIndex(lines: string[], labelPattern: RegExp): number {
    return lines.findIndex((line) => labelPattern.test(line));
  }

  private findDateLineIndex(lines: string[]): number {
    return lines.findIndex(
      (line) =>
        MAGIC_ITEM_SHEET_PATTERNS.dataCriacao.test(line) ||
        MAGIC_ITEM_SHEET_PATTERNS.dataCriacaoValue.test(line),
    );
  }

  private findLineIndex(lines: string[], value?: string): number {
    if (!value) {
      return -1;
    }

    return lines.findIndex((line) => line === value);
  }

  private findNextValueLine(
    lines: string[],
    startIndex: number,
  ): string | undefined {
    if (startIndex === -1) {
      return undefined;
    }

    return lines
      .slice(startIndex + 1)
      .find((line) => !this.isMetadataLine(line));
  }

  private findPreviousValueLine(
    lines: string[],
    startIndex: number,
  ): string | undefined {
    if (startIndex <= 0) {
      return undefined;
    }

    return [...lines]
      .slice(0, startIndex)
      .reverse()
      .find((line) => !this.isMetadataLine(line));
  }

  private isMetadataLine(line: string): boolean {
    return (
      MAGIC_ITEM_SHEET_PATTERNS.dataCriacao.test(line) ||
      MAGIC_ITEM_SHEET_PATTERNS.dataCriacaoValue.test(line) ||
      Object.values(MAGIC_ITEM_SHEET_LABELS).some((label) =>
        label.test(line),
      ) ||
      /^Ficha\s+de\s+Item\s+Mágico$/i.test(line) ||
      /^ANGEA$/i.test(line) ||
      /^Pontos\s+de\s+Fadiga\s*\/\s*Atuais$/i.test(line) ||
      /^Poder\s+Principal$/i.test(line) ||
      /^Nível\s+de\s+Sintonia/i.test(line) ||
      /^Instabilidades\s+e\s+Riscos$/i.test(line) ||
      /^Efeitos\s+Passivos$/i.test(line) ||
      /^Traço\s+de\s+Consciência$/i.test(line) ||
      /^Descrição\s+da\s+Alma$/i.test(line) ||
      /^Peso\s+Material\s+Dano/i.test(line) ||
      MAGIC_ITEM_SHEET_PATTERNS.pontosFadigaSintonia.test(line) ||
      /^\d+\s*\+\s*Situação\s+Atual$/i.test(line)
    );
  }

  private isPageMarker(line: string): boolean {
    return /^--\s*\d+\s+of\s+\d+\s*--$/i.test(line);
  }

  private isSecondPageMetadataLine(line: string): boolean {
    return /^BRASA$/i.test(line) || /^Histórico\b/i.test(line);
  }
}
