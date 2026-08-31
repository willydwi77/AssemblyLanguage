<template>
  <div class="jmp-visualizer bg-slate-900 rounded-lg border border-slate-800 text-slate-100 p-5 flex flex-col gap-6 shadow-xl">
    <!-- Header visualizer -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
      <div>
        <h4 class="font-bold text-sm text-blue-400 flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          Simulator Visual JMP: Alur Lompatan Instruksi
        </h4>
        <p class="text-xs text-slate-400 mt-0.5">
          Memperlihatkan pergerakan Instruction Pointer (<strong class="text-yellow-400">{{ ipName }}</strong>) saat instruksi JMP mengubah aliran eksekusi.
        </p>
      </div>

      <!-- Skenario Selector -->
      <div class="flex items-center gap-2 self-stretch sm:self-auto">
        <span class="text-[11px] text-slate-400 font-bold uppercase whitespace-nowrap">Skenario:</span>
        <select v-model="selectedScenario" class="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-blue-500 font-sans">
          <option value="forward">1. Forward Jump (Melewati Kode)</option>
          <option value="loop">2. Backward Jump (Loop Putar Balik)</option>
          <option value="indirect">3. Indirect Jump (Register Target)</option>
        </select>
      </div>
    </div>

    <!-- Main Visual Grid: Code Pipeline & CPU State -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Panel Kiri: Code Pipeline dengan Alamat Memori (7 Cols) -->
      <div class="lg:col-span-7 flex flex-col">
        <div class="flex justify-between items-center mb-2 px-1">
          <span class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Instruksi Memori (Code Stream)</span>
          <span class="text-[10px] font-mono text-slate-500">Arsitektur: {{ mode }}</span>
        </div>

        <div class="bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col gap-2 relative overflow-hidden">
          <div 
            v-for="(inst, idx) in currentScenarioData.instructions" 
            :key="idx"
            :class="[
              'p-2.5 rounded border text-xs font-mono transition-all duration-300 relative flex items-center justify-between',
              currentStepIdx === inst.stepMatch 
                ? 'bg-blue-950/80 border-blue-500 text-blue-200 shadow-md shadow-blue-900/30' 
                : isSkipped(idx)
                  ? 'bg-slate-950/40 border-slate-850/50 text-slate-600 line-through opacity-50'
                  : isPassed(idx)
                    ? 'bg-slate-900/90 border-slate-800 text-slate-400'
                    : 'bg-slate-900/50 border-slate-850 text-slate-300'
            ]"
          >
            <!-- Indikator Pointer IP -->
            <div class="flex items-center gap-2.5 min-w-0">
              <span 
                :class="[
                  'text-[10px] font-bold px-1.5 py-0.5 rounded select-none shrink-0',
                  currentStepIdx === inst.stepMatch 
                    ? 'bg-yellow-400 text-slate-950 font-extrabold animate-pulse' 
                    : 'bg-slate-800 text-slate-400'
                ]"
              >
                {{ inst.address }}
              </span>

              <div class="flex flex-col min-w-0">
                <span :class="['truncate', currentStepIdx === inst.stepMatch ? 'font-bold text-white' : '']">
                  {{ inst.text }}
                </span>
                <span class="text-[10px] text-slate-500 font-mono">
                  Opcode: {{ inst.opcode }}
                </span>
              </div>
            </div>

            <!-- Status Tag -->
            <div class="shrink-0 flex items-center gap-1.5 ml-2">
              <span 
                v-if="currentStepIdx === inst.stepMatch"
                class="text-[9px] bg-blue-600 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                <span class="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></span>
                ACTIVE ({{ ipName }})
              </span>

              <span 
                v-else-if="isSkipped(idx)" 
                class="text-[9px] bg-red-950/80 border border-red-800 text-red-400 font-bold uppercase px-1.5 py-0.5 rounded"
              >
                SKIPPED
              </span>

              <span 
                v-else-if="isPassed(idx)"
                class="text-[9px] text-slate-500 font-bold"
              >
                ✓ DONE
              </span>
            </div>
          </div>
        </div>

        <!-- Jump Vector Alert Banner -->
        <div v-if="isJumpMoment" class="mt-3 p-3 rounded bg-amber-950/60 border border-amber-500/60 text-amber-300 text-xs flex items-center gap-3 animate-pulse">
          <svg class="w-5 h-5 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
          </svg>
          <div>
            <div class="font-bold">LOMPATAN DIEKSEKUSI (UNCONDITIONAL JUMP)!</div>
            <div class="text-[11px] text-amber-200/90 font-mono mt-0.5">
              {{ ipName }} diubah paksa dari <span class="text-white bg-slate-900 px-1 rounded">{{ jumpSourceAddress }}</span> &rarr; <span class="text-yellow-300 bg-slate-900 px-1 rounded font-bold">{{ jumpTargetAddress }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Kanan: Status CPU (Registers & Execution Log) (5 Cols) -->
      <div class="lg:col-span-5 flex flex-col justify-between gap-4">
        <!-- Register State Monitor -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div class="text-[11px] font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
            <span>Status Register CPU</span>
            <span class="text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-mono">Live Values</span>
          </div>

          <div class="space-y-2.5 font-mono text-xs">
            <!-- Instruction Pointer -->
            <div class="bg-slate-900 p-2.5 rounded border border-yellow-500/40 flex justify-between items-center shadow-inner">
              <div class="flex items-center gap-1.5">
                <span class="text-yellow-400 font-bold">{{ ipName }}</span>
                <span class="text-[9px] text-slate-500">(Program Counter)</span>
              </div>
              <span class="text-yellow-300 font-bold bg-slate-950 px-2 py-1 rounded border border-slate-800">
                {{ currentStepData.ipValue }}
              </span>
            </div>

            <!-- General Purpose Register 1 -->
            <div class="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300 font-bold">{{ reg1Name }}</span>
              <span class="text-emerald-400 font-bold">{{ currentStepData.reg1 }}</span>
            </div>

            <!-- General Purpose Register 2 -->
            <div class="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300 font-bold">{{ reg2Name }}</span>
              <span class="text-cyan-400 font-bold">{{ currentStepData.reg2 }}</span>
            </div>

            <!-- General Purpose Register 3 -->
            <div class="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-slate-300 font-bold">{{ reg3Name }}</span>
              <span class="text-purple-400 font-bold">{{ currentStepData.reg3 }}</span>
            </div>
          </div>
        </div>

        <!-- Log & Penjelasan Langkah -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analisis Langkah CPU
            </div>
            <div class="text-xs text-slate-300 leading-relaxed min-h-[60px]" v-html="currentStepData.explanation"></div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Step {{ currentStepIdx + 1 }} dari {{ currentScenarioData.steps.length }}</span>
            <span class="text-blue-400">{{ currentScenarioData.title }}</span>
          </div>
        </div>

        <!-- Controls (Reset, Prev, Next) -->
        <div class="flex items-center gap-2 pt-2">
          <button 
            @click="resetStep" 
            class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-300 hover:text-white rounded text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer select-none"
            title="Reset ke awal simulasi"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Reset</span>
          </button>

          <button 
            @click="prevStep" 
            :disabled="currentStepIdx === 0" 
            class="flex-1 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded text-xs font-semibold transition-all border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed select-none"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Mundur</span>
          </button>

          <button 
            @click="nextStep" 
            :disabled="currentStepIdx === currentScenarioData.steps.length - 1" 
            class="flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 text-white rounded text-xs font-semibold transition-all border border-blue-500 flex items-center justify-center gap-1.5 shadow-sm shadow-blue-900/30 cursor-pointer disabled:cursor-not-allowed select-none"
          >
            <span>Langkah Selanjutnya</span>
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'x64'
  }
})

const selectedScenario = ref('forward')
const currentStepIdx = ref(0)

const ipName = computed(() => props.mode === 'x64' ? 'RIP' : 'EIP')
const reg1Name = computed(() => props.mode === 'x64' ? 'RAX' : 'EAX')
const reg2Name = computed(() => props.mode === 'x64' ? 'RBX' : 'EBX')
const reg3Name = computed(() => props.mode === 'x64' ? 'RCX' : 'ECX')

const scenarios = computed(() => {
  const is64 = props.mode === 'x64'
  const r1 = is64 ? 'RAX' : 'EAX'
  const r2 = is64 ? 'RBX' : 'EBX'
  const r3 = is64 ? 'RCX' : 'ECX'

  return {
    forward: {
      title: 'Forward Jump (Melewati Kode)',
      instructions: [
        { address: '0x00401000', text: `MOV ${r1}, 10`, opcode: 'B8 0A 00 00 00', stepMatch: 0 },
        { address: '0x00401005', text: 'JMP skip_block  ; Lompat ke 0x00401015', opcode: 'EB 0E', stepMatch: 1 },
        { address: '0x00401007', text: `MOV ${r2}, 20   ; (DILEWATI)`, opcode: 'BB 14 00 00 00', stepMatch: -1 },
        { address: '0x0040100C', text: `ADD ${r1}, ${r2}   ; (DILEWATI)`, opcode: '01 D8', stepMatch: -1 },
        { address: '0x0040100E', text: `MOV ${r2}, 99   ; (DILEWATI)`, opcode: 'BB 63 00 00 00', stepMatch: -1 },
        { address: '0x00401015', text: `skip_block: MOV ${r3}, 30`, opcode: 'B9 1E 00 00 00', stepMatch: 2 },
        { address: '0x0040101A', text: `ADD ${r1}, ${r3}  ; ${r1} = 10 + 30`, opcode: '01 C8', stepMatch: 3 }
      ],
      steps: [
        {
          ipValue: '0x00401000',
          reg1: '0x0A (10)',
          reg2: '0x00 (0)',
          reg3: '0x00 (0)',
          explanation: `CPU mengeksekusi <code>MOV ${r1}, 10</code>. Register ${r1} sekarang bernilai 10. ${ipName} bergeser menunjuk ke baris instruksi berikutnya di <code>0x00401005</code>.`
        },
        {
          ipValue: '0x00401005',
          reg1: '0x0A (10)',
          reg2: '0x00 (0)',
          reg3: '0x00 (0)',
          explanation: `CPU membaca instruksi <code>JMP skip_block</code> (opcode: <code>EB 0E</code> dengan relative offset +14 byte). <strong>Alur program langsung melompat</strong> dan memindahkan ${ipName} langsung ke <code>0x00401015</code>, melewati baris 0x00401007 s/d 0x0040100E tanpa pernah mengeksekusinya.`
        },
        {
          ipValue: '0x00401015',
          reg1: '0x0A (10)',
          reg2: '0x00 (0)',
          reg3: '0x1E (30)',
          explanation: `Eksekusi mendarat di label <code>skip_block</code> (alamat <code>0x00401015</code>). CPU mengeksekusi <code>MOV ${r3}, 30</code>. Perhatikan bahwa register ${r2} tetap bernilai 0 karena baris pengisiannya telah dilewati.`
        },
        {
          ipValue: '0x0040101A',
          reg1: '0x28 (40)',
          reg2: '0x00 (0)',
          reg3: '0x1E (30)',
          explanation: `CPU mengeksekusi <code>ADD ${r1}, ${r3}</code>. Nilai akhir ${r1} menjadi 40 (10 + 30). Program selesai dengan sukses.`
        }
      ]
    },

    loop: {
      title: 'Backward Jump (Loop Iterasi)',
      instructions: [
        { address: '0x00401040', text: `MOV ${r1}, 0      ; inisialisasi counter`, opcode: 'B8 00 00 00 00', stepMatch: 0 },
        { address: '0x00401045', text: `loop_start: INC ${r1} ; counter++`, opcode: 'FF C0', stepMatch: 1 },
        { address: '0x00401047', text: `ADD ${r2}, 5      ; akumulasi ${r2} += 5`, opcode: '83 C3 05', stepMatch: 2 },
        { address: '0x0040104A', text: `JMP loop_start  ; Putar balik ke 0x00401045`, opcode: 'EB F9', stepMatch: 3 }
      ],
      steps: [
        {
          ipValue: '0x00401040',
          reg1: '0x00 (0)',
          reg2: '0x00 (0)',
          reg3: '0x00 (0)',
          explanation: `Inisialisasi counter: ${r1} diisi 0. ${ipName} berlanjut ke alamat awal loop di <code>0x00401045</code>.`
        },
        {
          ipValue: '0x00401045',
          reg1: '0x01 (1)',
          reg2: '0x00 (0)',
          reg3: '0x00 (0)',
          explanation: `[Iterasi 1] CPU mengeksekusi <code>INC ${r1}</code>. Nilai counter ${r1} bertambah menjadi 1.`
        },
        {
          ipValue: '0x00401047',
          reg1: '0x01 (1)',
          reg2: '0x05 (5)',
          reg3: '0x00 (0)',
          explanation: `[Iterasi 1] CPU mengeksekusi <code>ADD ${r2}, 5</code>. Akumulator ${r2} kini bernilai 5.`
        },
        {
          ipValue: '0x0040104A',
          reg1: '0x01 (1)',
          reg2: '0x05 (5)',
          reg3: '0x00 (0)',
          explanation: `CPU menemui <code>JMP loop_start</code> (offset negatif -7 byte / opcode <code>EB F9</code>). ${ipName} ditarik mundur kembali ke alamat <code>0x00401045</code> untuk mengulang iterasi.`
        }
      ]
    },

    indirect: {
      title: 'Indirect Jump (Via Register Pointer)',
      instructions: [
        { address: '0x00401080', text: `MOV ${r1}, 0x00401090 ; Muat target ke register`, opcode: '48 C7 C0 90 10 40 00', stepMatch: 0 },
        { address: '0x00401087', text: `JMP ${r1}             ; Lompat ke alamat di ${r1}`, opcode: 'FF E0', stepMatch: 1 },
        { address: '0x00401089', text: `NOP                   ; (Dilewati)`, opcode: '90', stepMatch: -1 },
        { address: '0x00401090', text: `handler_target: MOV ${r2}, 0xAA`, opcode: 'BB AA 00 00 00', stepMatch: 2 }
      ],
      steps: [
        {
          ipValue: '0x00401080',
          reg1: '0x00401090',
          reg2: '0x00 (0)',
          reg3: '0x00 (0)',
          explanation: `Alamat target (pointer fungsi atau branch table) dimasukkan ke register <code>${r1}</code>.`
        },
        {
          ipValue: '0x00401087',
          reg1: '0x00401090',
          reg2: '0x00 (0)',
          reg3: '0x00 (0)',
          explanation: `CPU mengeksekusi <code>JMP ${r1}</code> (Indirect Jump). CPU membaca isi ${r1} yaitu <code>0x00401090</code> dan langsung mengisinya ke ${ipName}.`
        },
        {
          ipValue: '0x00401090',
          reg1: '0x00401090',
          reg2: '0xAA (170)',
          reg3: '0x00 (0)',
          explanation: `Eksekusi mendarat langsung di alamat <code>0x00401090</code> dan mengeksekusi <code>MOV ${r2}, 0xAA</code>.`
        }
      ]
    }
  }
})

const currentScenarioData = computed(() => scenarios.value[selectedScenario.value])

const currentStepData = computed(() => {
  return currentScenarioData.value.steps[currentStepIdx.value]
})

const isJumpMoment = computed(() => {
  if (selectedScenario.value === 'forward') return currentStepIdx.value === 1
  if (selectedScenario.value === 'loop') return currentStepIdx.value === 3
  if (selectedScenario.value === 'indirect') return currentStepIdx.value === 1
  return false
})

const jumpSourceAddress = computed(() => {
  if (selectedScenario.value === 'forward') return '0x00401005'
  if (selectedScenario.value === 'loop') return '0x0040104A'
  if (selectedScenario.value === 'indirect') return '0x00401087'
  return ''
})

const jumpTargetAddress = computed(() => {
  if (selectedScenario.value === 'forward') return '0x00401015'
  if (selectedScenario.value === 'loop') return '0x00401045'
  if (selectedScenario.value === 'indirect') return '0x00401090'
  return ''
})

function isSkipped(instructionIdx) {
  if (selectedScenario.value === 'forward' && (instructionIdx === 2 || instructionIdx === 3 || instructionIdx === 4)) {
    return currentStepIdx.value >= 1
  }
  if (selectedScenario.value === 'indirect' && instructionIdx === 2) {
    return currentStepIdx.value >= 1
  }
  return false
}

function isPassed(instructionIdx) {
  const inst = currentScenarioData.value.instructions[instructionIdx]
  return inst.stepMatch !== -1 && inst.stepMatch < currentStepIdx.value
}

function nextStep() {
  if (currentStepIdx.value < currentScenarioData.value.steps.length - 1) {
    currentStepIdx.value++
  }
}

function prevStep() {
  if (currentStepIdx.value > 0) {
    currentStepIdx.value--
  }
}

function resetStep() {
  currentStepIdx.value = 0
}

watch(selectedScenario, () => {
  currentStepIdx.value = 0
})

watch(() => props.mode, () => {
  currentStepIdx.value = 0
})
</script>
