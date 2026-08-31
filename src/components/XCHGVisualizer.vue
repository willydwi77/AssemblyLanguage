<template>
  <div class="xchg-visualizer bg-slate-900 rounded-lg border border-slate-800 text-slate-100 p-5 flex flex-col gap-6 shadow-xl">
    <!-- Header -->
    <div>
      <h4 class="font-bold text-sm mb-2 text-indigo-400 flex items-center gap-1.5">
        <i class="fas fa-sync-alt"></i> XCHG - Operasi Penukaran Nilai (Exchange)
      </h4>
      <p class="text-xs text-slate-400 leading-relaxed">
        Instruksi <code>XCHG</code> menukar isi dari dua register, atau register dengan memori. 
        Karena instruksi ini dikerjakan langsung oleh CPU secara atomik, proses ini jauh lebih cepat daripada menggunakan variabel perantara.
      </p>
    </div>

    <!-- Tab Visualizer (Pilih Mode Simulasi) -->
    <div class="flex border-b border-slate-800 text-xs">
      <button 
        @click="activeSubTab = 'basic'" 
        :class="activeSubTab === 'basic' ? 'border-b-2 border-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
        class="pb-2 px-4 transition-colors"
      >
        Simulasi Dasar (Reg/Mem)
      </button>
      <button 
        @click="activeSubTab = 'm2m'" 
        :class="activeSubTab === 'm2m' ? 'border-b-2 border-indigo-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'"
        class="pb-2 px-4 transition-colors"
      >
        Swap Memori-ke-Memori (Dilema CPU)
      </button>
    </div>

    <!-- KONTEN TAB 1: SIMULASI DASAR -->
    <div v-if="activeSubTab === 'basic'" class="flex flex-col md:flex-row gap-6">
      <!-- Panel Kontrol Aksi (Kiri) -->
      <div class="flex-1 space-y-4">
        <div class="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-850">
          <!-- Operand 1 (Selalu Register) -->
          <div class="flex flex-col gap-1">
            <span class="text-[10px] text-slate-500 font-bold uppercase">Operand 1 (Register {{ op1RegName }})</span>
            <div class="flex gap-2">
              <input v-model="op1Input" type="text" placeholder="Nilai Awal" class="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs w-full font-mono focus:outline-none" />
            </div>
          </div>

          <!-- Operand 2 (Register / Memory) -->
          <div class="flex flex-col gap-1">
            <div class="flex justify-between items-center">
              <span class="text-[10px] text-slate-500 font-bold uppercase">Operand 2 Type</span>
              <select v-model="op2Type" class="bg-slate-800 border border-slate-700 text-white rounded px-1.5 py-0.5 text-[10px] font-mono focus:outline-none">
                <option value="reg">Register ({{ op2RegName }})</option>
                <option value="mem">Memory Address ([0x403000])</option>
              </select>
            </div>
            <div class="flex gap-2 mt-1">
              <input v-model="op2Input" type="text" placeholder="Nilai Awal" class="bg-slate-800 border border-slate-700 text-white rounded px-2.5 py-1 text-xs w-full font-mono focus:outline-none" />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <button 
            @click="runBasicSwap" 
            :disabled="isSwapping"
            class="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <i class="fas fa-exchange-alt"></i> Simulasikan XCHG
          </button>
          
          <div class="bg-slate-950 p-2.5 rounded border border-slate-850 font-mono text-[10px] min-h-[48px] flex items-center">
            <span class="text-slate-300"><span class="text-slate-500">></span> {{ opLog }}</span>
          </div>
        </div>
      </div>

      <!-- Panel Visualisasi Swap (Kanan) -->
      <div class="flex-1 flex flex-col justify-center items-center py-4 bg-slate-950/60 rounded-lg border border-slate-850 relative min-h-[200px]">
        <div class="w-full max-w-[340px] flex items-center justify-between px-6 relative">
          <!-- Box Operand 1 -->
          <div class="flex flex-col items-center gap-1 w-24">
            <span class="text-[10px] text-slate-500 font-bold uppercase">{{ op1RegName }}</span>
            <div 
              class="w-20 py-3 rounded-lg border text-center font-mono font-extrabold text-sm transition-all duration-500"
              :class="getBoxClass('op1')"
            >
              {{ op1Val }}
            </div>
          </div>

          <!-- Cross arrows indicators (Swapping Animation) -->
          <div class="flex-1 flex justify-center items-center h-12 relative overflow-visible">
            <div class="w-full border-t-2 border-dashed border-slate-700 absolute"></div>
            <!-- Animated curves -->
            <div 
              v-if="isSwapping" 
              class="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div class="animate-ping w-4 h-4 bg-indigo-500/50 rounded-full"></div>
              <!-- Simulated cross curved visual effect -->
              <span class="text-indigo-400 text-xs animate-bounce font-bold">XCHG</span>
            </div>
            <div v-else class="text-slate-600 text-[10px] font-mono bg-slate-950 px-2 z-10 uppercase font-bold select-none">
              &harr;
            </div>
          </div>

          <!-- Box Operand 2 -->
          <div class="flex flex-col items-center gap-1 w-24">
            <span class="text-[10px] text-slate-500 font-bold uppercase">{{ op2Title }}</span>
            <div 
              class="w-20 py-3 rounded-lg border text-center font-mono font-extrabold text-sm transition-all duration-500"
              :class="getBoxClass('op2')"
            >
              {{ op2Val }}
            </div>
          </div>
        </div>

        <div class="text-[10px] text-slate-500 mt-4 select-none">
          {{ op2Type === 'mem' ? '*Operand 2 disimulasikan sebagai alamat memori [0x403000]' : '*Kedua operand berada di register CPU' }}
        </div>
      </div>
    </div>

    <!-- KONTEN TAB 2: SWAP MEMORY-TO-MEMORY -->
    <div v-else class="flex flex-col md:flex-row gap-6">
      <!-- Penjelasan Teori & Langkah (Kiri) -->
      <div class="flex-1 space-y-4">
        <div class="text-xs text-slate-400 leading-relaxed">
          Arsitektur x86/x64 memiliki batasan perangkat keras: **CPU tidak dapat mengakses dua alamat memori dalam satu instruksi.**
          Oleh karena itu, instruksi seperti <code class="text-red-400 font-mono">XCHG [var1], [var2]</code> adalah <strong>ILEGAL</strong>.
        </div>

        <!-- Pemilih Demo -->
        <div class="flex gap-2">
          <button 
            @click="selectM2mMode('incorrect')"
            :class="m2mMode === 'incorrect' ? 'bg-red-950/80 border-red-700 text-red-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'"
            class="flex-1 py-1.5 rounded border text-xs font-bold transition-all text-center"
          >
            ❌ Cara Salah (Langsung)
          </button>
          <button 
            @click="selectM2mMode('correct')"
            :class="m2mMode === 'correct' ? 'bg-emerald-950/80 border-emerald-700 text-emerald-200' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'"
            class="flex-1 py-1.5 rounded border text-xs font-bold transition-all text-center"
          >
            &check; Cara Benar (Menggunakan Reg)
          </button>
        </div>

        <!-- Cara Salah Panel -->
        <div v-if="m2mMode === 'incorrect'" class="p-3 bg-red-950/20 border border-red-900/60 rounded text-xs">
          <pre class="font-mono text-red-400 text-[11px] mb-2">XCHG [var1], [var2]  ; ❌ COMPILE ERROR!</pre>
          <p class="text-slate-400 leading-relaxed text-[11px]">
            <strong>Mengapa Gagal?</strong> CPU tidak memiliki jalur bus memori langsung untuk membaca nilai dari <code class="font-mono text-slate-200">[var2]</code> dan menulisnya ke <code class="font-mono text-slate-200">[var1]</code> secara bersamaan. Salah satu operand harus disalin ke register internal CPU terlebih dahulu.
          </p>
        </div>

        <!-- Cara Benar Panel -->
        <div v-if="m2mMode === 'correct'" class="space-y-3">
          <div class="p-3 bg-slate-950 rounded border border-slate-850 space-y-1.5 font-mono text-xs">
            <div :class="{'bg-emerald-950 text-emerald-200 px-1 py-0.5 rounded': m2mStep === 1}">
              1. MOV {{ op1RegName }}, [var1] <span class="text-slate-500 text-[10px]">; Ambil nilai var1 ke register</span>
            </div>
            <div :class="{'bg-emerald-950 text-emerald-200 px-1 py-0.5 rounded': m2mStep === 2}">
              2. XCHG {{ op1RegName }}, [var2] <span class="text-slate-500 text-[10px]">; Tukar register dengan var2</span>
            </div>
            <div :class="{'bg-emerald-950 text-emerald-200 px-1 py-0.5 rounded': m2mStep === 3}">
              3. MOV [var1], {{ op1RegName }} <span class="text-slate-500 text-[10px]">; Simpan nilai baru ke var1</span>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              @click="nextM2mStep" 
              :disabled="m2mStep === 3" 
              class="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-all flex justify-center items-center gap-1"
            >
              Simulasikan Langkah {{ m2mStep + 1 }} <i class="fas fa-play text-[10px]"></i>
            </button>
            <button @click="resetM2m" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-xs font-bold text-slate-300">
              Reset
            </button>
          </div>

          <div class="bg-slate-950 p-2 rounded border border-slate-850 font-mono text-[10px]">
            <span class="text-slate-400">> {{ m2mLog }}</span>
          </div>
        </div>
      </div>

      <!-- Simulasi Visual Grid Memori (Kanan) -->
      <div class="flex-1 flex flex-col md:flex-row gap-4 items-center justify-center py-4 bg-slate-950/60 rounded-lg border border-slate-850 min-h-[220px]">
        <!-- Buffer Register (RAX) -->
        <div class="flex flex-col items-center gap-1 w-24">
          <span class="text-[10px] text-slate-500 font-bold uppercase">{{ op1RegName }}</span>
          <div 
            class="w-20 py-2.5 rounded-lg border text-center font-mono font-extrabold text-xs transition-all duration-300"
            :class="m2mRegActive ? 'bg-indigo-900 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'"
          >
            {{ m2mRegVal }}
          </div>
          <span class="text-[9px] text-slate-600 italic">Buffer CPU</span>
        </div>

        <!-- Memory Variables -->
        <div class="flex flex-col gap-2 w-48 font-mono text-xs">
          <!-- Var 1 -->
          <div 
            class="flex justify-between items-center p-2 rounded border transition-all duration-300"
            :class="m2mVar1Active ? 'bg-emerald-950/50 border-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-800 text-slate-400'"
          >
            <span class="text-[10px] text-slate-500">[var1] (0x4030A0)</span>
            <span class="font-extrabold text-slate-100">{{ m2mVar1Val }}</span>
          </div>
          <!-- Var 2 -->
          <div 
            class="flex justify-between items-center p-2 rounded border transition-all duration-300"
            :class="m2mVar2Active ? 'bg-emerald-950/50 border-emerald-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.2)]' : 'bg-slate-900 border-slate-800 text-slate-400'"
          >
            <span class="text-[10px] text-slate-500">[var2] (0x4030A4)</span>
            <span class="font-extrabold text-slate-100">{{ m2mVar2Val }}</span>
          </div>
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

// === REGISTER NAMES ===
const op1RegName = computed(() => props.mode === 'x64' ? 'RAX' : 'EAX')
const op2RegName = computed(() => props.mode === 'x64' ? 'RBX' : 'EBX')
const op2Title = computed(() => op2Type.value === 'reg' ? op2RegName.value : '[0x403000]')

// === TAB & MODE STATE ===
const activeSubTab = ref('basic')
const m2mMode = ref('incorrect')

// === BASIC SWAP STATE ===
const op1Input = ref("100")
const op2Input = ref("200")
const op2Type = ref("reg")

const op1Val = ref("100")
const op2Val = ref("200")

const isSwapping = ref(false)
const opLog = ref("Siap melakukan operasi XCHG.")

// === MEMORY-TO-MEMORY STATE ===
const m2mStep = ref(0)
const m2mVar1Val = ref(77)
const m2mVar2Val = ref(88)
const m2mRegVal = ref(0)
const m2mLog = ref("Klik 'Simulasikan Langkah 1' untuk memulai pertukaran.")

const m2mRegActive = ref(false)
const m2mVar1Active = ref(false)
const m2mVar2Active = ref(false)

// Reset state when sub tab changes
watch(activeSubTab, () => {
  resetBasic()
  resetM2m()
})

// Reset values when architecture changes
watch(() => props.mode, () => {
  resetBasic()
  resetM2m()
})

// === BASIC SWAP METHODS ===
function resetBasic() {
  op1Input.value = "100"
  op2Input.value = "200"
  op1Val.value = "100"
  op2Val.value = "200"
  isSwapping.value = false
  opLog.value = "Parameter di-reset. Siap melakukan operasi XCHG."
}

function runBasicSwap() {
  // Sync values with inputs in case user modified them before click
  op1Val.value = op1Input.value
  op2Val.value = op2Input.value
  
  isSwapping.value = true
  opLog.value = `Menjalankan XCHG ${op1RegName.value}, ${op2Title.value}...`

  setTimeout(() => {
    // Swap operation
    const temp = op1Val.value
    op1Val.value = op2Val.value
    op2Val.value = temp
    
    // Update inputs to reflect swapped state
    op1Input.value = op1Val.value
    op2Input.value = op2Val.value

    opLog.value = `XCHG sukses! Nilai di ${op1RegName.value} dan ${op2Title.value} berhasil ditukar secara langsung.`
    
    setTimeout(() => {
      isSwapping.value = false
    }, 200)
  }, 400)
}

// === MEMORY-TO-MEMORY METHODS ===
function selectM2mMode(mode) {
  m2mMode.value = mode
  resetM2m()
}

function resetM2m() {
  m2mStep.value = 0
  m2mVar1Val.value = 77
  m2mVar2Val.value = 88
  m2mRegVal.value = 0
  m2mLog.value = "Klik 'Simulasikan Langkah 1' untuk memulai pertukaran."
  
  m2mRegActive.value = false
  m2mVar1Active.value = false
  m2mVar2Active.value = false
}

function nextM2mStep() {
  if (m2mStep.value === 0) {
    // Step 1: MOV RAX, [var1]
    m2mStep.value = 1
    m2mRegVal.value = m2mVar1Val.value // RAX = 77
    m2mRegActive.value = true
    m2mVar1Active.value = true
    m2mVar2Active.value = false
    m2mLog.value = `Langkah 1 Selesai: Nilai 77 dari [var1] disalin ke register ${op1RegName.value}.`
  } else if (m2mStep.value === 1) {
    // Step 2: XCHG RAX, [var2]
    m2mStep.value = 2
    const tempReg = m2mRegVal.value // 77
    m2mRegVal.value = m2mVar2Val.value // RAX = 88
    m2mVar2Val.value = tempReg // [var2] = 77
    
    m2mRegActive.value = true
    m2mVar1Active.value = false
    m2mVar2Active.value = true
    m2mLog.value = `Langkah 2 Selesai: Register ${op1RegName.value} (77) ditukar dengan [var2] (88). Sekarang ${op1RegName.value} = 88, [var2] = 77.`
  } else if (m2mStep.value === 2) {
    // Step 3: MOV [var1], RAX
    m2mStep.value = 3
    m2mVar1Val.value = m2mRegVal.value // [var1] = 88
    
    m2mRegActive.value = false
    m2mVar1Active.value = true
    m2mVar2Active.value = false
    m2mLog.value = `Langkah 3 Selesai: Nilai 88 dari register ${op1RegName.value} disalin kembali ke [var1]. Swap Memori-ke-Memori sukses!`
  }
}

// === UTILS ===
function getBoxClass(op) {
  if (op === 'op1') {
    if (isSwapping.value) {
      return 'bg-indigo-950 border-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.4)] translate-x-4 opacity-70 scale-95'
    }
    return 'bg-slate-800 border-slate-700 text-indigo-300'
  } else {
    // op2
    if (isSwapping.value) {
      return 'bg-indigo-950 border-indigo-500 text-white shadow-[0_0_8px_rgba(99,102,241,0.4)] -translate-x-4 opacity-70 scale-95'
    }
    return op2Type.value === 'mem' ? 'bg-slate-900 border-indigo-900 text-emerald-300' : 'bg-slate-800 border-slate-700 text-indigo-300'
  }
}
</script>

<style scoped>
.xchg-visualizer {
  background-color: #0b0f19;
}
</style>
