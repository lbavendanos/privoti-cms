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
export function boolean(value: any): boolean {
  const type = Object.prototype.toString.call(value)

  if (type === '[object String]')
    return ['true', 't', 'yes', 'y', 'on', '1'].includes(
      value.trim().toLowerCase(),
    )

  if (type === '[object Number]') return value === 1

  if (type === '[object Boolean]') return value

  return false
}

/**
 * Check if a value is `true`.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `true`, `false` otherwise.
 */
export function isTrue(value: any): boolean {
  return boolean(value)
}

/**
 * Check if a value is `false`.
 *
 * @param {any} value - The value to check.
 * @returns {boolean} Returns `true` if the value is `false`, `false` otherwise.
 */
export function isFalse(value: any): boolean {
  return !isTrue(value)
}
