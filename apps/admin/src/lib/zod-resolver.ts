import { zodResolver as originalZodResolver } from "@hookform/resolvers/zod";
import type { FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

// Wrapper to handle Zod 4.x compatibility with react-hook-form
export function zodResolver<T extends FieldValues>(
  schema: ZodType<T>
): Resolver<T> {
  return originalZodResolver(schema) as Resolver<T>;
}

