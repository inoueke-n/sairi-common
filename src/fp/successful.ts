export namespace Successful {
  interface Base {
    success: boolean;
  }
  export interface Success<T> extends Base {
    success: true;
    value: T;
  }
  export interface Fail extends Base {
    success: false;
    reason?: any;
  }
}

export type Successful<T> = Successful.Fail | Successful.Success<T>;

export function isSuccess<T>(
  successful: Successful<T>
): successful is Successful.Success<T> {
  return successful.success;
}

export function isFail<T>(
  successful: Successful<T>
): successful is Successful.Fail {
  return !isSuccess(successful);
}

type MapFn<T> = (a: T) => T;

export function mapSuccessful<T>(
  f: MapFn<T>,
  successful: Successful<T>
): Successful<T> {
  if (successful.success) {
    return { success: true, value: f(successful.value) };
  } else {
    return successful;
  }
}
