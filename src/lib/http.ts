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
  #baseURL = process.env.NEXT_PUBLIC_API_URL ?? ''

  #handleInput(path: string, config: ApiRequestConfig) {
    const { params = {} } = config

    const baseURL = this.#baseURL.replace(/\/?$/, '/') // Ensure trailing slash
    const normalizedPath = path.replace(/^\/+/, '') // Remove leading slashes

    const input = new URL(normalizedPath, baseURL)
    input.search = new URLSearchParams(params).toString()

    return input
  }

  #handleInit(
    method: string,
    data: object = {},
    config: ApiRequestConfig = {},
  ): RequestInit {
    const headers: HeadersInit = {
      Accept: 'application/json',
      ...(data instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...(config.sessionToken && {
        Authorization: `Bearer ${config.sessionToken}`,
      }),
      ...config.headers,
    }

    const body =
      method !== 'GET'
        ? data instanceof FormData
          ? data
          : JSON.stringify(data)
        : null

    return {
      ...config,
      method,
      body,
      headers,
    }
  }

  async #handleResponse<TData>(
    response: Response,
  ): Promise<ApiResponse<TData>> {
    const data: TData = await response.json()

    const apiResponse: ApiResponse<TData> = {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    if (!response.ok) throw new ApiError(apiResponse.statusText, apiResponse)

    return apiResponse
  }

  async fetch<TData>(
    path: string,
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const input = this.#handleInput(path, config)
    const init = this.#handleInit(config.method ?? 'GET', {}, config)

    console.log(`[API] ${config.method ?? 'GET'} ${input.toString()}`)

    return fetch(input, init).then((response) => {
      console.log(`[API] ${response.status} ${response.statusText}`)

      return this.#handleResponse<TData>(response)
    })
  }

  async get<TData>(
    url: string,
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const input = this.#handleInput(url, config)
    const init = this.#handleInit('GET', {}, config)

    return fetch(input, init).then((response) =>
      this.#handleResponse<TData>(response),
    )
  }

  async post<TData>(
    url: string,
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
    url: string,
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
    url: string,
    data: object = {},
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const input = this.#handleInput(url, config)
    const init = this.#handleInit('DELETE', data, config)

    return fetch(input, init).then((response) =>
      this.#handleResponse<TData>(response),
    )
  }
}

export function isApiError<TData>(error: unknown): error is ApiError<TData> {
  return error instanceof ApiError
}

export const api = new Api()
