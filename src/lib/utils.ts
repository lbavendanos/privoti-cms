import { clsx } from 'clsx'
import { local } from './fetcher/local'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'
import type { FetchConfig } from './fetcher/base'

/**
 * Utility for constructing className strings conditionally and merging them with Tailwind CSS classes.
 *
 * @param {ClassValue[]} inputs - The classes to add or merged.
 * @returns {string} Returns a string of class names.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Generate a url for the application.
 *
 * @param {string} path - The path to generate the url for.
 * @returns {URL} Returns the generated url.
 */
export function url(path: string = '/'): URL {
  return new URL(path, process.env.NEXT_PUBLIC_APP_URL)
}

/**
 *  Generate a url for the store application.
 *
 * @param {string} [path] - The path to generate the url for.
 * @returns {URL} Returns the generated url.
 */
export function storeUrl(path: string = '/'): URL {
  return new URL(path, process.env.NEXT_PUBLIC_STORE_URL)
}

/**
 * Check if a value is a boolean.
 *
 * @param {boolean | number | string} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a boolean, `false` otherwise.
 */
export function boolean(value: boolean | number | string): boolean {
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value === 1

  if (typeof value === 'string')
    return ['true', 't', 'yes', 'y', 'on', '1'].includes(
      value.trim().toLowerCase(),
    )

  return false
}

/**
 * Check if a value is `true`.
 *
 * @param {boolean | number | string} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `true`, `false` otherwise.
 */
export function isTrue(value: boolean | number | string): boolean {
  return boolean(value)
}

/**
 * Check if a value is `false`.
 *
 * @param {boolean | number | string} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `false`, `false` otherwise.
 */
export function isFalse(value: boolean | number | string): boolean {
  return !isTrue(value)
}

/**
 * Delays the execution for a specified number of milliseconds.
 *
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise<void>} Returns a promise that resolves after the delay.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Determine if the given value is "blank".
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} Returns `true` if the value is "blank", `false` otherwise.
 */
export function blank(value: unknown): boolean {
  if (value === null || value === undefined) return true

  if (typeof value === 'number' || typeof value === 'boolean') return false

  if (typeof value === 'string' && value.trim() === '') return true

  if (Array.isArray(value) && value.length === 0) return true

  if (value instanceof Map || value instanceof Set) return value.size === 0

  if (typeof value === 'object' && Object.keys(value as object).length === 0)
    return true

  return false
}

/**
 * Determine if the given value is "filled".
 *
 * @param {unknown} value - The value to check.
 * @returns {boolean} Returns `true` if the value is "filled", `false` otherwise.
 */
export function filled(value: unknown): boolean {
  return !blank(value)
}

/**
 * Capitalizes the first letter of a string.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * Generate a UUID.
 *
 * @returns {string} Returns a UUID.
 */
export function uuid(): string {
  return crypto.randomUUID()
}

/**
 * Create a debounce function that delays invoking
 * the provided function until after `delay` milliseconds
 * have elapsed since the last time the debounce function was invoked.
 *
 * @param fn - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @param immediate - Whether to execute the function immediately.
 * @returns The debounced function.
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delay: number,
  immediate?: boolean,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>): void {
    if (timeout) clearTimeout(timeout)

    if (immediate && !timeout) fn.apply(this, args)

    timeout = setTimeout(() => {
      timeout = null
      if (!immediate) fn.apply(this, args)
    }, delay)
  }
}

/**
 * Fetches data from the specified path
 *
 * @template T - The type of the data to be fetched.
 * @param {string} path - The API endpoint path to fetch data from.
 * @param {FetchConfig} [config={}] - Optional configuration for the fetch request.
 * @returns {Promise<T>} - A promise that resolves to the fetched data of type T.
 */
export async function fetcher<T>(
  path: string,
  config: FetchConfig = {},
): Promise<T> {
  return local.fetch<T>(path, config)
}
