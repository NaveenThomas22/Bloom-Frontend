import { describe, it, expect } from 'vitest';

function extractApiErrorMessage(error: any): string {
  if (error?.response?.data) {
    const data = error.response.data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;
    if (data.errors && typeof data.errors === 'object') {
      const firstKey = Object.keys(data.errors)[0];
      const val = data.errors[firstKey];
      return Array.isArray(val) ? val[0] : String(val);
    }
  }
  return error.message || 'An unexpected error occurred.';
}

describe('API Error Handling Utility', () => {
  it('extracts RFC 7807 detail string', () => {
    const error = {
      response: {
        status: 400,
        data: {
          detail: 'Invalid preparation mode specified.',
        },
      },
    };
    expect(extractApiErrorMessage(error)).toBe('Invalid preparation mode specified.');
  });

  it('extracts validation dictionary errors', () => {
    const error = {
      response: {
        status: 400,
        data: {
          errors: {
            Email: ['The Email field is not a valid e-mail address.'],
          },
        },
      },
    };
    expect(extractApiErrorMessage(error)).toBe('The Email field is not a valid e-mail address.');
  });

  it('extracts message property fallback', () => {
    const error = {
      response: {
        status: 500,
        data: {
          message: 'Internal server error occurred.',
        },
      },
    };
    expect(extractApiErrorMessage(error)).toBe('Internal server error occurred.');
  });

  it('handles offline / network disconnect errors', () => {
    const error = new Error('Network Error');
    expect(extractApiErrorMessage(error)).toBe('Network Error');
  });
});

