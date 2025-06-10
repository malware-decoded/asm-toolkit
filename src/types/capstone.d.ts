export { };

declare global {
  interface Window {
    cs: {
      Capstone: new (...args: any[]) => {
        disasm: (code: Uint8Array, address: number) => {
          address: number;
          mnemonic: string;
          op_str: string;
          size: number;
        }[];
        option: (optType: number, optValue: number) => void;
        errno: () => any;
        close: () => void;
      };
      // Architecture constants
      ARCH_ARM: number;
      ARCH_ARM64: number;
      ARCH_MIPS: number;
      ARCH_X86: number;
      ARCH_PPC: number;
      ARCH_SPARC: number;
      ARCH_SYSTEMZ: number;
      ARCH_HEXAGON: number;
      ARCH_MAX: number;

      // Mode constants
      MODE_LITTLE_ENDIAN: number;
      MODE_BIG_ENDIAN: number;
      MODE_ARM: number;
      MODE_THUMB: number;
      MODE_MIPS32: number;
      MODE_MIPS64: number;
      MODE_16: number;
      MODE_32: number;
      MODE_64: number;
      MODE_PPC32: number;
      MODE_PPC64: number;
      MODE_SPARC32: number;
      MODE_SPARC64: number;

      // Disassembly detail options
      OPT_DETAIL: number;
      OPT_SKIPDATA: number;
      OPT_SYNTAX: number;
      OPT_SYNTAX_DEFAULT: number;
      OPT_SYNTAX_INTEL: number;
      OPT_SYNTAX_ATT: number;
      OPT_SYNTAX_NOREGNAME: number;

      // Error codes
      ERR_OK: number;
      ERR_MEM: number;
      ERR_ARCH: number;
      ERR_HANDLE: number;
      ERR_MODE: number;
      ERR_VERSION: number;
      ERR_DIET: number;
      ERR_SKIPDATA: number;
      ERR_X86_ATT: number;
      ERR_X86_INTEL: number;

      // Instruction group types
      GROUP_INVALID: number;
      GROUP_JUMP: number;
      GROUP_CALL: number;
      GROUP_RET: number;
      GROUP_INT: number;
      GROUP_IRET: number;
      GROUP_PRIVILEGE: number;
      GROUP_BRANCH_RELATIVE: number;

      // Access types for instruction operands
      AC_INVALID: number;
      AC_READ: number;
      AC_WRITE: number;
      AC_READWRITE: number; // Combined read/write access
    };
  }
}
