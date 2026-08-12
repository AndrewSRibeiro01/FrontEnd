export interface Producer {
  id: string;
  document: string;
  name: string;
}

export type NewProducer = Omit<Producer, 'id'>;
export type ProducerPatch = Partial<NewProducer>;
