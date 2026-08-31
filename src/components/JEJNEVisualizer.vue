<template>
  <div class="jejne-visualizer bg-slate-900 rounded-lg border border-slate-800 text-slate-100 p-5 flex flex-col gap-6 shadow-xl">
    <!-- Header visualizer -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
      <div>
        <h4 class="font-bold text-sm text-emerald-400 flex items-center gap-2">
          <svg class="w-4 h-4 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Simulator Visual JE &amp; JNE: Evaluasi Zero Flag (ZF)
        </h4>
        <p class="text-xs text-slate-400 mt-0.5">
          Memperlihatkan bagaimana <code>CMP</code> mengatur status <strong>Zero Flag (ZF)</strong> dan menentukan apakah percabangan melompat (<em>Jump Taken</em>) atau lanjut ke baris berikutnya (<em>Fall-through</em>).
        </p>
      </div>

      <!-- Skenario Selector -->
      <div class="flex items-center gap-2 self-stretch sm:self-auto">
        <span class="text-[11px] text-slate-400 font-bold uppercase whitespace-nowrap">Skenario:</span>
        <select v-model="selectedScenario" class="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500 font-sans">
          <option value="equal">1. Nilai Sama (CMP 25, 25 &rarr; JE Lompat)</option>
          <option value="not_equal">2. Nilai Berbeda (CMP 50, 20 &rarr; JE Diabaikan)</option>
          <option value="loop_counter">3. Counter Loop (DEC &rarr; JNE Putar Balik)</option>
          <option value="custom">4. Eksperimen Nilai Bebas (Custom)</option>
        </select>
      </div>
    </div>

    <!-- Mode Kustom Input Bar (Hanya tampil jika skenario custom) -->
    <div v-if="selectedScenario === 'custom'" class="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-1.5 font-mono">
          <span class="text-slate-400 font-bold">{{ reg1Name }}:</span>
          <input v-model.number="customValA" type="number" class="w-20 bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-center focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="flex items-center gap-1.5 font-mono">
          <span class="text-slate-400 font-bold">{{ reg2Name }}:</span>
          <input v-model.number="customValB" type="number" class="w-20 bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-center focus:outline-none focus:border-emerald-500" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-slate-400 font-bold">Uji Instruksi:</span>
          <select v-model="customJumpInst" class="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 font-mono text-emerald-400 font-bold focus:outline-none">
            <option value="JE">JE (Lompat jika Sama / ZF=1)</option>
            <option value="JNE">JNE (Lompat jika Beda / ZF=0)</option>
          </select>
        </div>
      </div>
      <button @click="resetStep" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-colors">
        Terapkan &amp; Uji
      </button>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Panel Kiri: Code Stream (7 Cols) -->
      <div class="lg:col-span-7 flex flex-col">
        <div class="flex justify-between items-center mb-2 px-1">
          <span class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Alur Instruksi CPU</span>
          <span class="text-[10px] font-mono text-slate-500">Arsitektur: {{ mode }}</span>
        </div>

        <div class="bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col gap-2 relative overflow-hidden">
          <div 
            v-for="(inst, idx) in currentScenarioData.instructions" 
            :key="idx"
            :class="[
              'p-2.5 rounded border text-xs font-mono transition-all duration-300 relative flex items-center justify-between',
              currentStepIdx === inst.stepMatch 
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-900/30' 
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
                  'text-[10px] font-bold px-1.5 py-0.5 rounded select-none shrink-0 font-mono',
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
                class="text-[9px] bg-emerald-600 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
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

        <!-- Decision Banner -->
        <div 
          v-if="currentStepData.decision" 
          :class="[
            'mt-3 p-3 rounded text-xs flex items-center gap-3 border animate-pulse',
            currentStepData.decision.taken 
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300' 
              : 'bg-slate-950/80 border-slate-700 text-slate-300'
          ]"
        >
          <div 
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
              currentStepData.decision.taken ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
            ]"
          >
            {{ currentStepData.decision.taken ? '⚡' : '⮯' }}
          </div>
          <div>
            <div class="font-bold uppercase tracking-wider">
              {{ currentStepData.decision.taken ? 'LOMPATAN DILAKUKAN (JUMP TAKEN)!' : 'LOMPATAN DIABAIKAN (FALL-THROUGH)' }}
            </div>
            <div class="text-[11px] opacity-90 mt-0.5 font-mono">
              {{ currentStepData.decision.desc }}
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Kanan: Status Flags & CPU Registers (5 Cols) -->
      <div class="lg:col-span-5 flex flex-col justify-between gap-4">
        <!-- Zero Flag (ZF) HUD Monitor -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div class="text-[11px] font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
            <span>Status Flag Register (EFLAGS)</span>
            <span class="text-[10px] bg-slate-800 text-yellow-400 px-2 py-0.5 rounded font-mono">Zero Flag Focus</span>
          </div>

          <!-- Zero Flag Big Indicator -->
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div 
              :class="[
                'p-3 rounded-lg border flex flex-col items-center justify-center transition-all',
                currentStepData.zf === 1 
                  ? 'bg-emerald-950/70 border-emerald-500 shadow-md shadow-emerald-900/40 text-emerald-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              ]"
            >
              <div class="text-[10px] uppercase font-bold tracking-wider mb-0.5">Zero Flag (ZF)</div>
              <div class="text-2xl font-mono font-extrabold" :class="currentStepData.zf === 1 ? 'text-emerald-400' : 'text-slate-400'">
                {{ currentStepData.zf }}
              </div>
              <div class="text-[9px] font-bold mt-0.5">
                {{ currentStepData.zf === 1 ? 'HASIL NOL / SAMA' : 'HASIL != 0 / BEDA' }}
              </div>
            </div>

            <!-- CMP Internal Calculation -->
            <div class="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col justify-between font-mono text-xs">
              <div class="text-[10px] text-slate-400 uppercase font-sans font-bold">Kalkulasi CMP Internal</div>
              <div class="text-xs text-yellow-400 font-bold my-1">
                {{ currentStepData.cmpFormula || 'dest - src' }}
              </div>
              <div class="text-[10px] text-slate-400 font-sans">
                {{ currentStepData.cmpResultText || 'Belum ada operasi CMP' }}
              </div>
            </div>
          </div>

          <!-- Register Values Live Table -->
          <div class="space-y-1.5 font-mono text-xs pt-2 border-t border-slate-850">
            <div class="flex justify-between items-center text-slate-400 text-[11px]">
              <span>{{ ipName }} (Pointer):</span>
              <span class="text-yellow-300 font-bold">{{ currentStepData.ipValue }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-400 text-[11px]">
              <span>{{ reg1Name }}:</span>
              <span class="text-emerald-400 font-bold">{{ currentStepData.reg1 }}</span>
            </div>
            <div class="flex justify-between items-center text-slate-400 text-[11px]">
              <span>{{ reg2Name }}:</span>
              <span class="text-cyan-400 font-bold">{{ currentStepData.reg2 }}</span>
            </div>
            <div v-if="currentStepData.reg3 !== undefined" class="flex justify-between items-center text-slate-400 text-[11px]">
              <span>{{ reg3Name }}:</span>
              <span class="text-purple-400 font-bold">{{ currentStepData.reg3 }}</span>
            </div>
          </div>
        </div>

        <!-- Log & Penjelasan Langkah -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analisis Eksekusi CPU
            </div>
            <div class="text-xs text-slate-300 leading-relaxed min-h-[60px]" v-html="currentStepData.explanation"></div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Step {{ currentStepIdx + 1 }} dari {{ currentScenarioData.steps.length }}</span>
            <span class="text-emerald-400">{{ currentScenarioData.title }}</span>
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
            class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-all border border-emerald-500 flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-900/30 cursor-pointer disabled:cursor-not-allowed select-none"
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

const selectedScenario = ref('equal')
const currentStepIdx = ref(0)

// Custom state
const customValA = ref(25)
const customValB = ref(25)
const customJumpInst = ref('JE')

const ipName = computed(() => props.mode === 'x64' ? 'RIP' : 'EIP')
const reg1Name = computed(() => props.mode === 'x64' ? 'RAX' : 'EAX')
const reg2Name = computed(() => props.mode === 'x64' ? 'RBX' : 'EBX')
const reg3Name = computed(() => props.mode === 'x64' ? 'RCX' : 'ECX')

const scenarios = computed(() => {
  const is64 = props.mode === 'x64'
  const r1 = is64 ? 'RAX' : 'EAX'
  const r2 = is64 ? 'RBX' : 'EBX'
  const r3 = is64 ? 'RCX' : 'ECX'

  // Custom calculation
  const isCustomEqual = customValA.value === customValB.value
  const customDiff = customValA.value - customValB.value
  const customZF = isCustomEqual ? 1 : 0
  const customJumpTaken = customJumpInst.value === 'JE' ? (customZF === 1) : (customZF === 0)

  return {
    equal: {
      title: 'Nilai Sama (CMP 25, 25 -> JE Lompat)',
      instructions: [
        { address: '0x00401100', text: `MOV ${r1}, 25`, opcode: 'B8 19 00 00 00', stepMatch: 0 },
        { address: '0x00401105', text: `MOV ${r2}, 25`, opcode: 'BB 19 00 00 00', stepMatch: 1 },
        { address: '0x0040110A', text: `CMP ${r1}, ${r2}     ; 25 - 25 = 0 -> ZF = 1`, opcode: '39 D8', stepMatch: 2 },
        { address: '0x0040110C', text: 'JE  equal_target   ; ZF == 1 -> Lompat!', opcode: '74 0A', stepMatch: 3 },
        { address: '0x0040110E', text: `MOV ${r3}, 0        ; (DILEWATI / BEDA)`, opcode: 'B9 00 00 00 00', stepMatch: -1 },
        { address: '0x00401113', text: 'JMP done           ; (DILEWATI)', opcode: 'EB 05', stepMatch: -1 },
        { address: '0x00401118', text: `equal_target: MOV ${r3}, 1 ; (SAMA)`, opcode: 'B9 01 00 00 00', stepMatch: 4 },
        { address: '0x0040111D', text: 'done: RET', opcode: 'C3', stepMatch: 5 }
      ],
      steps: [
        {
          ipValue: '0x00401100',
          reg1: '25 (0x19)',
          reg2: '0 (0x00)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: 'Belum dievaluasi',
          cmpResultText: 'Inisialisasi nilai operand A',
          explanation: `CPU mengisi register <code>${r1}</code> dengan nilai 25.`
        },
        {
          ipValue: '0x00401105',
          reg1: '25 (0x19)',
          reg2: '25 (0x19)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: 'Belum dievaluasi',
          cmpResultText: 'Inisialisasi nilai operand B',
          explanation: `CPU mengisi register <code>${r2}</code> dengan nilai 25.`
        },
        {
          ipValue: '0x0040110A',
          reg1: '25 (0x19)',
          reg2: '25 (0x19)',
          reg3: '0 (0x00)',
          zf: 1,
          cmpFormula: '25 - 25 = 0',
          cmpResultText: 'Hasil = 0 -> ZF disetel ke 1',
          explanation: `Instruksi <code>CMP ${r1}, ${r2}</code> mengurangkan kedua nilai (25 - 25 = 0). Karena hasilnya 0, CPU menyetel <strong>Zero Flag (ZF) = 1</strong>.`
        },
        {
          ipValue: '0x0040110C',
          reg1: '25 (0x19)',
          reg2: '25 (0x19)',
          reg3: '0 (0x00)',
          zf: 1,
          cmpFormula: 'ZF = 1 (Kondisi Terpenuhi)',
          cmpResultText: 'JE memeriksa ZF == 1 -> BENAR',
          decision: {
            taken: true,
            desc: `ZF bernilai 1. Instruksi JE memicu lompatan ke label equal_target (0x00401118).`
          },
          explanation: `Instruksi <code>JE equal_target</code> memeriksa status ZF. Karena <strong>ZF = 1</strong>, CPU <strong>mengambil lompatan (Jump Taken)</strong> langsung ke <code>0x00401118</code>, melewati blok not_equal.`
        },
        {
          ipValue: '0x00401118',
          reg1: '25 (0x19)',
          reg2: '25 (0x19)',
          reg3: '1 (0x01)',
          zf: 1,
          cmpFormula: 'Selesai lompat',
          cmpResultText: 'Blok sama dieksekusi',
          explanation: `CPU mengeksekusi cabang target: <code>MOV ${r3}, 1</code> (menandai status nilai adalah SAMA).`
        },
        {
          ipValue: '0x0040111D',
          reg1: '25 (0x19)',
          reg2: '25 (0x19)',
          reg3: '1 (0x01)',
          zf: 1,
          cmpFormula: '-',
          cmpResultText: 'Program selesai',
          explanation: `Eksekusi mencapai instruksi <code>RET</code>. Percabangan selesai.`
        }
      ]
    },

    not_equal: {
      title: 'Nilai Berbeda (CMP 50, 20 -> JE Diabaikan / Fall-through)',
      instructions: [
        { address: '0x00401140', text: `MOV ${r1}, 50`, opcode: 'B8 32 00 00 00', stepMatch: 0 },
        { address: '0x00401145', text: `MOV ${r2}, 20`, opcode: 'BB 14 00 00 00', stepMatch: 1 },
        { address: '0x0040114A', text: `CMP ${r1}, ${r2}     ; 50 - 20 = 30 -> ZF = 0`, opcode: '39 D8', stepMatch: 2 },
        { address: '0x0040114C', text: 'JE  equal_target   ; ZF == 0 -> Tidak Lompat!', opcode: '74 0A', stepMatch: 3 },
        { address: '0x0040114E', text: `MOV ${r3}, 0        ; Eksekusi lanjut (BEDA)`, opcode: 'B9 00 00 00 00', stepMatch: 4 },
        { address: '0x00401153', text: 'JMP done           ; Lewati blok equal', opcode: 'EB 05', stepMatch: 5 },
        { address: '0x00401158', text: `equal_target: MOV ${r3}, 1 ; (DILEWATI)`, opcode: 'B9 01 00 00 00', stepMatch: -1 },
        { address: '0x0040115D', text: 'done: RET', opcode: 'C3', stepMatch: 6 }
      ],
      steps: [
        {
          ipValue: '0x00401140',
          reg1: '50 (0x32)',
          reg2: '0 (0x00)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: 'Belum dievaluasi',
          cmpResultText: 'Inisialisasi RAX = 50',
          explanation: `CPU mengisi register <code>${r1}</code> dengan nilai 50.`
        },
        {
          ipValue: '0x00401145',
          reg1: '50 (0x32)',
          reg2: '20 (0x14)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: 'Belum dievaluasi',
          cmpResultText: 'Inisialisasi RBX = 20',
          explanation: `CPU mengisi register <code>${r2}</code> dengan nilai 20.`
        },
        {
          ipValue: '0x0040114A',
          reg1: '50 (0x32)',
          reg2: '20 (0x14)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: '50 - 20 = 30',
          cmpResultText: 'Hasil != 0 -> ZF = 0',
          explanation: `Instruksi <code>CMP ${r1}, ${r2}</code> menghitung 50 - 20 = 30. Karena hasilnya bukan nol, <strong>ZF bernilai 0</strong>.`
        },
        {
          ipValue: '0x0040114C',
          reg1: '50 (0x32)',
          reg2: '20 (0x14)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: 'ZF = 0 (Kondisi JE Gagal)',
          cmpResultText: 'JE membutuhkan ZF=1 -> Lompatan Diabaikan',
          decision: {
            taken: false,
            desc: `ZF bernilai 0. Lompatan JE tidak terjadi (Fall-through ke baris berikutnya).`
          },
          explanation: `Instruksi <code>JE equal_target</code> memeriksa ZF. Karena <strong>ZF = 0</strong>, syarat lompat <strong>TIDAK TERPENUHI</strong>. CPU melanjutkan eksekusi secara berurutan (*Fall-through*) ke baris <code>0x0040114E</code>.`
        },
        {
          ipValue: '0x0040114E',
          reg1: '50 (0x32)',
          reg2: '20 (0x14)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: '-',
          cmpResultText: 'Eksekusi blok tidak sama',
          explanation: `CPU mengeksekusi <code>MOV ${r3}, 0</code> (menandai status nilai adalah BERBEDA).`
        },
        {
          ipValue: '0x00401153',
          reg1: '50 (0x32)',
          reg2: '20 (0x14)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: 'JMP mutlak',
          cmpResultText: 'Lompat melewati blok sama',
          explanation: `Instruksi <code>JMP done</code> melompat melewati blok equal agar tidak tertimpa.`
        },
        {
          ipValue: '0x0040115D',
          reg1: '50 (0x32)',
          reg2: '20 (0x14)',
          reg3: '0 (0x00)',
          zf: 0,
          cmpFormula: '-',
          cmpResultText: 'Program selesai',
          explanation: `Eksekusi selesai dengan hasil ${r3} = 0 (Berbeda).`
        }
      ]
    },

    loop_counter: {
      title: 'Counter Loop (DEC RCX -> JNE Putar Balik)',
      instructions: [
        { address: '0x00401180', text: `MOV ${r3}, 3        ; Counter awal = 3`, opcode: 'B9 03 00 00 00', stepMatch: 0 },
        { address: '0x00401185', text: `loop_top: DEC ${r3} ; Counter--`, opcode: 'FF C9', stepMatch: 1 },
        { address: '0x00401187', text: `ADD ${r1}, 10       ; ${r1} += 10`, opcode: '83 C0 0A', stepMatch: 2 },
        { address: '0x0040118A', text: `JNE loop_top       ; Jika ${r3} != 0 (ZF=0), Ulangi!`, opcode: '75 F9', stepMatch: 3 },
        { address: '0x0040118C', text: 'loop_exit: RET', opcode: 'C3', stepMatch: 4 }
      ],
      steps: [
        {
          ipValue: '0x00401180',
          reg1: '0 (0x00)',
          reg2: '0 (0x00)',
          reg3: '3 (0x03)',
          zf: 0,
          cmpFormula: 'Inisialisasi',
          cmpResultText: 'Counter diisi 3',
          explanation: `Counter awal diisi: <code>${r3} = 3</code>.`
        },
        {
          ipValue: '0x00401185',
          reg1: '0 (0x00)',
          reg2: '0 (0x00)',
          reg3: '2 (0x02)',
          zf: 0,
          cmpFormula: '3 - 1 = 2',
          cmpResultText: 'DEC: Hasil = 2 (ZF = 0)',
          explanation: `[Iterasi 1] <code>DEC ${r3}</code> mengurangi counter menjadi 2. Karena hasil bukan 0, <strong>ZF = 0</strong>.`
        },
        {
          ipValue: '0x00401187',
          reg1: '10 (0x0A)',
          reg2: '0 (0x00)',
          reg3: '2 (0x02)',
          zf: 0,
          cmpFormula: '-',
          cmpResultText: 'Akumulasi nilai RAX',
          explanation: `[Iterasi 1] <code>ADD ${r1}, 10</code> menambah total akumulasi.`
        },
        {
          ipValue: '0x0040118A',
          reg1: '10 (0x0A)',
          reg2: '0 (0x00)',
          reg3: '2 (0x02)',
          zf: 0,
          cmpFormula: 'ZF = 0 (Syarat JNE Terpenuhi)',
          cmpResultText: 'JNE lompat balik ke loop_top',
          decision: {
            taken: true,
            desc: `ZF = 0 (${r3} != 0). JNE melompat kembali ke loop_top (0x00401185).`
          },
          explanation: `Instruksi <code>JNE loop_top</code> memeriksa ZF. Karena <strong>ZF = 0</strong>, loop <strong>melompat kembali ke atas</strong>.`
        },
        {
          ipValue: '0x0040118C',
          reg1: '30 (0x1E)',
          reg2: '0 (0x00)',
          reg3: '0 (0x00)',
          zf: 1,
          cmpFormula: '1 - 1 = 0',
          cmpResultText: 'Counter = 0 -> ZF = 1 (Loop Selesai)',
          decision: {
            taken: false,
            desc: `Setelah 3 iterasi, counter ${r3} mencapai 0 (ZF=1). JNE diabaikan dan loop berakhir.`
          },
          explanation: `Setelah iterasi ke-3, <code>DEC ${r3}</code> menghasilkan 0 sehingga <strong>ZF = 1</strong>. Syarat <code>JNE</code> gugur, CPU keluar dari loop dan mengeksekusi <code>RET</code> dengan total ${r1} = 30.`
        }
      ]
    },

    custom: {
      title: `Eksperimen Bebas: CMP (${customValA.value}, ${customValB.value}) -> ${customJumpInst.value}`,
      instructions: [
        { address: '0x00401200', text: `MOV ${r1}, ${customValA.value}`, opcode: 'B8 .. .. .. ..', stepMatch: 0 },
        { address: '0x00401205', text: `MOV ${r2}, ${customValB.value}`, opcode: 'BB .. .. .. ..', stepMatch: 1 },
        { address: '0x0040120A', text: `CMP ${r1}, ${r2}     ; ${customValA.value} - ${customValB.value} = ${customDiff} (ZF=${customZF})`, opcode: '39 D8', stepMatch: 2 },
        { address: '0x0040120C', text: `${customJumpInst.value}  target_label  ; ${customJumpTaken ? 'Lompat!' : 'Diabaikan'}`, opcode: customJumpInst.value === 'JE' ? '74 08' : '75 08', stepMatch: 3 },
        { address: '0x0040120E', text: 'MOV status, 0     ; (Fall-through)', opcode: 'C7 .. ..', stepMatch: customJumpTaken ? -1 : 4 },
        { address: '0x00401216', text: 'target_label: MOV status, 1 ; (Jump target)', opcode: 'C7 .. ..', stepMatch: customJumpTaken ? 4 : -1 }
      ],
      steps: [
        {
          ipValue: '0x00401200',
          reg1: `${customValA.value}`,
          reg2: '0',
          zf: 0,
          cmpFormula: 'Inisialisasi',
          cmpResultText: `Memuat input A = ${customValA.value}`,
          explanation: `CPU memuat nilai A (<code>${customValA.value}</code>) ke register <code>${r1}</code>.`
        },
        {
          ipValue: '0x00401205',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          zf: 0,
          cmpFormula: 'Inisialisasi',
          cmpResultText: `Memuat input B = ${customValB.value}`,
          explanation: `CPU memuat nilai B (<code>${customValB.value}</code>) ke register <code>${r2}</code>.`
        },
        {
          ipValue: '0x0040120A',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          zf: customZF,
          cmpFormula: `${customValA.value} - ${customValB.value} = ${customDiff}`,
          cmpResultText: isCustomEqual ? 'Hasil = 0 -> ZF = 1' : `Hasil = ${customDiff} (!= 0) -> ZF = 0`,
          explanation: `<code>CMP</code> mengurangkan ${customValA.value} - ${customValB.value} = ${customDiff}. Status bendera diatur: <strong>ZF = ${customZF}</strong>.`
        },
        {
          ipValue: '0x0040120C',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          zf: customZF,
          cmpFormula: `Uji ${customJumpInst.value} pada ZF=${customZF}`,
          cmpResultText: customJumpTaken ? 'Kondisi Terpenuhi -> Lompat!' : 'Kondisi Tidak Terpenuhi -> Lanjut',
          decision: {
            taken: customJumpTaken,
            desc: customJumpTaken 
              ? `${customJumpInst.value} berhasil dieksekusi karena syarat ZF=${customJumpInst.value === 'JE' ? '1' : '0'} terpenuhi.`
              : `${customJumpInst.value} gagal melompat karena ZF bernilai ${customZF}. CPU lanjut ke baris berikutnya.`
          },
          explanation: customJumpTaken
            ? `Instruksi <code>${customJumpInst.value}</code> berhasil melompat langsung ke <code>target_label</code>.`
            : `Instruksi <code>${customJumpInst.value}</code> diabaikan karena kondisi tidak terpenuhi. Eksekusi berjalan secara fall-through.`
        },
        {
          ipValue: customJumpTaken ? '0x00401216' : '0x0040120E',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          zf: customZF,
          cmpFormula: 'Selesai',
          cmpResultText: customJumpTaken ? 'Mendarat di target lompatan' : 'Melanjutkan baris normal',
          explanation: `Simulasi kustom selesai dievaluasi dengan status <strong>${customJumpTaken ? 'JUMP TAKEN' : 'FALL THROUGH'}</strong>.`
        }
      ]
    }
  }
})

const currentScenarioData = computed(() => scenarios.value[selectedScenario.value])

const currentStepData = computed(() => {
  return currentScenarioData.value.steps[currentStepIdx.value]
})

function isSkipped(instructionIdx) {
  const inst = currentScenarioData.value.instructions[instructionIdx]
  return inst.stepMatch === -1 && currentStepIdx.value >= 3
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

watch([selectedScenario, customValA, customValB, customJumpInst], () => {
  currentStepIdx.value = 0
})

watch(() => props.mode, () => {
  currentStepIdx.value = 0
})
</script>
