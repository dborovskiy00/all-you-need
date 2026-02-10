export interface SettledOk<T> {
  status: "fulfilled";
  value: T;
}

export interface SettledErr {
  status: "rejected";
  reason: unknown;
}

export type SettledResult<T> = SettledOk<T> | SettledErr;

export function pSettle<T>(
  promises: Promise<T>[],
): Promise<SettledResult<T>[]> {
  return Promise.all(
    promises.map((promise) =>
      promise.then(
        (value): SettledOk<T> => ({ status: "fulfilled", value }),
        (reason): SettledErr => ({ status: "rejected", reason }),
      ),
    ),
  );
}
