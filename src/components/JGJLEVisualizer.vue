<template>
  <div class="jgjle-visualizer bg-slate-900 rounded-lg border border-slate-800 text-slate-100 p-5 flex flex-col gap-6 shadow-xl">
    <!-- Header visualizer -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
      <div>
        <h4 class="font-bold text-sm text-purple-400 flex items-center gap-2">
          <svg class="w-4 h-4 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Simulator Visual JG / JL: Signed vs Unsigned Branching
        </h4>
        <p class="text-xs text-slate-400 mt-0.5">
          Memperlihatkan bagaimana flag <strong>SF (Sign)</strong>, <strong>OF (Overflow)</strong>, dan <strong>CF (Carry)</strong> membedakan perbandingan bilangan bertanda (signed) dan tanpa tanda (unsigned).
        </p>
      </div>

      <!-- Skenario Selector -->
      <div class="flex items-center gap-2 self-stretch sm:self-auto">
        <span class="text-[11px] text-slate-400 font-bold uppercase whitespace-nowrap">Skenario:</span>
        <select v-model="selectedScenario" class="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-purple-500 font-sans">
          <option value="conflict">1. Kasus Paradoks: -1 vs +1 (JG vs JA)</option>
          <option value="signed_pos_neg">2. Signed: Positif vs Negatif (+15 vs -10)</option>
          <option value="range_check">3. Validasi Range (10 &lt;= X &lt;= 20)</option>
          <option value="custom">4. Eksperimen Bebas (Custom Calculator)</option>
        </select>
      </div>
    </div>

    <!-- Mode Kustom Input Bar -->
    <div v-if="selectedScenario === 'custom'" class="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-4 flex-wrap">
        <div class="flex items-center gap-1.5 font-mono">
          <span class="text-slate-400 font-bold">{{ reg1Name }} (A):</span>
          <input v-model.number="customValA" type="number" class="w-20 bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-center focus:outline-none focus:border-purple-500" />
        </div>
        <div class="flex items-center gap-1.5 font-mono">
          <span class="text-slate-400 font-bold">{{ reg2Name }} (B):</span>
          <input v-model.number="customValB" type="number" class="w-20 bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-center focus:outline-none focus:border-purple-500" />
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-slate-400 font-bold">Instruksi:</span>
          <select v-model="customJumpInst" class="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 font-mono text-purple-400 font-bold focus:outline-none">
            <optgroup label="Signed (Bertanda)">
              <option value="JG">JG (Signed &gt;)</option>
              <option value="JGE">JGE (Signed &gt;=)</option>
              <option value="JL">JL (Signed &lt;)</option>
              <option value="JLE">JLE (Signed &lt;=)</option>
            </optgroup>
            <optgroup label="Unsigned (Tanpa Tanda)">
              <option value="JA">JA (Unsigned &gt; / Above)</option>
              <option value="JAE">JAE (Unsigned &gt;= / Above Equal)</option>
              <option value="JB">JB (Unsigned &lt; / Below)</option>
              <option value="JBE">JBE (Unsigned &lt;= / Below Equal)</option>
            </optgroup>
          </select>
        </div>
      </div>
      <button @click="resetStep" class="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-bold transition-colors">
        Evaluasi Cabang
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
                ? 'bg-purple-950/80 border-purple-500 text-purple-200 shadow-md shadow-purple-900/30' 
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
                class="text-[9px] bg-purple-600 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
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
              ? 'bg-purple-950/60 border-purple-500/60 text-purple-300' 
              : 'bg-slate-950/80 border-slate-700 text-slate-300'
          ]"
        >
          <div 
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
              currentStepData.decision.taken ? 'bg-purple-500 text-slate-950' : 'bg-slate-800 text-slate-400'
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

      <!-- Panel Kanan: Flags Matrix & Register Monitor (5 Cols) -->
      <div class="lg:col-span-5 flex flex-col justify-between gap-4">
        <!-- 4 Key Flags Matrix Box -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div class="text-[11px] font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
            <span>Status 4 Bendera Kunci (EFLAGS)</span>
            <span class="text-[10px] bg-slate-800 text-purple-400 px-2 py-0.5 rounded font-mono">Condition Bits</span>
          </div>

          <!-- Flags 4-Grid -->
          <div class="grid grid-cols-4 gap-2 mb-3 font-mono text-center">
            <!-- SF -->
            <div 
              :class="[
                'p-2 rounded border transition-all',
                currentStepData.flags.sf === 1 
                  ? 'bg-amber-950/70 border-amber-500 text-amber-300 shadow-sm shadow-amber-900/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              ]"
            >
              <div class="text-[9px] font-sans font-bold uppercase">SF (Sign)</div>
              <div class="text-lg font-bold" :class="currentStepData.flags.sf === 1 ? 'text-amber-400' : 'text-slate-400'">
                {{ currentStepData.flags.sf }}
              </div>
              <div class="text-[8px] truncate">{{ currentStepData.flags.sf === 1 ? 'Negatif' : 'Positif' }}</div>
            </div>

            <!-- OF -->
            <div 
              :class="[
                'p-2 rounded border transition-all',
                currentStepData.flags.of === 1 
                  ? 'bg-red-950/70 border-red-500 text-red-300 shadow-sm shadow-red-900/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              ]"
            >
              <div class="text-[9px] font-sans font-bold uppercase">OF (Over)</div>
              <div class="text-lg font-bold" :class="currentStepData.flags.of === 1 ? 'text-red-400' : 'text-slate-400'">
                {{ currentStepData.flags.of }}
              </div>
              <div class="text-[8px] truncate">{{ currentStepData.flags.of === 1 ? 'Overflow' : 'Normal' }}</div>
            </div>

            <!-- CF -->
            <div 
              :class="[
                'p-2 rounded border transition-all',
                currentStepData.flags.cf === 1 
                  ? 'bg-blue-950/70 border-blue-500 text-blue-300 shadow-sm shadow-blue-900/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              ]"
            >
              <div class="text-[9px] font-sans font-bold uppercase">CF (Carry)</div>
              <div class="text-lg font-bold" :class="currentStepData.flags.cf === 1 ? 'text-blue-400' : 'text-slate-400'">
                {{ currentStepData.flags.cf }}
              </div>
              <div class="text-[8px] truncate">{{ currentStepData.flags.cf === 1 ? 'Borrow' : 'No Borrow' }}</div>
            </div>

            <!-- ZF -->
            <div 
              :class="[
                'p-2 rounded border transition-all',
                currentStepData.flags.zf === 1 
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-900/30' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              ]"
            >
              <div class="text-[9px] font-sans font-bold uppercase">ZF (Zero)</div>
              <div class="text-lg font-bold" :class="currentStepData.flags.zf === 1 ? 'text-emerald-400' : 'text-slate-400'">
                {{ currentStepData.flags.zf }}
              </div>
              <div class="text-[8px] truncate">{{ currentStepData.flags.zf === 1 ? 'Nol' : 'Bukan 0' }}</div>
            </div>
          </div>

          <!-- Dual Interpretation Matrix (Signed vs Unsigned) -->
          <div class="grid grid-cols-2 gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-850 font-mono text-[11px]">
            <div class="border-r border-slate-800 pr-2">
              <div class="text-[9px] font-sans font-bold uppercase text-emerald-400 mb-1">Evaluasi Signed (Bertanda)</div>
              <div class="text-slate-300 font-bold">{{ currentStepData.signedEvalText || 'SF == OF' }}</div>
              <div class="text-[10px] text-slate-400 font-sans mt-0.5">{{ currentStepData.signedResultText || '-' }}</div>
            </div>
            <div class="pl-1">
              <div class="text-[9px] font-sans font-bold uppercase text-blue-400 mb-1">Evaluasi Unsigned (Tanpa Tanda)</div>
              <div class="text-slate-300 font-bold">{{ currentStepData.unsignedEvalText || 'CF == 0 & ZF == 0' }}</div>
              <div class="text-[10px] text-slate-400 font-sans mt-0.5">{{ currentStepData.unsignedResultText || '-' }}</div>
            </div>
          </div>

          <!-- Live Register Table -->
          <div class="space-y-1.5 font-mono text-xs pt-3 mt-2 border-t border-slate-850">
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
          </div>
        </div>

        <!-- Log & Penjelasan Langkah -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analisis Eksekusi CPU
            </div>
            <div class="text-xs text-slate-300 leading-relaxed min-h-[60px]" v-html="currentStepData.explanation"></div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Step {{ currentStepIdx + 1 }} dari {{ currentScenarioData.steps.length }}</span>
            <span class="text-purple-400">{{ currentScenarioData.title }}</span>
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
            class="flex-1 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white rounded text-xs font-semibold transition-all border border-purple-500 flex items-center justify-center gap-1.5 shadow-sm shadow-purple-900/30 cursor-pointer disabled:cursor-not-allowed select-none"
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

const selectedScenario = ref('conflict')
const currentStepIdx = ref(0)

// Custom state
const customValA = ref(-5)
const customValB = ref(10)
const customJumpInst = ref('JG')

const ipName = computed(() => props.mode === 'x64' ? 'RIP' : 'EIP')
const reg1Name = computed(() => props.mode === 'x64' ? 'RAX' : 'EAX')
const reg2Name = computed(() => props.mode === 'x64' ? 'RBX' : 'EBX')

const scenarios = computed(() => {
  const is64 = props.mode === 'x64'
  const r1 = is64 ? 'RAX' : 'EAX'
  const r2 = is64 ? 'RBX' : 'EBX'

  // Custom logic
  const a = customValA.value
  const b = customValB.value
  const diff = a - b
  const sf = diff < 0 ? 1 : 0
  const of = 0
  const zf = diff === 0 ? 1 : 0
  const cf = (a >>> 0) < (b >>> 0) ? 1 : 0

  let jumpTaken = false
  switch (customJumpInst.value) {
    case 'JG': jumpTaken = (zf === 0 && sf === of); break
    case 'JGE': jumpTaken = (sf === of); break
    case 'JL': jumpTaken = (sf !== of); break
    case 'JLE': jumpTaken = (zf === 1 || sf !== of); break
    case 'JA': jumpTaken = (cf === 0 && zf === 0); break
    case 'JAE': jumpTaken = (cf === 0); break
    case 'JB': jumpTaken = (cf === 1); break
    case 'JBE': jumpTaken = (cf === 1 || zf === 1); break
  }

  return {
    conflict: {
      title: 'Kasus Paradoks: -1 vs +1 (JG vs JA)',
      instructions: [
        { address: '0x00401300', text: `MOV ${r1}, -1       ; ${r1} = 0xFFFFFFFF`, opcode: 'B8 FF FF FF FF', stepMatch: 0 },
        { address: '0x00401305', text: `MOV ${r2}, 1        ; ${r2} = 0x00000001`, opcode: 'BB 01 00 00 00', stepMatch: 1 },
        { address: '0x0040130A', text: `CMP ${r1}, ${r2}     ; SF=1, OF=0, CF=0, ZF=0`, opcode: '39 D8', stepMatch: 2 },
        { address: '0x0040130C', text: 'JG  signed_target  ; -1 > 1? SALAH! (Diabaikan)', opcode: '7F 08', stepMatch: 3 },
        { address: '0x0040130E', text: 'JA  unsigned_target; 4.29M > 1? BENAR! (Lompat)', opcode: '77 0C', stepMatch: 4 },
        { address: '0x00401310', text: 'MOV status, 0      ; (DILEWATI)', opcode: 'C7 .. ..', stepMatch: -1 },
        { address: '0x00401316', text: 'signed_target: ... ; (DILEWATI)', opcode: '90', stepMatch: -1 },
        { address: '0x0040131C', text: 'unsigned_target: RET', opcode: 'C3', stepMatch: 5 }
      ],
      steps: [
        {
          ipValue: '0x00401300',
          reg1: '-1 (0xFFFFFFFF)',
          reg2: '0 (0x00)',
          flags: { sf: 0, of: 0, cf: 0, zf: 0 },
          signedEvalText: '-',
          signedResultText: 'Memuat nilai -1 (semua bit 1)',
          unsignedEvalText: '-',
          unsignedResultText: 'Sebagai unsigned: 4.294.967.295',
          explanation: `CPU memuat nilai -1 ke dalam <code>${r1}</code>. Dalam heksadesimal 32-bit, nilainya adalah <code>0xFFFFFFFF</code>.`
        },
        {
          ipValue: '0x00401305',
          reg1: '-1 (0xFFFFFFFF)',
          reg2: '1 (0x00000001)',
          flags: { sf: 0, of: 0, cf: 0, zf: 0 },
          signedEvalText: '-',
          signedResultText: 'Memuat nilai +1',
          unsignedEvalText: '-',
          unsignedResultText: 'Sebagai unsigned: 1',
          explanation: `CPU memuat nilai 1 ke dalam register <code>${r2}</code>.`
        },
        {
          ipValue: '0x0040130A',
          reg1: '-1 (0xFFFFFFFF)',
          reg2: '1 (0x00000001)',
          flags: { sf: 1, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'SF ≠ OF (1 ≠ 0) -> Signed: Lebih Kecil',
          signedResultText: '-1 < 1 (SF=1 menunjukkan negatif)',
          unsignedEvalText: 'CF = 0 & ZF = 0 -> Unsigned: Lebih Besar',
          unsignedResultText: '0xFFFFFFFF > 1 (Tanpa borrow)',
          explanation: `<code>CMP</code> mengurangkan <code>0xFFFFFFFF - 1 = 0xFFFFFFFE</code>. Bit MSB adalah 1 (sehingga <strong>SF = 1</strong>), tidak ada overflow bertanda (<strong>OF = 0</strong>), dan tidak ada borrow unsigned (<strong>CF = 0</strong>).`
        },
        {
          ipValue: '0x0040130C',
          reg1: '-1 (0xFFFFFFFF)',
          reg2: '1 (0x00000001)',
          flags: { sf: 1, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'Syarat JG: ZF=0 & SF=OF (1=0? SALAH)',
          signedResultText: 'Kondisi JG GAGAL (Fall-through)',
          unsignedEvalText: 'Syarat JA: CF=0 & ZF=0',
          unsignedResultText: 'Menunggu instruksi JA',
          decision: {
            taken: false,
            desc: 'JG memeriksa interpretasi signed: -1 > 1 adalah SALAH (SF ≠ OF). Lompatan diabaikan.'
          },
          explanation: `Instruksi <code>JG signed_target</code> memeriksa apakah operand bertanda lebih besar. Karena <strong>SF ≠ OF</strong>, kondisi gagal &rarr; <strong>Lompatan JG Diabaikan (Fall-through)</strong>.`
        },
        {
          ipValue: '0x0040130E',
          reg1: '-1 (0xFFFFFFFF)',
          reg2: '1 (0x00000001)',
          flags: { sf: 1, of: 0, cf: 0, zf: 0 },
          signedEvalText: '-',
          signedResultText: 'Signed dilewati',
          unsignedEvalText: 'Syarat JA: CF=0 & ZF=0 -> BENAR!',
          unsignedResultText: '4.294.967.295 > 1 (JUMP TAKEN)',
          decision: {
            taken: true,
            desc: 'JA memeriksa interpretasi unsigned: 4.294.967.295 > 1 adalah BENAR (CF=0 & ZF=0). Lompatan diambil!'
          },
          explanation: `Instruksi <code>JA unsigned_target</code> memeriksa perbandingan unsigned. Karena <strong>CF = 0 dan ZF = 0</strong>, kondisi terpenuhi &rarr; <strong>Lompatan JA BERHASIL!</strong> CPU melompat langsung ke <code>0x0040131C</code>.`
        },
        {
          ipValue: '0x0040131C',
          reg1: '-1 (0xFFFFFFFF)',
          reg2: '1 (0x00000001)',
          flags: { sf: 1, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'Selesai',
          signedResultText: 'JG menolak lompat',
          unsignedEvalText: 'Selesai',
          unsignedResultText: 'JA berhasil lompat',
          explanation: `Simulasi membuktikan bahwa instruksi yang sama (<code>CMP 0xFFFFFFFF, 1</code>) menghasilkan keputusan lompat yang berlawanan antara <code>JG</code> (Signed) dan <code>JA</code> (Unsigned).`
        }
      ]
    },

    signed_pos_neg: {
      title: 'Signed: Positif vs Negatif (+15 vs -10)',
      instructions: [
        { address: '0x00401340', text: `MOV ${r1}, 15`, opcode: 'B8 0F 00 00 00', stepMatch: 0 },
        { address: '0x00401345', text: `MOV ${r2}, -10`, opcode: 'BB F6 FF FF FF', stepMatch: 1 },
        { address: '0x0040134A', text: `CMP ${r1}, ${r2}     ; 15 - (-10) = 25`, opcode: '39 D8', stepMatch: 2 },
        { address: '0x0040134C', text: 'JG  pos_greater    ; 15 > -10? BENAR! (Lompat)', opcode: '7F 08', stepMatch: 3 },
        { address: '0x0040134E', text: 'MOV status, 0      ; (DILEWATI)', opcode: 'C7 .. ..', stepMatch: -1 },
        { address: '0x00401356', text: 'pos_greater: RET', opcode: 'C3', stepMatch: 4 }
      ],
      steps: [
        {
          ipValue: '0x00401340',
          reg1: '15 (0x0F)',
          reg2: '0 (0x00)',
          flags: { sf: 0, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'Inisialisasi',
          signedResultText: 'Memuat nilai +15',
          unsignedEvalText: '-',
          unsignedResultText: '15',
          explanation: `CPU memuat nilai +15 ke dalam <code>${r1}</code>.`
        },
        {
          ipValue: '0x00401345',
          reg1: '15 (0x0F)',
          reg2: '-10 (0xFFFFFFF6)',
          flags: { sf: 0, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'Inisialisasi',
          signedResultText: 'Memuat nilai -10',
          unsignedEvalText: '-',
          unsignedResultText: '4.294.967.286',
          explanation: `CPU memuat nilai -10 (representasi two's complement <code>0xFFFFFFF6</code>) ke dalam <code>${r2}</code>.`
        },
        {
          ipValue: '0x0040134A',
          reg1: '15 (0x0F)',
          reg2: '-10 (0xFFFFFFF6)',
          flags: { sf: 0, of: 0, cf: 1, zf: 0 },
          signedEvalText: 'SF = 0, OF = 0 -> SF == OF (SAMA)',
          signedResultText: '+15 > -10 (Hasil positif 25)',
          unsignedEvalText: 'CF = 1 (Karena 15 < 4.29M secara unsigned)',
          unsignedResultText: 'JA akan gagal, tapi JG akan sukses',
          explanation: `<code>CMP</code> mengurangkan 15 - (-10) = 25. Hasilnya positif (<strong>SF = 0</strong>), tidak ada overflow (<strong>OF = 0</strong>), dan bukan nol (<strong>ZF = 0</strong>).`
        },
        {
          ipValue: '0x0040134C',
          reg1: '15 (0x0F)',
          reg2: '-10 (0xFFFFFFF6)',
          flags: { sf: 0, of: 0, cf: 1, zf: 0 },
          signedEvalText: 'ZF=0 & SF=OF (0==0) -> BENAR!',
          signedResultText: 'Syarat JG Terpenuhi!',
          unsignedEvalText: '-',
          unsignedResultText: 'Lompatan Signed Berhasil',
          decision: {
            taken: true,
            desc: '15 > -10 adalah BENAR. SF == OF (0 == 0). Instruksi JG melompat ke pos_greater.'
          },
          explanation: `Instruksi <code>JG pos_greater</code> memeriksa syarat <code>SF == OF</code> dan <code>ZF = 0</code>. Karena <strong>0 == 0</strong>, lompatan <strong>BERHASIL DIAMBIL</strong> langsung ke <code>0x00401356</code>.`
        },
        {
          ipValue: '0x00401356',
          reg1: '15 (0x0F)',
          reg2: '-10 (0xFFFFFFF6)',
          flags: { sf: 0, of: 0, cf: 1, zf: 0 },
          signedEvalText: 'Mendarat di target',
          signedResultText: 'Hasil positif terbukti lebih besar',
          unsignedEvalText: '-',
          unsignedResultText: '-',
          explanation: `Program selesai. Evaluasi bertanda berhasil membuktikan +15 lebih besar dari -10.`
        }
      ]
    },

    range_check: {
      title: 'Validasi Range (10 <= X <= 20)',
      instructions: [
        { address: '0x00401380', text: `MOV ${r1}, 5        ; Input X = 5`, opcode: 'B8 05 00 00 00', stepMatch: 0 },
        { address: '0x00401385', text: `CMP ${r1}, 10       ; Cek batas bawah (5 - 10 = -5)`, opcode: '83 F8 0A', stepMatch: 1 },
        { address: '0x00401388', text: 'JL  invalid_label  ; 5 < 10? YA! (Lompat ke Error)', opcode: '7C 0A', stepMatch: 2 },
        { address: '0x0040138A', text: `CMP ${r1}, 20       ; (DILEWATI)`, opcode: '83 F8 14', stepMatch: -1 },
        { address: '0x0040138D', text: 'JG  invalid_label  ; (DILEWATI)', opcode: '7F 05', stepMatch: -1 },
        { address: '0x00401394', text: 'invalid_label: RET ; Tangani input di luar jangkauan', opcode: 'C3', stepMatch: 3 }
      ],
      steps: [
        {
          ipValue: '0x00401380',
          reg1: '5 (0x05)',
          reg2: '0',
          flags: { sf: 0, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'Input',
          signedResultText: 'X = 5',
          unsignedEvalText: '-',
          unsignedResultText: '-',
          explanation: `Program menguji nilai masukan <code>${r1} = 5</code>.`
        },
        {
          ipValue: '0x00401385',
          reg1: '5 (0x05)',
          reg2: '0',
          flags: { sf: 1, of: 0, cf: 1, zf: 0 },
          signedEvalText: 'SF ≠ OF (1 ≠ 0) -> 5 < 10',
          signedResultText: 'X lebih kecil dari batas bawah',
          unsignedEvalText: '-',
          unsignedResultText: '-',
          explanation: `<code>CMP ${r1}, 10</code> menghasilkan 5 - 10 = -5. Karena hasil negatif, <strong>SF = 1</strong> dan <strong>OF = 0</strong>.`
        },
        {
          ipValue: '0x00401388',
          reg1: '5 (0x05)',
          reg2: '0',
          flags: { sf: 1, of: 0, cf: 1, zf: 0 },
          signedEvalText: 'Syarat JL: SF ≠ OF (1 ≠ 0) -> BENAR!',
          signedResultText: 'JL memicu lompatan error',
          unsignedEvalText: '-',
          unsignedResultText: '-',
          decision: {
            taken: true,
            desc: '5 < 10 adalah BENAR. JL melompat langsung ke invalid_label.'
          },
          explanation: `Instruksi <code>JL invalid_label</code> mendeteksi bahwa 5 &lt; 10. Lompatan diambil langsung ke blok error, melewati seluruh kode validasi selanjutnya.`
        },
        {
          ipValue: '0x00401394',
          reg1: '5 (0x05)',
          reg2: '0',
          flags: { sf: 1, of: 0, cf: 1, zf: 0 },
          signedEvalText: 'Invalid Handler',
          signedResultText: 'Input ditolak',
          unsignedEvalText: '-',
          unsignedResultText: '-',
          explanation: `CPU mendarat di <code>invalid_label</code>. Validasi range sukses menggagalkan nilai di bawah 10.`
        }
      ]
    },

    custom: {
      title: `Eksperimen Bebas: CMP (${customValA.value}, ${customValB.value}) -> ${customJumpInst.value}`,
      instructions: [
        { address: '0x00401400', text: `MOV ${r1}, ${customValA.value}`, opcode: 'B8 .. .. .. ..', stepMatch: 0 },
        { address: '0x00401405', text: `MOV ${r2}, ${customValB.value}`, opcode: 'BB .. .. .. ..', stepMatch: 1 },
        { address: '0x0040140A', text: `CMP ${r1}, ${r2}     ; ${customValA.value} - ${customValB.value} = ${diff}`, opcode: '39 D8', stepMatch: 2 },
        { address: '0x0040140C', text: `${customJumpInst.value}  target_label  ; ${jumpTaken ? 'Lompat!' : 'Diabaikan'}`, opcode: '7. ..', stepMatch: 3 },
        { address: '0x0040140E', text: 'MOV status, 0     ; (Fall-through)', opcode: 'C7 .. ..', stepMatch: jumpTaken ? -1 : 4 },
        { address: '0x00401416', text: 'target_label: RET ; (Jump target)', opcode: 'C3', stepMatch: jumpTaken ? 4 : -1 }
      ],
      steps: [
        {
          ipValue: '0x00401400',
          reg1: `${customValA.value}`,
          reg2: '0',
          flags: { sf: 0, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'Inisialisasi',
          signedResultText: `A = ${customValA.value}`,
          unsignedEvalText: '-',
          unsignedResultText: `${customValA.value >>> 0}`,
          explanation: `Memuat nilai A (<code>${customValA.value}</code>) ke dalam <code>${r1}</code>.`
        },
        {
          ipValue: '0x00401405',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          flags: { sf: 0, of: 0, cf: 0, zf: 0 },
          signedEvalText: 'Inisialisasi',
          signedResultText: `B = ${customValB.value}`,
          unsignedEvalText: '-',
          unsignedResultText: `${customValB.value >>> 0}`,
          explanation: `Memuat nilai B (<code>${customValB.value}</code>) ke dalam <code>${r2}</code>.`
        },
        {
          ipValue: '0x0040140A',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          flags: { sf, of, cf, zf },
          signedEvalText: `SF=${sf}, OF=${of}, ZF=${zf}`,
          signedResultText: sf === of && zf === 0 ? 'A > B (Signed)' : sf !== of ? 'A < B (Signed)' : 'A == B',
          unsignedEvalText: `CF=${cf}, ZF=${zf}`,
          unsignedResultText: cf === 0 && zf === 0 ? 'A > B (Unsigned)' : cf === 1 ? 'A < B (Unsigned)' : 'A == B',
          explanation: `<code>CMP</code> menghitung ${customValA.value} - ${customValB.value} = ${diff}. Status bendera: <strong>SF=${sf}</strong>, <strong>OF=${of}</strong>, <strong>CF=${cf}</strong>, <strong>ZF=${zf}</strong>.`
        },
        {
          ipValue: '0x0040140C',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          flags: { sf, of, cf, zf },
          signedEvalText: `Uji ${customJumpInst.value}`,
          signedResultText: jumpTaken ? 'Kondisi Terpenuhi' : 'Kondisi Gagal',
          unsignedEvalText: `Uji ${customJumpInst.value}`,
          unsignedResultText: jumpTaken ? 'Kondisi Terpenuhi' : 'Kondisi Gagal',
          decision: {
            taken: jumpTaken,
            desc: jumpTaken 
              ? `Instruksi ${customJumpInst.value} berhasil melompat karena syarat kondisi terpenuhi.`
              : `Instruksi ${customJumpInst.value} gagal melompat. Eksekusi jatuh (fall-through).`
          },
          explanation: jumpTaken 
            ? `Kondisi <code>${customJumpInst.value}</code> terpenuhi &rarr; <strong>JUMP TAKEN</strong> melompat ke target_label.`
            : `Kondisi <code>${customJumpInst.value}</code> tidak terpenuhi &rarr; <strong>FALL-THROUGH</strong> ke baris berikutnya.`
        },
        {
          ipValue: jumpTaken ? '0x00401416' : '0x0040140E',
          reg1: `${customValA.value}`,
          reg2: `${customValB.value}`,
          flags: { sf, of, cf, zf },
          signedEvalText: 'Selesai',
          signedResultText: jumpTaken ? 'Lompat ke target' : 'Lanjut baris normal',
          unsignedEvalText: 'Selesai',
          unsignedResultText: jumpTaken ? 'Lompat ke target' : 'Lanjut baris normal',
          explanation: `Evaluasi custom selesai dengan hasil akhir: <strong>${jumpTaken ? 'LOMPATAN DIEKSEKUSI' : 'LOMPATAN DIABAIKAN'}</strong>.`
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
