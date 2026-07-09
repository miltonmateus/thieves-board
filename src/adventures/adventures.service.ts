import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import type { CreateAdventureInput } from './schemas/create-adventure.schema';
import { AdventureDocument, AdventureModel } from './schemas/adventure.mongo';
import type { Adventure, AdventureMasterView } from './types/adventure.type';

type PersistedAdventure = {
  _id: unknown;
  name: string;
  setting: string;
  description: string;
  gmNotes?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

@Injectable()
export class AdventuresService {
  constructor(
    @InjectModel(AdventureModel.name)
    private readonly adventureModel: Model<AdventureDocument>,
  ) {}

  async createAdventure(payload: CreateAdventureInput) {
    const adventure = await this.adventureModel.create(payload);

    return this.mapPublicAdventure(adventure);
  }

  async getAllAdventures() {
    const adventures = await this.adventureModel.find().lean();

    return adventures.map((adventure) => this.mapPublicAdventure(adventure));
  }

  async getAdventureById(adventureId: string) {
    const adventure = await this.findAdventureDocument(adventureId);

    return this.mapPublicAdventure(adventure);
  }

  async getAdventureMasterView(adventureId: string) {
    const adventure = await this.findAdventureDocument(adventureId);

    return this.mapMasterAdventure(adventure);
  }

  private async findAdventureDocument(adventureId: string) {
    if (!isValidObjectId(adventureId)) {
      throw new NotFoundException('aventura não encontrada');
    }

    const adventure = await this.adventureModel.findById(adventureId).lean();

    if (!adventure) {
      throw new NotFoundException('aventura não encontrada');
    }

    return adventure;
  }

  private mapPublicAdventure(
    adventure: AdventureDocument | PersistedAdventure,
  ): Adventure {
    const persistedAdventure = adventure as unknown as PersistedAdventure;

    return {
      id: String(persistedAdventure._id),
      name: persistedAdventure.name,
      setting: persistedAdventure.setting,
      description: persistedAdventure.description,
      createdAt: persistedAdventure.createdAt,
      updatedAt: persistedAdventure.updatedAt,
    };
  }

  private mapMasterAdventure(
    adventure: AdventureDocument | PersistedAdventure,
  ): AdventureMasterView {
    const persistedAdventure = adventure as unknown as PersistedAdventure;

    return {
      ...this.mapPublicAdventure(adventure),
      gmNotes: persistedAdventure.gmNotes,
    };
  }
}
