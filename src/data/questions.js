import raw from "../../assets/questions?raw";

export const QUESTIONS = raw
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);
