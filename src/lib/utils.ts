import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'

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
  return new URL(path, import.meta.env.VITE_APP_URL)
}

/**
 *  Generate a url for the store application.
 *
 * @param {string} [path] - The path to generate the url for.
 * @returns {URL} Returns the generated url.
 */
export function storeUrl(path: string = '/'): URL {
  return new URL(path, import.meta.env.VITE_STORE_URL)
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
  if (typeof value === 'boolean') return false
  if (typeof value === 'number' && isNaN(value)) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (value instanceof Map || value instanceof Set) return value.size === 0
  if (
    typeof value === 'object' &&
    Object.getPrototypeOf(value) === Object.prototype &&
    Object.keys(value).length === 0
  )
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
 * Uppercase the first character of each word in a string
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 */
export function ucwords(str: string) {
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\s|["'([{])+\S/g, (l) => l.toUpperCase())
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
 * Get today's date with the time set to midnight.
 *
 * @return {Date} Returns today's date with the time set to midnight.
 */
export function today(): Date {
  const date = new Date()
  date.setHours(0, 0, 0, 0)

  return date
}

/**
 * Format a date to a localized string.
 *
 * @param {Date | string | null} date - The date to format.
 * @param {Intl.DateTimeFormatOptions} [options] - Optional formatting options.
 * @return {string} Returns the formatted date string.
 */
export function formatDate(
  date: Date | string | null,
  options?: Intl.DateTimeFormatOptions,
): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) return ''

  return d.toLocaleDateString(import.meta.env.VITE_APP_LOCALE, {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    ...options,
  })
}

/**
 * Pick fields from an object based on the provided keys.
 *
 * @param {T} source - The source object from which to pick fields.
 * @param {Partial<Record<keyof T, unknown>>} keys - An object where
 * keys are the fields to pick from the source object.
 * @return {Partial<T>} Returns a new object containing only the fields
 */
export function pickFields<T extends Record<string, unknown>>(
  source: T,
  keys: Partial<Record<keyof T, unknown>>,
): Partial<T> {
  return Object.keys(keys).reduce((acc, key) => {
    if (keys[key as keyof T]) {
      acc[key as keyof T] = source[key as keyof T]
    }
    return acc
  }, {} as Partial<T>)
}

/**
 * Remove empty fields from an object.
 *
 * @param {T} search - The object from which to remove empty fields.
 * @return {Partial<T>} Returns a new object without empty fields.
 *
 */
export function clearEmptyFields<T extends Record<string, unknown>>(
  search: T,
): Partial<T> {
  return Object.entries(search).reduce<Partial<T>>((acc, [key, value]) => {
    if (!blank(value)) acc[key as keyof T] = value as T[keyof T]
    return acc
  }, {})
}
