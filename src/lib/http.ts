import Cookies from 'js-cookie'

interface FetchRequestConfig<D = any> extends RequestInit {
  url?: URL | string
  baseURL?: string
  params?: Record<string, string>
  data?: D
  headers?: Record<string, string>
  cookies?: any
  withCredentials?: boolean
  withXSRFToken?: boolean
  xsrfCookieName?: string
  xsrfHeaderName?: string
}

interface FetchResponse<TData = any> {
  data: TData
  status: number
  statusText: string
  headers: Headers
}

interface FetchError<TData = any> {
  code: number
  response: FetchResponse<TData>
}

class Fetch {
  #config: FetchRequestConfig = {
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  }

  constructor(config: FetchRequestConfig = {}) {
    this.#config = { ...this.#config, ...config }
  }

  #handleURL(config: FetchRequestConfig) {
    const baseURL = config.baseURL
      ? config.baseURL.endsWith('/')
        ? config.baseURL
        : `${config.baseURL}/`
      : config.baseURL

    const url =
      typeof config.url === 'string' || config.url instanceof String
        ? config.url.startsWith('/')
          ? config.url.substring(1)
          : config.url
        : config.url

    const input = new URL(url!, baseURL)

    Object.entries(config.params || {}).forEach(([key, value]) => {
      input.searchParams.append(key, value as string)
    })

    return input
  }

  #handleConfig(config: FetchRequestConfig): FetchRequestConfig {
    const { headers: globalHeaders, ...globalConfig } = this.#config
    const { headers: localHeaders, ...localConfig } = config

    config = { ...globalConfig, ...localConfig }
    config['headers'] = { ...globalHeaders, ...localHeaders }

    if (
      config.withXSRFToken &&
      config.xsrfCookieName &&
      config.xsrfHeaderName
    ) {
      const xsrfValue = config.cookies
        ? config.cookies.get(config.xsrfCookieName).value
        : Cookies.get(config.xsrfCookieName)

      if (xsrfValue) {
        config['headers'] = {
          ...config['headers'],
          [config.xsrfHeaderName]: xsrfValue,
        }
      }
    }

    return {
      ...config,
      url: this.#handleURL(config),
      body: config.data && JSON.stringify(config.data),
    }
  }

  #getResponseType(headers: Headers) {
    const contentType = headers.get('Content-Type')

    if (!contentType) return null

    if (contentType?.includes('application/json')) return 'json'
    if (contentType?.includes('text')) return 'text'
    if (contentType?.includes('blob')) return 'blob'

    throw new Error(`Fetch does not support content-type ${contentType} yet`)
  }

  async #handleResponse<TData = any>(
    response: Response,
  ): Promise<FetchResponse<TData>> {
    const type = this.#getResponseType(response.headers)

    const responseData = {
      data: (type ? await response[type]() : null) as TData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    return response.ok
      ? Promise.resolve(responseData)
      : Promise.reject({
          code: response.status,
          response: responseData,
        } satisfies FetchError)
  }

  async get<TData = any>(
    url: string,
    config: FetchRequestConfig = {},
  ): Promise<FetchResponse<TData>> {
    config = this.#handleConfig({ url, method: 'GET', ...config })

    return fetch(config.url!, config).then((response) => {
      return this.#handleResponse(response)
    })
  }

  async post<TData = any>(
    url: string,
    data: any = {},
    config: FetchRequestConfig = {},
  ): Promise<FetchResponse<TData>> {
    config = this.#handleConfig({
      url,
      method: 'POST',
      data,
      ...config,
    })

    return fetch(config.url!, config).then((response) => {
      return this.#handleResponse(response)
    })
  }

  async put<TData = any>(
    url: string,
    data: any = {},
    config: FetchRequestConfig = {},
  ): Promise<FetchResponse<TData>> {
    config = this.#handleConfig({
      url,
      method: 'PUT',
      data,
      ...config,
    })
    return fetch(config.url!, config).then((response) => {
      return this.#handleResponse(response)
    })
  }

  async delete<TData = any>(
    url: string,
    config: FetchRequestConfig = {},
  ): Promise<FetchResponse<TData>> {
    config = this.#handleConfig({ url, method: 'DELETE', ...config })

    return fetch(config.url!, config).then((response) => {
      return this.#handleResponse(response)
    })
  }

  static create(config?: FetchRequestConfig) {
    return new Fetch(config)
  }
}

export interface ApiError {
  errors?: Record<string, string[]>
  error?: string
}

class Api extends Fetch {
  constructor(config: FetchRequestConfig = {}) {
    super({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      withXSRFToken: true,
      withCredentials: true,
      credentials: 'include',
      ...config,
    })
  }

  plainErrors(errors: Record<string, string[]>): string {
    return Object.values(errors)
      .map((error) => error.join(', '))
      .join(', ')
  }

  handleError(error: any): ApiError {
    if (error?.code === 422) {
      return {
        errors: error?.response?.data?.errors,
        error: this.plainErrors(error?.response?.data?.errors || {}),
      }
    }

    return {
      error: error?.response?.data?.message || error?.response?.data?.error,
    }
  }

  static create(config: FetchRequestConfig = {}) {
    return new Api(config)
  }
}

const api = Api.create()

export { api }
