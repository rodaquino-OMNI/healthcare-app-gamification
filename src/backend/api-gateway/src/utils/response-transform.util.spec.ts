/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpStatus } from '@nestjs/common';
import { transformResponse, transformErrorResponse } from './response-transform.util';

describe('ResponseTransformUtil', () => {
  // -------------------------------------------------------------------------
  // transformResponse
  // -------------------------------------------------------------------------
  describe('transformResponse', () => {
    it('should be defined as a function', () => {
      expect(transformResponse).toBeDefined();
      expect(typeof transformResponse).toBe('function');
    });

    it('should return data as-is when data is a plain object', () => {
      const data = { id: 'user-1', name: 'Jane' };

      const result = transformResponse(data);

      expect(result).toEqual(data);
    });

    it('should return an empty object when data is null', () => {
      const result = transformResponse(null);

      expect(result).toEqual({});
    });

    it('should return an empty object when data is undefined', () => {
      const result = transformResponse(undefined);

      expect(result).toEqual({});
    });

    it('should return arrays as-is', () => {
      const data = [{ id: 1 }, { id: 2 }];

      const result = transformResponse(data);

      expect(result).toEqual(data);
    });

    it('should return primitive values as-is', () => {
      expect(transformResponse(42)).toBe(42);
      expect(transformResponse('hello')).toBe('hello');
      expect(transformResponse(true)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // transformErrorResponse
  // -------------------------------------------------------------------------
  describe('transformErrorResponse', () => {
    it('should be defined as a function', () => {
      expect(transformErrorResponse).toBeDefined();
      expect(typeof transformErrorResponse).toBe('function');
    });

    it('should return a standardized error object with required fields', () => {
      const error = new Error('Something went wrong');

      const result = transformErrorResponse(error);

      expect(result).toHaveProperty('statusCode');
      expect(result).toHaveProperty('errorCode');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('timestamp');
    });

    it('should default to INTERNAL_SERVER_ERROR status for plain Error objects', () => {
      const error = new Error('Unexpected failure');

      const result = transformErrorResponse(error);

      expect(result.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('should extract status and message from Axios-like error response', () => {
      const axiosError = {
        response: {
          status: 404,
          data: {
            message: 'Resource not found',
            errorCode: 'RES_001',
          },
        },
      };

      const result = transformErrorResponse(axiosError);

      expect(result.statusCode).toBe(404);
      expect(result.message).toBe('Resource not found');
      expect(result.errorCode).toBe('RES_001');
    });

    it('should extract status and message from NestJS HttpException-like errors', () => {
      const nestError = {
        status: 403,
        message: 'Forbidden',
        errorCode: 'AUTH_FORBIDDEN',
      };

      const result = transformErrorResponse(nestError);

      expect(result.statusCode).toBe(403);
    });

    it('should map unauthorized message to AUTH_INVALID_CREDENTIALS error code', () => {
      const error = new Error('Unauthorized access');

      const result = transformErrorResponse(error);

      expect(result.errorCode).toBe('AUTH_INVALID_CREDENTIALS');
      expect(result.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should map forbidden message to AUTH_INSUFFICIENT_PERMISSIONS error code', () => {
      const error = new Error('Forbidden resource');

      const result = transformErrorResponse(error);

      expect(result.errorCode).toBe('AUTH_INSUFFICIENT_PERMISSIONS');
      expect(result.statusCode).toBe(HttpStatus.FORBIDDEN);
    });

    it('should map token expired message to AUTH_TOKEN_INVALID error code', () => {
      const error = new Error('Token expired');

      const result = transformErrorResponse(error);

      expect(result.errorCode).toBe('AUTH_TOKEN_INVALID');
      expect(result.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should map rate limit message to API_RATE_LIMIT_EXCEEDED error code', () => {
      const error = new Error('Rate limit exceeded');

      const result = transformErrorResponse(error);

      expect(result.errorCode).toBe('API_RATE_LIMIT_EXCEEDED');
      expect(result.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
    });

    it('should map validation failed message to API_INVALID_PARAMETER error code', () => {
      const error = new Error('Validation failed on input');

      const result = transformErrorResponse(error);

      expect(result.errorCode).toBe('API_INVALID_PARAMETER');
      expect(result.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should include path when available from the error response', () => {
      const axiosError = {
        response: {
          status: 400,
          data: {
            message: 'Bad request',
            path: '/api/users/invalid',
          },
          config: { url: '/api/users/invalid' },
        },
      };

      const result = transformErrorResponse(axiosError);

      expect(result.path).toBe('/api/users/invalid');
    });

    it('should include a valid ISO timestamp string', () => {
      const error = new Error('Test error');

      const result = transformErrorResponse(error);

      expect(() => new Date(result.timestamp)).not.toThrow();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
});
