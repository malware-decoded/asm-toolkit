export function getX86Registers(mode: string, uc: any): [string, number][] {
 switch (mode) {
    case '16-bit':
        return [
          ['AX', uc.X86_REG_AX],
          ['BX', uc.X86_REG_BX],
          ['CX', uc.X86_REG_CX],
          ['DX', uc.X86_REG_DX],
          ['SI', uc.X86_REG_SI],
          ['DI', uc.X86_REG_DI],
          ['BP', uc.X86_REG_BP],
          ['SP', uc.X86_REG_SP],
          ['EFLAGS', uc.X86_REG_EFLAGS],
          ['CS', uc.X86_REG_CS],
          ['DS', uc.X86_REG_DS],
          ['ES', uc.X86_REG_ES],
          ['FS', uc.X86_REG_FS],
          ['GS', uc.X86_REG_GS],
          ['SS', uc.X86_REG_SS]
        ]
    case '32-bit':
        return [
          ['EAX', uc.X86_REG_EAX],
          ['EBX', uc.X86_REG_EBX],
          ['ECX', uc.X86_REG_ECX],
          ['EDX', uc.X86_REG_EDX],
          ['ESI', uc.X86_REG_ESI],
          ['EDI', uc.X86_REG_EDI],
          ['EBP', uc.X86_REG_EBP],
          ['ESP', uc.X86_REG_ESP],
          ['EFLAGS', uc.X86_REG_EFLAGS],
          ['CS', uc.X86_REG_CS],
          ['DS', uc.X86_REG_DS],
          ['ES', uc.X86_REG_ES],
          ['FS', uc.X86_REG_FS],
          ['GS', uc.X86_REG_GS],
          ['SS', uc.X86_REG_SS]
        ]
    case '64-bit':
        return [
          ['RAX', uc.X86_REG_RAX],
          ['RBX', uc.X86_REG_RBX],
          ['RCX', uc.X86_REG_RCX],
          ['RDX', uc.X86_REG_RDX],
          ['RSI', uc.X86_REG_RSI],
          ['RDI', uc.X86_REG_RDI],
          ['RBP', uc.X86_REG_RBP],
          ['RSP', uc.X86_REG_RSP],
          ['R8', uc.X86_REG_R8],
          ['R9', uc.X86_REG_R9],
          ['R10', uc.X86_REG_R10],
          ['R11', uc.X86_REG_R11],
          ['R12', uc.X86_REG_R12],
          ['R13', uc.X86_REG_R13],
          ['R14', uc.X86_REG_R14],
          ['R15', uc.X86_REG_R15],
          ['RIP', uc.X86_REG_RIP],
          ['EFLAGS', uc.X86_REG_EFLAGS],
          ['CS', uc.X86_REG_CS],
          ['DS', uc.X86_REG_DS],
          ['ES', uc.X86_REG_ES],
          ['FS', uc.X86_REG_FS],
          ['GS', uc.X86_REG_GS],
          ['SS', uc.X86_REG_SS]
        ]
    default:
        throw new Error('Invalid mode');
 }
}


