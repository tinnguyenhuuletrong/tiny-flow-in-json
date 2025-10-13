import { describe, it, expect } from 'bun:test';
import { flowJsonSchema } from '../../src/lib/schema';

describe('flowJsonSchema', () => {
  it('should be an object', () => {
    expect(typeof flowJsonSchema).toBe('object');
  });

  it('should not be null', () => {
    expect(flowJsonSchema).not.toBeNull();
  });

  it('should have a $schema property', () => {
    expect(flowJsonSchema).toHaveProperty('$schema');
  });
});
