import 'server-only'

export type ActionResponse = {
  code?: number
  codeType?: string
  isInformational?: boolean
  isSuccess?: boolean
  isRedirection?: boolean
  isClientError?: boolean
  isServerError?: boolean
  isUnknown?: boolean
  message?: string
  errors?: Record<string, []>
  payload?: FormData
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

function createActionResponse(
  code: number | undefined,
  message: string,
  errors?: Record<string, []>,
  payload?: FormData,
): ActionResponse {
  const codeType = getCodeType(code ?? 0)

  return {
    code,
    codeType,
    message,
    errors,
    payload,
    isInformational: codeType === CodeTypes.INFORMATIONAL,
    isSuccess: codeType === CodeTypes.SUCCESS,
    isRedirection: codeType === CodeTypes.REDIRECTION,
    isClientError: codeType === CodeTypes.CLIENT_ERROR,
    isServerError: codeType === CodeTypes.SERVER_ERROR,
    isUnknown: codeType === CodeTypes.UNKNOWN,
  }
}

export function handleActionSuccess(response: any): ActionResponse {
  return createActionResponse(response.status, response.data.message)
}

export function handleActionError(
  error: any,
  payload?: FormData,
): ActionResponse {
  const defaultMessage =
    'There was a problem with the server. Please try again.'

  return createActionResponse(
    error?.status,
    error?.data?.message || defaultMessage,
    error?.data?.errors || [],
    payload,
  )
}
