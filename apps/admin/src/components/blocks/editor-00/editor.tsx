"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";

import type { InitialConfigType } from "@lexical/react/LexicalComposer";
import type { EditorState, SerializedEditorState } from "lexical";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  nodes,
  onError: (error: Error) => {
    console.error(error);
  },
  theme: editorTheme,
};

export function Editor({
  editorSerializedState,
  editorState,
  onChange,
  onSerializedChange,
}: {
  editorSerializedState?: SerializedEditorState;
  editorState?: EditorState;
  onChange?: (editorState: EditorState) => void;
  onSerializedChange?: (editorSerializedState: SerializedEditorState) => void;
}) {
  return (
    <div className="bg-background rounded-lg border shadow">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
          ...(editorSerializedState
            ? { editorState: JSON.stringify(editorSerializedState) }
            : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />

          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(editorState) => {
              onChange?.(editorState);
              onSerializedChange?.(editorState.toJSON());
            }}
          />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
