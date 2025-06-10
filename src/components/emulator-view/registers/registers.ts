import { getArmRegisters } from "./arm";
import { getArm64Registers } from "./arm64";
import { getMipsRegisters } from "./mips";
import { getSparcRegisters } from "./sparc";
import { getX86Registers } from "./x64";

class Register {
  name: string;
  value: number;

  constructor(name: string, value: number) {
    this.name = name;
    this.value = value;
  }

  public toString = (): string => {
    return `${this.name}: 0x${this.value.toString(16)}`;
  };
}

export function getRegisters(
  architecture: string,
  mode: string
): [string, number][] {
  const uc = window.uc;
  var registers: [string, number][] = [];

  switch (architecture) {
    case "x86":
      registers = getX86Registers(mode, uc);
      break;
    case "ARM":
      registers = getArmRegisters(uc);
      break;
    case "ARM64":
      registers = getArm64Registers(uc);
      break;
    case "MIPS":
      registers = getMipsRegisters(uc);
      break;
    case "SPARC":
      registers = getSparcRegisters(uc);
      break;
    default:
      throw new Error("Invalid architecture");
  }

  return registers;
}

export function readRegisters(
  e: any,
  architecture: string,
  mode: string
): Register[] {
  const registers = getRegisters(architecture, mode);
  const filledRegisters = [];

  // For now all registers are treated as 64-bit registers.
  // In the future register touple should be updated with register 
  // size and the an appropriate read operation can be performed.
  for (const register of registers) {
    const value = e.reg_read(register[1], 8);
    const num = uint8ArrayToNumber(value);

    const reg = new Register(register[0], num);
    filledRegisters.push(reg);
  }

  return filledRegisters;
}

export function getRegisterValue(
  e: any,
  register: number,
  size: number
): number {
  const raw_register_value = e.reg_read(register, size);
  const register_value = uint8ArrayToNumber(raw_register_value);
  return register_value;
}

export function setRegisterValue(
  e: any,
  register: number,
  value: number,
  size: number
) {
  const raw_number = numToUint8Array(value, size);
  e.reg_write(register, raw_number);
}

export function getPcRegister(
  e: any,
  architecture: string,
  mode: string
): Register {
  const uc = window.uc;

  switch (architecture) {
    case "x86":
      switch (mode) {
        case "16-bit":
          return new Register("IP", getRegisterValue(e, uc.X86_REG_IP, 2));
        case "32-bit":
          return new Register("EIP", getRegisterValue(e, uc.X86_REG_EIP, 4));
        case "64-bit":
          return new Register("RIP", getRegisterValue(e, uc.X86_REG_RIP, 8));
        default:
          throw new Error("Invalid mode");
      }
    case "ARM":
      return new Register("PC", getRegisterValue(e, uc.ARM_REG_PC, 4));
    case "ARM64":
      return new Register("PC", getRegisterValue(e, uc.ARM64_REG_PC, 8));
    case "MIPS":
      return new Register("PC", getRegisterValue(e, uc.MIPS_REG_PC, 4));
    case "SPARC":
      return new Register("PC", getRegisterValue(e, uc.SPARC_REG_PC, 4));
    default:
      throw new Error("Invalid architecture");
  }
}

export const registersToOutput = (registers: Register[]): string => {
  var output = "";
  for (const reg of registers) {
    output += reg.toString() + "|";
  }
  return output;
};

function uint8ArrayToNumber(arr: Uint8Array) {
  let num = 0;

  for (let i = 0; i < arr.length; i++) {
    num += Math.pow(256, i) * arr[i];
  }

  return num;
}

function numToUint8Array(num: number, size: number): Uint8Array {
  let arr = new Uint8Array(8);

  for (let i = 0; i < size; i++) {
    arr[i] = num % 256;
    num = Math.floor(num / 256);
  }

  return arr;
}
