import { create } from 'zustand';

export type Architecture = 
  | 'x86' 
  | 'ARM64' 
  | 'ARM' 
  | 'MIPS'
  | 'PPC'
  | 'SPARC';

export type Endianness = 'little' | 'big';

export type Mode = 
  | '16-bit'
  | '32-bit'
  | '64-bit'
  | 'ARM'
  | 'THUMB'
  | 'MIPS32'
  | 'MIPS64'
  | 'PPC32'
  | 'PPC64'
  | 'SPARC32'
  | 'SPARC64';

export type TranslationDirection = 'assembly-to-machine' | 'machine-to-assembly';

const getExampleCode = (arch: Architecture, mode: Mode): string => {
  switch (arch) {
    case 'x86':
      switch (mode) {
        case '16-bit':
          return `// 16-bit x86: Add two numbers
    mov ax, 5           // First number
    mov bx, 3           // Second number
    add ax, bx          // Add them together
    // Result is in ax register`;
        case '32-bit':
          return `// 32-bit x86: Add two numbers
    mov eax, 5          // First number
    mov ebx, 3          // Second number
    add eax, ebx        // Add them together
    // Result is in eax register`;
        case '64-bit':
          return `// 64-bit x86: Add two numbers
    mov rax, 5          // First number
    mov rbx, 3          // Second number
    add rax, rbx        // Add them together
    // Result is in rax register`;
        default:
          return '';
      }
    case 'ARM':
      switch (mode) {
        case 'ARM':
          return `// ARM: Add two numbers
    mov r0, #5          // First number
    mov r1, #3          // Second number
    add r0, r0, r1      // Add them together
    // Result is in r0 register`;
        case 'THUMB':
          return `// THUMB: Add two numbers
    movs r0, #5         // First number
    movs r1, #3         // Second number
    adds r0, r0, r1     // Add them together
    // Result is in r0 register`;
        default:
          return '';
      }
    case 'ARM64':
      return `// ARM64: Add two numbers
    mov x0, #5          // First number
    mov x1, #3          // Second number
    add x0, x0, x1      // Add them together
    // Result is in x0 register`;
    case 'MIPS':
      switch (mode) {
        case 'MIPS32':
          return `// MIPS32: Add two numbers
    li $t0, 5           // First number
    li $t1, 3           // Second number
    add $t0, $t0, $t1   // Add them together
    // Result is in $t0 register`;
        case 'MIPS64':
          return `// MIPS64: Add two numbers
    li $t0, 5           // First number
    li $t1, 3           // Second number
    add $t0, $t0, $t1   // Add them together
    // Result is in $t0 register`;
        default:
          return '';
      }
    case 'PPC':
      switch (mode) {
        case 'PPC32':
          return `// PPC32: Add two numbers
    li 3, 5             // First number
    li 4, 3             // Second number
    add 3, 3, 4         // Add them together
    // Result is in register 3`;
        case 'PPC64':
          return `// PPC64: Add two numbers
    li 3, 5             // First number
    li 4, 3             // Second number
    add 3, 3, 4         // Add them together
    // Result is in register 3`;
        default:
          return '';
      }
    case 'SPARC':
      return `// SPARC: Add two numbers
    mov 5, %g1          // First number
    mov 3, %g2          // Second number
    add %g1, %g2, %g1   // Add them together
    // Result is in %g1 register`;
    default:
      return '';
  }
};

interface AppState {
  architecture: Architecture;
  endianness: Endianness;
  mode: Mode;
  translationDirection: TranslationDirection;
  assemblyCode: string;
  setArchitecture: (arch: Architecture) => void;
  setEndianness: (endian: Endianness) => void;
  setMode: (mode: Mode) => void;
  setTranslationDirection: (direction: TranslationDirection) => void;
  setAssemblyCode: (code: string) => void;
}

export const useStore = create<AppState>((set) => ({
  architecture: 'x86',
  endianness: 'little',
  mode: '32-bit',
  translationDirection: 'assembly-to-machine',
  assemblyCode: getExampleCode('x86', '32-bit'),
  setArchitecture: (arch) => set((state) => ({ 
    architecture: arch,
    assemblyCode: getExampleCode(arch, state.mode)
  })),
  setEndianness: (endian) => set({ endianness: endian }),
  setMode: (mode) => set((state) => ({ 
    mode,
    assemblyCode: getExampleCode(state.architecture, mode)
  })),
  setTranslationDirection: (direction) => set({ translationDirection: direction }),
  setAssemblyCode: (code) => set({ assemblyCode: code }),
})); 