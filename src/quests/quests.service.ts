import { questsMock } from './mocks/quests.mock';
import { Quest } from './types/quest.type';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import type { CreateQuestInput } from './schemas/create-quest.schema';
import { QuestDocument, QuestModel } from './schemas/quest.mongo';

type PersistedQuest = {
  _id: unknown;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

@Injectable()
export class QuestsService {
  private activeQuest: Quest | null = null;

  constructor(
    @InjectModel(QuestModel.name)
    private readonly questModel: Model<QuestDocument>,
  ) {}

  setActiveQuest(quest: Quest) {
    this.activeQuest = quest;
  }

  hasActiveQuest() {
    return this.activeQuest !== null;
  }

  async createQuest(payload: CreateQuestInput) {
    const quest = await this.questModel.create(payload);

    return this.mapQuestDocument(quest);
  }

  async findQuestById(questId: string) {
    const mockedQuest = questsMock.find((quest) => quest.id === questId);

    if (mockedQuest) {
      return mockedQuest;
    }

    if (!isValidObjectId(questId)) {
      return undefined;
    }

    const quest = await this.questModel.findById(questId).lean();

    if (!quest) {
      return undefined;
    }

    return this.mapQuestDocument(quest);
  }

  async getAllQuests() {
    const createdQuests = await this.questModel.find().lean();

    return [
      ...questsMock,
      ...createdQuests.map((quest) => this.mapQuestDocument(quest)),
    ];
  }

  getActiveQuest() {
    return this.activeQuest;
  }

  completeActiveQuest() {
    this.activeQuest = null;
  }

  async selectQuest(questId: string) {
    if (this.hasActiveQuest()) {
      throw new ConflictException('você já possui uma quest ativa');
    }

    const quest = await this.findQuestById(questId);

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

  private mapQuestDocument(quest: QuestDocument | PersistedQuest): Quest {
    const persistedQuest = quest as unknown as PersistedQuest;
    const id = String(persistedQuest._id);

    return {
      id,
      name: persistedQuest.name,
      description: persistedQuest.description,
      createdAt: persistedQuest.createdAt,
      updatedAt: persistedQuest.updatedAt,
    };
  }
}
