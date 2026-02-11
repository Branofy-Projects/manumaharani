import Image from "next/image";
import React, { Fragment } from "react";

type ElementNode = {
  [key: string]: any;
  children: LexicalNode[];
  format?: string;
  indent?: number;
  tag?: string;
  type: string;
};

type LexicalNode = ElementNode | LinkNode | TextNode;

type LinkNode = {
  children: LexicalNode[];
  type: "link";
  url: string;
};

type TextNode = {
  format: number;
  text: string;
  type: "text";
};

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

export function LexicalRenderer({ content }: { content: string }) {
  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    // Check if it's a valid Lexical state structure (has root)
    if (parsed.root) {
      return (
        <div className="lexical-content text-primary">
          {renderNode(parsed.root, 0)}
        </div>
      );
    }
    // Fallback if it's not JSON or root (maybe plain text or HTML string from legacy)
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  } catch (e) {
    // Not JSON, assume HTML or text
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === "text") {
    return (
      <React.Fragment key={index}>
        {renderText(node as TextNode)}
      </React.Fragment>
    );
  }

  const element = node as ElementNode;
  const children = element.children?.map((child, i) => renderNode(child, i));

  switch (element.type) {
    case "heading":
      const Tag = (element.tag || "h1") as keyof React.JSX.IntrinsicElements;
      const classes = {
        h1: "mb-6 text-4xl font-thin leading-tight text-gray-900 md:text-5xl lg:text-6xl",
        h2: "mb-6 text-3xl font-thin text-gray-900",
        h3: "mb-6 text-2xl font-thin text-gray-900",
        h4: "mb-6 text-xl font-thin text-gray-900",
        h5: "mb-6 text-lg font-thin text-gray-900",
        h6: "mb-6 text-base font-thin text-gray-900",
      };
      return (
        <Tag
          className={classes[element.tag as keyof typeof classes] || ""}
          key={index}
        >
          {children}
        </Tag>
      );
    case "horizontalrule":
      return <hr className="my-8 border-t border-gray-200" key={index} />;
    case "image":
      // Assuming image node structure from our admin implementation
      // It usually doesn't have children but has src/alt props directly
      const { altText, height, maxWidth, src, width } = element;


      return (
        <span
          className="block my-8 h-[250px] w-full overflow-hidden relative rounded-lg sm:h-[350px] md:my-12 md:h-[500px]"
          key={index}
        >
          <Image
            alt={altText}
            className="object-cover object-center"
            fill
            src={src}
          />
        </span>
      );
    case "linebreak":
      return <br key={index} />;
    case "link":
      const linkNode = node as LinkNode;
      return (
        <a
          className="text-blue-600 hover:underline"
          href={linkNode.url}
          key={index}
          rel="noopener noreferrer"
          target="_blank"
        >
          {children}
        </a>
      );
    case "list":
      if (element.tag === "ol") {
        return (
          <ol
            className="list-decimal list-outside ml-5 mb-2 space-y-1"
            key={index}
          >
            {children}
          </ol>
        );
      }
      return (
        <ul className="list-disc list-outside ml-5 mb-2 space-y-1" key={index}>
          {children}
        </ul>
      );
    case "listitem":
      return (
        <li className="pl-1" key={index}>
          {children}
        </li>
      );
    case "paragraph":
      // Empty paragraph handling
      if (children?.length === 0) {
        return <br key={index} />;
      }
      return (
        <p
          className="mb-2 text-lg font-thin leading-relaxed text-gray-700"
          key={index}
        >
          {children}
        </p>
      );
    case "quote":
      return (
        <blockquote
          className="my-12 border-l-4 border-gray-900 bg-gray-50 p-8 text-xl italic leading-relaxed text-gray-800"
          key={index}
        >
          {children}
        </blockquote>
      );
    case "root":
      return <div key={index}>{children}</div>;
    default:
      return <Fragment key={index}>{children}</Fragment>;
  }
}

function renderText(node: TextNode): React.ReactNode {
  let text: React.ReactNode = node.text;

  if (node.format & IS_BOLD) {
    text = <strong key="bold">{text}</strong>;
  }
  if (node.format & IS_ITALIC) {
    text = <em key="italic">{text}</em>;
  }
  if (node.format & IS_STRIKETHROUGH) {
    text = (
      <span className="line-through" key="strikethrough">
        {text}
      </span>
    );
  }
  if (node.format & IS_UNDERLINE) {
    text = (
      <span className="underline" key="underline">
        {text}
      </span>
    );
  }
  if (node.format & IS_CODE) {
    text = (
      <code className="bg-gray-100 rounded px-1" key="code">
        {text}
      </code>
    );
  }

  return text;
}
