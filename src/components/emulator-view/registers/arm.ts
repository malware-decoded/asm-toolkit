export function getArmRegisters(uc: any): [string, number][] {
    return [
        ['R0', uc.ARM_REG_R0],
        ['R1', uc.ARM_REG_R1],
        ['R2', uc.ARM_REG_R2],
        ['R3', uc.ARM_REG_R3],
        ['R4', uc.ARM_REG_R4],
        ['R5', uc.ARM_REG_R5],
        ['R6', uc.ARM_REG_R6],
        ['R7', uc.ARM_REG_R7],
        ['R8', uc.ARM_REG_R8],
        ['R9', uc.ARM_REG_R9],
        ['R10', uc.ARM_REG_R10],
        ['R11', uc.ARM_REG_R11],
        ['R12', uc.ARM_REG_R12],
        ['PC', uc.ARM_REG_PC],
        ['SP', uc.ARM_REG_SP],
        ['LR', uc.ARM_REG_LR],
        ['CPSR', uc.ARM_REG_CPSR]
    ];
}