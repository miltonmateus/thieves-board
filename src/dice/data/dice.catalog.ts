import { DiceDefinition } from '../schemas/dice-definition.schema';

export const diceCatalog: DiceDefinition[] = [
  {
    id: 'd2',
    label: 'D2',
    type: 'numeric',
    faces: [1, 2].map((n) => ({ value: n })),
    canSum: true,
  },
  {
    id: 'd4',
    label: 'D4',
    type: 'numeric',
    faces: [1, 2, 3, 4].map((n) => ({ value: n })),
    canSum: true,
  },
  {
    id: 'd6',
    label: 'D6',
    type: 'numeric',
    faces: [1, 2, 3, 4, 5, 6].map((n) => ({ value: n })),
    canSum: true,
  },
  {
    id: 'd8',
    label: 'D8',
    type: 'numeric',
    faces: [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ value: n })),
    canSum: true,
  },
  {
    id: 'd10',
    label: 'D10',
    type: 'numeric',
    faces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ value: n })),
    canSum: true,
  },
  {
    id: 'd12',
    label: 'D12',
    type: 'numeric',
    faces: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => ({ value: n })),
    canSum: true,
  },
  {
    id: 'd20',
    label: 'D20',
    type: 'numeric',
    faces: Array.from({ length: 20 }, (_, i) => ({ value: i + 1 })),
    canSum: true,
  },
  {
    id: 'd18',
    label: 'dado de maldição',
    type: 'numeric',
    faces: Array.from({ length: 18 }, (_, i) => ({ value: i + 1 })),
    canSum: true,
  },
  {
    id: 'state-die',
    label: 'Dado de estado',
    type: 'symbolic',
    faces: [
      { value: 'luz' },
      { value: 'sombra' },
      { value: 'caos' },
      { value: 'natureza' },
      { value: 'vazio' },
    ],
    canSum: false,
  },
];

export function findDiceById(id: string): DiceDefinition | undefined {
  return diceCatalog.find((dice) => dice.id === id);
}
