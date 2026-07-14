/**
 * A discriminated-union `Result` type for modelling operations that can fail
 * without throwing. Used as a shared vocabulary between layers so error
 * handling stays explicit and type-safe.
 */
export type Result<TValue, TError = Error> =
  { readonly ok: true; readonly value: TValue } | { readonly ok: false; readonly error: TError };

export const ok = <TValue>(value: TValue): Result<TValue, never> => ({
  ok: true,
  value,
});

export const err = <TError>(error: TError): Result<never, TError> => ({
  ok: false,
  error,
});
