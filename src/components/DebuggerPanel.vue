<template>
  <div class="anim-panel-container flex flex-col min-h-0 md:flex-row h-[600px] !rounded-t-none border-t-0 min-w-0">
    
    <!-- Kiri: Code & Terminal -->
    <div class="flex-[1.7] flex flex-col min-h-0 anim-panel-border-r min-w-0">
      <!-- Source Code -->
      <div class="flex-[1.5] flex flex-col min-h-0 anim-panel-border-b min-w-0">
        <div class="anim-panel-header">Source Code</div>
        <div class="anim-panel-code flex-1 overflow-y-scroll overflow-x-auto py-2">
          <div class="w-max min-w-full">
            <div 
              v-for="(line, i) in codeLines" 
              :key="i"
              class="anim-line"
              :class="{ 'active': i === activeLine }"
            >
              <div class="anim-line-num shrink-0">{{ i + 1 }}</div>
              <div class="whitespace-pre">{{ line }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- Terminal -->
      <div class="flex-1 flex flex-col min-h-0 min-w-0">
        <div class="anim-panel-header">Terminal</div>
        <div class="flex-1 overflow-y-scroll overflow-x-auto p-2">
          <pre class="m-0 whitespace-pre w-max min-w-full" v-html="terminal"></pre>
        </div>
      </div>
    </div>

    <!-- Tengah: Registers & Disassembly -->
    <div class="flex-[1.7] flex flex-col min-h-0 anim-panel-border-r min-w-0">
      <!-- Registers -->
      <div class="flex-[0.8] flex flex-col min-h-0 anim-panel-border-r min-w-0">
        <div class="anim-panel-header">Registers</div>
        <div class="flex-1 overflow-y-scroll overflow-x-auto p-2">
          <pre class="m-0 whitespace-pre text-xs w-max min-w-full"><div v-for="(val, reg) in defaultRegisters" :key="reg" class="mb-2"><span class="hl-reg">{{ reg.padEnd(6, ' ') }}</span> : <span class="hl-val" v-if="typeof val === 'string' && val.includes('\n')">{{ val.split('\n')[0] }}<br>{{ val.split('\n')[1] }}</span><span class="hl-val" v-else>{{ val }}</span></div></pre>
        </div>
      </div>
      <!-- Disassembly -->
      <div class="flex-[1.2] flex flex-col min-h-0 anim-panel-border-r min-w-0">
        <div class="anim-panel-header">Disassembly</div>
        <div class="flex-1 overflow-y-scroll overflow-x-auto p-2">
          <div class="w-max min-w-full whitespace-nowrap">
            <div 
              v-for="(d, idx) in defaultDisassembly" 
              :key="idx"
              class="flex py-0.5"
              :class="d.active ? 'bg-[#37373d] active-row' : ''"
            >
              <div class="hl-addr w-[60px] shrink-0">{{ d.addr }}</div>
              <div class="hl-bytes w-[85px] shrink-0">{{ d.bytes }}</div>
              <div class="hl-inst whitespace-pre">{{ d.inst }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Kanan: Dashboard grids -->
    <div class="flex-[2] flex flex-row min-w-0">
      
      
      
      <!-- Stack Memory -->
      <div class="flex-[1.2] flex flex-col min-h-0 min-w-0">
        <div class="anim-panel-header">Stack memory</div>
        <div class="flex-1 overflow-y-scroll overflow-x-auto p-2">
          <div class="w-max min-w-full whitespace-nowrap">
            <div v-for="(s, idx) in defaultStack" :key="idx" class="flex py-0.5" :class="s.active ? 'bg-[#37373d] active-row' : ''">
              <div class="hl-addr text-right shrink-0" :class="mode === 'x64' ? 'w-[120px]' : 'w-[60px]'">{{ s.addr }}</div>
              <div class="hl-bytes shrink-0">{{ s.bytes }}</div>
              <div class="hl-addr shrink-0">{{ s.ascii }}</div>
            </div>
          </div>
        </div>
      </div>
      
    </div>

  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  mode: {
    type: String,
    default: 'x64' // 'x64' or 'x86'
  },
  codeLines: {
    type: Array,
    default: () => [
      "; Dummy code initialized",
      "section .text",
      "global _start",
      "_start:",
      "  nop"
    ]
  },
  activeLine: {
    type: Number,
    default: -1
  },
  registers: {
    type: Object,
    default: () => null
  },
  disassembly: {
    type: Array,
    default: () => null
  },
  stack: {
    type: Array,
    default: () => null
  },
  terminal: {
    type: String,
    default: "<span class='hl-term-prompt'>$</span> "
  }
})

// === HISTORY ACCUMULATION TO PREVENT JUMPING ===
const disasmHistory = ref([])
const stackHistory = ref([])

// Clear history when switching tabs or architecture
watch([() => props.mode, () => props.codeLines], () => {
  disasmHistory.value = []
  stackHistory.value = []
}, { deep: true })

watch(() => props.disassembly, (newVal) => {
  if (!newVal) return
  let history = [...disasmHistory.value]
  newVal.forEach(item => {
    const existing = history.find(x => x.addr === item.addr)
    if (existing) {
      Object.assign(existing, item)
    } else {
      history.push({ ...item })
    }
  })
  // Sort ascending by address
  history.sort((a, b) => parseInt(a.addr, 16) - parseInt(b.addr, 16))
  disasmHistory.value = history
}, { deep: true, immediate: true })

watch(() => props.stack, (newVal) => {
  if (!newVal) return
  let history = [...stackHistory.value]
  newVal.forEach(item => {
    const existing = history.find(x => x.addr === item.addr)
    if (existing) {
      Object.assign(existing, item)
    } else {
      history.push({ ...item })
    }
  })
  // Sort ascending by address
  history.sort((a, b) => parseInt(a.addr, 16) - parseInt(b.addr, 16))
  stackHistory.value = history
}, { deep: true, immediate: true })

const defaultRegisters = computed(() => {
  if (props.registers) return props.registers
  
  if (props.mode === 'x64') {
    return {
      rax: '0x00',
      rbx: '0x00',
      rcx: '0x00',
      rdx: '0x00',
      rsp: '0x00',
      rbp: '0x00',
      rsi: '0x00',
      rdi: '0x00',
      r8: '0x00',
      r9: '0x00',
      r10: '0x00',
      r11: '0x00',
      r12: '0x00',
      r13: '0x00',
      r14: '0x00',
      r15: '0x00',
      rip: '0x00',
      rflags: '0x0\n[ ]'
    }
  } else {
    return {
      eax: '0x00',
      ebx: '0x00',
      ecx: '0x00',
      edx: '0x00',
      esp: '0x00',
      ebp: '0x00',
      esi: '0x00',
      edi: '0x00',
      eip: '0x00',
      eflags: '0x0\n[ ]'
    }
  }
})

const defaultDisassembly = computed(() => {
  const disasmList = []
  const instStr = props.mode === 'x64' ? 'add BYTE PTR [rax], al' : 'add BYTE PTR [eax], al'
  
  const sourceList = disasmHistory.value.length > 0 ? disasmHistory.value : (props.disassembly || [])
  
  for (let i = 0; i < 15; i++) {
    if (i < sourceList.length) {
      disasmList.push(sourceList[i])
    } else {
      let prevAddrStr = i > 0 ? disasmList[i - 1].addr : '0000000'
      let prevAddrNum = parseInt(prevAddrStr, 16) || 0
      let nextAddrStr = (prevAddrNum + 4).toString(16).padStart(prevAddrStr.length, '0')
      if (nextAddrStr === 'NaN' || !prevAddrStr) nextAddrStr = '0000000'

      disasmList.push({
        addr: nextAddrStr,
        bytes: '00 00',
        inst: instStr,
        active: false
      })
    }
  }
  return disasmList
})

const defaultStack = computed(() => {
  const stackList = []
  const numRows = (0x1fc / 4) + 1 // 128 rows
  
  const sourceList = stackHistory.value.length > 0 ? stackHistory.value : (props.stack || [])
  
  for (let i = 0; i < numRows; i++) {
    let itemData;
    if (i < sourceList.length) {
      itemData = { ...sourceList[i] }
    } else {
      let prevAddrStr = i > 0 ? stackList[i - 1].addr : (props.mode === 'x86' ? '00000000' : '0000000000000000')
      let prevAddrNum = parseInt(prevAddrStr, 16) || 0
      let stepSize = props.mode === 'x86' ? 4 : 8
      let nextAddrStr = (prevAddrNum + stepSize).toString(16).padStart(prevAddrStr.length, '0')
      if (nextAddrStr === 'NaN' || !prevAddrStr) {
         nextAddrStr = props.mode === 'x86' ? '00000000' : '0000000000000000'
      }

      let emptyBytes = props.mode === 'x86' ? '00 00 00 00' : '00 00 00 00 00 00 00 00'
      let emptyAscii = props.mode === 'x86' ? '....' : '........'

      itemData = {
        addr: nextAddrStr,
        bytes: emptyBytes,
        ascii: emptyAscii
      }
    }

    // Identify if this stack memory address is active (changed in the current step)
    itemData.active = false
    if (props.stack && props.stack.find(s => s.addr === itemData.addr)) {
      itemData.active = true
    }

    stackList.push(itemData)
  }
  return stackList
})
</script>

<style scoped>
.anim-panel-container {
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 12px;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #333333;
}
.anim-panel-header {
  background-color: #252526;
  border-bottom: 1px solid #333333;
  padding: 6px 10px;
  color: #e8e8e8;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.anim-panel-border-r { border-right: 1px solid #333333; }
.anim-panel-border-b { border-bottom: 1px solid #333333; }

/* Scrollbars Customization */
.anim-panel-container ::-webkit-scrollbar { width: 10px; height: 10px; }
.anim-panel-container ::-webkit-scrollbar-track { background: #1e1e1e; }
.anim-panel-container ::-webkit-scrollbar-thumb { background: #424242; border: 1px solid #1e1e1e; }
.anim-panel-container ::-webkit-scrollbar-thumb:hover { background: #4f4f4f; }

/* Syntax Highlighting */
.hl-reg { color: #569cd6; }
.hl-val { color: #d4d4d4; }
.hl-addr { color: #858585; }
.hl-bytes { color: #9cdcfe; margin: 0 8px; }
.hl-inst { color: #d4d4d4; }
:deep(.hl-term) { color: #d4d4d4; }
:deep(.hl-term-prompt) { color: #569cd6; font-weight: bold; }

/* Source Code lines */
.anim-line {
  display: flex;
  padding-right: 8px;
  cursor: default;
  line-height: 1.6;
}
.anim-line.active {
  background-color: #37373d;
}
.anim-line-num {
  color: #858585;
  width: 32px;
  text-align: right;
  padding-right: 10px;
  margin-right: 10px;
  user-select: none;
}

/* Active Highlight for Disasm & Stack */
.active-row {
  border-left: 2px solid #569cd6;
  margin-left: -2px;
}
.active-row .hl-addr,
.active-row .hl-bytes,
.active-row .hl-inst {
  color: #ffffff !important;
  font-weight: bold !important;
}
</style>
