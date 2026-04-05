import { questsMock } from "./mocks/quests.mock";
import { Quest } from "./types/quest.type";
import { ConflictException, NotFoundException, Injectable } from '@nestjs/common';

export class QuestsService {

    private activeQuest: Quest | null = null;

    setActiveQuest(quest: Quest) {
        this.activeQuest = quest;
    }

    hasActiveQuest() {
        return this.activeQuest !== null;
    }

    findQuestById(questId: string) {
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

    selectQuest(questId: string) {
        if (this.hasActiveQuest()) {
            throw new ConflictException('você já possui uma quest ativa');
        }

        const quest = this.findQuestById(questId);

        if (!quest) {
            throw new NotFoundException('quest não encontrada');
        }

        this.setActiveQuest(quest);

        return {
            message: 'quest recebida',
            quest,
        };
    }

    completeQuest() {
        if (!this.hasActiveQuest()) {
        throw new ConflictException('não existe quest ativa para concluir');
}
    this.completeActiveQuest();

    return {
        message: 'quest concluída',
    };
}
}