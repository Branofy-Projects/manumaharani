import { DecoratorNode } from "lexical";
import * as React from "react";

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";

export interface ImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    height?: number;
    maxWidth?: number;
    src: string;
    width?: number;
  },
  SerializedLexicalNode
>;

// This is a simplified ImageNode implementation
export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __altText: string;
  __height: "inherit" | number;
  __maxWidth: number;
  __src: string;
  __width: "inherit" | number;

  constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: "inherit" | number,
    height?: "inherit" | number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit";
    this.__height = height || "inherit";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static getType(): string {
    return "image";
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0,
      }),
    };
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, maxWidth, src, width } = serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
    });
    return node;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  decorate(): React.JSX.Element {
    return (
      <img
        alt={this.__altText}
        src={this.__src}
        style={{
          height: this.__height === "inherit" ? "auto" : this.__height,
          width: "100%",
        }}
      />
    );
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    return { element };
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.__altText,
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.__src,
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : this.__width,
    };
  }

  getAltText(): string {
    return this.__altText;
  }

  getSrc(): string {
    return this.__src;
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  updateDOM(): false {
    return false;
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
}: ImagePayload): ImageNode {
  return new ImageNode(src, altText, maxWidth, width, height);
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}

function convertImageElement(domNode: Node): DOMConversionOutput | null {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, height, src, width } = domNode;
    const node = $createImageNode({ altText, height, src, width });
    return { node };
  }
  return null;
}
