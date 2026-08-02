import "server-only";
import { Schema, model, models } from "mongoose";

export interface ICounter {
  name: string;
  value: number;
}

const CounterSchema = new Schema<ICounter>({
  name: { type: String, required: true, unique: true, index: true },
  value: { type: Number, required: true, default: 0 },
});

export const Counter =
  (models.Counter as import("mongoose").Model<ICounter>) ?? model<ICounter>("Counter", CounterSchema);
