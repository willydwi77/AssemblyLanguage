<template>
  <div class="main-container py-10">
    <div class="card bg-white text-center">
      <h1 class="page-title text-4xl mb-4">Welcome to Assembly Language Guide</h1>
      <p class="page-subtitle mb-8">Pilih panduan di bawah ini untuk memulai:</p>
      
      <div class="flex flex-col md:flex-row justify-center gap-4">
        <router-link to="/fundamental" class="px-6 py-3 bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition">
          Fundamental C++ vs Assembly
        </router-link>
        <router-link to="/arsitektur" class="px-6 py-3 bg-slate-800 text-white rounded font-bold hover:bg-slate-700 transition">
          Sintesis Arsitektur x86 & x64
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index'
}
</script>
