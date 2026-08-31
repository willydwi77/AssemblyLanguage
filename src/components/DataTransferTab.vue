<template>
  <div class="data-transfer-tab pb-10">
    <h2 class="section-title">Data Transfer Instructions</h2>
    <p class="content-desc mb-6">Instruksi pemindahan data merupakan fondasi dari assembly, digunakan untuk menyalin data antara register, memori, dan nilai konstanta.</p>

    <!-- 1. MOV & LEA - Pemindahan Data vs Kalkulasi Alamat -->
    <div class="mb-10 border-b pb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">1</span>
        MOV & LEA - Pemindahan Data vs Kalkulasi Alamat
      </h3>
      
      <!-- Penjelasan MOV -->
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2"><strong>MOV (Move Data):</strong> Memindahkan (menyalin) data dari <em>source</em> ke <em>destination</em>. Data bisa berupa konstanta (immediate), register, atau alamat memori.</p>
        <div class="bg-slate-800 rounded p-3 mb-2">
          <code class="text-green-400 font-mono text-sm">MOV destination, source</code>
        </div>
        <p class="text-xs text-red-500 font-semibold"><i class="fas fa-exclamation-triangle"></i> Aturan Penting: Tidak bisa melakukan MOV langsung dari memori ke memori. Tujuan tidak boleh berupa nilai immediate.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <!-- Examples -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Register ke Register</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV RAX, RBX   ; RAX = RBX
MOV EAX, ECX   ; EAX = ECX</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Immediate ke Register</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV RAX, 10    ; RAX = 10
MOV AL, 'A'    ; AL = 65</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Memori ke Register</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV RAX, [var] ; RAX = nilai var
MOV BX, [RBP-4]; BX = nilai stack</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Register ke Memori</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV [var], RAX ; var = RAX
MOV [RBP-8], EAX</pre>
        </div>
      </div>

      <!-- Penjelasan LEA -->
      <div class="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2"><strong>LEA (Load Effective Address):</strong> Menghitung alamat memori dan menyimpannya ke register, <strong>TIDAK MENGAKSES (membaca/menulis)</strong> nilai pada memori tersebut. Sering digunakan untuk aritmetika pointer dan array, serta optimasi perhitungan matematis sederhana karena dijalankan oleh unit Address Generation (AGU) yang sangat cepat.</p>
        <pre class="p-3 mt-2 text-xs font-mono bg-slate-800 text-slate-200 rounded">MOV RAX, [RBP-8] ; Membaca NILAI dari memori RBP-8
LEA RAX, [RBP-8] ; Menyimpan ALAMAT RBP-8 ke RAX</pre>
      </div>

      <!-- Simulator Pembanding LEA vs MOV -->
      <LEAVisualizer :mode="currentArch" class="mt-4" />
    </div>

    <!-- 2. PUSH & POP -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">2</span>
        PUSH & POP - Operasi Stack
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-slate-50 border border-slate-200 rounded p-4">
          <h4 class="font-bold text-slate-700 text-sm mb-2">PUSH</h4>
          <p class="text-xs text-slate-600 mb-2">Menyimpan nilai ke dalam Stack (LIFO). Stack tumbuh ke bawah, sehingga PUSH akan mengurangi nilai <code>RSP</code> sebesar ukuran data.</p>
          <div class="bg-slate-800 rounded p-2 mb-2"><code class="text-blue-300 font-mono text-xs">PUSH RAX ; RSP -= 8, [RSP] = RAX</code></div>
        </div>
        <div class="bg-slate-50 border border-slate-200 rounded p-4">
          <h4 class="font-bold text-slate-700 text-sm mb-2">POP</h4>
          <p class="text-xs text-slate-600 mb-2">Mengambil nilai dari puncak Stack. Ini membaca nilai pada <code>RSP</code> saat ini, kemudian menambah <code>RSP</code>.</p>
          <div class="bg-slate-800 rounded p-2 mb-2"><code class="text-blue-300 font-mono text-xs">POP RBX  ; RBX = [RSP], RSP += 8</code></div>
        </div>
      </div>

      <!-- Analogi Stack (LIFO) Interaktif Reusable -->
      <StackVisualizer :mode="currentArch" class="mt-4" />
    </div>

    <!-- 3. XCHG -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">3</span>
        XCHG - Tukar Nilai (Exchange)
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2"><code>XCHG</code> menukar nilai antara dua operand tanpa memerlukan register sementara (seperti variabel <code>temp</code>). Sangat cepat dan berguna untuk operasi atomik atau sorting.</p>
        <div class="bg-slate-800 rounded p-3">
          <code class="text-green-400 font-mono text-sm">XCHG operand1, operand2</code>
        </div>
      </div>
      <XCHGVisualizer :mode="currentArch" class="mt-4" />
    </div>



    <!-- 4. Latihan Praktis (Simulations) -->
    <div class="mb-8 border-t pt-8">
      <h3 class="text-xl font-bold text-slate-800 mb-6">Latihan Praktis & Simulasi</h3>

      <!-- Simulasi 1: Swap -->
      <div class="mb-10">
        <h4 class="text-md font-bold text-slate-700 mb-3">Latihan 1: Fungsi Swap (Menukar Nilai)</h4>
        <p class="text-sm text-slate-600 mb-4">Fungsi ini mendemonstrasikan bagaimana menukar dua nilai memori (pointer) menggunakan register dan instruksi <code>XCHG</code>.</p>
        
        <div class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-lg">
          <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
            <span>Simulasi Swap Memory</span>
            <span class="text-blue-400 normal-case">{{ currentArch === 'x64' ? 'x64' : 'x86' }}</span>
          </div>
          
          <DebuggerPanel
            v-if="stepSwapData"
            :mode="currentArch"
            :codeLines="swapCodeLines"
            :activeLine="stepSwapData.l"
            :registers="stepSwapData.regs"
            :disassembly="stepSwapData.disasm"
            :stack="stepSwapData.stack"
            class="!border-none !rounded-none shadow-none h-[400px]"
          />
          <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
            <div class="text-slate-400 text-xs">Step {{ stepSwap + 1 }} of {{ swapStepsCount }}</div>
            <div class="flex gap-2">
              <button @click="prevStepSwap" :disabled="stepSwap === 0" class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">&lt; Mundur</button>
              <button @click="nextStepSwap" :disabled="stepSwap === swapStepsCount - 1" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">Langkah Selanjutnya ⏭️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulasi 2: Push/Pop -->
      <div class="mb-10">
        <h4 class="text-md font-bold text-slate-700 mb-3">Latihan 2: Manajemen Stack (PUSH & POP)</h4>
        <p class="text-sm text-slate-600 mb-4">Perhatikan bagaimana nilai RSP/ESP berubah dan nilai memori di Stack diisi saat melakukan PUSH, lalu bagaimana LIFO bekerja saat POP.</p>
        
        <div class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-lg">
          <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
            <span>Simulasi Stack (PUSH & POP)</span>
            <span class="text-blue-400 normal-case">{{ currentArch === 'x64' ? 'x64' : 'x86' }}</span>
          </div>
          
          <DebuggerPanel
            v-if="stepPushData"
            :mode="currentArch"
            :codeLines="pushCodeLines"
            :activeLine="stepPushData.l"
            :registers="stepPushData.regs"
            :disassembly="stepPushData.disasm"
            :stack="stepPushData.stack"
            class="!border-none !rounded-none shadow-none h-[400px]"
          />
          <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
            <div class="text-slate-400 text-xs">Step {{ stepPushPop + 1 }} of {{ pushStepsCount }}</div>
            <div class="flex gap-2">
              <button @click="prevStepPushPop" :disabled="stepPushPop === 0" class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">&lt; Mundur</button>
              <button @click="nextStepPushPop" :disabled="stepPushPop === pushStepsCount - 1" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">Langkah Selanjutnya ⏭️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Simulasi 3: LEA -->
      <div class="mb-10">
        <h4 class="text-md font-bold text-slate-700 mb-3">Latihan 3: Kalkulasi LEA (Array)</h4>
        <p class="text-sm text-slate-600 mb-4">Mengakses array dengan menggunakan kalkulasi matematika di instruksi LEA tanpa membaca memori secara langsung.</p>
        
        <div class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-lg">
          <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
            <span>Simulasi Load Effective Address</span>
            <span class="text-blue-400 normal-case">{{ currentArch === 'x64' ? 'x64' : 'x86' }}</span>
          </div>
          
          <DebuggerPanel
            v-if="stepLeaData"
            :mode="currentArch"
            :codeLines="leaCodeLines"
            :activeLine="stepLeaData.l"
            :registers="stepLeaData.regs"
            :disassembly="stepLeaData.disasm"
            :stack="stepLeaData.stack"
            class="!border-none !rounded-none shadow-none h-[400px]"
          />
          <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
            <div class="text-slate-400 text-xs">Step {{ stepLea + 1 }} of {{ leaStepsCount }}</div>
            <div class="flex gap-2">
              <button @click="prevStepLea" :disabled="stepLea === 0" class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">&lt; Mundur</button>
              <button @click="nextStepLea" :disabled="stepLea === leaStepsCount - 1" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">Langkah Selanjutnya ⏭️</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DebuggerPanel from './DebuggerPanel.vue'
import StackVisualizer from './StackVisualizer.vue'
import LEAVisualizer from './LEAVisualizer.vue'
import XCHGVisualizer from './XCHGVisualizer.vue'

const props = defineProps({
  currentArch: {
    type: String,
    default: 'x64'
  }
})

// === STATE ===
const stepSwap = ref(0)
const stepPushPop = ref(0)
const stepLea = ref(0)

// Reset state when arch changes
watch(() => props.currentArch, () => {
  stepSwap.value = 0
  stepPushPop.value = 0
  stepLea.value = 0
})

// === METHODS ===
function nextStepSwap() { if (stepSwap.value < simSwap[props.currentArch].steps.length - 1) stepSwap.value++ }
function prevStepSwap() { if (stepSwap.value > 0) stepSwap.value-- }

function nextStepPushPop() { if (stepPushPop.value < simPushPop[props.currentArch].steps.length - 1) stepPushPop.value++ }
function prevStepPushPop() { if (stepPushPop.value > 0) stepPushPop.value-- }

function nextStepLea() { if (stepLea.value < simLea[props.currentArch].steps.length - 1) stepLea.value++ }
function prevStepLea() { if (stepLea.value > 0) stepLea.value-- }

const simSwap = {
  x64: {
    code: [
      "swap:",
      "  ; rdi = alamat a (0x00402000)",
      "  ; rsi = alamat b (0x00402008)",
      "  mov rax, [rdi]   ; Ambil *a",
      "  xchg rax, [rsi]  ; Tukar dengan *b",
      "  mov [rdi], rax   ; Simpan ke *a",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { rdi: "0x00402000", rsi: "0x00402008", rax: "0x00" }, disasm: [{ addr: "00400100", bytes: "55", inst: "swap:", active: true }], stack: [{ addr: "00402000", bytes: "0A 00 00 00 00 00 00 00", ascii: "........" }, { addr: "00402008", bytes: "14 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 3, regs: { rdi: "0x00402000", rsi: "0x00402008", rax: "0x000000000000000A" }, disasm: [{ addr: "00400102", bytes: "48 8B 07", inst: "mov rax, [rdi]", active: true }], stack: [{ addr: "00402000", bytes: "0A 00 00 00 00 00 00 00", ascii: "........" }, { addr: "00402008", bytes: "14 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 4, regs: { rdi: "0x00402000", rsi: "0x00402008", rax: "0x0000000000000014" }, disasm: [{ addr: "00400105", bytes: "48 87 06", inst: "xchg rax, [rsi]", active: true }], stack: [{ addr: "00402000", bytes: "0A 00 00 00 00 00 00 00", ascii: "........" }, { addr: "00402008", bytes: "0A 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 5, regs: { rdi: "0x00402000", rsi: "0x00402008", rax: "0x0000000000000014" }, disasm: [{ addr: "00400108", bytes: "48 89 07", inst: "mov [rdi], rax", active: true }], stack: [{ addr: "00402000", bytes: "14 00 00 00 00 00 00 00", ascii: "........" }, { addr: "00402008", bytes: "0A 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 6, regs: { rdi: "0x00402000", rsi: "0x00402008", rax: "0x0000000000000014" }, disasm: [{ addr: "0040010B", bytes: "C3", inst: "ret", active: true }], stack: [] }
    ]
  },
  x86: {
    code: [
      "swap:",
      "  ; edi = alamat a (0x00402000)",
      "  ; esi = alamat b (0x00402004)",
      "  mov eax, [edi]",
      "  xchg eax, [esi]",
      "  mov [edi], eax",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { edi: "0x00402000", esi: "0x00402004", eax: "0x00" }, disasm: [{ addr: "00400100", bytes: "55", inst: "swap:", active: true }], stack: [{ addr: "00402000", bytes: "0A 00 00 00", ascii: "...." }, { addr: "00402004", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 3, regs: { edi: "0x00402000", esi: "0x00402004", eax: "0x0000000A" }, disasm: [{ addr: "00400102", bytes: "8B 07", inst: "mov eax, [edi]", active: true }], stack: [{ addr: "00402000", bytes: "0A 00 00 00", ascii: "...." }, { addr: "00402004", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 4, regs: { edi: "0x00402000", esi: "0x00402004", eax: "0x00000014" }, disasm: [{ addr: "00400104", bytes: "87 06", inst: "xchg eax, [esi]", active: true }], stack: [{ addr: "00402000", bytes: "0A 00 00 00", ascii: "...." }, { addr: "00402004", bytes: "0A 00 00 00", ascii: "...." }] },
      { l: 5, regs: { edi: "0x00402000", esi: "0x00402004", eax: "0x00000014" }, disasm: [{ addr: "00400106", bytes: "89 07", inst: "mov [edi], eax", active: true }], stack: [{ addr: "00402000", bytes: "14 00 00 00", ascii: "...." }, { addr: "00402004", bytes: "0A 00 00 00", ascii: "...." }] },
      { l: 6, regs: { edi: "0x00402000", esi: "0x00402004", eax: "0x00000014" }, disasm: [{ addr: "00400108", bytes: "C3", inst: "ret", active: true }], stack: [] }
    ]
  }
}

const simPushPop = {
  x64: {
    code: [
      "main:",
      "  mov rax, 100",
      "  mov rbx, 200",
      "  push rax       ; RSP -= 8",
      "  push rbx       ; RSP -= 8",
      "  pop rcx        ; RCX = 200, RSP += 8",
      "  pop rdx        ; RDX = 100, RSP += 8",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { rax: "0x00", rbx: "0x00", rcx: "0x00", rdx: "0x00", rsp: "0x00007FFFFFFFE000" }, disasm: [{ addr: "00400100", bytes: "55", inst: "main:", active: true }], stack: [] },
      { l: 1, regs: { rax: "0x0000000000000064", rbx: "0x00", rcx: "0x00", rdx: "0x00", rsp: "0x00007FFFFFFFE000" }, disasm: [{ addr: "00400101", bytes: "48 C7 C0 64...", inst: "mov rax, 100", active: true }], stack: [] },
      { l: 2, regs: { rax: "0x0000000000000064", rbx: "0x00000000000000C8", rcx: "0x00", rdx: "0x00", rsp: "0x00007FFFFFFFE000" }, disasm: [{ addr: "00400108", bytes: "48 C7 C3 C8...", inst: "mov rbx, 200", active: true }], stack: [] },
      { l: 3, regs: { rax: "0x0000000000000064", rbx: "0x00000000000000C8", rcx: "0x00", rdx: "0x00", rsp: "0x00007FFFFFFFDFF8" }, disasm: [{ addr: "0040010F", bytes: "50", inst: "push rax", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "64 00 00 00 00 00 00 00", ascii: "d......." }] },
      { l: 4, regs: { rax: "0x0000000000000064", rbx: "0x00000000000000C8", rcx: "0x00", rdx: "0x00", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "00400110", bytes: "53", inst: "push rbx", active: true }], stack: [{ addr: "00007FFFFFFFDFF0", bytes: "C8 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 5, regs: { rax: "0x0000000000000064", rbx: "0x00000000000000C8", rcx: "0x00000000000000C8", rdx: "0x00", rsp: "0x00007FFFFFFFDFF8" }, disasm: [{ addr: "00400111", bytes: "59", inst: "pop rcx", active: true }], stack: [] },
      { l: 6, regs: { rax: "0x0000000000000064", rbx: "0x00000000000000C8", rcx: "0x00000000000000C8", rdx: "0x0000000000000064", rsp: "0x00007FFFFFFFE000" }, disasm: [{ addr: "00400112", bytes: "5A", inst: "pop rdx", active: true }], stack: [] },
      { l: 7, regs: { rsp: "0x00007FFFFFFFE008" }, disasm: [{ addr: "00400113", bytes: "C3", inst: "ret", active: true }], stack: [] }
    ]
  },
  x86: {
    code: [
      "main:",
      "  mov eax, 100",
      "  mov ebx, 200",
      "  push eax       ; ESP -= 4",
      "  push ebx       ; ESP -= 4",
      "  pop ecx        ; ECX = 200, ESP += 4",
      "  pop edx        ; EDX = 100, ESP += 4",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", esp: "0x00402000" }, disasm: [{ addr: "00400100", bytes: "55", inst: "main:", active: true }], stack: [] },
      { l: 1, regs: { eax: "0x00000064", ebx: "0x00", ecx: "0x00", edx: "0x00", esp: "0x00402000" }, disasm: [{ addr: "00400101", bytes: "B8 64 00 00 00", inst: "mov eax, 100", active: true }], stack: [] },
      { l: 2, regs: { eax: "0x00000064", ebx: "0x000000C8", ecx: "0x00", edx: "0x00", esp: "0x00402000" }, disasm: [{ addr: "00400106", bytes: "BB C8 00 00 00", inst: "mov ebx, 200", active: true }], stack: [] },
      { l: 3, regs: { eax: "0x00000064", ebx: "0x000000C8", ecx: "0x00", edx: "0x00", esp: "0x00401FFC" }, disasm: [{ addr: "0040010B", bytes: "50", inst: "push eax", active: true }], stack: [{ addr: "00401FFC", bytes: "64 00 00 00", ascii: "d..." }] },
      { l: 4, regs: { eax: "0x00000064", ebx: "0x000000C8", ecx: "0x00", edx: "0x00", esp: "0x00401FF8" }, disasm: [{ addr: "0040010C", bytes: "53", inst: "push ebx", active: true }], stack: [{ addr: "00401FF8", bytes: "C8 00 00 00", ascii: "...." }] },
      { l: 5, regs: { eax: "0x00000064", ebx: "0x000000C8", ecx: "0x000000C8", edx: "0x00", esp: "0x00401FFC" }, disasm: [{ addr: "0040010D", bytes: "59", inst: "pop ecx", active: true }], stack: [] },
      { l: 6, regs: { eax: "0x00000064", ebx: "0x000000C8", ecx: "0x000000C8", edx: "0x00000064", esp: "0x00402000" }, disasm: [{ addr: "0040010E", bytes: "5A", inst: "pop edx", active: true }], stack: [] },
      { l: 7, regs: { esp: "0x00402004" }, disasm: [{ addr: "0040010F", bytes: "C3", inst: "ret", active: true }], stack: [] }
    ]
  }
}

const simLea = {
  x64: {
    code: [
      "main:",
      "  ; int matrix[3][4], akses matrix[1][2]",
      "  mov rcx, 1   ; RCX = row (1)",
      "  mov rdx, 2   ; RDX = col (2)",
      "  lea rax, [0x403000] ; alamat dasar matrix",
      "  ",
      "  ; Hitung offset = (row*16 + col*4)",
      "  lea rbx, [rax + rdx*4]",
      "  add rbx, 16",
      "  mov eax, [rbx] ; Ambil nilai",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { rcx: "0x00", rdx: "0x00", rax: "0x00", rbx: "0x00" }, disasm: [{ addr: "00400100", bytes: "55", inst: "main:", active: true }], stack: [] },
      { l: 2, regs: { rcx: "0x0000000000000001", rdx: "0x00", rax: "0x00", rbx: "0x00" }, disasm: [{ addr: "00400101", bytes: "48 C7 C1 01...", inst: "mov rcx, 1", active: true }], stack: [] },
      { l: 3, regs: { rcx: "0x0000000000000001", rdx: "0x0000000000000002", rax: "0x00", rbx: "0x00" }, disasm: [{ addr: "00400108", bytes: "48 C7 C2 02...", inst: "mov rdx, 2", active: true }], stack: [] },
      { l: 4, regs: { rcx: "0x0000000000000001", rdx: "0x0000000000000002", rax: "0x0000000000403000", rbx: "0x00" }, disasm: [{ addr: "0040010F", bytes: "48 8D 05 EA...", inst: "lea rax, [0x403000]", active: true }], stack: [] },
      { l: 7, regs: { rcx: "0x0000000000000001", rdx: "0x0000000000000002", rax: "0x0000000000403000", rbx: "0x0000000000403008" }, disasm: [{ addr: "00400116", bytes: "48 8D 1C 90", inst: "lea rbx, [rax+rdx*4]", active: true }], stack: [] },
      { l: 8, regs: { rcx: "0x0000000000000001", rdx: "0x0000000000000002", rax: "0x0000000000403000", rbx: "0x0000000000403018" }, disasm: [{ addr: "0040011A", bytes: "48 83 C3 10", inst: "add rbx, 16", active: true }], stack: [] },
      { l: 9, regs: { rcx: "0x0000000000000001", rdx: "0x0000000000000002", rax: "0x0000000000000007", rbx: "0x0000000000403018" }, disasm: [{ addr: "0040011E", bytes: "8B 03", inst: "mov eax, [rbx]", active: true }], stack: [{ addr: "00403018", bytes: "07 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 10, regs: {}, disasm: [{ addr: "00400120", bytes: "C3", inst: "ret", active: true }], stack: [] }
    ]
  },
  x86: {
    code: [
      "main:",
      "  ; int matrix[3][4], akses matrix[1][2]",
      "  mov ecx, 1   ; ECX = row (1)",
      "  mov edx, 2   ; EDX = col (2)",
      "  lea eax, [0x403000] ; alamat dasar matrix",
      "  ",
      "  lea ebx, [eax + edx*4]",
      "  add ebx, 16",
      "  mov eax, [ebx]",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { ecx: "0x00", edx: "0x00", eax: "0x00", ebx: "0x00" }, disasm: [{ addr: "00400100", bytes: "55", inst: "main:", active: true }], stack: [] },
      { l: 2, regs: { ecx: "0x00000001", edx: "0x00", eax: "0x00", ebx: "0x00" }, disasm: [{ addr: "00400101", bytes: "B9 01 00 00 00", inst: "mov ecx, 1", active: true }], stack: [] },
      { l: 3, regs: { ecx: "0x00000001", edx: "0x00000002", eax: "0x00", ebx: "0x00" }, disasm: [{ addr: "00400106", bytes: "BA 02 00 00 00", inst: "mov edx, 2", active: true }], stack: [] },
      { l: 4, regs: { ecx: "0x00000001", edx: "0x00000002", eax: "0x00403000", ebx: "0x00" }, disasm: [{ addr: "0040010B", bytes: "8D 05 00 30 40 00", inst: "lea eax, [0x403000]", active: true }], stack: [] },
      { l: 6, regs: { ecx: "0x00000001", edx: "0x00000002", eax: "0x00403000", ebx: "0x00403008" }, disasm: [{ addr: "00400111", bytes: "8D 1C 90", inst: "lea ebx, [eax+edx*4]", active: true }], stack: [] },
      { l: 7, regs: { ecx: "0x00000001", edx: "0x00000002", eax: "0x00403000", ebx: "0x00403018" }, disasm: [{ addr: "00400114", bytes: "83 C3 10", inst: "add ebx, 16", active: true }], stack: [] },
      { l: 8, regs: { ecx: "0x00000001", edx: "0x00000002", eax: "0x00000007", ebx: "0x00403018" }, disasm: [{ addr: "00400117", bytes: "8B 03", inst: "mov eax, [ebx]", active: true }], stack: [{ addr: "00403018", bytes: "07 00 00 00", ascii: "...." }] },
      { l: 9, regs: {}, disasm: [{ addr: "00400119", bytes: "C3", inst: "ret", active: true }], stack: [] }
    ]
  }
}

// === COMPUTEDS ===
const stepSwapData = computed(() => {
  const archData = simSwap[props.currentArch]
  return archData && archData.steps ? archData.steps[stepSwap.value] : null
})
const stepPushData = computed(() => {
  const archData = simPushPop[props.currentArch]
  return archData && archData.steps ? archData.steps[stepPushPop.value] : null
})
const stepLeaData = computed(() => {
  const archData = simLea[props.currentArch]
  return archData && archData.steps ? archData.steps[stepLea.value] : null
})

const swapCodeLines = computed(() => {
  const archData = simSwap[props.currentArch]
  return archData ? archData.code : []
})
const swapStepsCount = computed(() => {
  const archData = simSwap[props.currentArch]
  return archData && archData.steps ? archData.steps.length : 0
})

const pushCodeLines = computed(() => {
  const archData = simPushPop[props.currentArch]
  return archData ? archData.code : []
})
const pushStepsCount = computed(() => {
  const archData = simPushPop[props.currentArch]
  return archData && archData.steps ? archData.steps.length : 0
})

const leaCodeLines = computed(() => {
  const archData = simLea[props.currentArch]
  return archData ? archData.code : []
})
const leaStepsCount = computed(() => {
  const archData = simLea[props.currentArch]
  return archData && archData.steps ? archData.steps.length : 0
})
</script>
