import { describe, it, expect } from 'vitest';
import { validateProjectName, checkNodeVersion } from '../../src/utils/validator.js';

describe('validateProjectName', () => {
  it('accepts valid npm package names', () => {
    expect(validateProjectName('my-app')).toBe(true);
    expect(validateProjectName('my-app-123')).toBe(true);
    expect(validateProjectName('app')).toBe(true);
    expect(validateProjectName('@scope/my-app')).toBe(true);
  });

  it('rejects empty names', () => {
    expect(validateProjectName('')).not.toBe(true);
    expect(validateProjectName('  ')).not.toBe(true);
  });

  it('rejects names with spaces', () => {
    expect(validateProjectName('my app')).not.toBe(true);
  });

  it('rejects names with uppercase', () => {
    expect(validateProjectName('MyApp')).not.toBe(true);
  });

  it('rejects names starting with a dot or underscore', () => {
    expect(validateProjectName('.my-app')).not.toBe(true);
    expect(validateProjectName('_my-app')).not.toBe(true);
  });
});

describe('checkNodeVersion', () => {
  it('passes for current Node.js version', () => {
    const result = checkNodeVersion(16);
    expect(result).toBe(true);
  });

  it('fails when requiring a higher version than available', () => {
    const result = checkNodeVersion(999);
    expect(result).not.toBe(true);
    expect(result).toContain('999');
  });
});
