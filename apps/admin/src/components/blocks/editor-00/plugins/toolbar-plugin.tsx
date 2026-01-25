"use client";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { INSERT_IMAGE_COMMAND } from "@/components/blocks/editor-00/plugins/images-plugin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

// Basic Toolbar Component
export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode("h1")); // Logic for paragraph
      }
    });
  };

  const formatHeading = (headingSize: "h1" | "h2" | "h3") => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (!url) return;
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  }, [editor]);

  const insertImage = useCallback(
    (src: string, altText: string) => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
        altText,
        src,
      });
    },
    [editor]
  );

  const handleImageUpload = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          // Using the same upload logic from previous editor
          // Assuming uploadFilesWithProgress is available in scope or imported
          // We need to import it.
          const { uploadFilesWithProgress } = await import(
            "@/lib/upload-files"
          );
          const results = await uploadFilesWithProgress(
            [file],
            () => { },
            "/api/v1/upload-image"
          );
          if (results && results[0]) {
            editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
              altText: "Uploaded Image",
              src: results[0].image.large_url,
            });
          }
        } catch (error) {
          console.error("Failed to upload image", error);
        }
      }
    };
    input.click();
  }, [editor]);

  return (
    <div className="sticky top-0 z-10 bg-background border-b p-2 flex flex-wrap gap-1 items-center rounded-t-lg">
      <Toggle
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        pressed={isBold}
        size="sm"
        type="button"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        pressed={isItalic}
        size="sm"
        type="button"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        pressed={isUnderline}
        size="sm"
        type="button"
      >
        <Underline className="h-4 w-4" />
      </Toggle>
      <Toggle
        onPressedChange={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        pressed={isStrikethrough}
        size="sm"
        type="button"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Separator className="h-6 mx-1" orientation="vertical" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-8 px-2" size="sm" type="button" variant="ghost">
            Heading
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => formatHeading("h1")}>
            <Heading1 className="h-4 w-4 mr-2" /> Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h2")}>
            <Heading2 className="h-4 w-4 mr-2" /> Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => formatHeading("h3")}>
            <Heading3 className="h-4 w-4 mr-2" /> Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator className="h-6 mx-1" orientation="vertical" />

      <Button
        onClick={() => {
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        }}
        size="sm"
        type="button"
        variant="ghost"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        onClick={() => {
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        }}
        size="sm"
        type="button"
        variant="ghost"
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button onClick={formatQuote} size="sm" type="button" variant="ghost">
        <Quote className="h-4 w-4" />
      </Button>

      <Separator className="h-6 mx-1" orientation="vertical" />

      <Button onClick={insertLink} size="sm" type="button" variant="ghost">
        <LinkIcon className="h-4 w-4" />
      </Button>

      <Button
        onClick={handleImageUpload}
        size="sm"
        type="button"
        variant="ghost"
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <Button
        onClick={() =>
          editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
        }
        size="sm"
        type="button"
        variant="ghost"
      >
        <Minus className="h-4 w-4" />
      </Button>
    </div>
  );
}
