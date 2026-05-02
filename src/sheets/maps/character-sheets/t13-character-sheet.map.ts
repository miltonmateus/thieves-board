export const CHARACTER_SHEET_PATTERNS = {
  nome: /Nome:\s*(.*?)\s+Jogador:/i,
  jogador: /Jogador:\s*(.*?)(?:\n|$)/i,

  dataCriacao: /Data de Criação:\s*(.*?)\s+PP:/i,
  pp: /PP:\s*(.*?)\s+PP p\/ gastar:/i,
  ppParaGastar: /PP p\/ gastar:\s*(.*?)(?:\n|$)/i,

  aparencia: /Aparência:\s*(.*?)\s+Cenário:/i,
  cenario: /Cenário:\s*(.*?)(?:\s+NCD:|\n|$)/i,
  ncd: /NCD:\s*(.*?)\s+NCT:/i,
  nct: /NCT:\s*(.*?)(?:\n|$)/i,

  historia: /História:\s*([\s\S]*?)\s*Tamanho:/i,

  tamanho: /Tamanho:\s*(.*?)\s*x\s*(.*?)\s+Altura:/i,
  altura: /Altura:\s*(.*?)(?:\s+Peso:|\s+CM:|\n|$)/i,

  cm: /CM:\s*(.*?)(?:\n|$)/i,

  inventarioSection: /Inventário([\s\S]*?)MARCAS PESSOAIS/i,
  inventarioMarcasPessoaisSection:
    /Inventário\s+MARCAS PESSOAIS([\s\S]*?)(?:Ficha de Personagem\s+Anotações:|Anotações:|$)/i,
  marcasPessoaisSection:
    /MARCAS PESSOAIS([\s\S]*?)(?:Ficha de Personagem\s+Anotações:|Anotações:|$)/i,

  anotacoes: /Anotações:\s*([\s\S]*)/i,
} as const;

export const CHARACTER_SHEET_DEFAULTS = {
  capacidadesFisicas: {
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
  atributos: {
    fo: { base: null, atual: null, comCm: null },
    de: { base: null, atual: null },
    it: { base: null, atual: null },
    co: { base: null, atual: null, comCm: null },
  },
  competencias: {
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
  memoriasCanonicas: [] as string[],
  inventario: [] as Array<{
    nome?: string;
    valor: number | null;
    peso: number | null;
    tipo: 'item-comum' | 'item-magico';
    fichaItemMagicoId?: string | null;
  }>,
  marcasPessoais: [] as string[],
} as const;
