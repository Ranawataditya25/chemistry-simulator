// Zero Order Reaction: A → B
// [A] = [A]₀ - k·t   (until [A] = 0)
// [B] = [A]₀ - [A]

export function calculateZeroOrder({ A0, k, time }) {
  const A = Math.max(A0 - k * time, 0);
  const B = A0 - A;
  return { A, B };
}