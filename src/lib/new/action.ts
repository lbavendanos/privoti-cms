import 'server-only'
import { isApiError } from '../http'

export type ActionResponse<TData> = {
  code?: number
  codeType?: string
  data?: TData
  message?: string
  errors?: Record<string, string[]>
  isInformational?: boolean
  isSuccess?: boolean
  isRedirection?: boolean
  isClientError?: boolean
  isServerError?: boolean
  isUnknown?: boolean
}

const CodeTypes = {
  INFORMATIONAL: 'informational',
  SUCCESS: 'success',
  REDIRECTION: 'redirection',
  CLIENT_ERROR: 'client',
  SERVER_ERROR: 'server',
  UNKNOWN: 'unknown',
} as const

type CodeRange = { min: number; max: number; type: string }

const CODE_RANGES: CodeRange[] = [
  { min: 100, max: 199, type: CodeTypes.INFORMATIONAL },
  { min: 200, max: 299, type: CodeTypes.SUCCESS },
  { min: 300, max: 399, type: CodeTypes.REDIRECTION },
  { min: 400, max: 499, type: CodeTypes.CLIENT_ERROR },
  { min: 500, max: Infinity, type: CodeTypes.SERVER_ERROR },
]

export function getCodeType(code: number): string {
  return (
    CODE_RANGES.find((range) => code >= range.min && code <= range.max)?.type ||
    CodeTypes.UNKNOWN
  )
}

function createActionResponse<TData>(
  code: number,
  data?: TData,
  message?: string,
  errors?: Record<string, string[]>,
): ActionResponse<TData> {
  const codeType = getCodeType(code ?? 0)

  return {
    code,
    codeType,
    data,
    message,
    errors,
    isInformational: codeType === CodeTypes.INFORMATIONAL,
    isSuccess: codeType === CodeTypes.SUCCESS,
    isRedirection: codeType === CodeTypes.REDIRECTION,
    isClientError: codeType === CodeTypes.CLIENT_ERROR,
    isServerError: codeType === CodeTypes.SERVER_ERROR,
    isUnknown: codeType === CodeTypes.UNKNOWN,
  }
}

export function handleActionSuccess<TData>(
  code: number,
  data?: TData,
  message?: string,
): ActionResponse<TData> {
  const defaultMessage = 'The action was successful.'

  return createActionResponse(code, data as TData, message || defaultMessage)
}

export function handleActionError<TData>(
  error: unknown,
): ActionResponse<TData> {
  const defaultMessage =
    'There was a problem with the server. Please try again.'

  if (
    isApiError<{
      message?: string
      errors?: Record<string, string[]>
    }>(error)
  ) {
    const {
      response: {
        status,
        data: { message, errors },
      },
    } = error

    return createActionResponse(
      status,
      {} as TData,
      message || defaultMessage,
      errors || {},
    )
  }

  return createActionResponse(
    0,
    {} as TData,
    error instanceof Error ? error.message : defaultMessage,
    {},
  )
}
