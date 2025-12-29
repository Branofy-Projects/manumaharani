import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  type Klass,
  type LexicalNode,
  type LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from "lexical";

import { ImageNode } from "@/components/blocks/editor-00/nodes/image-node";

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [
    HeadingNode,
    ParagraphNode,
    TextNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    LinkNode,
    AutoLinkNode,
    CodeNode,
    CodeHighlightNode,
    ImageNode,
    HorizontalRuleNode,
  ];
