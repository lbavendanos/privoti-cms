import 'server-only'
import { getSessionToken } from '../session'
import { Fetcher } from './base'
import type { FetchConfig } from './base'

export class CoreFetcher extends Fetcher {
  constructor() {
    super(process.env.NEXT_PUBLIC_API_URL ?? '')
  }

  async fetch<TData>(path: string, config: FetchConfig = {}): Promise<TData> {
    const sessionToken = await getSessionToken()
    const headers = {
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      ...config.headers,
    }

    return super.fetch(path, {
      ...config,
      headers,
    })
  }
}

export const core = new CoreFetcher()
