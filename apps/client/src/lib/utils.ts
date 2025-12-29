import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type { ClassValue } from "clsx";
export function calculateReadTime(content: string): number {
  try {
    let text = "";
    const parsed = JSON.parse(content);
    if (parsed.root && parsed.root.children) {
      const traverse = (node: any) => {
        if (node.text) {
          text += node.text + " ";
        }
        if (node.children) {
          node.children.forEach(traverse);
        }
      };
      traverse(parsed.root);
    }
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  } catch (e) {
    // Fallback for legacy HTML or plain text
    const wordsPerMinute = 200;
    const words = content
      .replace(/<[^>]*>?/gm, "")
      .trim()
      .split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
