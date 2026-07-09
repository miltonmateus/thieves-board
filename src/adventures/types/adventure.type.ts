export type Adventure = {
  id: string;
  name: string;
  setting: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type AdventureMasterView = Adventure & {
  gmNotes?: string;
};
