import { Fetcher } from './base'

export class LocalFetcher extends Fetcher {
  constructor() {
    super(process.env.NEXT_PUBLIC_APP_URL ?? '')
  }
}

export const local = new LocalFetcher()
