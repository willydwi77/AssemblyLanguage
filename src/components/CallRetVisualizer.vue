<template>
  <div class="callret-visualizer bg-slate-900 rounded-lg border border-slate-800 text-slate-100 p-5 flex flex-col gap-6 shadow-xl">
    <!-- Header visualizer -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-800">
      <div>
        <h4 class="font-bold text-sm text-indigo-400 flex items-center gap-2">
          <svg class="w-4 h-4 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Simulator Visual CALL &amp; RET: Mekanisme Stack Frame &amp; Return Address
        </h4>
        <p class="text-xs text-slate-400 mt-0.5">
          Memperlihatkan bagaimana <code>CALL</code> otomatis menyimpan <strong>Return Address</strong> ke dalam Stack RAM ({{ spName }} berkurang) dan <code>RET</code> mengambilnya kembali ({{ spName }} bertambah) untuk melanjutkan alur program pemanggil.
        </p>
      </div>

      <!-- Skenario Selector -->
      <div class="flex items-center gap-2 self-stretch sm:self-auto">
        <span class="text-[11px] text-slate-400 font-bold uppercase whitespace-nowrap">Skenario:</span>
        <select v-model="selectedScenario" class="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 font-sans">
          <option value="simple_call">1. Pemanggilan Fungsi Sederhana (CALL -> RET)</option>
          <option value="stack_frame">2. Setup Stack Frame (Prolog, Var Lokal, Epilog)</option>
          <option value="nested_call">3. Fungsi Bersarang / Nested (Main -> FuncA -> FuncB)</option>
        </select>
      </div>
    </div>

    <!-- Main Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Panel Kiri: Code Pipeline dengan Alamat Memori (6 Cols) -->
      <div class="lg:col-span-6 flex flex-col">
        <div class="flex justify-between items-center mb-2 px-1">
          <span class="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Alur Eksekusi Instruksi</span>
          <span class="text-[10px] font-mono text-slate-500">Arsitektur: {{ mode }}</span>
        </div>

        <div class="bg-slate-950 rounded-lg border border-slate-800 p-3 flex flex-col gap-2 relative overflow-hidden">
          <div 
            v-for="(inst, idx) in currentScenarioData.instructions" 
            :key="idx"
            :class="[
              'p-2.5 rounded border text-xs font-mono transition-all duration-300 relative flex items-center justify-between',
              currentStepIdx === inst.stepMatch 
                ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-md shadow-indigo-900/30' 
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
                class="text-[9px] bg-indigo-600 text-white font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1"
              >
                <span class="w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping"></span>
                ACTIVE ({{ ipName }})
              </span>

              <span 
                v-else-if="inst.isReturnTarget"
                class="text-[9px] bg-emerald-950/80 border border-emerald-700 text-emerald-300 font-bold uppercase px-1.5 py-0.5 rounded"
              >
                RETURN TARGET
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

        <!-- Event Action Banner -->
        <div 
          v-if="currentStepData.actionBanner" 
          :class="[
            'mt-3 p-3 rounded text-xs flex items-center gap-3 border animate-pulse',
            currentStepData.actionBanner.type === 'call' 
              ? 'bg-indigo-950/70 border-indigo-500/70 text-indigo-200' 
              : 'bg-emerald-950/70 border-emerald-500/70 text-emerald-200'
          ]"
        >
          <div 
            :class="[
              'w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0',
              currentStepData.actionBanner.type === 'call' ? 'bg-indigo-500 text-white' : 'bg-emerald-500 text-slate-950'
            ]"
          >
            {{ currentStepData.actionBanner.type === 'call' ? '📥' : '📤' }}
          </div>
          <div>
            <div class="font-bold uppercase tracking-wider">
              {{ currentStepData.actionBanner.title }}
            </div>
            <div class="text-[11px] opacity-90 mt-0.5 font-mono">
              {{ currentStepData.actionBanner.desc }}
            </div>
          </div>
        </div>
      </div>

      <!-- Panel Kanan: Stack Memory Frame & Register Monitor (6 Cols) -->
      <div class="lg:col-span-6 flex flex-col justify-between gap-4">
        <!-- Live Stack RAM View -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div class="text-[11px] font-bold uppercase text-slate-400 mb-3 flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" />
              </svg>
              Stack RAM Frame (Alamat Menurun &darr;)
            </span>
            <span class="text-[10px] bg-slate-800 text-indigo-400 px-2 py-0.5 rounded font-mono">Top of Stack: {{ spName }}</span>
          </div>

          <!-- Stack Slot List -->
          <div class="space-y-1.5 font-mono text-xs mb-3">
            <div 
              v-for="(slot, sIdx) in currentStepData.stackSlots" 
              :key="sIdx"
              :class="[
                'p-2 rounded border flex items-center justify-between transition-all duration-300',
                slot.isTop 
                  ? 'bg-indigo-950/80 border-indigo-400 shadow-md shadow-indigo-950 text-white' 
                  : 'bg-slate-900 border-slate-800 text-slate-300'
              ]"
            >
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                  {{ slot.address }}
                </span>
                <span :class="['font-bold text-[11px]', slot.highlightColor || 'text-slate-200']">
                  {{ slot.label }}
                </span>
              </div>

              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold font-mono text-yellow-300 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {{ slot.value }}
                </span>
                <span v-if="slot.isTop" class="text-[9px] bg-yellow-400 text-slate-950 font-bold px-1.5 py-0.2 rounded font-sans uppercase">
                  {{ spName }}
                </span>
                <span v-if="slot.isBase" class="text-[9px] bg-blue-500 text-white font-bold px-1.5 py-0.2 rounded font-sans uppercase">
                  {{ bpName }}
                </span>
              </div>
            </div>
          </div>

          <!-- Live Register Table -->
          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-850 font-mono text-xs">
            <div class="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-slate-400 text-[10px]">{{ ipName }}:</span>
              <span class="text-yellow-300 font-bold text-[11px]">{{ currentStepData.ipValue }}</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-slate-400 text-[10px]">{{ spName }}:</span>
              <span class="text-indigo-400 font-bold text-[11px]">{{ currentStepData.spValue }}</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-slate-400 text-[10px]">{{ bpName }}:</span>
              <span class="text-blue-400 font-bold text-[11px]">{{ currentStepData.bpValue || '0x...E020' }}</span>
            </div>
            <div class="bg-slate-900 p-2 rounded border border-slate-800 flex justify-between items-center">
              <span class="text-slate-400 text-[10px]">{{ reg1Name }} (Return):</span>
              <span class="text-emerald-400 font-bold text-[11px]">{{ currentStepData.reg1 || '0' }}</span>
            </div>
          </div>
        </div>

        <!-- Log & Penjelasan Langkah -->
        <div class="bg-slate-950 p-4 rounded-lg border border-slate-800 flex-1 flex flex-col justify-between">
          <div>
            <div class="text-[11px] font-bold uppercase text-slate-400 mb-2 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Analisis Alur Eksekusi
            </div>
            <div class="text-xs text-slate-300 leading-relaxed min-h-[60px]" v-html="currentStepData.explanation"></div>
          </div>

          <div class="mt-3 pt-2 border-t border-slate-850 flex justify-between items-center text-[10px] text-slate-500 font-mono">
            <span>Step {{ currentStepIdx + 1 }} dari {{ currentScenarioData.steps.length }}</span>
            <span class="text-indigo-400">{{ currentScenarioData.title }}</span>
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
            class="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white rounded text-xs font-semibold transition-all border border-indigo-500 flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-900/30 cursor-pointer disabled:cursor-not-allowed select-none"
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

const selectedScenario = ref('simple_call')
const currentStepIdx = ref(0)

const ipName = computed(() => props.mode === 'x64' ? 'RIP' : 'EIP')
const spName = computed(() => props.mode === 'x64' ? 'RSP' : 'ESP')
const bpName = computed(() => props.mode === 'x64' ? 'RBP' : 'EBP')
const reg1Name = computed(() => props.mode === 'x64' ? 'RAX' : 'EAX')

const scenarios = computed(() => {
  const is64 = props.mode === 'x64'
  const r1 = is64 ? 'RAX' : 'EAX'
  const sp = is64 ? 'RSP' : 'ESP'
  const bp = is64 ? 'RBP' : 'EBP'
  const delta = is64 ? 8 : 4
  const retHex = '0x0040150A'

  return {
    simple_call: {
      title: 'Pemanggilan Fungsi Sederhana (CALL -> RET)',
      instructions: [
        { address: '0x00401500', text: `MOV ${r1}, 5        ; [main] Persiapan data`, opcode: 'B8 05 00 00 00', stepMatch: 0 },
        { address: '0x00401505', text: 'CALL tambah_sepuluh; Push Return (0x0040150A) -> Lompat', opcode: 'E8 16 00 00 00', stepMatch: 1 },
        { address: '0x0040150A', text: `MOV [hasil], ${r1}   ; [main] Eksekusi lanjut setelah RET`, opcode: '89 05 ..', stepMatch: 4, isReturnTarget: true },
        { address: '0x00401510', text: 'RET                 ; Selesai main', opcode: 'C3', stepMatch: 5 },
        { address: '0x00401520', text: `tambah_sepuluh: ADD ${r1}, 10 ; [fungsi] Tambah 10`, opcode: '83 C0 0A', stepMatch: 2 },
        { address: '0x00401523', text: 'RET                 ; Pop Return (0x0040150A) -> Kembali', opcode: 'C3', stepMatch: 3 }
      ],
      steps: [
        {
          ipValue: '0x00401500',
          spValue: '0x00402000',
          bpValue: '0x00402000',
          reg1: '5 (0x05)',
          stackSlots: [
            { address: '0x00402000', label: '[Stack Frame Caller]', value: '0x00000000', isTop: true }
          ],
          explanation: `[Fungsi Main] CPU memuat nilai 5 ke dalam register <code>${r1}</code>. ${ipName} menunjuk ke baris <code>CALL</code> berikutnya di <code>0x00401505</code>.`
        },
        {
          ipValue: '0x00401520',
          spValue: '0x00401FF8',
          bpValue: '0x00402000',
          reg1: '5 (0x05)',
          actionBanner: {
            type: 'call',
            title: 'INSTRUKSI CALL DIEKSEKUSI!',
            desc: `Return Address (${retHex}) otomatis di-PUSH ke Stack (${spName} -= ${delta}). ${ipName} melompat ke 0x00401520.`
          },
          stackSlots: [
            { address: '0x00401FF8', label: `[RETURN ADDR: ${retHex}]`, value: retHex, isTop: true, highlightColor: 'text-emerald-400 font-bold' },
            { address: '0x00402000', label: '[Stack Frame Caller]', value: '0x00000000', isTop: false }
          ],
          explanation: `Saat <code>CALL tambah_sepuluh</code> dijalankan: CPU secara otomatis menyimpan alamat instruksi tepat di bawahnya (<code>${retHex}</code>) ke puncak Stack (<strong>${spName} berkurang ${delta} byte</strong>), lalu melompat ke <code>0x00401520</code>.`
        },
        {
          ipValue: '0x00401523',
          spValue: '0x00401FF8',
          bpValue: '0x00402000',
          reg1: '15 (0x0F)',
          stackSlots: [
            { address: '0x00401FF8', label: `[RETURN ADDR: ${retHex}]`, value: retHex, isTop: true, highlightColor: 'text-emerald-400' },
            { address: '0x00402000', label: '[Stack Frame Caller]', value: '0x00000000', isTop: false }
          ],
          explanation: `Di dalam subrutin: CPU mengeksekusi <code>ADD ${r1}, 10</code>. Nilai register ${r1} bertambah menjadi 15 (5 + 10). ${ipName} kini berada di baris <code>RET</code>.`
        },
        {
          ipValue: '0x0040150A',
          spValue: '0x00402000',
          bpValue: '0x00402000',
          reg1: '15 (0x0F)',
          actionBanner: {
            type: 'ret',
            title: 'INSTRUKSI RET DIEKSEKUSI!',
            desc: `Return Address (${retHex}) di-POP dari Stack (${spName} += ${delta}). ${ipName} melanjutkan baris setelah CALL.`
          },
          stackSlots: [
            { address: '0x00402000', label: '[Stack Frame Caller]', value: '0x00000000', isTop: true }
          ],
          explanation: `Saat <code>RET</code> dieksekusi: CPU mengambil (<strong>POP</strong>) Return Address <code>${retHex}</code> dari puncak Stack, memulihkan <strong>${spName} bertambah ${delta} byte</strong>, dan melompat kembali tepat ke baris setelah CALL.`
        },
        {
          ipValue: '0x00401510',
          spValue: '0x00402000',
          bpValue: '0x00402000',
          reg1: '15 (0x0F)',
          stackSlots: [
            { address: '0x00402000', label: '[Stack Frame Caller]', value: '0x00000000', isTop: true }
          ],
          explanation: `[Kembali ke Main] Nilai hasil fungsi (15) tersimpan di <code>${r1}</code> dan disimpan ke variabel memori. Subrutin selesai dengan aman tanpa merusak pointer stack.`
        }
      ]
    },

    stack_frame: {
      title: 'Setup Stack Frame (Prolog, Var Lokal, Epilog)',
      instructions: [
        { address: '0x00401600', text: `func: PUSH ${bp}          ; 1. Prolog: Simpan ${bp} lama`, opcode: '55', stepMatch: 0 },
        { address: '0x00401601', text: `MOV ${bp}, ${sp}          ; 2. Prolog: Pasang base baru`, opcode: '48 89 E5', stepMatch: 1 },
        { address: '0x00401604', text: `SUB ${sp}, 16          ; 3. Alokasi 16 byte stack`, opcode: '48 83 EC 10', stepMatch: 2 },
        { address: '0x00401608', text: `MOV DWORD [${bp}-4], 42; 4. Simpan var lokal x=42`, opcode: 'C7 45 FC 2A...', stepMatch: 3 },
        { address: '0x0040160F', text: `MOV ${sp}, ${bp}          ; 5. Epilog: Bersihkan stack`, opcode: '48 89 EC', stepMatch: 4 },
        { address: '0x00401612', text: `POP ${bp}              ; 6. Epilog: Pulihkan ${bp} lama`, opcode: '5D', stepMatch: 5 },
        { address: '0x00401613', text: 'RET                  ; 7. Kembali ke caller', opcode: 'C3', stepMatch: 6 }
      ],
      steps: [
        {
          ipValue: '0x00401600',
          spValue: '0x00401FF0',
          bpValue: '0x00402020',
          reg1: '0',
          stackSlots: [
            { address: '0x00401FF0', label: `[SAVED ${bp}: 0x00402020]`, value: '0x00402020', isTop: true, highlightColor: 'text-blue-400' },
            { address: '0x00401FF8', label: '[Return Address: 0x0040150A]', value: '0x0040150A', isTop: false, highlightColor: 'text-emerald-400' }
          ],
          explanation: `[Prolog Langkah 1] <code>PUSH ${bp}</code> menyimpan nilai frame pointer fungsi pemanggil ke stack.`
        },
        {
          ipValue: '0x00401601',
          spValue: '0x00401FF0',
          bpValue: '0x00401FF0',
          reg1: '0',
          stackSlots: [
            { address: '0x00401FF0', label: `[CURRENT ${bp} ANCHOR]`, value: '0x00402020', isTop: true, isBase: true, highlightColor: 'text-blue-400 font-bold' },
            { address: '0x00401FF8', label: '[Return Address: 0x0040150A]', value: '0x0040150A', isTop: false }
          ],
          explanation: `[Prolog Langkah 2] <code>MOV ${bp}, ${sp}</code> menetapkan patokan alamat absolut baru untuk fungsi ini.`
        },
        {
          ipValue: '0x00401604',
          spValue: '0x00401FE0',
          bpValue: '0x00401FF0',
          reg1: '0',
          stackSlots: [
            { address: '0x00401FE0', label: '[RESERVED LOCAL VARS]', value: '0x00000000', isTop: true, highlightColor: 'text-purple-400' },
            { address: '0x00401FE8', label: '[RESERVED LOCAL VARS]', value: '0x00000000', isTop: false },
            { address: '0x00401FF0', label: `[SAVED ${bp}]`, value: '0x00402020', isTop: false, isBase: true, highlightColor: 'text-blue-400' },
            { address: '0x00401FF8', label: '[Return Address]', value: '0x0040150A', isTop: false }
          ],
          explanation: `[Prolog Langkah 3] <code>SUB ${sp}, 16</code> mengalokasikan ruang memori 16 byte untuk variabel-variabel lokal fungsi.`
        },
        {
          ipValue: '0x00401608',
          spValue: '0x00401FE0',
          bpValue: '0x00401FF0',
          reg1: '42 (0x2A)',
          stackSlots: [
            { address: '0x00401FE0', label: '[VAR 2: uninit]', value: '0x00000000', isTop: true },
            { address: '0x00401FE8', label: `[VAR 1: x = 42] ([${bp}-4])`, value: '0x0000002A', isTop: false, highlightColor: 'text-yellow-300 font-bold' },
            { address: '0x00401FF0', label: `[SAVED ${bp}]`, value: '0x00402020', isTop: false, isBase: true, highlightColor: 'text-blue-400' }
          ],
          explanation: `CPU mengisi variabel lokal <code>x = 42</code> pada koordinat <code>[${bp}-4]</code>.`
        },
        {
          ipValue: '0x0040160F',
          spValue: '0x00401FF0',
          bpValue: '0x00401FF0',
          reg1: '42 (0x2A)',
          stackSlots: [
            { address: '0x00401FF0', label: `[SAVED ${bp}]`, value: '0x00402020', isTop: true, isBase: true, highlightColor: 'text-blue-400' },
            { address: '0x00401FF8', label: '[Return Address]', value: '0x0040150A', isTop: false }
          ],
          explanation: `[Epilog Langkah 1] <code>MOV ${sp}, ${bp}</code> mengembalikan pointer stack ke posisi awal frame, membersihkan seluruh variabel lokal.`
        },
        {
          ipValue: '0x00401612',
          spValue: '0x00401FF8',
          bpValue: '0x00402020',
          reg1: '42 (0x2A)',
          stackSlots: [
            { address: '0x00401FF8', label: '[Return Address: 0x0040150A]', value: '0x0040150A', isTop: true, highlightColor: 'text-emerald-400 font-bold' }
          ],
          explanation: `[Epilog Langkah 2] <code>POP ${bp}</code> memulihkan frame pointer pemanggil (<code>0x00402020</code>). Sekarang Return Address berada tepat di puncak stack siap di-RET.`
        },
        {
          ipValue: '0x00401613',
          spValue: '0x00402000',
          bpValue: '0x00402020',
          reg1: '42 (0x2A)',
          stackSlots: [
            { address: '0x00402000', label: '[Stack Frame Caller]', value: '0x00000000', isTop: true }
          ],
          explanation: `<code>RET</code> dieksekusi. Stack kembali seimbang sempurna ke posisi semula.`
        }
      ]
    },

    nested_call: {
      title: 'Fungsi Bersarang / Nested (Main -> FuncA -> FuncB)',
      instructions: [
        { address: '0x00401700', text: 'CALL func_A        ; [main] Panggil func_A', opcode: 'E8 ..', stepMatch: 0 },
        { address: '0x00401705', text: 'MOV [res], RAX     ; [main] Lanjut setelah func_A', opcode: '48 89 ..', stepMatch: 5, isReturnTarget: true },
        { address: '0x00401720', text: 'func_A: CALL func_B; [func_A] Panggil func_B', opcode: 'E8 ..', stepMatch: 1 },
        { address: '0x00401725', text: 'ADD RAX, 5         ; [func_A] Lanjut setelah func_B', opcode: '48 83 C0 05', stepMatch: 3, isReturnTarget: true },
        { address: '0x00401729', text: 'RET                ; [func_A] Kembali ke main', opcode: 'C3', stepMatch: 4 },
        { address: '0x00401740', text: 'func_B: MOV RAX, 20; [func_B] Hasil dasar 20', opcode: '48 C7 C0 14...', stepMatch: 2 },
        { address: '0x00401747', text: 'RET                ; [func_B] Kembali ke func_A', opcode: 'C3', stepMatch: 2 }
      ],
      steps: [
        {
          ipValue: '0x00401700',
          spValue: '0x00402000',
          reg1: '0',
          stackSlots: [
            { address: '0x00402000', label: '[Main Stack Top]', value: '0x00000000', isTop: true }
          ],
          explanation: `[Fungsi Main] Memanggil <code>CALL func_A</code>.`
        },
        {
          ipValue: '0x00401720',
          spValue: '0x00401FF8',
          reg1: '0',
          actionBanner: {
            type: 'call',
            title: 'NESTED CALL 1: main -> func_A',
            desc: 'Return Address Main (0x00401705) tersimpan di Stack.'
          },
          stackSlots: [
            { address: '0x00401FF8', label: '[RETURN KE MAIN: 0x00401705]', value: '0x00401705', isTop: true, highlightColor: 'text-indigo-400 font-bold' },
            { address: '0x00402000', label: '[Main Stack Top]', value: '0x00000000', isTop: false }
          ],
          explanation: `Di dalam <code>func_A</code>: Return address main (<code>0x00401705</code>) tersimpan di stack. Sekarang <code>func_A</code> memanggil <code>CALL func_B</code>.`
        },
        {
          ipValue: '0x00401740',
          spValue: '0x00401FF0',
          reg1: '20',
          actionBanner: {
            type: 'call',
            title: 'NESTED CALL 2: func_A -> func_B',
            desc: 'Dua Return Address bertumpuk di Stack (LIFO)!'
          },
          stackSlots: [
            { address: '0x00401FF0', label: '[RETURN KE FUNC_A: 0x00401725]', value: '0x00401725', isTop: true, highlightColor: 'text-emerald-400 font-bold' },
            { address: '0x00401FF8', label: '[RETURN KE MAIN: 0x00401705]', value: '0x00401705', isTop: false, highlightColor: 'text-indigo-400' },
            { address: '0x00402000', label: '[Main Stack Top]', value: '0x00000000', isTop: false }
          ],
          explanation: `Di dalam <code>func_B</code>: Dua alamat return tersusun rapi secara LIFO (Last In First Out). <code>func_B</code> mengisi <code>${r1} = 20</code> lalu memicu <code>RET</code>.`
        },
        {
          ipValue: '0x00401725',
          spValue: '0x00401FF8',
          reg1: '25',
          actionBanner: {
            type: 'ret',
            title: 'POP RETURN 1: func_B -> func_A',
            desc: 'Alamat 0x00401725 diambil, kembali ke func_A.'
          },
          stackSlots: [
            { address: '0x00401FF8', label: '[RETURN KE MAIN: 0x00401705]', value: '0x00401705', isTop: true, highlightColor: 'text-indigo-400 font-bold' },
            { address: '0x00402000', label: '[Main Stack Top]', value: '0x00000000', isTop: false }
          ],
          explanation: `<code>func_B</code> selesai dan kembali ke <code>func_A</code>. <code>func_A</code> mengeksekusi <code>ADD ${r1}, 5</code> sehingga ${r1} = 25, lalu memicu <code>RET</code>.`
        },
        {
          ipValue: '0x00401705',
          spValue: '0x00402000',
          reg1: '25',
          actionBanner: {
            type: 'ret',
            title: 'POP RETURN 2: func_A -> main',
            desc: 'Alamat 0x00401705 diambil, kembali ke main.'
          },
          stackSlots: [
            { address: '0x00402000', label: '[Main Stack Top]', value: '0x00000000', isTop: true }
          ],
          explanation: `<code>func_A</code> selesai dan kembali ke <code>main</code>. Semua level rekursi/fungsi bersarang berhasil kembali dengan urutan sempurna berkat struktur LIFO Stack.`
        }
      ]
    }
  }
})

const currentScenarioData = computed(() => scenarios.value[selectedScenario.value])

const currentStepData = computed(() => {
  return currentScenarioData.value.steps[currentStepIdx.value]
})

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
