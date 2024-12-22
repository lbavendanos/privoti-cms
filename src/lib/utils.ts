import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
 * @param {any} value - The value to check.
 * @returns {boolean} Returns `true` if the value is a boolean, `false` otherwise.
 */
export function boolean(value: unknown): boolean {
  if (typeof value === 'string') {
    return ['true', 't', 'yes', 'y', 'on', '1'].includes(
      value.trim().toLowerCase(),
    )
  }

  if (typeof value === 'number') {
    return value === 1
  }

  if (typeof value === 'boolean') {
    return value
  }

  return false
}

/**
 * Check if a value is `true`.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `true`, `false` otherwise.
 */
export function isTrue(value: unknown): boolean {
  return boolean(value)
}

/**
 * Check if a value is `false`.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `false`, `false` otherwise.
 */
export function isFalse(value: unknown): boolean {
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
