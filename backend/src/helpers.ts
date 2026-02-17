export function toError(error: any): Error {
  return error instanceof Error ? error : new Error(String(error));
}
