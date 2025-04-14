export type FetchConfig = RequestInit & {
  params?: Record<string, string>
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
    input.search = new URLSearchParams(params).toString()

    return input
  }

  #handleInit(config: FetchConfig = {}): RequestInit {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...config.headers,
    }

    return {
      ...config,
      ...(config.body
        ? {
            body:
              headers['Content-Type'] === 'application/json'
                ? JSON.stringify(config.body)
                : config.body,
          }
        : {}),
      headers: new Headers(headers),
    }
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

    return response.json()
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
