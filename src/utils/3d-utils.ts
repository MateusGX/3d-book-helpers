type Position = [number, number, number];

export const makeTriangle = (a: Position, b: Position, c: Position) => {
  return [...a, ...b, ...c];
};

export const makeFace = (
  a: Position,
  b: Position,
  c: Position,
  d: Position
) => {
  const triangleA = makeTriangle(a, b, d);
  const triangleB = makeTriangle(d, c, a);
  return [...triangleA, ...triangleB];
};
