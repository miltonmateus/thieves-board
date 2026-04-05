import { z } from 'zod';

export const selectQuestSchema = z.object({
    questId: z.string().nonempty(),
});

export type SelectQuestInput = z.infer<typeof selectQuestSchema>;