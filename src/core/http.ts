/**
 * Generic wrapper for all HTTP responses from the Splitivo backend.
 *
 * {
 *   "code": 200,
 *   "message": "Operation completed successfully",
 *   "data": { ... },
 *   "errors": []
 * }
 */
export interface HttpResp<T> {
  code: number;
  message: string;
  data: T;
  errors: unknown[];
}
