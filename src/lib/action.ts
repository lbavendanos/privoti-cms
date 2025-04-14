import 'server-only'
import { isFetchError } from './fetcher/base'

export type ActionResponse<TData> = {
  status: number
  data?: TData
  message?: string
  errors?: Record<string, string>
  isSuccess: boolean
  isClientError: boolean // 4xx
  isServerError: boolean // 5xx
}

function makeStatus(status: number) {
  return {
    isSuccess: status >= 200 && status < 300,
    isClientError: status >= 400 && status < 500,
    isServerError: status >= 500,
  }
}

function makeSuccessResponse<TData>(data?: TData, status: number = 200) {
  return {
    status,
    data,
    ...makeStatus(status),
  }
}

function makeErrorResponse(
  body: { message?: string; errors?: Record<string, string> },
  status: number = 500,
) {
  const { message, errors } = body

  return {
    status,
    message,
    errors,
    ...makeStatus(status),
  }
}

export function successResponse<TData>(
  data?: TData,
  status?: number,
): ActionResponse<TData> {
  return makeSuccessResponse<TData>(data, status)
}

export function errorResponse(error: unknown): ActionResponse<null> {
  if (isFetchError(error)) {
    const { status, message, errors } = error
    return makeErrorResponse({ message, errors }, status)
  }

  const message = error instanceof Error ? error.message : 'Unknown error'
  return makeErrorResponse({ message })
}
