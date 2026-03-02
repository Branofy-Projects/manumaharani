import { createBlog } from "@repo/actions/blogs.actions";
import { insertBlogSchema } from "@repo/db/schema/blogs.schema";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      category,
      content,
      excerpt,
      featured_image_id: featuredImageId,
      meta_description: metaDescription,
      meta_keywords: metaKeywords,
      meta_title: metaTitle,
      slug,
      status,
      tags,
      title,
    } = body;

    // Convert HTML content to Lexical JSON if needed
    const processedContent = convertHtmlToLexical(content);

    // Auto-generate slug from title if not provided
    let finalSlug = slug;
    if (!finalSlug && title) {
      finalSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    }

    // Auto-generate excerpt from content if not provided
    let finalExcerpt = excerpt;
    if (!finalExcerpt && content) {
      const plainText = content
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
      finalExcerpt = plainText.slice(0, 300);
    }

    const blogData: { content: string; excerpt: string; slug: string; title: string } & Record<string, unknown> = {
      category: category || "general",
      content: processedContent,
      excerpt: finalExcerpt,
      slug: finalSlug,
      title,
    };

    if (featuredImageId) blogData.featured_image_id = featuredImageId;
    if (status) blogData.status = status;
    if (tags) blogData.tags = tags;
    if (metaTitle) blogData.meta_title = metaTitle;
    if (metaDescription) blogData.meta_description = metaDescription;
    if (metaKeywords) blogData.meta_keywords = metaKeywords;

    const validatedData = insertBlogSchema.safeParse(blogData);

    if (!validatedData.success) {
      return NextResponse.json(
        { details: validatedData.error.format(), error: "Invalid data" },
        { status: 400 },
      );
    }

    const newBlog = await createBlog(blogData);

    return NextResponse.json(
      {
        data: newBlog,
        message: "Blog created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating blog:", error);
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("foreign key constraint")) {
      return NextResponse.json(
        { error: "Invalid featured_image_id. Image does not exist." },
        { status: 400 },
      );
    }

    if (message.includes("unique constraint")) {
      return NextResponse.json(
        { error: "A blog with this slug already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { details: message, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

function convertHtmlToLexical(html: string) {
  if (!html) return "";
  if (html.trim().startsWith("{")) {
    return html;
  }

  const rootChildren: Record<string, unknown>[] = [];

  const parts = html.split(/(<h2>[\s\S]*?<\/h2>)/i);

  for (const part of parts) {
    if (part.match(/^<h2>[\s\S]*?<\/h2>$/i)) {
      const text = part.replace(/<\/?h2>/gi, "").trim();

      if (text) {
        rootChildren.push({
          children: [
            {
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: text,
              type: "text",
              version: 1,
            },
          ],
          direction: "ltr",
          format: "",
          indent: 0,
          tag: "h2",
          type: "heading",
          version: 1,
        });
      }
    } else {
      const paragraphs = part.split(/(?:\r?\n\s*){2,}/i);

      for (const p of paragraphs) {
        const lines = p.split(/<br\s*\/?>/i);
        const paragraphChildren: Record<string, unknown>[] = [];

        for (let i = 0; i < lines.length; i++) {
          const lineText = lines[i]
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();

          if (lineText) {
            paragraphChildren.push({
              detail: 0,
              format: 0,
              mode: "normal",
              style: "",
              text: lineText,
              type: "text",
              version: 1,
            });
          }

          if (i < lines.length - 1) {
            paragraphChildren.push({
              type: "linebreak",
              version: 1,
            });
          }
        }

        if (paragraphChildren.length > 0) {
          rootChildren.push({
            children: paragraphChildren,
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          });
        }
      }
    }
  }

  return JSON.stringify({
    root: {
      children: rootChildren,
      direction: "ltr",
      format: "",
      indent: 0,
      type: "root",
      version: 1,
    },
  });
}
