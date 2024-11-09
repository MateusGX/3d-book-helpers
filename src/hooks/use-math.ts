import { useEffect, useState } from "react";

export const useMath = (
  a: number,
  b: number,
  f: (a: number, b: number) => number
) => {
  const [result, setResult] = useState<number>(0);

  useEffect(() => {
    setResult(f(a, b));
  }, [a, b, f]);

  return result;
};
