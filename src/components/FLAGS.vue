<template>
  <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-sm my-4 flex flex-col gap-4">
    <!-- Header -->
    <div class="flex items-center gap-2 border-b border-slate-100 pb-3">
      <div class="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
        <i class="fas fa-flag text-sm"></i>
      </div>
      <div>
        <h4 class="text-sm font-bold text-slate-800">Status Register: RFLAGS / EFLAGS</h4>
        <p class="text-xs text-slate-500 font-sans">
          Register bendera status khusus yang menyimpan status hasil operasi CPU (aritmatika, perbandingan, dll.).
        </p>
      </div>
    </div>

    <!-- Flags Bit Strip Diagram -->
    <div class="flex flex-col gap-2">
      <h5 class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tata Letak Bit EFLAGS (Bit 0 - 11)</h5>
      
      <div class="flex border border-slate-200 rounded-lg overflow-hidden h-10 shadow-sm bg-slate-50">
        <!-- We render bits from 11 down to 0 -->
        <div 
          v-for="bit in bitList" 
          :key="bit.position"
          @click="selectBit(bit)"
          :class="[
            'flex-1 flex flex-col justify-between items-center py-1 cursor-pointer transition-all border-r border-slate-200 last:border-r-0 select-none',
            bit.reserved 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : selectedBit.position === bit.position
                ? 'bg-orange-500 text-white font-bold scale-y-105 shadow-inner'
                : 'hover:bg-orange-50 text-slate-700'
          ]"
        >
          <span class="text-[9px] font-bold font-mono opacity-60">b{{ bit.position }}</span>
          <span class="text-xs font-extrabold font-mono">{{ bit.name }}</span>
        </div>
      </div>
    </div>

    <!-- Selected Flag Info Panel -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50/70 border border-slate-100 p-4 rounded-xl">
      <div class="md:col-span-8 flex flex-col gap-1">
        <div class="flex items-center gap-2">
          <span class="text-sm font-extrabold text-slate-800">
            {{ selectedBit.fullName }} ({{ selectedBit.name }})
          </span>
          <span class="bg-orange-100 text-orange-800 text-[9px] px-1.5 py-0.5 rounded font-bold font-mono">
            Bit {{ selectedBit.position }}
          </span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed font-sans mt-1">
          {{ selectedBit.desc }}
        </p>
      </div>
      <div class="md:col-span-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4 flex flex-col gap-1 shrink-0">
        <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Instruksi Terkait</div>
        <div class="flex flex-wrap gap-1 mt-1">
          <span 
            v-for="inst in selectedBit.instructions" 
            :key="inst"
            class="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono text-[10px]"
          >
            {{ inst }}
          </span>
        </div>
      </div>
    </div>

    <!-- Info Note -->
    <div class="text-[11px] text-slate-500 font-sans leading-relaxed flex items-start gap-1">
      <i class="fas fa-info-circle text-blue-500 mt-0.5"></i>
      <span>
        Tiga flag utama yang paling sering diperhatikan programmer adalah <strong>ZF</strong> (Zero Flag), <strong>CF</strong> (Carry Flag), dan <strong>OF</strong> (Overflow Flag) untuk mendeteksi kesamaan data, hasil minus, atau luapan memori.
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const bitList = [
  { position: 11, name: 'OF', fullName: 'Overflow Flag', desc: 'Diset jika operasi matematika angka bertanda (signed) meluap (terlalu besar/kecil untuk ditampung).', instructions: ['jo', 'jno', 'into'], reserved: false },
  { position: 10, name: 'DF', fullName: 'Direction Flag', desc: 'Mengatur arah pemrosesan operasi string: 0 untuk auto-increment (maju), 1 untuk auto-decrement (mundur).', instructions: ['cld', 'std', 'lodsb'], reserved: false },
  { position: 9, name: 'IF', fullName: 'Interrupt Enable Flag', desc: 'Mengontrol apakah CPU boleh menerima interupsi perangkat keras eksternal (maskable interrupts).', instructions: ['cli', 'sti'], reserved: false },
  { position: 8, name: 'TF', fullName: 'Trap Flag', desc: 'Digunakan debugger untuk mengaktifkan single-step execution (menjalankan satu instruksi per satu detak).', instructions: ['int 3'], reserved: false },
  { position: 7, name: 'SF', fullName: 'Sign Flag', desc: 'Diset sama dengan bit paling signifikan (sign bit) dari hasil operasi. Bernilai 1 jika hasilnya negatif.', instructions: ['js', 'jns'], reserved: false },
  { position: 6, name: 'ZF', fullName: 'Zero Flag', desc: 'Diset jika hasil operasi aritmetika atau perbandingan bernilai nol (misal perbandingan dua angka yang sama).', instructions: ['je', 'jne', 'jz', 'jnz'], reserved: false },
  { position: 5, name: '0', fullName: 'Reserved (0)', desc: 'Bit cadangan yang selalu diatur bernilai 0 oleh sistem.', instructions: [], reserved: true },
  { position: 4, name: 'AF', fullName: 'Auxiliary Carry Flag', desc: 'Diset jika ada carry atau borrow dari bit 3 ke bit 4. Digunakan untuk aritmetika BCD (Binary Coded Decimal).', instructions: ['aaa', 'aas'], reserved: false },
  { position: 3, name: '0', fullName: 'Reserved (0)', desc: 'Bit cadangan yang selalu diatur bernilai 0 oleh sistem.', instructions: [], reserved: true },
  { position: 2, name: 'PF', fullName: 'Parity Flag', desc: 'Diset jika jumlah bit bernilai 1 pada byte terakhir hasil operasi berjumlah genap (even parity).', instructions: ['jp', 'jnp'], reserved: false },
  { position: 1, name: '1', fullName: 'Reserved (1)', desc: 'Bit cadangan yang selalu diatur bernilai 1 oleh sistem.', instructions: [], reserved: true },
  { position: 0, name: 'CF', fullName: 'Carry Flag', desc: 'Diset jika operasi matematika angka tak bertanda (unsigned) menghasilkan carry-out atau borrow-in.', instructions: ['jc', 'jnc', 'clc', 'stc'], reserved: false }
]

const selectedBit = ref(bitList[5]) // Zero Flag is default (index 5)

function selectBit(bit) {
  if (bit.reserved) return
  selectedBit.value = bit
}
</script>

<style scoped>
/* Focus & Hover states styling */
</style>
