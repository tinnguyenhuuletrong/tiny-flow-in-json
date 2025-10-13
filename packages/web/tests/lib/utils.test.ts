import { describe, it, expect } from 'bun:test';
import { cn } from '../../src/lib/utils';

describe('cn', () => {
  it('should merge class names', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional classes', () => {
    expect(cn('bg-red-500', { 'text-white': true, 'font-bold': false })).toBe('bg-red-500 text-white');
  });

  it('should merge conflicting tailwind classes', () => {
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
  });

  it('should handle a mix of arguments', () => {
    expect(cn('p-4', false, 'm-2', { 'rounded-lg': true })).toBe('p-4 m-2 rounded-lg');
  });

  it('should return an empty string for no arguments', () => {
    expect(cn()).toBe('');
  });
});
