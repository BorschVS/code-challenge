// Iterative solution:

export const sumToNIterative: Function = (n: number): number => {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Mathematical solution:

export const sumToNMath: Function = (n: number): number => {
  return (n * (n + 1)) / 2;
};

// Recursive solution:

export const sumToNRecursive: Function = (n: number): number => {
  if (n === 1) {
    return 1;
  } else {
    return n + sumToNRecursive(n - 1);
  }
};
