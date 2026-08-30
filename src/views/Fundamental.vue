<template>
  <div class="main-container py-6">
    <!-- Header -->
    <div class="card bg-white mb-6">
        <h1 class="page-title">Sintesis Arsitektur Instruksi</h1>
        <p class="page-subtitle">Harmonisasi materi x86 (32-bit) dan x86-64 (64-bit) dengan sintaks Intel yang konsisten.</p>
        
        <!-- Toggle Arsitektur -->
        <div class="arch-toggle-container">
            <div class="arch-toggle-label">Arsitektur:</div>
            <button @click="setArch('x64')" :class="['arch-btn', currentArch === 'x64' ? 'active' : 'inactive']">x64 (64-bit)</button>
            <button @click="setArch('x86')" :class="['arch-btn', currentArch === 'x86' ? 'active' : 'inactive']">x86 (32-bit)</button>
        </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-group mb-6">
        <button v-for="tab in tabs" :key="tab.id" 
                @click="setTab(tab.id)" 
                :class="['tab-btn', activeTab === tab.id ? 'active' : '']">
          {{ tab.label }}
        </button>
    </div>

    <!-- Content Area -->
    <div v-if="activeData" class="card bg-white">
      <h2 class="section-title">{{ activeData.title }}</h2>
      <p class="content-desc">{{ activeData.desc[currentArch] }}</p>

      <!-- Panel Teori Tambahan -->
      <div v-if="activeData.theory" class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div v-for="(item, idx) in activeData.theory" :key="idx" class="border border-slate-200 rounded p-4 bg-slate-50">
          <h3 class="font-bold text-slate-700 text-sm mb-2"><i class="fas fa-info-circle text-blue-500 mr-1"></i> {{ item.title }}</h3>
          <p class="text-xs text-slate-600 leading-relaxed" v-html="item.desc"></p>
        </div>
      </div>

      <div class="flex flex-col gap-6 mb-6">
        <div class="border border-slate-200 rounded overflow-hidden flex flex-col">
          <!-- Jika ada data asmCode, tampilkan komparasi (Side-by-side) -->
          <div v-if="activeData.asmCode" class="flex flex-col md:flex-row">
            <div class="flex-1 border-b md:border-b-0 md:border-r border-slate-200 flex flex-col min-w-0">
              <div class="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200">Kode C++</div>
              <pre class="code-block flex-1 overflow-x-auto"><code v-html="activeData.cppCode"></code></pre>
            </div>
            <div class="flex-1 flex flex-col min-w-0">
              <div class="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200">Hasil Bahasa Mesin ({{ currentArch }})</div>
              <pre class="code-block flex-1 overflow-x-auto"><code v-html="activeData.asmCode[currentArch]"></code></pre>
            </div>
          </div>
          <!-- Mode normal (Hanya C++) -->
          <div v-else>
            <div class="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200">Kode C++</div>
            <pre class="code-block overflow-x-auto"><code v-html="activeData.cppCode"></code></pre>
          </div>
        </div>

        <div v-if="activeData.isAnim" class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-lg">
          <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
            <span>Simulasi Eksekusi Assembly</span>
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
            class="!border-none !rounded-none shadow-none h-[550px]"
          />

            <!-- Controls -->
            <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
              <div class="text-slate-400 text-xs">
                Step {{ currentStep + 1 }} of {{ currentSim.steps.length }}
              </div>
              <div class="flex gap-2">
                <button @click="prevStep" :disabled="currentStep === 0" 
                        class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">
                  &lt; Mundur
                </button>
                <button @click="nextStep" :disabled="currentStep === currentSim.steps.length - 1" 
                        class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">
                  Langkah Selanjutnya ⏭️
                </button>
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DebuggerPanel from '../components/DebuggerPanel.vue'
import { animDb } from '../data/cpp_asm_data.js'

const tabs = [
  { id: 'fund', label: 'Fundamental' },
  { id: 'hello', label: 'Hello World' },
  { id: 'arith', label: 'Aritmatika' },
  { id: 'cond', label: 'If / Else' },
  { id: 'loop', label: 'Looping' }
]

const currentArch = ref('x64')
const activeTab = ref('fund')
const currentStep = ref(0)

const activeData = computed(() => animDb[activeTab.value])
const currentSim = computed(() => {
  if (activeData.value && activeData.value.isAnim) {
    return activeData.value[currentArch.value]
  }
  return null
})
const currentStepData = computed(() => {
  if (currentSim.value && currentSim.value.steps) {
    return currentSim.value.steps[currentStep.value]
  }
  return null
})

function setArch(arch) {
  currentArch.value = arch
  currentStep.value = 0
}

function setTab(tabId) {
  activeTab.value = tabId
  currentStep.value = 0
}

function nextStep() {
  if (currentStep.value < currentSim.value.steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}
</script>
