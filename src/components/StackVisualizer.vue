<template>
  <div class="stack-visualizer bg-slate-900 rounded-lg border border-slate-800 text-slate-100 p-5 flex flex-col md:flex-row gap-6 shadow-xl">
    <!-- Panel Kontrol (Kiri) -->
    <div class="flex-1 flex flex-col justify-between">
      <div>
        <h4 class="font-bold text-sm mb-2 text-blue-400 flex items-center gap-1.5">
          <i class="fas fa-layer-group"></i> Stack Frame 
        </h4>
        <p class="text-xs text-slate-400 mb-4 leading-relaxed">
          Eksperimen interaktif untuk memahami pembentukan <strong>Stack Frame</strong>. 
          Gunakan perintah di bawah ini untuk melihat bagaimana register <strong>{{ bpName }}</strong> (Base Pointer) 
          dan <strong>{{ spName }}</strong> (Stack Pointer) melacak alamat memori saat fungsi berjalan.
        </p>

        <!-- PUSH / POP -->
        <div class="mb-4">
          <label class="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Operasi Dasar Stack</label>
          <div class="flex gap-2">
            <input 
              v-model="inputValue" 
              type="text" 
              placeholder="Nilai (misal: 0x99, EAX)" 
              class="bg-slate-800 border border-slate-700 text-white rounded px-3 py-1.5 text-xs w-full focus:outline-none focus:border-blue-500 font-mono text-slate-200"
              @keyup.enter="handlePush"
            />
            <button @click="handlePush" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition-colors whitespace-nowrap">
              PUSH 📥
            </button>
            <button @click="handlePop" :disabled="spIndex <= 3" class="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors whitespace-nowrap">
              POP 📤
            </button>
          </div>
        </div>

        <!-- SUB / ADD ESP -->
        <div class="mb-4">
          <label class="block text-[11px] text-slate-500 font-bold uppercase mb-1.5">Alokasi Frame Lokal (Aritmetika Pointer)</label>
          <div class="grid grid-cols-2 gap-2 mb-2">
            <button @click="handleSub(8)" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-mono text-left text-slate-300">
              SUB {{ spName }}, {{ mode === 'x64' ? 16 : 8 }}
            </button>
            <button @click="handleSub(16)" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-mono text-left text-slate-300">
              SUB {{ spName }}, {{ mode === 'x64' ? 32 : 16 }}
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <button @click="handleAdd(8)" :disabled="!hasReservedSpace" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 rounded text-xs font-mono text-left text-slate-300">
              ADD {{ spName }}, {{ mode === 'x64' ? 16 : 8 }}
            </button>
            <button @click="handleAdd(16)" :disabled="!hasReservedSpace" class="px-2 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 disabled:opacity-40 rounded text-xs font-mono text-left text-slate-300">
              ADD {{ spName }}, {{ mode === 'x64' ? 32 : 16 }}
            </button>
          </div>
        </div>
      </div>

      <!-- Log Operasi -->
      <div class="border-t border-slate-800 pt-3 text-[11px] font-mono text-slate-400 mt-2">
        <div class="flex justify-between mb-1">
          <span>Register {{ bpName }}:</span>
          <span class="text-blue-400 font-bold">{{ bpAddress }}</span>
        </div>
        <div class="flex justify-between mb-1">
          <span>Register {{ spName }}:</span>
          <span class="text-yellow-400 font-bold">{{ spAddress }}</span>
        </div>
        <div class="flex justify-between">
          <span>Ukuran Frame:</span>
          <span class="text-green-400 font-bold">{{ frameSize }} byte</span>
        </div>
        <div class="mt-2 bg-slate-950 p-2 rounded border border-slate-850 text-slate-300 min-h-[40px] flex items-center">
          <span class="text-[10px]"><span class="text-slate-500">></span> {{ opLog }}</span>
        </div>
      </div>
    </div>

    <!-- Visual Stack (Kanan) -->
    <div class="flex-1 flex flex-col items-center justify-end">
      <div class="text-[10px] text-slate-500 font-bold mb-2 uppercase tracking-wider">Arah Pertumbuhan Stack (Alamat Menurun)</div>
      
      <!-- Stack Grid Container -->
      <div class="w-full max-w-[320px] border border-slate-800 rounded-lg p-3 bg-slate-950 flex flex-col-reverse justify-start min-h-[260px] gap-1.5 relative">
        <TransitionGroup name="stack-list">
          <div 
            v-for="(item, idx) in stackItems" 
            :key="item.id"
            class="flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono border relative group transition-all duration-300"
            :class="getItemClass(idx)"
          >
            <!-- Border bracket stack frame -->
            <div 
              v-if="isInStackFrame(idx)" 
              class="absolute left-0 top-0 bottom-0 w-[4px] bg-emerald-500/80 rounded-l"
              title="Bagian dari Stack Frame"
            ></div>

            <div class="flex items-center gap-2 min-w-0 z-10">
              <span class="text-slate-500 text-[10px] shrink-0">[{{ item.addr }}]</span>
              <span class="font-bold truncate text-slate-200">{{ item.val }}</span>
            </div>

            <!-- Pointer Flags -->
            <div class="flex items-center gap-1 z-10 shrink-0 select-none">
              <!-- ESP/RSP Pointer Flag -->
              <span 
                v-if="idx === spIndex" 
                class="text-[9px] bg-yellow-600 text-white font-extrabold px-1 py-0.5 rounded shadow flex items-center gap-0.5"
              >
                &larr; {{ spName }}
              </span>
              
              <!-- EBP/RBP Pointer Flag -->
              <span 
                v-if="idx === bpIndex" 
                class="text-[9px] bg-blue-600 text-white font-extrabold px-1 py-0.5 rounded shadow flex items-center gap-0.5"
              >
                &larr; {{ bpName }}
              </span>
            </div>
          </div>
        </TransitionGroup>

        <!-- Range Stack Frame Indicator (Floating bracket) -->
        <div v-if="frameRangeActive" class="absolute -right-2 top-0 bottom-0 flex items-center pointer-events-none">
          <!-- Visually indicated inside the items instead -->
        </div>

        <div v-if="stackItems.length === 0" class="flex-1 flex items-center justify-center text-xs text-slate-600 italic">
          Stack Kosong
        </div>
      </div>
      <div class="text-[10px] text-slate-500 mt-2">Alamat Memori Tinggi (Awal/Base)</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'x64' // 'x64' or 'x86'
  }
})

// === REGISTER NAMES ===
const bpName = computed(() => props.mode === 'x64' ? 'RBP' : 'EBP')
const spName = computed(() => props.mode === 'x64' ? 'RSP' : 'ESP')
const stepSize = computed(() => props.mode === 'x64' ? 8 : 4)

// === STATE ===
const stackItems = ref([])
const inputValue = ref("")
const nextId = ref(10)
const opLog = ref("Menunggu instruksi...")

// Indeks pointer saat ini pada list
const spIndex = ref(2)
const bpIndex = ref(1)

// === COMPUTED VALUES ===
const bpAddress = computed(() => {
  const item = stackItems.value[bpIndex.value]
  return item ? item.addr : "N/A"
})

const spAddress = computed(() => {
  const item = stackItems.value[spIndex.value]
  return item ? item.addr : "N/A"
})

const frameSize = computed(() => {
  const bpItem = stackItems.value[bpIndex.value]
  const spItem = stackItems.value[spIndex.value]
  if (!bpItem || !spItem) return 0
  const bpVal = parseInt(bpItem.addr, 16)
  const spVal = parseInt(spItem.addr, 16)
  return Math.max(0, bpVal - spVal)
})

const frameRangeActive = computed(() => {
  return spIndex.value > bpIndex.value
})

const hasReservedSpace = computed(() => {
  // Check if there are any empty/reserved local variables slots above Saved BP
  return stackItems.value.some((item, idx) => idx > bpIndex.value && item.type === 'reserved')
})

// === WATCHERS ===
watch(() => props.mode, () => {
  resetStack()
}, { immediate: true })

onMounted(() => {
  resetStack()
})

// === RESET LOGIC ===
function resetStack() {
  nextId.value = 10
  if (props.mode === 'x64') {
    stackItems.value = [
      { id: 1, addr: "0x7FFFFFFFE010", val: "Argumen Fungsi / Main Caller", type: "arg" },
      { id: 2, addr: "0x7FFFFFFFE008", val: "Return Address (main)", type: "ret" },
      { id: 3, addr: "0x7FFFFFFFE000", val: "Saved RBP", type: "bp" },
      { id: 4, addr: "0x7FFFFFFFDFF8", val: "Empty Slot (Puncak Awal)", type: "empty" }
    ]
    bpIndex.value = 2 // index 2 is "Saved RBP"
    spIndex.value = 3 // index 3 is "Empty Slot"
  } else {
    stackItems.value = [
      { id: 1, addr: "0x0040200C", val: "Argumen Fungsi / Main Caller", type: "arg" },
      { id: 2, addr: "0x00402008", val: "Return Address (main)", type: "ret" },
      { id: 3, addr: "0x00402004", val: "Saved EBP", type: "bp" },
      { id: 4, addr: "0x00402000", val: "Empty Slot (Puncak Awal)", type: "empty" }
    ]
    bpIndex.value = 2
    spIndex.value = 3
  }
  opLog.value = "Visualizer di-reset untuk arsitektur " + props.mode.toUpperCase()
}

// === OPERATIONS ===

function handlePush() {
  const val = inputValue.value.trim() || "0x" + Math.floor(Math.random() * 256).toString(16).toUpperCase()
  
  // Ambil alamat pointer RSP/ESP saat ini
  const currentSpItem = stackItems.value[spIndex.value]
  if (!currentSpItem) return
  
  const currentSpAddr = parseInt(currentSpItem.addr, 16)
  
  // Alamat baru = RSP - stepSize
  const nextAddr = "0x" + (currentSpAddr - stepSize.value).toString(16).toUpperCase()
  
  // Jika slot SP saat ini 'empty', isi slot tersebut dan buat slot baru di atasnya
  if (currentSpItem.type === 'empty') {
    currentSpItem.val = val
    currentSpItem.type = 'data'
    
    // Tambah slot empty baru di atasnya (tumpukan tumbuh ke atas dalam visual, alamat mengecil)
    stackItems.value.push({
      id: nextId.value++,
      addr: nextAddr,
      val: `Empty Slot`,
      type: 'empty'
    })
    spIndex.value++
  } else {
    // Jika tidak empty (karena SUB ESP alokasi), cari slot empty teratas
    const lastItem = stackItems.value[stackItems.value.length - 1]
    const lastAddr = parseInt(lastItem.addr, 16)
    const newAddr = "0x" + (lastAddr - stepSize.value).toString(16).toUpperCase()
    
    stackItems.value.push({
      id: nextId.value++,
      addr: newAddr,
      val: val,
      type: 'data'
    })
    spIndex.value = stackItems.value.length - 1
  }

  inputValue.value = ""
  opLog.value = `PUSH: Menyimpan '${val}' di alamat ${currentSpItem.addr}. Register ${spName.value} bergeser turun ke alamat lebih rendah.`
}

function handlePop() {
  if (spIndex.value <= 3) {
    opLog.value = "POP Gagal: Stack Frame dasar telah tercapai."
    return
  }

  // Element to pop is right below the stack pointer
  const poppedItem = stackItems.value[spIndex.value - 1]
  if (!poppedItem) return

  const poppedVal = poppedItem.val

  // If the top element is an 'empty' boundary, remove it from stackItems
  if (stackItems.value[spIndex.value] && stackItems.value[spIndex.value].type === 'empty') {
    stackItems.value.pop()
  }

  // Convert the popped slot to the new empty boundary slot
  poppedItem.val = "Empty Slot"
  poppedItem.type = "empty"
  
  // Decrement stack pointer index
  spIndex.value--
  
  opLog.value = `POP: Mengambil data '${poppedVal}' dari stack. Register ${spName.value} bergeser naik ke alamat lebih tinggi.`
}

function handleSub(bytes) {
  // Alokasi memori lokal (SUB ESP/RSP, bytes)
  // Menambahkan slot kosong dengan tipe 'reserved'
  const numSlots = bytes / (props.mode === 'x64' ? 8 : 4)
  
  // Pastikan slot empty paling atas dihapus sementara untuk alokasi terstruktur
  let lastItem = stackItems.value[stackItems.value.length - 1]
  if (lastItem.type === 'empty') {
    stackItems.value.pop()
  }

  let lastAddr = parseInt(stackItems.value[stackItems.value.length - 1].addr, 16)

  for (let i = 0; i < numSlots; i++) {
    lastAddr -= stepSize.value
    const addrStr = "0x" + lastAddr.toString(16).toUpperCase()
    stackItems.value.push({
      id: nextId.value++,
      addr: addrStr,
      val: `Local Var Slot [${bpName.value}-${(stackItems.value.length - bpIndex.value) * stepSize.value}]`,
      type: 'reserved'
    })
  }

  // Tambahkan kembali pembatas empty paling atas
  lastAddr -= stepSize.value
  const addrStr = "0x" + lastAddr.toString(16).toUpperCase()
  stackItems.value.push({
    id: nextId.value++,
    addr: addrStr,
    val: "Empty Slot",
    type: "empty"
  })

  // Set SP ke slot kosong teratas
  spIndex.value = stackItems.value.length - 1

  opLog.value = `SUB ${spName.value}, ${bytes}: Mengalokasikan ${bytes} byte ruang lokal di stack untuk variabel lokal. ${spName.value} berkurang.`
}

function handleAdd(bytes) {
  // Dealokasi memori (ADD ESP/RSP, bytes)
  const numSlots = bytes / (props.mode === 'x64' ? 8 : 4)
  
  // Hapus slot pembatas 'empty' teratas terlebih dahulu
  if (stackItems.value[stackItems.value.length - 1].type === 'empty') {
    stackItems.value.pop()
  }

  // Hapus slot variabel lokal sebanyak numSlots
  for (let i = 0; i < numSlots; i++) {
    if (stackItems.value.length > 3) {
      stackItems.value.pop()
    }
  }

  // Tambahkan kembali slot empty pembatas
  const lastItem = stackItems.value[stackItems.value.length - 1]
  const lastAddr = parseInt(lastItem.addr, 16)
  const nextAddr = "0x" + (lastAddr - stepSize.value).toString(16).toUpperCase()
  
  stackItems.value.push({
    id: nextId.value++,
    addr: nextAddr,
    val: "Empty Slot",
    type: "empty"
  })

  spIndex.value = stackItems.value.length - 1

  opLog.value = `ADD ${spName.value}, ${bytes}: Dealokasi ${bytes} byte ruang lokal. Membersihkan stack frame, ${spName.value} bertambah.`
}

// === UTILS ===
function isInStackFrame(idx) {
  // Rentang stack frame adalah dari Saved RBP/EBP (eksklusif) hingga RSP/ESP (inklusif)
  return idx > bpIndex.value && idx < spIndex.value
}

function getItemClass(idx) {
  const item = stackItems.value[idx]
  if (!item) return ''
  
  const isSp = idx === spIndex.value
  const isBp = idx === bpIndex.value
  const inFrame = isInStackFrame(idx)

  if (isSp) {
    return 'bg-yellow-950/40 border-yellow-700 text-yellow-100 shadow-[inset_0_0_8px_rgba(234,179,8,0.15)] font-bold'
  }
  if (isBp) {
    return 'bg-blue-950/50 border-blue-700 text-blue-100 shadow-[inset_0_0_8px_rgba(59,130,246,0.15)] font-bold'
  }
  if (inFrame) {
    return 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
  }
  
  if (item.type === 'arg') {
    return 'bg-slate-900 border-slate-800 text-slate-500 opacity-60'
  }
  if (item.type === 'ret') {
    return 'bg-purple-950/30 border-purple-900/60 text-purple-200'
  }
  
  return 'bg-slate-900 border-slate-800 text-slate-400'
}
</script>

<style scoped>
/* Transisi List Animasi Stack */
.stack-list-enter-active,
.stack-list-leave-active {
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.stack-list-enter-from {
  opacity: 0;
  transform: translateY(-16px);
}
.stack-list-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}

.stack-visualizer {
  background-color: #0b0f19;
}
</style>
