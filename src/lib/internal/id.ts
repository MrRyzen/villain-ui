import { nanoid } from 'nanoid';

/**
 * Generate a unique ID with an optional prefix.
 * Uses nanoid for smaller size and better security than Math.random() or crypto.randomUUID().
 * 
 * @param prefix - Optional prefix for the ID (e.g., 'input', 'modal', 'tooltip')
 * @returns A unique ID string with the format `prefix-{nanoid}`
 * 
 * @example
 * createId('input') // Returns 'input-V1StGXR8_Z5jdHi6B'
 * createId('modal') // Returns 'modal-n5yjdHi6BV1StGXR8'
 */
export function createId(prefix: string): string {
  return `${prefix}-${nanoid(9)}`;
}
