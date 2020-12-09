export function createGraphLineCentered(width: number, content: string, leftFill = ' ', rightFill = ' '): string {
  const left = (width / 2) - (content.length / 2);
  return createGraphLine(left, width, content, leftFill, rightFill);
}

export function createGraphLineLeft(value: number, min: number, width: number, content: string, leftFill = ' ', rightFill = ' '): string {
  const left = value - min;
  return createGraphLine(left, width, content, leftFill, rightFill);
}

export function createGraphLine(left: number, width: number, content: string, leftFill = ' ', rightFill = ' '): string {
  const leftMin = left < 0 ? 0 : left;
  const right = width - leftMin - content.length;
  const rightMin = right < 0 ? 0 : right;
  return fillString(leftMin, leftFill) + content + fillString(rightMin, rightFill);
}

export function fillString(amount: number, fill = ' '): string {
  const amountMin = amount < 0 ? 0 : amount;
  const amountRound = Math.round(amountMin);
  return fill.repeat(amountRound);
}
