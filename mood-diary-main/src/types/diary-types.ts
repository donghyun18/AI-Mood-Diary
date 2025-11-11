import { Emotion } from "utils/emotion-utils";

export enum Action {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  INIT = "INIT",
}

export interface DiaryType {
  id: number;
  createdDate: number;
  emotion: Emotion;
  content: string;
  gptAnswer?: string;
  aiEmotion?: Emotion;
  aiConfidence?: number;
}

export type CreateDiaryType = Omit<DiaryType, "id">;

export type onCreateType = (
  createdDate: number,
  emotion: Emotion,
  content: string
) => void;

export type onUpdateType = (
  id: number,
  createdDate: number,
  emotion: Emotion,
  content: string
) => void;

export type onDeleteType = (id: number) => void;

export type ActionType =
  | { type: Action.CREATE; data: DiaryType }
  | { type: Action.UPDATE; data: DiaryType }
  | { type: Action.DELETE; id: number }
  | { type: Action.INIT; data: DiaryType[] };

export interface DispatchContextType {
  onCreate: onCreateType;
  onUpdate: onUpdateType;
  onDelete: onDeleteType;
}
