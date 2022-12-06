import { submit } from "./fineGrainedHistory/submit";

export type HistoryData = HistoryDataSuccess | HistoryDataFail;

interface HistoryDataBase {
  success: boolean;
  lsVersion: string;
  editor: submit.EditorInfo;
  files: submit.FileInfo[];
  raw: submit.EditorEvent[];
}

export interface HistoryDataSuccess extends HistoryDataBase {
  success: true;
  history: submit.EditorEvent[];
}

export interface HistoryDataFail extends HistoryDataBase {
  success: false;
  reason: string;
}
