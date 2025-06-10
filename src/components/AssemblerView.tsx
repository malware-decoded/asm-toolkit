import { useEffect, useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { useStore } from "../store/useStore";
import { ArchitectureSelector } from "./selector/ArchitectureSelector";
import { EndianSelector } from "./selector/EndianSelector";
import { ModeSelector } from "./selector/ModeSelector";
import { TranslationDirectionSelector } from "./selector/TranslationDirectionSelector";

export function AssemblerView() {
  const [inputCode, setInputCode] = useState("");
  const [outputCode, setOutputCode] = useState("");
  const [ksReady, setKsReady] = useState(false);
  const [csReady, setCsReady] = useState(false);
  const { architecture, endianness, mode, translationDirection } = useStore();

  useEffect(() => {
    if (window.ks) {
      setKsReady(true);
    } else {
      console.error("Keystone module (window.ks) is not loaded.");
    }

    if (window.cs) {
      setCsReady(true);
    } else {
      console.error("Capstone module (window.cs) is not loaded.");
    }
  }, []);

  function handleInputChange(newCode: string) {
    setInputCode(newCode);
  }

  function getArchAndMode(ob: any) {
    const archMap = {
      x86: ob.ARCH_X86,
      ARM64: ob.ARCH_ARM64,
      ARM: ob.ARCH_ARM,
      HEXAGON: ob.ARCH_HEXAGON,
      MIPS: ob.ARCH_MIPS,
      PPC: ob.ARCH_PPC,
      SPARC: ob.ARCH_SPARC,
      SYSTEMZ: ob.ARCH_SYSTEMZ,
    };

    let baseMode;
    switch (architecture) {
      case "x86":
        switch (mode) {
          case "16-bit":
            baseMode = ob.MODE_16 | ob.MODE_LITTLE_ENDIAN;
            break;
          case "32-bit":
            baseMode = ob.MODE_32 | ob.MODE_LITTLE_ENDIAN;
            break;
          case "64-bit":
            baseMode = ob.MODE_64 | ob.MODE_LITTLE_ENDIAN;
            break;
          default:
            throw new Error("Invalid mode");
        }
        break;
      case "ARM":
        baseMode = mode === "THUMB" ? ob.MODE_THUMB : ob.MODE_ARM;
        baseMode = baseMode | ob.MODE_LITTLE_ENDIAN;
        break;
      case "ARM64":
        baseMode = ob.MODE_LITTLE_ENDIAN;
        break;
      case "MIPS":
        baseMode = mode === "MIPS64" ? ob.MODE_MIPS64 : ob.MODE_MIPS32;

        baseMode =
          baseMode |
          (endianness === "big" ? ob.MODE_BIG_ENDIAN : ob.MODE_LITTLE_ENDIAN);
        break;
      case "PPC":
        baseMode = mode === "PPC64" ? ob.MODE_PPC64 : ob.MODE_PPC32;

        if (mode === "PPC32" || endianness === "big") {
          baseMode = baseMode | ob.MODE_BIG_ENDIAN;
        } else {
          baseMode = baseMode | ob.MODE_LITTLE_ENDIAN;
        }
        break;
      case "SPARC":
        baseMode = ob.MODE_SPARC32;

        baseMode =
          baseMode |
          (endianness === "big" ? ob.MODE_BIG_ENDIAN : ob.MODE_LITTLE_ENDIAN);
        break;
      case "SYSTEMZ":
        baseMode = ob.MODE_BIG_ENDIAN;
        break;
      default:
        throw new Error("Invalid architecture");
    }

    return {
      arch: archMap[architecture],
      mode: baseMode,
    };
  }

  function assemblyToMachineCode(code: string) {
    if (!ksReady) {
      setOutputCode("// Keystone.js is not loaded");
      return;
    }

    try {
      const ks = window.ks;
      const { arch, mode } = getArchAndMode(ks);

      const encoder = new ks.Keystone(arch, mode);

      const result = encoder.asm(code);
      encoder.close();

      const hex = Array.from(result)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(" ");

      setOutputCode(hex);
    } catch (err) {
      console.error("Error assembling:", err);
      setOutputCode("// Error during assembly");
    }
  }

  function machineCodeToAssembly(code: string) {
    if (!csReady) {
      setOutputCode("// Capstone.js is not loaded");
      return;
    }

    try {
      const cs = window.cs;
      const { arch, mode } = getArchAndMode(cs);

      var disassembler = new cs.Capstone(arch, mode);

      const cleaned = code.replace(/[^a-fA-F0-9]/g, "");

      var bytes = hexStringToUint8Array(cleaned);

      var instructions = disassembler.disasm(bytes, 0x1000);

      var code = instructions
        .map((instruction) => {
          return `${instruction.mnemonic} ${instruction.op_str}`;
        })
        .join("\n");

      setOutputCode(code);
    } catch (err) {
      console.error("Error disassembling:", err);
      setOutputCode("// Error during disassembly");
    }
  }

  function hexStringToUint8Array(hexString: string): Uint8Array {
    if (hexString.length % 2 !== 0) {
      throw new Error("Hex string must have an even length");
    }

    const bytes = new Uint8Array(hexString.length / 2);
    for (let i = 0; i < hexString.length; i += 2) {
      bytes[i / 2] = parseInt(hexString.substr(i, 2), 16);
    }
    return bytes;
  }

  function handleTranslate() {
    if (translationDirection === "assembly-to-machine") {
      assemblyToMachineCode(inputCode);
    } else {
      machineCodeToAssembly(inputCode);
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="min-h-[80px] p-4 bg-white border-b">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Architecture
            </label>
            <ArchitectureSelector mode="assembler" />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Endianness
            </label>
            <EndianSelector />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode
            </label>
            <ModeSelector />
          </div>
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Translation
            </label>
            <TranslationDirectionSelector />
          </div>
        </div>
      </div>

      <div className="flex-grow min-h-0 flex flex-col p-4">
        <div className="flex-1 flex flex-col min-h-0 mb-4">
          <h2 className="text-lg font-medium mb-2">
            {translationDirection === "assembly-to-machine"
              ? "Assembly Code"
              : "Machine Code"}
          </h2>
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={inputCode}
              onChange={handleInputChange}
              placeholder={
                translationDirection === "assembly-to-machine"
                  ? "Enter assembly code here..."
                  : "Enter machine code in hex format..."
              }
              className="h-full"
            />
          </div>
        </div>

        <div className="flex justify-center py-4">
          <button
            onClick={handleTranslate}
            className="w-[40%] px-6 py-2 bg-blue-900/20 text-blue-900 hover:bg-blue-900/40 rounded-md hover:text-blue-700 transition-colors font-medium"
          >
            Translate
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0">
          <h2 className="text-lg font-medium mb-2">
            {translationDirection === "assembly-to-machine"
              ? "Machine Code"
              : "Assembly Code"}
          </h2>
          <div className="flex-1 min-h-0">
            <CodeEditor value={outputCode} readOnly className="h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
