export const MAGIC_ITEM_SHEET_LABELS = {
  nome: /(?:^|\s)Nome\s+do\s+item$/i,
  categoriaPoder: /^Categoria\s+de\s+Poder$/i,
  situacaoAtual: /^Situação\s+Atual$/i,
} as const;

export const MAGIC_ITEM_SHEET_PATTERNS = {
  dataCriacao: /Data\s+de\s+Criação:\s*(\d{2}\/\d{2}\/\d{4})/i,
  dataCriacaoValue: /^\d{2}\/\d{2}\/\d{4}$/i,
  pontosFadigaSintonia:
    /^(?<maximos>\d+)\s*\/\s*(?<atuais>\d+)(?:\s*(?<nivelSintonia>[+-]\d+))?$/,
  atributosFisicos:
    /^(?<peso>\d+(?:,\d+)?\s*kg)\s+(?<material>.+?)\s+(?<dano>\d+d\d+\s+.+?)\s+(?<alcance>Corpo\s+a\s+corpo|Longo|Médio|Medio|Curto)$/i,
  historico: /Histórico\s*([\s\S]*?)(?:--\s*2\s+of\s+2\s*--|$)/i,
} as const;
