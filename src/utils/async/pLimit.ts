export function pLimit(
  concurrency: number,
): <T>(fn: () => Promise<T>) => Promise<T> {
  let activeCount = 0;
  const queue: Array<() => void> = [];

  function next(): void {
    if (queue.length > 0 && activeCount < concurrency) {
      activeCount++;
      const run = queue.shift()!;
      run();
    }
  }

  return <T>(fn: () => Promise<T>): Promise<T> => {
    return new Promise<T>((resolve, reject) => {
      const run = (): void => {
        fn().then(
          (value) => {
            resolve(value);
            activeCount--;
            next();
          },
          (error) => {
            reject(error);
            activeCount--;
            next();
          },
        );
      };

      if (activeCount < concurrency) {
        activeCount++;
        run();
      } else {
        queue.push(run);
      }
    });
  };
}
