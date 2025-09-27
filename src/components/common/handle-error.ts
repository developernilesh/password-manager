import { AxiosError } from "axios";

export function getErrorMessage(error: unknown): string {
  let errorMessage = "Something went wrong!";

  if (error instanceof AxiosError) {
    errorMessage = error.response?.data?.message ?? error.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return errorMessage;
}
