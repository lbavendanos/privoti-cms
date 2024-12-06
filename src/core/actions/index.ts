export type ActionResponse = {
  status?: number
  message?: string
  errors?: Record<string, []>
  payload?: FormData
}

export function handleActionError(
  error: any,
  payload?: FormData,
): ActionResponse {
  return {
    status: error?.status,
    message:
      error?.data?.message ||
      'There was a problem with the server. Please try again.',
    errors: error?.data?.errors || [],
    payload,
  }
}
