import { stringify } from 'qs'
import Cookies from 'js-cookie'

export type FetchConfig = Omit<RequestInit, 'headers' | 'body'> & {
  headers?: Record<string, string | null>
  body?: Record<string, unknown> | BodyInit | null
  params?: Record<string, unknown>
}

export class FetchError extends Error {
  status: number
  statusText: string
  errors: Record<string, string> | undefined

  constructor(
    message: string,
    status: number,
    statusText: string,
    errors?: Record<string, string>,
  ) {
    super(message)

    this.name = 'FetchError'
    this.status = status
    this.statusText = statusText
    this.errors = errors
  }
}

export class Fetcher {
  #baseURL: string

  constructor(baseURL: string) {
    if (!baseURL) throw new Error('Base URL is required')

    this.#baseURL = baseURL.replace(/\/?$/, '/') // Ensure trailing slash
  }

  #handleInput(path: string, config: FetchConfig) {
    const { params = {} } = config

    const normalizedPath = path.replace(/^\/+/, '') // Remove leading slashes
    const input = new URL(normalizedPath, this.#baseURL)

    input.search = stringify(params)

    return input
  }

  #handleInit(config: FetchConfig = {}): RequestInit {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    })

    for (const [key, value] of Object.entries(config.headers ?? {})) {
      if (value === null) {
        headers.delete(key)
      } else {
        headers.set(key, value)
      }
    }

    const body =
      config.body && headers.get('Content-Type') === 'application/json'
        ? JSON.stringify(config.body)
        : config.body

    return {
      ...config,
      body,
      headers,
    } as RequestInit
  }

  async #handleResponse<TData>(response: Response): Promise<TData> {
    if (!response.ok) {
      const {
        message,
        errors,
      }: { message?: string; errors?: Record<string, string> } =
        await response.json()

      throw new FetchError(
        message ?? response.statusText,
        response.status,
        response.statusText,
        errors,
      )
    }

    const contentType = response.headers.get('Content-Type')
    const isJson = contentType?.includes('application/json')

    return isJson ? response.json() : (null as unknown as TData)
  }

  async fetch<TData>(path: string, config: FetchConfig = {}): Promise<TData> {
    const input = this.#handleInput(path, config)
    const init = this.#handleInit(config)

    console.log(
      `[API] Performing request to: ${input.toString()} ${config.method ?? 'GET'}`,
    )
    return fetch(input, init).then((response) => {
      console.log(
        `[API] Received response from: ${input.toString()} ${config.method ?? 'GET'} ${response.status} ${response.statusText}`,
      )
      return this.#handleResponse<TData>(response)
    })
  }
}

export function isFetchError(error: unknown): error is FetchError {
  return error instanceof FetchError
}

export class CoreFetcher extends Fetcher {
  constructor() {
    super(import.meta.env.VITE_CORE_URL)
  }

  async fetch<TData>(path: string, config: FetchConfig = {}): Promise<TData> {
    const xsrfValue = Cookies.get('XSRF-TOKEN')
    const headers = {
      ...config.headers,
      'X-Requested-With': 'XMLHttpRequest',
      ...(xsrfValue ? { 'X-XSRF-TOKEN': xsrfValue } : {}),
      ...(config.body instanceof FormData ? { 'Content-Type': null } : {}),
    }

    return super.fetch(path, {
      ...config,
      headers,
      credentials: 'include',
    })
  }
}

export const core = new CoreFetcher()
