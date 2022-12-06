import {
  TextDocumentIdentifier,
  DidChangeTextDocumentParams,
} from "vscode-languageserver";

export namespace submit {
  export interface EditHistoryPayload {
    history: EditorEvent[];
    files: FileInfo[];
    lsVersion: string;
    editor: EditorInfo;
  }

  export interface Base {
    time: Date;
    type: EditorEventType;
  }

  export interface EditorEventBaseCreator<K extends EditorEventType, T>
    extends Base {
    type: K;
    payload: T; // イベントごとの追加情報を入れる
  }

  export interface EditorInfo {
    name: string;
    version: string;
  }

  export type EditorEvent = FileEvent | TextDocumentEditEvent;

  export type FileEvent = EditorEventBaseCreator<"file", FileEventPayload>;
  export type TextDocumentEditEvent = EditorEventBaseCreator<
    "edit",
    TextDocumentEditEventPayload
  >;

  export type EditorEventType = "edit" | "editorFeature" | "file";

  export type EditorEventPayload =
    | FileEventPayload
    | TextDocumentEditEventPayload;

  export interface FileEventPayload {
    state: FileState;
    textDocument: TextDocumentIdentifier;
  }

  export interface TextDocumentEditEventPayload
    extends DidChangeTextDocumentParams {
    /**
     * どれくらいの数の編集操作が集約されたものかを表す
     */
    editEffort: number;
  }

  export interface FileInfo {
    uri: string;
    initialFullContent: string;
  }

  export type FileState = "open" | "close";
}

export function createFileEvent(
  state: submit.FileState,
  uri: string
): submit.EditorEvent {
  const payload: submit.FileEventPayload = {
    state,
    textDocument: { uri },
  };

  return {
    type: "file",
    time: new Date(),
    payload,
  };
}
