<template>
  <div class="border border-slate-200 rounded overflow-hidden flex flex-col mb-4">
    <div class="flex flex-col md:flex-row">
      <!-- C++ Code Panel -->
      <div class="flex-1 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col min-w-0">
        <div class="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200">
          Kode C++
        </div>
        <pre class="code-block flex-1 overflow-x-auto"><code class="text-xs text-slate-200 whitespace-pre">{{ cppCode.trim() }}</code></pre>
      </div>

      <!-- Assembly Code Panel -->
      <div class="flex-1 flex flex-col min-w-0">
        <div class="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200 flex justify-between items-center">
          <span>Hasil Assembly ({{ currentArch }})</span>
          <span class="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider select-none">
            {{ currentArch }}
          </span>
        </div>
        <pre class="code-block flex-1 overflow-x-auto"><code class="text-xs text-slate-200 whitespace-pre">{{ currentAsm.trim() }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  cppCode: {
    type: String,
    required: true
  },
  asmX64: {
    type: String,
    required: true
  },
  asmX86: {
    type: String,
    required: true
  },
  currentArch: {
    type: String,
    default: 'x64'
  }
})

const currentAsm = computed(() => {
  return props.currentArch === 'x86' ? props.asmX86 : props.asmX64
})
</script>
