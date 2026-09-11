/**
 * Shared checks for axios failures.
 *
 * Several endpoints report "nothing here" as a 404 rather than an empty list.
 * That is a valid state for the user, not a failure, so callers use this to
 * tell an empty result apart from a real problem.
 */

/** True only for an HTTP 404; a network failure is NOT an empty result. */
export const isNotFound = (error) => error?.response?.status === 404;
