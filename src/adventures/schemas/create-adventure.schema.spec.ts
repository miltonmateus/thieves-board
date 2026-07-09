import { createAdventureSchema } from './create-adventure.schema';

describe('createAdventureSchema', () => {
  it('should normalize name, setting and gm notes', () => {
    expect(
      createAdventureSchema.parse({
        name: '  Ecos   de    Eldoria  ',
        setting: '  Reino   de   Eldoria  ',
        description: 'A party investiga uma ruptura antiga.',
        gmNotes: '  A   rainha sabe   mais do que diz. ',
      }),
    ).toEqual({
      name: 'Ecos de Eldoria',
      setting: 'Reino de Eldoria',
      description: 'A party investiga uma ruptura antiga.',
      gmNotes: 'A rainha sabe mais do que diz.',
    });
  });

  it('should allow adventures without gm notes', () => {
    expect(
      createAdventureSchema.parse({
        name: 'Ecos de Eldoria',
        setting: 'Reino de Eldoria',
        description: 'A party investiga uma ruptura antiga.',
      }),
    ).toEqual({
      name: 'Ecos de Eldoria',
      setting: 'Reino de Eldoria',
      description: 'A party investiga uma ruptura antiga.',
    });
  });

  it('should reject empty required fields and unknown keys', () => {
    expect(
      createAdventureSchema.safeParse({
        name: '',
        setting: 'Eldoria',
        description: 'Uma aventura.',
      }).success,
    ).toBe(false);
    expect(
      createAdventureSchema.safeParse({
        name: 'Ecos de Eldoria',
        setting: '   ',
        description: 'Uma aventura.',
      }).success,
    ).toBe(false);
    expect(
      createAdventureSchema.safeParse({
        name: 'Ecos de Eldoria',
        setting: 'Eldoria',
        description: '   ',
      }).success,
    ).toBe(false);
    expect(
      createAdventureSchema.safeParse({
        name: 'Ecos de Eldoria',
        setting: 'Eldoria',
        description: 'Uma aventura.',
        secret: 'spoiler',
      }).success,
    ).toBe(false);
  });
});
