export const CHARACTER_SHEET_PATTERNS = {
  nome: /Nome:\s*(.*?)\s+Jogador:/i,
  jogador: /Jogador:\s*(.*?)(?:\n|$)/i,

  dataCriacao: /Data de Criação:\s*(.*?)\s+PP:/i,
  pp: /PP:\s*(.*?)\s+PP p\/ gastar:/i,
  ppParaGastar: /PP p\/ gastar:\s*(.*?)(?:\n|$)/i,

  aparencia: /Aparência:\s*(.*?)\s+Cenário:/i,
  cenario: /Cenário:\s*(.*?)(?:\n|$)/i,

  historia: /História:\s*([\s\S]*?)\s*Tamanho:/i,

  tamanho: /Tamanho:\s*(.*?)\s*x\s*(.*?)\s+Altura:/i,
  altura: /Altura:\s*(.*?)\s+Peso:/i,
  peso: /Peso:\s*(.*?)(?:\n|$)/i,

  cm: /CM:\s*(.*?)(?:\n|$)/i,

  inventarioSection: /Inventário([\s\S]*?)MARCAS PESSOAIS/i,
  marcasPessoaisSection:
    /MARCAS PESSOAIS([\s\S]*?)(?:Ficha de Personagem\s+Anotações:|Anotações:|$)/i,

  anotacoes: /Anotações:\s*([\s\S]*)/i,
} as const;

export const CHARACTER_SHEET_DEFAULTS = {
  inventario: [] as string[],
  marcasPessoais: [] as string[],
} as const;
