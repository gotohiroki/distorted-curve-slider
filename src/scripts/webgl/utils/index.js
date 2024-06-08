// 線形補間
export const lerp = (start, end, multiplier) => {
  return (1 - multiplier) * start + multiplier * end;
};
