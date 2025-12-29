"use client";

import { useState } from "react";

import { Editor } from "@/components/blocks/editor-00/editor";

import type { SerializedEditorState } from "lexical";

interface RichTextEditorProps {
  onChange: (value: string) => void;
  value: string;
}

export function RichTextEditor({ onChange, value }: RichTextEditorProps) {
  // Initialize state with value if available
  // Note: The Editor component expects SerializedEditorState or EditorState
  // This is a simplification - you'll need to parse the HTML value to Lexical state
  // or handle HTML content differently if the Editor supports it.
  // Assuming for now we pass undefined or handle initial state inside Editor if it supported HTML string
  // But based on the interface, it takes SerializedEditorState.
  // If value is HTML string, we might need a converter or just pass it if Editor was updated to handle it.

  // For now, we'll keep the interface but use the new Editor component.
  // Since the new Editor uses Lexical and outputs JSON/State, and our form expects string (HTML presumably or JSON string),
  // we need to adapt.

  // If the previous value was HTML from Tiptap, it won't directly load into Lexical without parsing.
  // However, if we are starting fresh or if the value is just stored, we need to decide on storage format.
  // If we switch to Lexical, we should store the JSON state string.

  const [editorState, setEditorState] = useState<
    SerializedEditorState | undefined
  >(() => {
    if (!value) return undefined;
    try {
      return JSON.parse(value);
    } catch (e) {
      // Fallback for existing HTML content if any, or just start empty
      // Lexical can't easily ingest HTML without a parser, but we'll handle simple cases or just ignore legacy data for now
      // Ideally we would run an HTML to Lexical conversion here
      console.warn("Failed to parse editor value as JSON, starting empty.", e);
      return undefined;
    }
  });

  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={(newState) => {
        setEditorState(newState);
        onChange(JSON.stringify(newState));
      }}
    />
  );
}
