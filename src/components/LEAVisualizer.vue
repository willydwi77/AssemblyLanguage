<template>
  <div class="lea-visualizer bg-slate-900 rounded-lg border border-slate-800 text-slate-100 p-5 flex flex-col lg:flex-row gap-6 shadow-xl">
    <!-- Panel Kontrol (Kiri) -->
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <h4 class="font-bold text-sm mb-2 text-emerald-400 flex items-center gap-1.5">
          <i class="fas fa-calculator"></i> LEA vs MOV Address Builder
        </h4>
        <p class="text-xs text-slate-400 mb-4 leading-relaxed">
          Kalkulator interaktif untuk memahami cara kerja <strong>Effective Address (Alamat Efektif)</strong>.
          Ganti parameter di bawah ini untuk melihat bagaimana Unit Pengalamatan (AGU) menghasilkan alamat di memori.
        </p>

        <!-- Pemilih Parameter -->
        <div class="space-y-3.5 mb-5 bg-slate-950 p-4 rounded-lg border border-slate-850">
          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-bold font-mono">Base Register ({{ baseRegName }})</span>
            <select v-model="baseVal" class="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 focus:outline-none focus:border-emerald-500 font-mono text-[11px]">
              <option :value="0x403000">0x403000 (matrix_base)</option>
              <option :value="0x403008">0x403008 (matrix_offset)</option>
            </select>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-bold font-mono">Index Register ({{ indexRegName }})</span>
            <div class="flex items-center gap-2">
              <input v-model.number="indexVal" type="number" min="0" max="8" class="w-16 bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-center font-mono text-[11px] focus:outline-none" />
              <span class="text-slate-500 text-[10px]"> (0 - 8)</span>
            </div>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-bold font-mono">Scale Factor (1, 2, 4, 8)</span>
            <select v-model.number="scaleVal" class="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 focus:outline-none focus:border-emerald-500 font-mono text-[11px]">
              <option :value="1">1 (byte/char)</option>
              <option :value="2">2 (word/short)</option>
              <option :value="4">4 (dword/int)</option>
              <option :value="8">8 (qword/double)</option>
            </select>
          </div>

          <div class="flex items-center justify-between text-xs">
            <span class="text-slate-400 font-bold font-mono">Displacement (Offset)</span>
            <select v-model.number="dispVal" class="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 focus:outline-none focus:border-emerald-500 font-mono text-[11px]">
              <option :value="-16">-16</option>
              <option :value="-8">-8</option>
              <option :value="0">0</option>
              <option :value="8">8</option>
              <option :value="16">16</option>
            </select>
          </div>
        </div>

        <!-- Rumus Interaktif -->
        <div class="mb-4">
          <label class="block text-[10px] text-slate-500 font-bold uppercase mb-1">Rumus Effective Address</label>
          <div class="bg-slate-800 rounded p-2.5 font-mono text-xs flex justify-between items-center border border-slate-750">
            <span class="text-slate-400">
              [{{ baseRegName }} + {{ indexRegName }} * Scale + Disp]
            </span>
            <span class="text-emerald-400 font-bold">
              [{{ formatHex(baseVal) }} + {{ indexVal }} * {{ scaleVal }} + {{ dispVal >= 0 ? '+' : '' }}{{ dispVal }}]
            </span>
          </div>
        </div>

        <!-- Langkah Perhitungan (AGU) -->
        <div class="mb-5 bg-slate-950/60 p-3 rounded border border-slate-850 text-xs font-mono text-slate-300">
          <h5 class="text-[10px] text-slate-500 font-bold uppercase mb-1.5 tracking-wider">Address Generation Unit (AGU) Output</h5>
          <div class="space-y-1">
            <div>1. Base = <span class="text-blue-400">{{ formatHex(baseVal) }}</span></div>
            <div>2. Index * Scale = {{ indexVal }} * {{ scaleVal }} = {{ indexVal * scaleVal }} (<span class="text-cyan-400">{{ formatHex(indexVal * scaleVal) }}</span>)</div>
            <div>3. Disp = {{ dispVal >= 0 ? '+' : '' }}{{ dispVal }} (<span class="text-purple-400">{{ formatHex(Math.abs(dispVal), dispVal < 0) }}</span>)</div>
            <div class="border-t border-slate-800 my-1 pt-1 font-bold">
              &rArr; Alamat Hasil: <span class="text-yellow-400 font-extrabold">{{ formatHex(effectiveAddress) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulasi Actions -->
      <div class="flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2.5">
          <button @click="simulate('lea')" class="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1">
            <i class="fas fa-link"></i> Simulasikan LEA
          </button>
          <button @click="simulate('mov')" class="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1">
            <i class="fas fa-file-import"></i> Simulasikan MOV
          </button>
        </div>
        
        <!-- Output Log Aksi -->
        <div class="bg-slate-950 p-2.5 rounded border border-slate-850 font-mono text-[10px] min-h-[50px] flex items-center">
          <div>
            <span class="text-slate-500">> </span>
            <span v-html="actionLog"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Visual Memory & Register Grid (Kanan) -->
    <div class="flex-1 flex flex-col md:flex-row gap-4 items-center justify-center">
      <!-- Register RAX Display -->
      <div class="flex flex-col items-center justify-center w-full md:w-32 bg-slate-950 p-4 rounded-lg border border-slate-800 shrink-0 text-center gap-1.5">
        <div class="text-[10px] text-slate-500 font-bold uppercase">{{ destRegName }}</div>
        <div class="text-sm font-mono font-extrabold px-3 py-1 bg-slate-900 border border-slate-750 rounded text-yellow-400" :class="{'animate-pulse scale-105 border-yellow-500': simActive}">
          {{ regValue }}
        </div>
        <div class="text-[9px] text-slate-400 italic">
          {{ regTypeDesc }}
        </div>
      </div>

      <!-- Memory Grid Mock -->
      <div class="w-full max-w-[280px]">
        <div class="text-[10px] text-slate-500 font-bold mb-2 uppercase text-center tracking-wider">Memory Array Mock</div>
        <div class="border border-slate-800 rounded-lg p-2.5 bg-slate-950 flex flex-col gap-1">
          <div 
            v-for="cell in memoryCells" 
            :key="cell.addr"
            class="flex items-center justify-between px-2.5 py-1.5 rounded text-[11px] font-mono border transition-all duration-300"
            :class="getCellClass(cell.addr)"
          >
            <div class="flex items-center gap-1.5">
              <span class="text-slate-500 text-[10px]">[{{ formatHex(cell.addr) }}]</span>
              <span class="font-extrabold text-slate-200">{{ cell.val }}</span>
            </div>
            
            <!-- Pointer Indicators -->
            <div class="flex items-center gap-1">
              <span v-if="cell.addr === effectiveAddress && simActive && simType === 'lea'" class="text-[8px] bg-emerald-600 text-white px-1 py-0.2 rounded uppercase animate-pulse">
                LEA Target
              </span>
              <span v-if="cell.addr === effectiveAddress && simActive && simType === 'mov'" class="text-[8px] bg-blue-600 text-white px-1 py-0.2 rounded uppercase animate-pulse">
                MOV Target
              </span>
            </div>
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
const baseRegName = computed(() => props.mode === 'x64' ? 'RBX' : 'EBX')
const indexRegName = computed(() => props.mode === 'x64' ? 'RCX' : 'ECX')
const destRegName = computed(() => props.mode === 'x64' ? 'RAX' : 'EAX')

// === STATE ===
const baseVal = ref(0x403000)
const indexVal = ref(2)
const scaleVal = ref(4)
const dispVal = ref(8)

const simActive = ref(false)
const simType = ref(null)
const regValue = ref("0x00000000")
const regTypeDesc = ref("Kosong / Reset")
const actionLog = ref("Pilih instruksi simulasi di atas.")

// Reset simulation when properties change
watch([baseVal, indexVal, scaleVal, dispVal, () => props.mode], () => {
  simActive.value = false
  simType.value = null
  regValue.value = props.mode === 'x64' ? "0x0000000000000000" : "0x00000000"
  regTypeDesc.value = "Di-reset"
  actionLog.value = "Parameter berubah. Pilih instruksi simulasi untuk melihat aksi."
})

// === COMPUTED VALUES ===
const effectiveAddress = computed(() => {
  return baseVal.value + (indexVal.value * scaleVal.value) + dispVal.value
})

const memoryCells = computed(() => {
  // Generate dummy array around 0x403000
  const cells = []
  const start = 0x403000
  const step = props.mode === 'x64' ? 8 : 4
  
  for (let i = 0; i < 7; i++) {
    const addr = start + i * step
    // Deterministic dummy values in memory
    const val = 10 * (i + 1)
    cells.push({ addr, val })
  }

  // Ensure our effective address target is shown, even if out of bounds of the loop
  const target = effectiveAddress.value
  if (!cells.some(c => c.addr === target)) {
    // Add target if it's within range
    if (target >= start - 16 && target <= start + 48) {
      cells.push({ addr: target, val: 99 })
      cells.sort((a, b) => a.addr - b.addr)
    }
  }

  return cells
})

// === ACTIONS ===
function simulate(type) {
  simActive.value = true
  simType.value = type
  
  const targetAddr = effectiveAddress.value
  const targetCell = memoryCells.value.find(c => c.addr === targetAddr)
  
  if (type === 'lea') {
    const hexAddr = formatHex(targetAddr)
    regValue.value = hexAddr
    regTypeDesc.value = "Berisi Alamat Memori"
    actionLog.value = `<span class='text-emerald-400'>LEA ${destRegName.value}, [${baseRegName.value} + ${indexRegName.value}*${scaleVal.value} ${dispVal.value >= 0 ? '+' : ''}${dispVal.value}]</span><br/>` +
                      `AGU menghitung alamat efektif &rArr; <b>${hexAddr}</b>. Nilai alamat disalin ke ${destRegName.value}. <span class='text-yellow-400'><b>TANPA akses ke memori!</b></span>`
  } else {
    // MOV
    const hexAddr = formatHex(targetAddr)
    if (targetCell) {
      regValue.value = targetCell.val.toString()
      regTypeDesc.value = "Berisi Nilai Data"
      actionLog.value = `<span class='text-blue-400'>MOV ${destRegName.value}, [${baseRegName.value} + ${indexRegName.value}*${scaleVal.value} ${dispVal.value >= 0 ? '+' : ''}${dispVal.value}]</span><br/>` +
                        `Membaca data dari alamat <b>${hexAddr}</b> &rArr; mengambil nilai <b>${targetCell.val}</b> dan memindahkannya ke ${destRegName.value}. <span class='text-red-400'><b>Memori diakses secara nyata.</b></span>`
    } else {
      regValue.value = "0x00"
      regTypeDesc.value = "Segmentation Fault (Mock)"
      actionLog.value = `<span class='text-red-500'>Segmentation Fault!</span><br/>Alamat hasil kalkulasi <b>${hexAddr}</b> berada di luar batasan array memori simulasi ini.`
    }
  }
}

// === UTILS ===
function formatHex(val, isNegative = false) {
  const prefix = isNegative ? "-" : ""
  if (props.mode === 'x64') {
    return prefix + "0x" + val.toString(16).toUpperCase().padStart(16, '0')
  } else {
    return prefix + "0x" + val.toString(16).toUpperCase().padStart(8, '0')
  }
}

function getCellClass(addr) {
  const isTarget = addr === effectiveAddress.value
  if (!isTarget) return 'bg-slate-900 border-slate-800 text-slate-400'
  
  if (simActive.value) {
    if (simType.value === 'lea') {
      return 'bg-emerald-950/40 border-emerald-500 text-emerald-100 shadow-[0_0_8px_rgba(16,185,129,0.3)] font-bold'
    } else {
      return 'bg-blue-950/40 border-blue-500 text-blue-100 shadow-[0_0_8px_rgba(59,130,246,0.3)] font-bold'
    }
  }
  
  return 'bg-slate-850 border-slate-700 text-slate-200'
}
</script>

<style scoped>
.lea-visualizer {
  background-color: #0b0f19;
}
</style>
