import { useState, useEffect } from "react";
import { CodeEditor } from "../CodeEditor";
import { useStore } from "../../store/useStore";
import { ArchitectureSelector } from "../selector/ArchitectureSelector";
import { EndianSelector } from "../selector/EndianSelector";
import { ModeSelector } from "../selector/ModeSelector";
import { validateHexInput } from "../../utils/validators";
import {
  readRegisters,
  registersToOutput,
  getPcRegister,
} from "./registers/registers";

class HookState {
  output_message: String;

  constructor() {
    this.output_message = "";
  }
}

export function EmulatorView() {
  const [output, setOutput] = useState("");
  const [ksReady, setKsReady] = useState(false);
  const [ucReady, setUcReady] = useState(false);
  const [baseMemoryAddress, setBaseMemoryAddress] = useState("0x1000");
  const { 
    architecture, 
    endianness, 
    mode, 
    assemblyCode, 
    setAssemblyCode,
    loadExampleCode 
  } = useStore();

  useEffect(() => {
    if (window.ks) {
      setKsReady(true);
    } else {
      console.error("Keystone module (window.ks) is not loaded.");
    }

    if (window.uc) {
      setUcReady(true);
    } else {
      console.error("Unicorn module (window.uc) is not loaded.");
    }
  }, []);

  function getArchAndMode(ob: any) {
    const archMap = {
      x86: ob.ARCH_X86,
      ARM64: ob.ARCH_ARM64,
      ARM: ob.ARCH_ARM,
      MIPS: ob.ARCH_MIPS,
      SPARC: ob.ARCH_SPARC,
    };

    let baseMode;
    switch (architecture) {
      case "x86":
        switch (mode) {
          case "16-bit":
            baseMode = ob.MODE_16;
            break;
          case "32-bit":
            baseMode = ob.MODE_32;
            break;
          case "64-bit":
            baseMode = ob.MODE_64;
            break;
          default:
            baseMode = ob.MODE_32;
        }
        break;
      case "ARM":
        baseMode = mode === "THUMB" ? ob.MODE_THUMB : ob.MODE_ARM;
        break;
      case "ARM64":
        baseMode = ob.MODE_LITTLE_ENDIAN;
        break;
      case "MIPS":
        baseMode = mode === "MIPS64" ? ob.MODE_MIPS64 : ob.MODE_MIPS32;
        break;
      case "SPARC":
        baseMode = ob.MODE_SPARC32 | ob.MODE_BIG_ENDIAN;
        break;
      default:
        throw new Error("Invalid architecture");
    }

    if (architecture === "MIPS") {
      baseMode =
        baseMode |
        (endianness === "big" ? ob.MODE_BIG_ENDIAN : ob.MODE_LITTLE_ENDIAN);
    }

    return {
      arch: archMap[architecture],
      mode: baseMode,
    };
  }

  function assemblyToMachineCode(code: string): Uint8Array {
    if (!ksReady) {
      throw new Error("Keystone.js is not loaded");
    }

    try {
      const ks = window.ks;
      const { arch, mode } = getArchAndMode(ks);

      const encoder = new ks.Keystone(arch, mode);

      const result = encoder.asm(code);
      encoder.close();

      return result;
    } catch (err) {
      throw new Error("Error assembling: " + err);
    }
  }

  function hookInstruction(
    e: any,
    address_lo: bigint,
    _address_hi: bigint,
    _size: number,
    user_data: HookState
  ) {
    const registers = readRegisters(e, architecture, mode);

    const mem_addr = address_lo.toString(16);
    var msg = `[0x${mem_addr}] `;
    msg += registersToOutput(registers);

    console.log(msg);

    const newOutput = user_data.output_message + msg + "\n";
    user_data.output_message = newOutput;
  }

  function hookInterrupt(
    _e: any,
    _address_lo: bigint,
    _address_hi: bigint,
    _size: number,
    _user_data: undefined
  ) {
    console.log("Interrupt hook");
  }

  function handleRun() {
    if (!ucReady) {
      setOutput("Unicorn.js is not loaded");
      return;
    }

    if (assemblyCode.length === 0) {
      setOutput("No assembly code");
      return;
    }

    const uc = window.uc;

    try {
      // During emulation IP seems to have problems with handling 64bit addresses
      // so for simplicity memory addresses are cut to lower 32 bits
      const addr = validateHexInput(baseMemoryAddress) & 0xffffffff;
      const code = assemblyToMachineCode(assemblyCode);

      const { arch: ucArch, mode: ucMode } = getArchAndMode(uc);

      var e = new uc.Unicorn(ucArch, ucMode);

      e.mem_map(addr, 4 * 1024, uc.PROT_ALL);
      e.mem_write(addr, code);

      var begin = addr;
      var until = addr + code.length;

      e.hook_add(uc.HOOK_INTR, hookInterrupt, null, begin, until);

      if (mode === "THUMB") {
        e.emu_start(begin | 1, until, 0, 1);
      } else {
        e.emu_start(begin, until, 0, 1);
      }

      var hookState = new HookState();

      const pc = getPcRegister(e, architecture, mode);

      if (pc.value != begin) {
        e.hook_add(uc.HOOK_CODE, hookInstruction, hookState, begin, until);
        if (mode === "THUMB") {
          e.emu_start(pc.value | 1, until, 0, 0);
        } else {
          e.emu_start(pc.value, until, 0, 0);
        }
      }

      const registers = readRegisters(e, architecture, mode);
      const address = getPcRegister(e, architecture, mode);
      const mem_addr = address.value.toString(16);

      var msg = `[0x${mem_addr}] `;
      msg += registersToOutput(registers);

      console.log(msg);

      const newOutput = hookState.output_message + msg;
      setOutput(newOutput);
    } catch (err) {
      console.error("Error running emulation:", err);
      setOutput("// Error during emulation");
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="min-h-[80px] p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Architecture
            </label>
            <ArchitectureSelector mode="emulator" />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Endianness
            </label>
            <EndianSelector />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mode
            </label>
            <ModeSelector />
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Base Memory Address
            </label>
            <input
              type="text"
              value={baseMemoryAddress}
              onChange={(e) => setBaseMemoryAddress(e.target.value)}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col min-h-0">
          <div className="flex-1 flex flex-col min-h-0 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Assembly Code</h2>
              <button
                onClick={loadExampleCode}
                className="px-4 bg-blue-900/20 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 hover:bg-blue-900/40 dark:hover:bg-blue-900/60 rounded-md hover:text-blue-700 dark:hover:text-blue-200 transition-colors font-medium"
              >
                Load Example
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={assemblyCode}
                onChange={setAssemblyCode}
                placeholder="Enter assembly code here..."
                className="h-full font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col min-h-0">
          <div className="flex-1 flex flex-col min-h-0 mb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Emulation Log</h2>

              <button
                onClick={handleRun}
                className="w-[40%] px-4 bg-blue-900/20 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 hover:bg-blue-900/40 dark:hover:bg-blue-900/60 rounded-md hover:text-blue-700 dark:hover:text-blue-200 transition-colors font-medium"
              >
                Run Emulation
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={output}
                readOnly
                placeholder="No output yet..."
                className="h-full font-mono text-sm"
                showCopyButton={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
