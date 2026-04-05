import { z } from 'zod';

export const selectQuestSchema = z.object({
  questId: z.string().nonempty(),
});

export type SelectQuestDto = z.infer<typeof selectQuestSchema>;
