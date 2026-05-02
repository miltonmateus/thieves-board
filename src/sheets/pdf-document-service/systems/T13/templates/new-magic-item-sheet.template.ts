import type { MagicItemSheet } from '../../../../schemas/magic-item-sheet.schema';

export function createNewT13MagicItemSheet(): MagicItemSheet {
  return {
    nome: '',
    dataCriacao: '',
    categoriaPoder: '',
    situacaoAtual: '',

    pontosFadiga: {
      maximos: 0,
      atuais: 0,
    },
    nivelSintonia: 0,
    tracoConsciencia: '',

    peso: '',
    material: '',
    dano: '',
    alcance: '',

    descricaoAlma: '',
    poderPrincipal: '',
    instabilidadesRiscos: '',
    efeitosPassivos: '',

    historico: '',
  };
}
