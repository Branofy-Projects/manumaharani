/**
 * Handles database errors gracefully
 * Returns true if error should cause early return (connection issues)
 * Returns false if error can be ignored (table doesn't exist, etc.)
 */
export function handleDatabaseError(
  error: any,
  tableName: string,
  context: string = "query"
): { isTableMissing: boolean; shouldReturn: boolean; } {
  const errorMessage = error?.message || String(error) || "";
  const errorString = errorMessage.toLowerCase();

  // Check if it's a table doesn't exist error
  const isTableMissing =
    errorString.includes("does not exist") ||
    errorString.includes("relation") ||
    (errorString.includes("failed query") && !errorString.includes("abort")) ||
    errorString.includes(`"${tableName}"`) ||
    errorString.includes(`'${tableName}'`);

  // Check if it's a connection error (should return early)
  const isConnectionError =
    errorString.includes("connection") ||
    errorString.includes("econnrefused") ||
    errorString.includes("timeout") ||
    errorString.includes("network") ||
    errorString.includes("socket");

  // Only log in development or if it's a connection error
  if (process.env.NODE_ENV === "development" || isConnectionError) {
    if (isTableMissing) {
      console.warn(
        `⚠️  Database table '${tableName}' may not exist. Please run migrations: yarn db:push or yarn db:migrate`
      );
    } else if (isConnectionError) {
      console.error(
        `⚠️  Database connection failed during ${context}. Please check your DATABASE_URL environment variable.`
      );
    } else {
      console.error(`Error during ${context} on ${tableName}:`, errorMessage);
    }
  }

  return {
    isTableMissing,
    shouldReturn: isConnectionError,
  };
}

/**
 * Safely executes a database query with error handling
 * Returns the result or a default value on error
 */
export async function safeDbQuery<T>(
  queryFn: () => Promise<T>,
  defaultValue: T,
  tableName: string,
  context: string = "query"
): Promise<T> {
  try {
    return await queryFn();
  } catch (error: any) {
    console.log("error",error);
    
    const { isTableMissing, shouldReturn } = handleDatabaseError(
      error,
      tableName,
      context
    );

    // If it's a connection error, return default immediately
    if (shouldReturn) {
      return defaultValue;
    }

    // For table missing errors, also return default (migrations not run)
    if (isTableMissing) {
      return defaultValue;
    }

    // For other errors, still return default but log in dev
    if (process.env.NODE_ENV === "development") {
      console.error(`Unexpected error in ${context}:`, error);
    }

    return defaultValue;
  }
}

