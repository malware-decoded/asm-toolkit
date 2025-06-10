export { };

declare global {
  interface Window {
    ks: {
      Keystone: new (...args: any[]) => {
        asm: (code: string) => Uint8Array;
        option: (optType: number, optValue: number) => void;
        errno: () => any;
        close: () => void;
      };
      ARCH_ARM: number;
      ARCH_ARM64: number;
      ARCH_MIPS: number;
      ARCH_X86: number;
      ARCH_PPC: number;
      ARCH_SPARC: number;
      ARCH_SYSTEMZ: number;
      ARCH_HEXAGON: number;
      ARCH_MAX: number;
      MODE_LITTLE_ENDIAN: number;
      MODE_BIG_ENDIAN: number;
      MODE_ARM: number;
      MODE_THUMB: number;
      MODE_V8: number;
      MODE_MICRO: number;
      MODE_MIPS3: number;
      MODE_MIPS32R6: number;
      MODE_MIPS32: number;
      MODE_MIPS64: number;
      MODE_16: number;
      MODE_32: number;
      MODE_64: number;
      MODE_PPC32: number;
      MODE_PPC64: number;
      MODE_QPX: number;
      MODE_SPARC32: number;
      MODE_SPARC64: number;
      MODE_V9: number;
      OPT_SYNTAX: number;
      OPT_SYNTAX_INTEL: number;
      OPT_SYNTAX_ATT: number;
      OPT_SYNTAX_NASM: number;
      OPT_SYNTAX_MASM: number;
      OPT_SYNTAX_GAS: number;
    };
  }
}
