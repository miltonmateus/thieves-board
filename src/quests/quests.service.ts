import { questsMock } from "./mocks/quests.mock";
import { Quest } from "./types/quest.type";

export class QuestsService {

    private activeQuest: Quest | null = null;

    setActiveQuest(quest: Quest) {
        this.activeQuest = quest;
    }

    hasActiveQuest() {
        return this.activeQuest !== null;
    }

    fintQuestById(questId: string) {
        //questsMock.find((quest) => quest.id === questId);
        for (let i = 0; i < questsMock.length; i++) {
            const quest = questsMock[i];

            if (quest.id === questId) {
                return quest;
            }
        }
        return undefined;
    }

    getAllQuests() {
        return questsMock;
    }

    getActiveQuest() {
        return this.activeQuest;
    }

    completeActiveQuest() {
        this.activeQuest = null;
    }
}