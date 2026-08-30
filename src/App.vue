<template>
  <div class="min-h-screen">
    <!-- Navbar -->
    <nav class="bg-slate-800 text-white p-4 shadow-md">
      <div class="max-w-[1200px] mx-auto flex gap-4">
        <router-link to="/" class="font-bold text-lg mr-8 hover:text-blue-300">Beranda</router-link>
        <router-link to="/fundamental" class="hover:text-blue-300">Fundamental</router-link>
        <router-link to="/arsitektur" class="hover:text-blue-300">Arsitektur</router-link>
      </div>
    </nav>

    <!-- Main Content Route -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
