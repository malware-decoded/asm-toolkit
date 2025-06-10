export function validateHexInput(input: string) {
  if (typeof input !== "string" || !/^(0x)?[0-9a-fA-F]+$/.test(input)) {
    throw new Error("Not a valid hexadecimal number");
  }

  const parsed = parseInt(input, 16);

  if (isNaN(parsed)) {
    throw new Error("Cannot parse as hexadecimal");
  }

  return parsed;
};