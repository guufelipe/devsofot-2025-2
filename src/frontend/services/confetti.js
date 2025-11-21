import confetti from "canvas-confetti";

export function showConfetti() {
  confetti({
    particleCount: 200,
    spread: 100,
    origin: { y: 0.6 }
  });
}