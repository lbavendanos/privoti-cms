import 'server-only'

interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string>
  sessionToken?: string | null
}

export interface ApiResponse<TData> {
  data: TData
  status: number
  statusText: string
  headers: HeadersInit
}

class ApiError<TData> extends Error {
  response: ApiResponse<TData>

  constructor(message: string, response: ApiResponse<TData>) {
    super(message)

    this.name = 'ApiError'
    this.response = response
  }
}

class Api {
  #baseURL = process.env.NEXT_PUBLIC_API_URL || ''

  #handleURL(url: string | URL, params: Record<string, string> = {}) {
    const baseURL = this.#baseURL.endsWith('/')
      ? this.#baseURL
      : `${this.#baseURL}/`

    url =
      typeof url === 'string'
        ? url.startsWith('/')
          ? url.substring(1)
          : url
        : url

    const input = new URL(url, baseURL)

    Object.entries(params).forEach(([key, value]) =>
      input.searchParams.append(key, value),
    )

    return input
  }

  #handleBody(data: unknown) {
    return data instanceof FormData ? data : JSON.stringify(data)
  }

  #getResponseType(headers: Headers) {
    const contentType = headers.get('Content-Type')

    if (!contentType) return null

    if (contentType.includes('application/json')) return 'json'
    if (contentType.includes('text')) return 'text'
    if (contentType.includes('blob')) return 'blob'

    throw new Error(`Fetch does not support content-type ${contentType} yet`)
  }

  #handleInput(url: string | URL, config: ApiRequestConfig) {
    return this.#handleURL(url, config.params)
  }

  #handleInit(
    method: string,
    data: object = {},
    config: ApiRequestConfig = {},
  ): RequestInit {
    const { headers: extraHeaders, ...rest } = config

    const headers: HeadersInit = {
      Accept: 'application/json',
      ...(data instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(config.sessionToken
        ? { Authorization: `Bearer ${config.sessionToken}` }
        : {}),
      ...extraHeaders,
    }

    const body = method !== 'GET' ? this.#handleBody(data) : null

    return {
      ...rest,
      method,
      body,
      headers,
    }
  }

  async #handleResponse<TData>(
    response: Response,
  ): Promise<ApiResponse<TData>> {
    const type = this.#getResponseType(response.headers)
    const data: TData = type ? await response[type]() : {}

    const apiResponse: ApiResponse<TData> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    if (!response.ok) throw new ApiError(response.statusText, apiResponse)

    return apiResponse
  }

  async get<TData>(
    url: string | URL,
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const input = this.#handleInput(url, config)
    const init = this.#handleInit('GET', {}, config)

    return fetch(input, init).then((response) =>
      this.#handleResponse<TData>(response),
    )
  }

  async post<TData>(
    url: string | URL,
    data: object = {},
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const input = this.#handleInput(url, config)
    const init = this.#handleInit('POST', data, config)

    return fetch(input, init).then((response) =>
      this.#handleResponse<TData>(response),
    )
  }

  async put<TData>(
    url: string | URL,
    data: object = {},
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const input = this.#handleInput(url, config)
    const init = this.#handleInit('PUT', data, config)

    return fetch(input, init).then((response) =>
      this.#handleResponse<TData>(response),
    )
  }

  async delete<TData>(
    url: string | URL,
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const input = this.#handleInput(url, config)
    const init = this.#handleInit('DELETE', {}, config)

    return fetch(input, init).then((response) =>
      this.#handleResponse<TData>(response),
    )
  }
}

export function isApiError<TData>(error: unknown): error is ApiError<TData> {
  return error instanceof ApiError
}

export const api = new Api()
