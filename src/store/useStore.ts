import { create } from 'zustand';

export type Architecture = 
  | 'x86' 
  | 'ARM64' 
  | 'ARM' 
  | 'HEXAGON'
  | 'MIPS'
  | 'PPC'
  | 'SPARC'
  | 'SYSTEMZ';

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
  | 'SPARC32';

export type TranslationDirection = 'assembly-to-machine' | 'machine-to-assembly';

interface AppState {
  architecture: Architecture;
  endianness: Endianness;
  mode: Mode;
  translationDirection: TranslationDirection;
  setArchitecture: (arch: Architecture) => void;
  setEndianness: (endian: Endianness) => void;
  setMode: (mode: Mode) => void;
  setTranslationDirection: (direction: TranslationDirection) => void;
}

export const useStore = create<AppState>((set) => ({
  architecture: 'x86',
  endianness: 'little',
  mode: '32-bit',
  translationDirection: 'assembly-to-machine',
  setArchitecture: (arch) => set({ architecture: arch }),
  setEndianness: (endian) => set({ endianness: endian }),
  setMode: (mode) => set({ mode }),
  setTranslationDirection: (direction) => set({ translationDirection: direction }),
})); 