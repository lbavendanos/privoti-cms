interface ApiRequestConfig extends RequestInit {
  params?: Record<string, string>
}

interface ApiResponse<TData = any> {
  data: TData
  status: number
  statusText: string
  headers: Headers
}

class Api {
  #baseURL = process.env.NEXT_PUBLIC_API_URL || ''

  #handleURL(url: string | URL, params: Record<string, string> = {}) {
    const baseURL = this.#baseURL.endsWith('/')
      ? this.#baseURL
      : `${this.#baseURL}/`

    url =
      typeof url === 'string' || url instanceof String
        ? url.startsWith('/')
          ? url.substring(1)
          : url
        : url

    const input = new URL(url, baseURL)

    Object.entries(params).forEach(([key, value]) => {
      input.searchParams.append(key, value as string)
    })

    return input
  }

  #handleBody(data: any) {
    if (data instanceof FormData) {
      return data
    }

    return JSON.stringify(data)
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
  ): Promise<ApiResponse<TData>> {
    const type = this.#getResponseType(response.headers)

    const responseData = {
      data: (type ? await response[type]() : null) as TData,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    }

    return response.ok
      ? Promise.resolve(responseData)
      : Promise.reject(responseData)
  }

  async post<TData = any>(
    url: string | URL,
    data: any = {},
    config: ApiRequestConfig = {},
  ): Promise<ApiResponse<TData>> {
    const { params, ...rest } = config
    const init = { ...rest, method: 'POST', body: this.#handleBody(data) }
    const input = this.#handleURL(url, params)

    return fetch(input, init).then((response) => {
      return this.#handleResponse(response)
    })
  }

  static create() {
    return new Api()
  }
}

const api = Api.create()

export { api }
