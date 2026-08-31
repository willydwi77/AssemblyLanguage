<template>
  <div class="flex flex-col gap-6 my-6 border border-slate-200 rounded-xl p-6 bg-white shadow-sm">
    <!-- Tab Index for Registers -->
    <div class="flex flex-wrap gap-2 pb-4 border-b border-slate-100">
      <button 
        v-for="(reg, idx) in registers" 
        :key="reg.r64"
        @click="selectReg(idx)"
        :class="[
          'px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all border shadow-sm cursor-pointer',
          selectedIndex === idx 
            ? 'bg-blue-600 border-blue-600 text-white scale-105' 
            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
        ]"
      >
        {{ reg.r64 }}
      </button>
    </div>

    <!-- Details and Bit Diagram Area -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
      <!-- Left side (8 cols): Bit Diagram & Sub Registers -->
      <div class="md:col-span-8 flex flex-col gap-4">
        <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <i class="fas fa-th-large text-blue-500"></i>
          Visualisasi Pembagian Bit & Sub-Register
        </h4>

        <div class="reg-diagram bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <!-- 64-bit Row -->
          <div class="reg-row mb-2">
            <div class="reg-label text-blue-600 font-mono font-bold">{{ activeReg.r64 }}</div>
            <div class="reg-bits">
              <div class="bit-block bit-64 w-full text-xs" style="flex: 64">
                {{ activeReg.r64 }} (64-bit General Purpose Register)
              </div>
            </div>
          </div>

          <!-- 32-bit Row -->
          <div class="reg-row mb-2">
            <div class="reg-label text-sky-500 font-mono font-bold">{{ activeReg.r32 }}</div>
            <div class="reg-bits">
              <div class="bit-block bit-inactive text-[10px]" style="flex: 32">unused</div>
              <div class="bit-block bit-32 text-xs" style="flex: 32">
                {{ activeReg.r32 }} (32-bit)
              </div>
            </div>
          </div>

          <!-- 16-bit Row -->
          <div class="reg-row mb-2">
            <div class="reg-label text-violet-500 font-mono font-bold">{{ activeReg.r16 }}</div>
            <div class="reg-bits">
              <div class="bit-block bit-inactive text-[10px]" style="flex: 48">unused</div>
              <div class="bit-block bit-16 text-xs" style="flex: 16">
                {{ activeReg.r16 }} (16-bit)
              </div>
            </div>
          </div>

          <!-- 8-bit Row (High/Low) -->
          <div class="reg-row mb-2" v-if="hasHighLow">
            <div class="reg-label text-fuchsia-500 font-mono font-bold">{{ activeReg.r8 }}</div>
            <div class="reg-bits">
              <div class="bit-block bit-inactive text-[10px]" style="flex: 48">unused</div>
              <div class="bit-block bit-8 text-[11px]" style="flex: 8">
                {{ activeReg.r8.split(' / ')[1] }} (8-15)
              </div>
              <div class="bit-block bit-8 text-[11px]" style="flex: 8">
                {{ activeReg.r8.split(' / ')[0] }} (0-7)
              </div>
            </div>
          </div>

          <!-- 8-bit Row (Low Only) -->
          <div class="reg-row mb-2" v-else-if="activeReg.r8 !== '-'">
            <div class="reg-label text-fuchsia-500 font-mono font-bold">{{ activeReg.r8 }}</div>
            <div class="reg-bits">
              <div class="bit-block bit-inactive text-[10px]" style="flex: 56">unused</div>
              <div class="bit-block bit-8 text-[11px]" style="flex: 8">
                {{ activeReg.r8 }} (0-7)
              </div>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="flex flex-wrap gap-4 mt-1 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span class="w-3 h-3 rounded bg-[#2563eb]"></span> 64-bit GPR
          </span>
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span class="w-3 h-3 rounded bg-[#0ea5e9]"></span> 32-bit Sub-Register
          </span>
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span class="w-3 h-3 rounded bg-[#8b5cf6]"></span> 16-bit Sub-Register
          </span>
          <span class="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            <span class="w-3 h-3 rounded bg-[#d946ef]"></span> 8-bit Sub-Register
          </span>
        </div>
      </div>

      <!-- Right side (4 cols): Information -->
      <div class="md:col-span-4 flex flex-col gap-4 border-l border-slate-100 md:pl-6 w-full">
        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nama Register</h4>
          <h3 class="text-2xl font-extrabold text-blue-600 font-sans mt-1">
            {{ activeReg.r64 }}
          </h3>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hierarki Sub-Register</h4>
          <div class="flex flex-col gap-1.5 font-mono text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div><span class="font-bold text-blue-600">64-bit:</span> {{ activeReg.r64 }}</div>
            <div><span class="font-bold text-sky-500">32-bit:</span> {{ activeReg.r32 }}</div>
            <div><span class="font-bold text-violet-500">16-bit:</span> {{ activeReg.r16 }}</div>
            <div><span class="font-bold text-fuchsia-500">8-bit:</span> {{ activeReg.r8 }}</div>
          </div>
        </div>

        <div>
          <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Fungsi Utama</h4>
          <p class="text-xs leading-relaxed font-sans bg-blue-50/50 border border-blue-100 p-3.5 rounded-lg text-slate-700">
            {{ activeReg.desc }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const registers = [
  { r64: 'RAX', r32: 'EAX', r16: 'AX', r8: 'AL / AH', desc: 'Akumulator; digunakan untuk operasi aritmetika dan menyimpan hasil fungsi.' },
  { r64: 'RBX', r32: 'EBX', r16: 'BX', r8: 'BL / BH', desc: 'Base; register tujuan umum.' },
  { r64: 'RCX', r32: 'ECX', r16: 'CX', r8: 'CL / CH', desc: 'Counter; sering digunakan sebagai penghitung loop.' },
  { r64: 'RDX', r32: 'EDX', r16: 'DX', r8: 'DL / DH', desc: 'Data; digunakan dalam operasi I/O dan aritmetika (misal, mul, div).' },
  { r64: 'RSI', r32: 'ESI', r16: 'SI', r8: 'SIL', desc: 'Source Index; digunakan untuk operasi string dan sebagai sumber data.' },
  { r64: 'RDI', r32: 'EDI', r16: 'DI', r8: 'DIL', desc: 'Destination Index; digunakan untuk operasi string dan sebagai tujuan data.' },
  { r64: 'RSP', r32: 'ESP', r16: 'SP', r8: 'SPL', desc: 'Stack Pointer; menunjuk ke puncak tumpukan (stack).' },
  { r64: 'RBP', r32: 'EBP', r16: 'BP', r8: 'BPL', desc: 'Base Pointer; digunakan untuk menunjuk ke frame stack.' },
  { r64: 'RIP', r32: 'EIP', r16: 'IP', r8: '-', desc: 'Instruction Pointer; menyimpan alamat instruksi selanjutnya yang akan dieksekusi.' }
]

const selectedIndex = ref(0)
const activeReg = computed(() => registers[selectedIndex.value])

const hasHighLow = computed(() => {
  return activeReg.value.r8.includes(' / ')
})

function selectReg(idx) {
  selectedIndex.value = idx
}
</script>

<style scoped>
/* Scoped style styling for buttons */
button:focus {
  outline: none;
}
</style>
