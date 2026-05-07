import { createNewT13MagicItemSheet } from './new-magic-item-sheet.template';

describe('createNewT13MagicItemSheet', () => {
  it('should create a blank T13 magic item sheet draft', () => {
    expect(createNewT13MagicItemSheet()).toEqual({
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
    });
  });
});
