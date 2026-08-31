<template>
  <div class="arithmetic-tab pb-10">
    <h2 class="section-title">Instruksi Aritmetika</h2>
    <p class="content-desc mb-6">
      Instruksi aritmetika digunakan untuk melakukan operasi matematika dasar (penjumlahan, pengurangan, perkalian, pembagian) 
      pada level perangkat keras CPU.
    </p>

    <!-- 1. ADD & SUB -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">1</span>
        ADD & SUB – Penjumlahan dan Pengurangan
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <strong>ADD:</strong> Menjumlahkan dua operand dan menyimpan hasil di operand pertama (destination).<br/>
          <strong>SUB:</strong> Mengurangkan operand kedua (source) dari operand pertama (destination) dan menyimpan hasilnya di destination.
        </p>
        <p class="text-xs text-slate-500 mb-3">Kedua instruksi ini mempengaruhi status register bendera (flags) CPU untuk menandai overflow atau hasil nol.</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs text-green-400">
          <div class="bg-slate-800 rounded p-2.5">ADD destination, source ; dest = dest + src</div>
          <div class="bg-slate-800 rounded p-2.5">SUB destination, source ; dest = dest - src</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <!-- Examples -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Immediate ke Register</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">ADD RAX, 10      ; RAX = RAX + 10
SUB RBX, 5       ; RBX = RBX - 5
ADD EAX, 0xFF    ; EAX = EAX + 255</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Register ke Register</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">ADD RAX, RBX     ; RAX = RAX + RBX
SUB RCX, RDX     ; RCX = RCX - RDX
ADD EAX, EBX     ; EAX = EAX + EBX</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Akses Memori RAM</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">ADD RAX, [var]   ; RAX += nilai var
SUB [var], RBX   ; var -= RBX
ADD [RBP-8], EAX ; stack += EAX</pre>
        </div>
      </div>

      <div class="bg-red-50 border border-red-100 rounded p-3 text-xs text-red-800 mb-4">
        <i class="fas fa-exclamation-triangle"></i> <strong>Aturan Penting:</strong> Operand harus berukuran sama (tidak bisa mencampur 8-bit dan 32-bit). Anda tidak bisa memicu penjumlahan memori-ke-memori secara langsung (e.g. <code>ADD [mem1], [mem2]</code>). Operasi harus dijembatani oleh register.
      </div>

      <!-- Flags table -->
      <h4 class="font-bold text-slate-700 text-xs uppercase mb-2">Pengaruh Status Flags (EFLAGS / RFLAGS)</h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200 text-slate-700">
              <th class="p-2 border-r">Flag</th>
              <th class="p-2">Keterangan Pengaruh Operasi</th>
            </tr>
          </thead>
          <tbody class="text-slate-600 font-mono">
            <tr class="border-b border-slate-200">
              <td class="p-2 border-r font-bold text-slate-800">ZF (Zero Flag)</td>
              <td class="p-2">Set (1) jika hasil akhir kalkulasi bernilai = 0.</td>
            </tr>
            <tr class="border-b border-slate-200">
              <td class="p-2 border-r font-bold text-slate-800">SF (Sign Flag)</td>
              <td class="p-2">Set (1) jika hasil bernilai negatif (bit MSB paling kiri bernilai 1).</td>
            </tr>
            <tr class="border-b border-slate-200">
              <td class="p-2 border-r font-bold text-slate-800">CF (Carry Flag)</td>
              <td class="p-2">Set (1) jika terjadi carry-out/pinjaman bit keluar (untuk unsigned overflow).</td>
            </tr>
            <tr>
              <td class="p-2 border-r font-bold text-slate-800">OF (Overflow Flag)</td>
              <td class="p-2">Set (1) jika hasil operasi aritmetika merusak bit tanda (untuk signed overflow).</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. INC & DEC -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">2</span>
        INC & DEC – Increment dan Decrement
      </h3>
      <p class="text-sm text-slate-700 mb-3">
        Instruksi hemat-lebar yang digunakan untuk menambahkan 1 (<code>INC</code>) atau mengurangkan 1 (<code>DEC</code>) 
        dari operand register atau memori secara cepat.
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="bg-slate-50 border border-slate-200 rounded p-4">
          <h4 class="font-bold text-slate-700 text-sm mb-1.5 font-mono">INC operand ; (operand += 1)</h4>
          <pre class="p-2 text-xs font-mono bg-slate-800 text-slate-200 rounded">INC RAX       ; RAX = RAX + 1
INC [var]     ; Nilai di alamat var += 1</pre>
        </div>
        <div class="bg-slate-50 border border-slate-200 rounded p-4">
          <h4 class="font-bold text-slate-700 text-sm mb-1.5 font-mono">DEC operand ; (operand -= 1)</h4>
          <pre class="p-2 text-xs font-mono bg-slate-800 text-slate-200 rounded">DEC RBX       ; RBX = RBX - 1
DEC [RBP-4]   ; Variabel lokal stack -= 1</pre>
        </div>
      </div>
      <div class="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-slate-700">
        <i class="fas fa-info-circle text-blue-500"></i> <strong>Catatan Flag:</strong> Berbeda dengan <code>ADD/SUB</code>, instruksi <code>INC</code> dan <code>DEC</code> <strong>tidak mempengaruhi Carry Flag (CF)</strong>. Hal ini mempermudah penggunaannya di dalam loop berantai tanpa mengganggu kalkulasi aritmetika besar (big-num arithmetic).
      </div>
    </div>

    <!-- 3. MUL & DIV -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">3</span>
        MUL & DIV – Perkalian dan Pembagian Unsigned
      </h3>
      <p class="text-sm text-slate-700 mb-3">
        Instruksi perkalian (<code>MUL</code>) dan pembagian (<code>DIV</code>) untuk tipe data tanpa tanda (unsigned). 
        Kedua instruksi ini memiliki <strong>register implisit</strong> yang telah ditentukan secara kaku oleh CPU berdasarkan ukuran operand.
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- MUL Table -->
        <div class="border border-slate-200 rounded p-4 bg-slate-50">
          <h4 class="font-bold text-slate-800 text-sm mb-2">Format Perkalian (MUL)</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border border-slate-200 bg-white">
              <thead class="bg-slate-100">
                <tr class="border-b">
                  <th class="p-1.5 border-r">Ukuran Src</th>
                  <th class="p-1.5 border-r">Multiplicand (Implisit)</th>
                  <th class="p-1.5">Hasil Akhir (Produk)</th>
                </tr>
              </thead>
              <tbody class="font-mono">
                <tr class="border-b">
                  <td class="p-1.5 border-r">8-bit</td>
                  <td class="p-1.5 border-r">AL</td>
                  <td class="p-1.5 text-blue-600">AX (16-bit)</td>
                </tr>
                <tr class="border-b">
                  <td class="p-1.5 border-r">16-bit</td>
                  <td class="p-1.5 border-r">AX</td>
                  <td class="p-1.5 text-blue-600">DX:AX (32-bit)</td>
                </tr>
                <tr class="border-b">
                  <td class="p-1.5 border-r">32-bit</td>
                  <td class="p-1.5 border-r">EAX</td>
                  <td class="p-1.5 text-blue-600">EDX:EAX (64-bit)</td>
                </tr>
                <tr>
                  <td class="p-1.5 border-r">64-bit</td>
                  <td class="p-1.5 border-r">RAX</td>
                  <td class="p-1.5 text-blue-600">RDX:RAX (128-bit)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <pre class="p-2 mt-3 text-[11px] font-mono bg-slate-800 text-slate-200 rounded">MOV AL, 5
MOV BL, 10
MUL BL       ; AX = AL * BL = 50 (0x32)</pre>
        </div>

        <!-- DIV Table -->
        <div class="border border-slate-200 rounded p-4 bg-slate-50">
          <h4 class="font-bold text-slate-800 text-sm mb-2">Format Pembagian (DIV)</h4>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border border-slate-200 bg-white">
              <thead class="bg-slate-100">
                <tr class="border-b">
                  <th class="p-1.5 border-r">Ukuran Src</th>
                  <th class="p-1.5 border-r">Dividend (Implisit)</th>
                  <th class="p-1.5 border-r">Hasil Bagi (Quotient)</th>
                  <th class="p-1.5">Sisa (Remainder)</th>
                </tr>
              </thead>
              <tbody class="font-mono">
                <tr class="border-b">
                  <td class="p-1.5 border-r">8-bit</td>
                  <td class="p-1.5 border-r">AX</td>
                  <td class="p-1.5 border-r text-green-600">AL</td>
                  <td class="p-1.5 text-orange-600">AH</td>
                </tr>
                <tr class="border-b">
                  <td class="p-1.5 border-r">16-bit</td>
                  <td class="p-1.5 border-r">DX:AX</td>
                  <td class="p-1.5 border-r text-green-600">AX</td>
                  <td class="p-1.5 text-orange-600">DX</td>
                </tr>
                <tr class="border-b">
                  <td class="p-1.5 border-r">32-bit</td>
                  <td class="p-1.5 border-r">EDX:EAX</td>
                  <td class="p-1.5 border-r text-green-600">EAX</td>
                  <td class="p-1.5 text-orange-600">EDX</td>
                </tr>
                <tr>
                  <td class="p-1.5 border-r">64-bit</td>
                  <td class="p-1.5 border-r">RDX:RAX</td>
                  <td class="p-1.5 border-r text-green-600">RAX</td>
                  <td class="p-1.5 text-orange-600">RDX</td>
                </tr>
              </tbody>
            </table>
          </div>
          <pre class="p-2 mt-3 text-[11px] font-mono bg-slate-800 text-slate-200 rounded">MOV AX, 100
MOV BL, 3
DIV BL       ; AL = 33 (hasil), AH = 1 (sisa)</pre>
        </div>
      </div>

      <div class="bg-yellow-50 border border-yellow-100 rounded p-3 text-xs text-yellow-800">
        <i class="fas fa-exclamation-circle"></i> <strong>Bahaya Div Overflow:</strong> Sebelum menjalankan <code>DIV</code>, pastikan untuk membersihkan register bagian atas (misal membersihkan EDX/RDX) dengan nilai 0. Jika hasil bagi melampaui kapasitas register penampung, CPU akan mengalami crash hardware akibat *Division Exception* (Division by Zero/Overflow).
      </div>
    </div>

    <!-- 4. IMUL -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">4</span>
        IMUL – Perkalian Bertanda (Signed)
      </h3>
      <p class="text-sm text-slate-700 mb-3">
        Instruksi <code>IMUL</code> digunakan untuk perkalian bilangan bertanda (signed, komplemen dua). 
        Berbeda dengan <code>MUL</code>, <code>IMUL</code> memiliki 3 varian sintaks penulisan yang sangat fleksibel:
      </p>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="border border-slate-200 rounded p-3.5 bg-slate-50">
          <h4 class="font-bold text-slate-700 text-xs uppercase mb-1.5">Varian 1 Operand</h4>
          <div class="bg-slate-800 text-[11px] font-mono text-emerald-400 p-2 rounded mb-2">IMUL source</div>
          <p class="text-xs text-slate-600 leading-relaxed">Operasi signed murni. Perilaku sama persis seperti MUL (menggunakan register implisit AL/AX/EAX/RAX).</p>
        </div>
        <div class="border border-slate-200 rounded p-3.5 bg-slate-50">
          <h4 class="font-bold text-slate-700 text-xs uppercase mb-1.5">Varian 2 Operand</h4>
          <div class="bg-slate-800 text-[11px] font-mono text-emerald-400 p-2 rounded mb-2">IMUL dest, src</div>
          <p class="text-xs text-slate-600 leading-relaxed">Menyimpan hasil perkalian langsung ke register <code>dest</code> (sumber bisa berupa register, memori, atau immediate).</p>
        </div>
        <div class="border border-slate-200 rounded p-3.5 bg-slate-50">
          <h4 class="font-bold text-slate-700 text-xs uppercase mb-1.5">Varian 3 Operand</h4>
          <div class="bg-slate-800 text-[11px] font-mono text-emerald-400 p-2 rounded mb-2">IMUL dest, src, imm</div>
          <p class="text-xs text-slate-600 leading-relaxed">Mengalikan operand <code>src</code> dengan konstanta <code>imm</code>, lalu menyimpan hasilnya ke register <code>dest</code>.</p>
        </div>
      </div>

      <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200 rounded">IMUL EAX, EBX     ; EAX = EAX * EBX (Signed 32-bit)
IMUL RAX, RBX, 5  ; RAX = RBX * 5</pre>
    </div>

    <!-- 5. Perbandingan C++ vs Assembly -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">5</span>
        Perbandingan Kode Aritmetika C++ vs Assembly
      </h3>
      <p class="text-sm text-slate-700 mb-4">
        Contoh bagaimana compiler menerjemahkan baris operasi aritmetika C++ menjadi instruksi mesin assembly x86-64:
      </p>

      <CodePanel 
        cppCode='int a = 10, b = 20;
int c = a + b;      // ADD
int d = b - a;      // SUB
a++;                // INC
b--;                // DEC
int e = a * 5;      // IMUL (signed)
unsigned int f = 15;
unsigned int g = 3;
unsigned int h = f / g;  // DIV'
        asmX64="MOV EAX, 10
MOV EBX, 20
ADD EAX, EBX        ; c = a + b
MOV ECX, EBX
SUB ECX, EAX        ; d = b - a
INC EAX             ; a++
DEC EBX             ; b--
IMUL EAX, EBX, 5   ; e = b * 5 (signed)
MOV EAX, 15
MOV ECX, 3
XOR EDX, EDX        ; clear high part
DIV ECX             ; h = 15 / 3 (unsigned)"
        asmX86="MOV EAX, 10
MOV EBX, 20
ADD EAX, EBX        ; c = a + b
MOV ECX, EBX
SUB ECX, EAX        ; d = b - a
INC EAX             ; a++
DEC EBX             ; b--
IMUL EAX, EBX, 5   ; e = b * 5 (signed)
MOV EAX, 15
MOV ECX, 3
XOR EDX, EDX        ; clear high part
DIV ECX             ; h = 15 / 3 (unsigned)"
        :currentArch="currentArch"
      />
    </div>

    <!-- 6. Latihan Praktis (Simulasi Debugger) -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">6</span>
        Simulasi Debugger: Aritmetika & Variabel Lokal (Stack)
      </h3>
      <p class="text-sm text-slate-600 mb-4">
        Gunakan simulator debugger di bawah ini untuk melihat jalannya alokasi memori lokal di stack, 
        serta eksekusi aritmetika <code>ADD</code> dan <code>SUB</code> secara bertahap pada variabel <code>a</code>.
      </p>

      <div v-if="currentSim" class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-lg">
        <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
          <span>Simulasi Aritmetika & Stack</span>
          <span class="text-blue-400 normal-case">{{ currentArch === 'x64' ? 'x64 (64-bit)' : 'x86 (32-bit)' }}</span>
        </div>

        <DebuggerPanel
          v-if="currentStepData"
          :mode="currentArch"
          :codeLines="currentSim.code"
          :activeLine="currentStepData.l"
          :registers="currentStepData.regs"
          :disassembly="currentStepData.disasm"
          :stack="currentStepData.stack"
          :terminal="currentStepData.term"
          class="!border-none !rounded-none shadow-none h-[500px]"
        />

        <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
          <div class="text-slate-400 text-xs">Step {{ stepVal + 1 }} of {{ stepsCount }}</div>
          <div class="flex gap-2">
            <button @click="prevStep" :disabled="stepVal === 0" class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">&lt; Mundur</button>
            <button @click="nextStep" :disabled="stepVal === stepsCount - 1" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">Langkah Selanjutnya ⏭️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DebuggerPanel from './DebuggerPanel.vue'
import CodePanel from './CodePanel.vue'
import { animDb } from '../data/cpp_asm_data.js'

const props = defineProps({
  currentArch: {
    type: String,
    default: 'x64'
  }
})

// === DEBUGGER STATE ===
const stepVal = ref(0)

const currentSim = computed(() => animDb.arith[props.currentArch])
const currentStepData = computed(() => {
  const sim = currentSim.value
  return sim && sim.steps ? sim.steps[stepVal.value] : null
})
const stepsCount = computed(() => {
  const sim = currentSim.value
  return sim && sim.steps ? sim.steps.length : 0
})

function nextStep() {
  if (stepVal.value < stepsCount.value - 1) stepVal.value++
}
function prevStep() {
  if (stepVal.value > 0) stepVal.value--
}

watch(() => props.currentArch, () => {
  stepVal.value = 0
})
</script>

<style scoped>
</style>
