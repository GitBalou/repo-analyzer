/**
 * Error with numeric code in addition to basic message
 */
export default class CustomError extends Error {
  private code: number

  constructor (message: string, code: number) {
    super(message)
    this.code = code

    // Remove this constructor from error stacktrace
    if (typeof window === 'undefined') {
      Error.captureStackTrace(this, CustomError)
    }
  }
}
