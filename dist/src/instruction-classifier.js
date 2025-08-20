"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructionClassifier = void 0;
const constants_1 = require("./constants");
class InstructionClassifier {
    constructor(adapter) {
        this.adapter = adapter;
        this.instructionMap = new Map();
        this.classifyInstructions();
    }
    classifyInstructions() {
        // outer instructions
        this.adapter.instructions.forEach((instruction, outerIndex) => {
            const programId = this.adapter.getInstructionProgramId(instruction);
            this.addInstruction({
                instruction,
                programId,
                outerIndex,
            });
        });
        // innerInstructions
        const innerInstructions = this.adapter.innerInstructions;
        if (innerInstructions) {
            innerInstructions.forEach((set) => {
                set.instructions.forEach((instruction, innerIndex) => {
                    const programId = this.adapter.getInstructionProgramId(instruction);
                    this.addInstruction({
                        instruction,
                        programId,
                        outerIndex: set.index,
                        innerIndex,
                    });
                });
            });
        }
    }
    addInstruction(classified) {
        if (!classified.programId)
            return;
        const instructions = this.instructionMap.get(classified.programId) || [];
        instructions.push(classified);
        this.instructionMap.set(classified.programId, instructions);
    }
    getInstructions(programId) {
        return this.instructionMap.get(programId) || [];
    }
    getAllProgramIds() {
        return Array.from(this.instructionMap.keys()).filter((it) => !constants_1.SYSTEM_PROGRAMS.includes(it));
    }
}
exports.InstructionClassifier = InstructionClassifier;
//# sourceMappingURL=instruction-classifier.js.map