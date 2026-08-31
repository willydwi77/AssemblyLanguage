<template>
  <div class="main-container py-6">
    <!-- Header -->
    <div class="card bg-white mb-6">
        <h1 class="page-title">Sintesis Arsitektur Instruksi</h1>
        <p class="page-subtitle">Harmonisasi materi x86 (32-bit) dan x86-64 (64-bit) dengan sintaks Intel yang konsisten.</p>
        
        <!-- Toggle Arsitektur -->
        <div v-if="activeTab !== 'fund'" class="arch-toggle-container">
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
      <template v-if="activeTab === 'fund'">
        <!-- Title and Subtitle -->
        <div class="mb-8">
          <h2 class="section-title text-2xl font-extrabold text-slate-900 mb-2 border-b pb-4">
            Fundamental Bahasa Mesin x86 Intel
          </h2>
          <p class="text-sm text-slate-500 italic">
            Materi Pembelajaran Dasar Arsitektur Komputer x86 dan x86-64
          </p>
        </div>

        <!-- 1. Arsitektur Dasar x86/x86-64 -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">1</span>
            Arsitektur Dasar x86 / x86-64
          </h3>
          <p class="content-desc mb-4">
            Arsitektur x86 adalah arsitektur instruksi kompleks (CISC) yang mendominasi komputasi desktop dan server. Versi 64-bit-nya, yang dikenal sebagai x86-64 atau AMD64, memperluas kemampuan arsitektur 32-bit (IA-32) asli. Pemahaman tentang arsitektur ini sangat penting untuk menulis kode assembly yang efisien.
          </p>

          <!-- a. Registers -->
          <div class="ml-4 mb-6">
            <h4 class="text-base font-semibold text-slate-700 mb-2">a. Registers (Register)</h4>
            <p class="content-desc mb-3">
              Register adalah lokasi penyimpanan data berkecepatan tinggi di dalam CPU. Setiap register memiliki fungsi tertentu. Pada x86-64, terdapat 16 register tujuan umum 64-bit:
            </p>

            <RegisterValue />

            <FlagsRegister />
          </div>

          <!-- b. Data Sizes (Ukuran Data) -->
          <div class="ml-4 mb-6">
            <h4 class="text-base font-semibold text-slate-700 mb-2">b. Data Sizes (Ukuran Data)</h4>
            <p class="content-desc mb-3">
              Dalam assembly x86/x64, ukuran data ditentukan secara ketat saat mengakses memori. Pointer penunjuk ukuran (directives) memberitahu CPU berapa banyak byte memori yang harus dibaca atau ditulis:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-sm mb-1.5 flex justify-between">
                  <span>BYTE</span>
                  <span class="text-xs text-blue-600 font-mono">8-bit (1 Byte)</span>
                </h5>
                <p class="text-xs text-slate-600 leading-relaxed mb-2">
                  Digunakan untuk karakter tunggal atau bilangan bulat 8-bit.
                </p>
                <div class="bg-slate-800 p-2 rounded text-[11px] font-mono text-emerald-400">
                  mov BYTE PTR [rax], 5
                </div>
              </div>

              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-sm mb-1.5 flex justify-between">
                  <span>WORD</span>
                  <span class="text-xs text-blue-600 font-mono">16-bit (2 Byte)</span>
                </h5>
                <p class="text-xs text-slate-600 leading-relaxed mb-2">
                  Ukuran kata dasar x86 (16-bit) legacy.
                </p>
                <div class="bg-slate-800 p-2 rounded text-[11px] font-mono text-emerald-400">
                  mov WORD PTR [rax], 5
                </div>
              </div>

              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-sm mb-1.5 flex justify-between">
                  <span>DWORD (Double Word)</span>
                  <span class="text-xs text-blue-600 font-mono">32-bit (4 Byte)</span>
                </h5>
                <p class="text-xs text-slate-600 leading-relaxed mb-2">
                  Ukuran standar tipe data integer (32-bit) di program C/C++.
                </p>
                <div class="bg-slate-800 p-2 rounded text-[11px] font-mono text-emerald-400">
                  mov DWORD PTR [rax], 5
                </div>
              </div>

              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-sm mb-1.5 flex justify-between">
                  <span>QWORD (Quad Word)</span>
                  <span class="text-xs text-blue-600 font-mono">64-bit (8 Byte)</span>
                </h5>
                <p class="text-xs text-slate-600 leading-relaxed mb-2">
                  Ukuran register umum 64-bit dan tipe data pointer/long di x64.
                </p>
                <div class="bg-slate-800 p-2 rounded text-[11px] font-mono text-emerald-400">
                  mov QWORD PTR [rax], 5
                </div>
              </div>
            </div>
          </div>

          <!-- c. Memory Addressing -->
          <div class="ml-4 mb-6">
            <h4 class="text-base font-semibold text-slate-700 mb-2">c. Memory Addressing (Pengalamatan Memori)</h4>
            <p class="content-desc mb-3">
              x86 mendukung berbagai mode pengalamatan untuk mengakses data di memori:
            </p>
            <ul class="list-disc pl-5 space-y-2 text-sm text-slate-700 mb-4">
              <li>
                <strong>Register:</strong> Operan berada di dalam register (contoh: <code class="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono">mov rax, rbx</code>).
              </li>
              <li>
                <strong>Immediate:</strong> Operan adalah nilai konstanta (contoh: <code class="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono">mov rax, 5</code>).
              </li>
              <li>
                <strong>Direct:</strong> Alamat memori ditentukan secara langsung (contoh: <code class="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono">mov rax, [0x00402000]</code>).
              </li>
              <li>
                <strong>Indirect:</strong> Alamat memori disimpan dalam sebuah register (contoh: <code class="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono">mov rax, [rbx]</code>).
              </li>
              <li>
                <strong>Base-Index with Displacement:</strong> Kombinasi yang umum dan powerful (contoh: <code class="bg-slate-100 text-rose-600 px-1 py-0.5 rounded font-mono">mov rax, [rbx + rcx*4 + 8]</code>), digunakan untuk mengakses array dan struktur data.
              </li>
            </ul>
          </div>

          <!-- d. Instruction Set -->
          <div class="ml-4">
            <h4 class="text-base font-semibold text-slate-700 mb-2">d. Instruction Set (Set Instruksi)</h4>
            <p class="content-desc mb-3">
              Set instruksi dasar mencakup operasi-operasi seperti:
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-700 text-sm mb-1">Data Transfer</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">mov</code> (memindahkan data), 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">lea</code> (memuat alamat efektif/koordinat memori).
                </p>
              </div>
              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-700 text-sm mb-1">Aritmetika</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">add</code>, 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">sub</code>, 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">mul</code>, 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">div</code> 
                  (perkalian dan pembagian seringkali menggunakan register RAX/RDX secara implisit).
                </p>
              </div>
              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-700 text-sm mb-1">Logika</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">and</code>, 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">or</code>, 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">xor</code>, 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">not</code>.
                </p>
              </div>
              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-700 text-sm mb-1">Kontrol Alur</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">jmp</code> (lompat tak bersyarat), 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">je</code>/<code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">jz</code> (lompat jika sama/nol), 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">call</code> (panggil fungsi), 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">ret</code> (kembali dari fungsi).
                </p>
              </div>
              <div class="border border-slate-200 rounded p-4 bg-slate-50 md:col-span-2">
                <h5 class="font-bold text-slate-700 text-sm mb-1">Stack</h5>
                <p class="text-xs text-slate-600 leading-relaxed">
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">push</code> (masukkan data ke stack), 
                  <code class="bg-slate-200 text-slate-800 px-1 py-0.5 rounded font-mono">pop</code> (keluarkan data dari stack).
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Ekstensi Modern dan SIMD -->
        <div class="mb-8 border-t pt-6">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">2</span>
            Ekstensi Modern dan SIMD
          </h3>
          <p class="content-desc mb-4">
            Prosesor x86 modern memiliki ekstensi untuk pemrosesan data paralel, yang dikenal sebagai <strong>SIMD (Single Instruction, Multiple Data)</strong>. Instruksi-instruksi ini memungkinkan satu instruksi untuk melakukan operasi yang sama pada beberapa data sekaligus, yang sangat berguna untuk komputasi berat seperti pemrosesan gambar, machine learning, dan grafik.
          </p>
          <div class="space-y-3">
            <div class="p-3 border-l-4 border-emerald-500 bg-slate-50 rounded-r">
              <p class="text-sm font-semibold text-slate-800 mb-1">MMX, SSE, SSE2, SSE3, SSSE3, SSE4</p>
              <p class="text-xs text-slate-600">Generasi awal ekstensi SIMD yang menggunakan register 64-bit atau 128-bit (<code class="bg-slate-200 px-1 py-0.2 rounded font-mono">XMM0</code> - <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">XMM15</code>).</p>
            </div>
            <div class="p-3 border-l-4 border-blue-500 bg-slate-50 rounded-r">
              <p class="text-sm font-semibold text-slate-800 mb-1">AVX, AVX2, AVX-512</p>
              <p class="text-xs text-slate-600">Generasi terbaru. AVX menggunakan register 256-bit (<code class="bg-slate-200 px-1 py-0.2 rounded font-mono">YMM0</code> - <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">YMM15</code>), dan AVX-512 menggunakan register 512-bit (<code class="bg-slate-200 px-1 py-0.2 rounded font-mono">ZMM0</code> - <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">ZMM15</code>). Ekstensi ini menawarkan peningkatan performa yang sangat signifikan untuk aplikasi yang dapat diparalelkan.</p>
            </div>
          </div>
        </div>

        <!-- 3. Perbedaan Sintaks: Intel vs. AT&T -->
        <div class="mb-8 border-t pt-6">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">3</span>
            Perbedaan Sintaks: Intel vs. AT&T
          </h3>
          <p class="content-desc mb-4">
            Ada dua gaya sintaks utama untuk assembly x86, yang sering membingungkan pemula:
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-slate-200 rounded overflow-hidden flex flex-col">
              <div class="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                Intel Syntax
              </div>
              <div class="p-4 flex-1 bg-slate-50 flex flex-col justify-between">
                <p class="text-xs text-slate-600 mb-3">
                  Lebih umum digunakan di Windows (oleh assembler seperti MASM) dan didukung oleh NASM. Ciri khasnya: <strong><code>tujuan, sumber</code></strong>. Tidak menggunakan awalan untuk register atau konstanta.
                </p>
                <pre class="code-block !p-3"><code class="font-mono text-xs text-slate-100">mov eax, 1 <span class="text-slate-400">; Pindahkan nilai 1 ke register EAX</span></code></pre>
              </div>
            </div>

            <div class="border border-slate-200 rounded overflow-hidden flex flex-col">
              <div class="bg-slate-100 px-3 py-1.5 text-[11px] font-bold text-slate-600 border-b border-slate-200">
                AT&T Syntax
              </div>
              <div class="p-4 flex-1 bg-slate-50 flex flex-col justify-between">
                <p class="text-xs text-slate-600 mb-3">
                  Digunakan di lingkungan Unix/Linux oleh assembler GNU (GAS). Ciri khasnya: <strong><code>sumber, tujuan</code></strong>. Menggunakan awalan <code>%</code> untuk register dan <code>$</code> untuk konstanta.
                </p>
                <pre class="code-block !p-3"><code class="font-mono text-xs text-slate-100">mov $1, %eax <span class="text-slate-400">; Pindahkan nilai 1 ke register EAX</span></code></pre>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Perkakas (Tools) dan Lingkungan -->
        <div class="mb-8 border-t pt-6">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">4</span>
            Perkakas (Tools) dan Lingkungan
          </h3>
          <p class="content-desc mb-4">
            Untuk memulai pemrograman assembly, Anda memerlukan assembler dan linker:
          </p>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div class="p-4 border border-slate-200 rounded bg-slate-50">
              <h5 class="font-bold text-slate-700 text-sm mb-1">NASM (Netwide Assembler)</h5>
              <p class="text-xs text-slate-600">Assembler populer yang mendukung sintaks Intel, tersedia untuk Windows dan Linux.</p>
            </div>
            <div class="p-4 border border-slate-200 rounded bg-slate-50">
              <h5 class="font-bold text-slate-700 text-sm mb-1">MASM (Microsoft Macro Assembler)</h5>
              <p class="text-xs text-slate-600">Assembler standar untuk Windows.</p>
            </div>
            <div class="p-4 border border-slate-200 rounded bg-slate-50">
              <h5 class="font-bold text-slate-700 text-sm mb-1">GAS (GNU Assembler)</h5>
              <p class="text-xs text-slate-600">Assembler di balik GCC yang menggunakan sintaks AT&T.</p>
            </div>
            <div class="p-4 border border-slate-200 rounded bg-slate-50">
              <h5 class="font-bold text-slate-700 text-sm mb-1">Linker</h5>
              <p class="text-xs text-slate-600">Program seperti <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">ld</code> (Linux) atau <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">link.exe</code> (Windows) untuk menggabungkan kode objek menjadi file executable.</p>
            </div>
            <div class="p-4 border border-slate-200 rounded bg-slate-50 sm:col-span-2">
              <h5 class="font-bold text-slate-700 text-sm mb-1">Debugger</h5>
              <p class="text-xs text-slate-600">Alat seperti <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">GDB</code> (Linux) atau <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">WinDbg</code> / <code class="bg-slate-200 px-1 py-0.2 rounded font-mono">x64dbg</code> (Windows) sangat penting untuk menelusuri kode assembly dan memeriksa status register serta memori.</p>
            </div>
          </div>
        </div>

        <!-- 5. Rekomendasi untuk Pembelajaran Lebih Lanjut -->
        <div class="mb-8 border-t pt-6">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">5</span>
            Rekomendasi Pembelajaran Lebih Lanjut
          </h3>
          <p class="content-desc mb-4">
            Berikut adalah beberapa sumber belajar yang direkomendasikan untuk mendalami bahasa assembly x86/x86-64 Intel:
          </p>
          <div class="space-y-4">
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 bg-slate-100 text-slate-700 border rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">1</div>
              <div>
                <p class="text-sm font-semibold text-slate-800">Buku: <em>Modern X86 Assembly Language Programming</em> oleh Daniel Kusswurm</p>
                <p class="text-xs text-slate-600 font-sans leading-relaxed">Buku ini sangat komprehensif, mencakup arsitektur dasar hingga ekstensi AVX-512, dengan contoh untuk Windows dan Linux. Sangat direkomendasikan untuk pemahaman mendalam.</p>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 bg-slate-100 text-slate-700 border rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">2</div>
              <div>
                <p class="text-sm font-semibold text-slate-800">Buku: <em>X86 Assembly Language and C Fundamentals</em></p>
                <p class="text-xs text-slate-600 font-sans leading-relaxed">Pilihan yang baik untuk memahami dasar-dasar arsitektur dan hubungannya dengan bahasa C.</p>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 bg-slate-100 text-slate-700 border rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">3</div>
              <div>
                <p class="text-sm font-semibold text-slate-800">Dokumentasi Resmi Intel</p>
                <p class="text-xs text-slate-600 font-sans leading-relaxed"><em>Intel® 64 and IA-32 Architectures Software Developer Manuals</em>. Ini adalah sumber utama dan paling otoritatif, tetapi sangat tebal dan lebih cocok sebagai referensi.</p>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 bg-slate-100 text-slate-700 border rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">4</div>
              <div>
                <p class="text-sm font-semibold text-slate-800">Panduan Online</p>
                <p class="text-xs text-slate-600 font-sans leading-relaxed">Cari tutorial dengan kata kunci "x86-64 assembly tutorial NASM" atau "x86 assembly GAS tutorial" untuk menemukan berbagai panduan langkah demi langkah.</p>
              </div>
            </div>
            <div class="flex gap-3 items-start">
              <div class="w-6 h-6 bg-slate-100 text-slate-700 border rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 mt-0.5">5</div>
              <div>
                <p class="text-sm font-semibold text-slate-800 font-sans">Sumber Daya dari Universitas</p>
                <p class="text-xs text-slate-600 font-sans leading-relaxed font-sans">Banyak universitas menyediakan materi kuliah tentang arsitektur komputer dan assembly, seperti dari CMU (Carnegie Mellon University) atau Washington State University.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="border-t pt-4 text-center text-xs text-slate-400">
          Semoga rangkuman ini bermanfaat sebagai titik awal Anda untuk memahami fundamental bahasa mesin x86 Intel.
        </div>
      </template>

      <template v-else-if="activeTab === 'inst'">
        <!-- Title and Subtitle -->
        <div class="mb-8">
          <h2 class="section-title text-2xl font-extrabold text-slate-900 mb-2 border-b pb-4">
            Instruksi Bahasa Mesin vs Assembly
          </h2>
          <p class="text-sm text-slate-500 italic">
            Memahami Struktur, Anatomi, dan Klasifikasi Instruksi Prosesor ({{ currentArch }})
          </p>
        </div>

        <!-- 2. Bahasa Mesin vs Assembly -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">2</span>
            Bahasa Mesin vs Assembly
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4 mb-4">
            <div class="border border-slate-200 rounded p-4 bg-slate-50">
              <h4 class="font-bold text-slate-700 text-xs mb-1 uppercase tracking-wider">2.1 Bahasa Mesin</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-3 font-sans">
                Prosesor hanya mengerti instruksi biner (0 dan 1). Ini adalah instruksi asli perangkat keras.
              </p>
              <pre class="bg-slate-950 text-emerald-400 p-3 rounded font-mono text-xs overflow-x-auto">01000011 00000000 01000101 11111000</pre>
            </div>
            <div class="border border-slate-200 rounded p-4 bg-slate-50">
              <h4 class="font-bold text-slate-700 text-xs mb-1 uppercase tracking-wider">2.2 Assembly Language</h4>
              <p class="text-xs text-slate-600 leading-relaxed mb-3 font-sans">
                Representasi simbolis (mnemonic) agar mudah dipahami manusia sebelum diterjemahkan oleh assembler.
              </p>
              <pre class="bg-slate-950 text-blue-400 p-3 rounded font-mono text-xs overflow-x-auto"><span v-if="currentArch === 'x64'">add DWORD [rbp-8], eax   ; x64 (64-bit)</span><span v-else>add DWORD [ebp-8], eax   ; x86 (32-bit)</span></pre>
            </div>
          </div>
          <div class="ml-4 border border-slate-200 rounded p-4 bg-slate-50">
            <h4 class="font-bold text-slate-700 text-xs mb-1 uppercase tracking-wider">2.3 Proses Kompilasi</h4>
            <div class="flex items-center justify-around flex-wrap gap-2 text-xs font-mono text-slate-600 py-2">
              <span class="bg-blue-50 px-2 py-1 border rounded text-blue-700">Kode C++</span>
              <span>→</span>
              <span class="bg-amber-50 px-2 py-1 border rounded text-amber-700">Compiler</span>
              <span>→</span>
              <span class="bg-purple-50 px-2 py-1 border rounded text-purple-700">Kode Assembly (.s)</span>
              <span>→</span>
              <span class="bg-emerald-50 px-2 py-1 border rounded text-emerald-700">Assembler</span>
              <span>→</span>
              <span class="bg-slate-950 text-slate-100 px-2 py-1 rounded">Bahasa Mesin (.o/.obj)</span>
            </div>
          </div>
        </div>

        <!-- 3. Anatomi Instruksi Assembly -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">3</span>
            Anatomi Instruksi Assembly
          </h3>
          <div class="ml-4 mb-4">
            <h4 class="font-bold text-slate-700 text-sm mb-2">3.1 Format Dasar</h4>
            <p class="text-xs text-slate-600 mb-3 font-sans">Instruksi assembly umumnya mengikuti skema:</p>
            <pre class="bg-slate-950 text-slate-300 p-3 rounded font-mono text-xs mb-4">[label]   mnemonic   [operands]   [;comment]</pre>

            <h4 class="font-bold text-slate-700 text-sm mb-2">3.2 Komponen Instruksi</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-xs mb-1">a. Label (<code>label</code>)</h5>
                <p class="text-xs text-slate-600 leading-relaxed mb-2 font-sans">Penanda lokasi lompatan (diakhiri titik dua).</p>
                <pre class="bg-slate-950 text-slate-400 p-2.5 rounded font-mono text-[11px] overflow-x-auto">_start:
    jmp _start   ; Loop tanpa henti</pre>
              </div>

              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-xs mb-1">b. Mnemonic (<code>mnemonic</code>)</h5>
                <p class="text-xs text-slate-600 leading-relaxed mb-2 font-sans">Singkatan instruksi operasi CPU.</p>
                <pre class="bg-slate-950 text-slate-400 p-2.5 rounded font-mono text-[11px] overflow-x-auto">MOV   ; Pindahkan data
ADD   ; Penjumlahan
SUB   ; Pengurangan
CMP   ; Perbandingan</pre>
              </div>

              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-xs mb-1">c. Operand (<code>operands</code>)</h5>
                <p class="text-xs text-slate-600 leading-relaxed mb-2 font-sans">
                  Aturan: <strong>Operand 1 = Tujuan (Dest)</strong>, <strong>Operand 2 = Sumber (Src)</strong>.
                </p>
                <pre class="bg-slate-950 text-slate-400 p-2.5 rounded font-mono text-[11px] overflow-x-auto"><span v-if="currentArch === 'x64'">ADD RAX, 1     ; RAX = RAX + 1
SUB RBX, RCX   ; RBX = RBX - RCX</span><span v-else>ADD EAX, 1     ; EAX = EAX + 1
SUB EBX, ECX   ; EBX = EBX - ECX</span></pre>
              </div>

              <div class="border border-slate-200 rounded p-4 bg-slate-50">
                <h5 class="font-bold text-slate-800 text-xs mb-1 font-sans">Jenis-jenis Operand Addressing</h5>
                <ul class="list-disc pl-4 space-y-1 text-xs text-slate-600 leading-relaxed font-sans">
                  <li><strong>Register</strong>: <code class="bg-slate-100 font-mono text-[11px] text-rose-600 px-1 py-0.5 rounded">{{ currentArch === 'x64' ? 'MOV RAX, RBX' : 'MOV EAX, EBX' }}</code></li>
                  <li><strong>Immediate (Konstanta)</strong>: <code class="bg-slate-100 font-mono text-[11px] text-rose-600 px-1 py-0.5 rounded">{{ currentArch === 'x64' ? 'MOV RAX, 45H' : 'MOV EAX, 45H' }}</code></li>
                  <li><strong>Memory Indirect</strong>: <code class="bg-slate-100 font-mono text-[11px] text-rose-600 px-1 py-0.5 rounded">{{ currentArch === 'x64' ? 'MOV [RBX], 110' : 'MOV [EBX], 110' }}</code></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- 3.3 Sintaks Intel vs AT&T -->
          <div class="ml-4 mb-4">
            <h4 class="font-bold text-slate-700 text-sm mb-2">3.3 Sintaks Intel vs AT&T</h4>
            <div class="overflow-x-auto border border-slate-200 rounded-lg">
              <table class="op-table w-full">
                <thead>
                  <tr class="bg-slate-100 border-b border-slate-200">
                    <th class="px-4 py-2 text-left text-xs font-bold text-slate-700">Aspek</th>
                    <th class="px-4 py-2 text-left text-xs font-bold text-slate-700">Intel Syntax (Default)</th>
                    <th class="px-4 py-2 text-left text-xs font-bold text-slate-700">AT&T Syntax</th>
                  </tr>
                </thead>
                <tbody class="text-xs">
                  <tr class="border-b border-slate-200">
                    <td class="px-4 py-2 font-semibold">Urutan Operand</td>
                    <td class="px-4 py-2"><code>tujuan, sumber</code></td>
                    <td class="px-4 py-2"><code>sumber, tujuan</code></td>
                  </tr>
                  <tr class="border-b border-slate-200">
                    <td class="px-4 py-2 font-semibold">Simbol Register</td>
                    <td class="px-4 py-2">Tanpa awalan (<code>{{ currentArch === 'x64' ? 'RAX' : 'EAX' }}</code>)</td>
                    <td class="px-4 py-2">Dengan awalan <code>%</code> (<code>{{ currentArch === 'x64' ? '%rax' : '%eax' }}</code>)</td>
                  </tr>
                  <tr class="border-b border-slate-200">
                    <td class="px-4 py-2 font-semibold">Nilai Konstanta</td>
                    <td class="px-4 py-2">Tanpa awalan (<code>45</code>)</td>
                    <td class="px-4 py-2">Dengan awalan <code>$</code> (<code>$45</code>)</td>
                  </tr>
                  <tr>
                    <td class="px-4 py-2 font-semibold">Contoh</td>
                    <td class="px-4 py-2"><code>mov {{ currentArch === 'x64' ? 'rax, 1' : 'eax, 1' }}</code></td>
                    <td class="px-4 py-2"><code>mov $1, {{ currentArch === 'x64' ? '%rax' : '%eax' }}</code></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 4. Struktur Program Assembly -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">4</span>
            Struktur Program Assembly
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4 mb-4">
            <div class="border border-slate-200 rounded p-4 bg-slate-50 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-slate-700 text-xs mb-1 uppercase tracking-wider">4.1 Tiga Bagian Utama</h4>
                <p class="text-xs text-slate-600 leading-relaxed mb-3 font-sans">
                  <strong>section .data</strong>: Data terinisialisasi awal.<br>
                  <strong>section .bss</strong>: Variabel cadangan tanpa nilai awal.<br>
                  <strong>section .text</strong>: Blok logika instruksi utama.
                </p>
              </div>
              <pre class="bg-slate-950 text-slate-300 p-2.5 rounded font-mono text-[10px] overflow-x-auto">section .data
  msg db 'Hello', 0xa
section .bss
  num resb 1
section .text
  global _start
_start:
<span v-if="currentArch === 'x64'">  mov rax, 1      ; sys_write
  mov rdi, 1      ; stdout
  syscall</span><span v-else>  mov eax, 4      ; sys_write
  mov ebx, 1      ; stdout
  int 0x80</span></pre>
            </div>

            <div class="border border-slate-200 rounded p-4 bg-slate-50 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-slate-700 text-xs mb-1 uppercase tracking-wider">4.2 Contoh Program Lengkap</h4>
                <p class="text-xs text-slate-600 leading-relaxed mb-3 font-sans">
                  Penerapan program Hello World mandiri untuk arsitektur {{ currentArch }}.
                </p>
              </div>
              <pre class="bg-slate-950 text-slate-300 p-2.5 rounded font-mono text-[10px] overflow-x-auto"><span v-if="currentArch === 'x64'">section .text
  global _start
_start:
  mov rdx, 14     ; panjang teks
  mov rsi, msg    ; alamat teks
  mov rdi, 1      ; stdout descriptor
  mov rax, 1      ; syscall write
  syscall

  mov rax, 60     ; syscall exit
  xor rdi, rdi    ; return 0
  syscall

section .data
  msg db 'Hello, world!', 10</span><span v-else>section .text
  global _start
_start:
  mov edx, 14     ; panjang teks
  mov ecx, msg    ; alamat teks
  mov ebx, 1      ; stdout descriptor
  mov eax, 4      ; syscall write
  int 0x80

  mov eax, 1      ; syscall exit
  xor ebx, ebx    ; return 0
  int 0x80

section .data
  msg db 'Hello, world!', 10</span></pre>
            </div>
          </div>
        </div>

        <!-- 5. Klasifikasi Instruksi (Mnemonic) -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">5</span>
            Klasifikasi Instruksi (Mnemonic)
          </h3>
          <div class="ml-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="border border-slate-200 rounded p-4 bg-slate-50">
              <h4 class="font-bold text-slate-700 text-xs mb-2 uppercase tracking-wider">5.1 Data Transfer</h4>
              <table class="w-full text-xs font-sans">
                <tbody>
                  <tr class="border-b"><td class="font-bold py-1">MOV</td><td class="text-slate-600">Pindahkan data</td><td class="font-mono text-rose-600 text-right"><code>MOV {{ currentArch === 'x64' ? 'RAX, 10' : 'EAX, 10' }}</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">PUSH</td><td class="text-slate-600">Push ke stack</td><td class="font-mono text-rose-600 text-right"><code>PUSH {{ currentArch === 'x64' ? 'RAX' : 'EAX' }}</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">POP</td><td class="text-slate-600">Pop dari stack</td><td class="font-mono text-rose-600 text-right"><code>POP {{ currentArch === 'x64' ? 'RBX' : 'EBX' }}</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">XCHG</td><td class="text-slate-600">Tukar dua nilai</td><td class="font-mono text-rose-600 text-right"><code>XCHG {{ currentArch === 'x64' ? 'RAX, RBX' : 'EAX, EBX' }}</code></td></tr>
                  <tr><td class="font-bold py-1">LEA</td><td class="text-slate-600">Ambil alamat memori (pointer)</td><td class="font-mono text-rose-600 text-right"><code>LEA {{ currentArch === 'x64' ? 'RAX, [RBP-8]' : 'EAX, [EBP-8]' }}</code></td></tr>
                </tbody>
              </table>
            </div>

            <div class="border border-slate-200 rounded p-4 bg-slate-50">
              <h4 class="font-bold text-slate-700 text-xs mb-2 uppercase tracking-wider">5.2 Aritmetika</h4>
              <table class="w-full text-xs font-sans">
                <tbody>
                  <tr class="border-b"><td class="font-bold py-1">ADD / SUB</td><td class="text-slate-600">Penjumlahan / Pengurangan</td><td class="font-mono text-rose-600 text-right"><code>ADD {{ currentArch === 'x64' ? 'RAX, 5' : 'EAX, 5' }}</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">INC / DEC</td><td class="text-slate-600">Tambah / Kurang 1</td><td class="font-mono text-rose-600 text-right"><code>INC {{ currentArch === 'x64' ? 'RAX' : 'EAX' }}</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">MUL / DIV</td><td class="text-slate-600">Perkalian / Pembagian</td><td class="font-mono text-rose-600 text-right"><code>MUL {{ currentArch === 'x64' ? 'RBX' : 'EBX' }}</code></td></tr>
                  <tr><td class="font-bold py-1">IMUL</td><td class="text-slate-600">Perkalian Bertanda</td><td class="font-mono text-rose-600 text-right"><code>IMUL {{ currentArch === 'x64' ? 'RAX, RBX, 5' : 'EAX, EBX, 5' }}</code></td></tr>
                </tbody>
              </table>
            </div>

            <div class="border border-slate-200 rounded p-4 bg-slate-50">
              <h4 class="font-bold text-slate-700 text-xs mb-2 uppercase tracking-wider">5.3 Logika & Perbandingan</h4>
              <table class="w-full text-xs font-sans">
                <tbody>
                  <tr class="border-b"><td class="font-bold py-1">AND / OR</td><td class="text-slate-600">Operasi bitwise AND / OR</td><td class="font-mono text-rose-600 text-right"><code>AND {{ currentArch === 'x64' ? 'RAX, 0xFF' : 'EAX, 0xFF' }}</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">XOR / NOT</td><td class="text-slate-600">XOR / Negasi Bitwise</td><td class="font-mono text-rose-600 text-right"><code>XOR {{ currentArch === 'x64' ? 'RAX, RAX' : 'EAX, EAX' }}</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">TEST</td><td class="text-slate-600">Bitwise test (sets flags)</td><td class="font-mono text-rose-600 text-right"><code>TEST {{ currentArch === 'x64' ? 'RAX, RAX' : 'EAX, EAX' }}</code></td></tr>
                  <tr><td class="font-bold py-1">CMP</td><td class="text-slate-600">Bandingkan 2 operan</td><td class="font-mono text-rose-600 text-right"><code>CMP {{ currentArch === 'x64' ? 'RAX, 10' : 'EAX, 10' }}</code></td></tr>
                </tbody>
              </table>
            </div>

            <div class="border border-slate-200 rounded p-4 bg-slate-50">
              <h4 class="font-bold text-slate-700 text-xs mb-2 uppercase tracking-wider">5.4 Kontrol Alur (Control Flow)</h4>
              <table class="w-full text-xs font-sans">
                <tbody>
                  <tr class="border-b"><td class="font-bold py-1">JMP</td><td class="text-slate-600">Lompat tak bersyarat</td><td class="font-mono text-rose-600 text-right"><code>JMP label</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">JE / JNE</td><td class="text-slate-600">Lompat jika Sama / Beda</td><td class="font-mono text-rose-600 text-right"><code>JE label</code></td></tr>
                  <tr class="border-b"><td class="font-bold py-1">JG / JLE</td><td class="text-slate-600">Lompat jika Besar / Kecil-Sama</td><td class="font-mono text-rose-600 text-right"><code>JG label</code></td></tr>
                  <tr><td class="font-bold py-1">CALL / RET</td><td class="text-slate-600">Panggil / Kembali Fungsi</td><td class="font-mono text-rose-600 text-right"><code>CALL fungsi</code></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 6. Perbandingan C++ vs Assembly -->
        <div class="mb-8">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">6</span>
            Perbandingan C++ vs Assembly
          </h3>
          <p class="text-xs text-slate-600 ml-4 mb-6 leading-relaxed font-sans">
            Di bawah ini adalah 3 contoh kompilasi dari kode C++ ke Assembly beserta visualisasi debugging interaktif untuk prosesor {{ currentArch }}.
          </p>

          <!-- 6.1 Contoh 1: Fungsi Penjumlahan -->
          <div class="ml-4 mb-8 border-l-4 border-blue-500 pl-4">
            <h4 class="font-bold text-slate-800 text-sm mb-2 font-sans">6.1 Contoh 1: Fungsi Penjumlahan</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-sans">
              Mengamati bagaimana stack frame dialokasikan dan argumen disalurkan ke fungsi <code>tambah()</code>.
            </p>

            <CodePanel
              cppCode="int tambah(int a, int b) {
    return a + b;
}

int main() {
    int x = 5;
    int y = 10;
    int z = tambah(x, y);
    return z;
}"
              asmX64="tambah:
    push rbp
    mov rbp, rsp
    mov DWORD [rbp-4], edi
    mov DWORD [rbp-8], esi
    mov eax, DWORD [rbp-4]
    add eax, DWORD [rbp-8]
    pop rbp
    ret

main:
    push rbp
    mov rbp, rsp
    sub rsp, 16
    mov DWORD [rbp-4], 5
    mov DWORD [rbp-8], 10
    mov edi, DWORD [rbp-4]
    mov esi, DWORD [rbp-8]
    call tambah
    mov DWORD [rbp-12], eax
    ret"
              asmX86="tambah:
    push ebp
    mov ebp, esp
    mov eax, DWORD [ebp+8]
    add eax, DWORD [ebp+12]
    pop ebp
    ret

main:
    push ebp
    mov ebp, esp
    sub esp, 16
    mov DWORD [ebp-4], 5
    mov DWORD [ebp-8], 10
    push DWORD [ebp-8]
    push DWORD [ebp-4]
    call tambah
    add esp, 8
    mov DWORD [ebp-12], eax
    ret"
              :currentArch="currentArch"
            />

            <!-- Debugger Simulator 6.1 -->
            <div class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-md">
              <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
                <span>Simulasi Penjumlahan</span>
                <span class="text-blue-400 font-mono">{{ currentArch }}</span>
              </div>
              <DebuggerPanel
                :mode="currentArch"
                :codeLines="sim61[currentArch].code"
                :activeLine="sim61[currentArch].steps[step61].l"
                :registers="sim61[currentArch].steps[step61].regs"
                :disassembly="sim61[currentArch].steps[step61].disasm"
                :stack="sim61[currentArch].steps[step61].stack"
                terminal="[Simulasi fungsi tambah]"
                class="!border-none !rounded-none shadow-none h-[400px]"
              />
              <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
                <div class="text-slate-400 text-xs">Step {{ step61 + 1 }} of {{ sim61[currentArch].steps.length }}</div>
                <div class="flex gap-2">
                  <button @click="prevStep61" :disabled="step61 === 0" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors">&lt; Back</button>
                  <button @click="nextStep61" :disabled="step61 === sim61[currentArch].steps.length - 1" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors">Next Step</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 6.2 Contoh 2: Struktur Kontrol if-else -->
          <div class="ml-4 mb-8 border-l-4 border-purple-500 pl-4">
            <h4 class="font-bold text-slate-800 text-sm mb-2 font-sans">6.2 Contoh 2: Struktur Kontrol if-else</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-sans">
              Menguji bagaimana instruksi perbandingan (<code>CMP</code>) bekerja berdampingan dengan lompatan bersyarat (<code>JLE</code>) dan tak bersyarat (<code>JMP</code>).
            </p>

            <CodePanel
              cppCode="int main() {
    int a = 10;
    int b = 20;
    int max;
    if (a > b) max = a;
    else max = b;
    return max;
}"
              asmX64="main:
    push rbp
    mov rbp, rsp
    mov DWORD [rbp-4], 10
    mov DWORD [rbp-8], 20
    mov eax, DWORD [rbp-4]
    cmp eax, DWORD [rbp-8]
    jle .L2
    mov eax, DWORD [rbp-4]
    mov DWORD [rbp-12], eax
    jmp .L3
.L2:
    mov eax, DWORD [rbp-8]
    mov DWORD [rbp-12], eax
.L3:
    mov eax, DWORD [rbp-12]
    pop rbp
    ret"
              asmX86="main:
    push ebp
    mov ebp, esp
    mov DWORD [ebp-4], 10
    mov DWORD [ebp-8], 20
    mov eax, DWORD [ebp-4]
    cmp eax, DWORD [ebp-8]
    jle .L2
    mov eax, DWORD [ebp-4]
    mov DWORD [ebp-12], eax
    jmp .L3
.L2:
    mov eax, DWORD [ebp-8]
    mov DWORD [ebp-12], eax
.L3:
    mov eax, DWORD [ebp-12]
    pop ebp
    ret"
              :currentArch="currentArch"
            />

            <!-- Debugger Simulator 6.2 -->
            <div class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-md">
              <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
                <span>Simulasi If-Else</span>
                <span class="text-blue-400 font-mono">{{ currentArch }}</span>
              </div>
              <DebuggerPanel
                :mode="currentArch"
                :codeLines="sim62[currentArch].code"
                :activeLine="sim62[currentArch].steps[step62].l"
                :registers="sim62[currentArch].steps[step62].regs"
                :disassembly="sim62[currentArch].steps[step62].disasm"
                :stack="sim62[currentArch].steps[step62].stack"
                terminal="[Simulasi kontrol alur percabangan]"
                class="!border-none !rounded-none shadow-none h-[400px]"
              />
              <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
                <div class="text-slate-400 text-xs">Step {{ step62 + 1 }} of {{ sim62[currentArch].steps.length }}</div>
                <div class="flex gap-2">
                  <button @click="prevStep62" :disabled="step62 === 0" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors">&lt; Back</button>
                  <button @click="nextStep62" :disabled="step62 === sim62[currentArch].steps.length - 1" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors">Next Step</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 6.3 Contoh 3: Perulangan for -->
          <div class="ml-4 mb-8 border-l-4 border-emerald-500 pl-4">
            <h4 class="font-bold text-slate-800 text-sm mb-2 font-sans">6.3 Contoh 3: Perulangan for</h4>
            <p class="text-xs text-slate-600 leading-relaxed mb-4 font-sans">
              Mengeksplorasi pembuatan iterasi loop dengan inisialisasi counter, pengecekan berkala, lompatan balik, dan inkrementasi otomatis.
            </p>

            <CodePanel
              cppCode="int main() {
    int sum = 0;
    for (int i = 0; i < 10; i++) {
        sum += i;
    }
    return sum;
}"
              asmX64="main:
    push rbp
    mov rbp, rsp
    mov DWORD [rbp-8], 0
    mov DWORD [rbp-4], 0
    jmp .L2
.L3:
    mov eax, DWORD [rbp-4]
    add DWORD [rbp-8], eax
    add DWORD [rbp-4], 1
.L2:
    cmp DWORD [rbp-4], 9
    jle .L3
    mov eax, DWORD [rbp-8]
    pop rbp
    ret"
              asmX86="main:
    push ebp
    mov ebp, esp
    mov DWORD [ebp-8], 0
    mov DWORD [ebp-4], 0
    jmp .L2
.L3:
    mov eax, DWORD [ebp-4]
    add DWORD [ebp-8], eax
    add DWORD [ebp-4], 1
.L2:
    cmp DWORD [ebp-4], 9
    jle .L3
    mov eax, DWORD [ebp-8]
    pop ebp
    ret"
              :currentArch="currentArch"
            />

            <!-- Debugger Simulator 6.3 -->
            <div class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-md">
              <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
                <span>Simulasi Loop</span>
                <span class="text-blue-400 font-mono">{{ currentArch }}</span>
              </div>
              <DebuggerPanel
                :mode="currentArch"
                :codeLines="sim63[currentArch].code"
                :activeLine="sim63[currentArch].steps[step63].l"
                :registers="sim63[currentArch].steps[step63].regs"
                :disassembly="sim63[currentArch].steps[step63].disasm"
                :stack="sim63[currentArch].steps[step63].stack"
                terminal="[Simulasi iterasi counter register]"
                class="!border-none !rounded-none shadow-none h-[400px]"
              />
              <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
                <div class="text-slate-400 text-xs">Step {{ step63 + 1 }} of {{ sim63[currentArch].steps.length }}</div>
                <div class="flex gap-2">
                  <button @click="prevStep63" :disabled="step63 === 0" class="px-3 py-1 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors">&lt; Back</button>
                  <button @click="nextStep63" :disabled="step63 === sim63[currentArch].steps.length - 1" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors">Next Step</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 7. Glosarium Singkat -->
        <div class="mb-8 font-sans">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">7</span>
            Glosarium Singkat
          </h3>
          <div class="overflow-x-auto ml-4 border border-slate-200 rounded-lg">
            <table class="op-table w-full">
              <thead>
                <tr class="bg-slate-100 border-b border-slate-200">
                  <th class="px-4 py-2 text-left text-xs font-bold text-slate-700">Istilah</th>
                  <th class="px-4 py-2 text-left text-xs font-bold text-slate-700">Deskripsi</th>
                </tr>
              </thead>
              <tbody class="text-xs">
                <tr class="border-b border-slate-200">
                  <td class="px-4 py-2 font-bold">Assembler</td>
                  <td class="px-4 py-2 text-slate-600">Program penerjemah kode assembly ke bahasa mesin biner (NASM, MASM, GAS).</td>
                </tr>
                <tr class="border-b border-slate-200">
                  <td class="px-4 py-2 font-bold">Mnemonic</td>
                  <td class="px-4 py-2 text-slate-600">Representasi teks singkat dari kode instruksi mesin (MOV, ADD, CALL).</td>
                </tr>
                <tr class="border-b border-slate-200">
                  <td class="px-4 py-2 font-bold">Register</td>
                  <td class="px-4 py-2 text-slate-600">Memori internal super cepat dalam prosesor untuk komputasi langsung.</td>
                </tr>
                <tr class="border-b border-slate-200">
                  <td class="px-4 py-2 font-bold">Stack</td>
                  <td class="px-4 py-2 text-slate-600">Memori LIFO untuk menyimpan alamat kembali fungsi dan variabel lokal.</td>
                </tr>
                <tr>
                  <td class="px-4 py-2 font-bold">Calling Convention</td>
                  <td class="px-4 py-2 text-slate-600">Konsensus tentang register mana yang digunakan untuk argumen dan return value.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 8. Kesimpulan -->
        <div class="mb-8 font-sans">
          <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
            <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">8</span>
            Kesimpulan
          </h3>
          <div class="ml-4 border border-slate-200 rounded p-4 bg-slate-50">
            <p class="text-xs text-slate-600 leading-relaxed">
              Bahasa mesin x86/x86-64 adalah fondasi dari seluruh operasi komputer. Memahami struktur dasar seperti <code>MOV</code>, <code>ADD</code>, <code>CMP</code>, dan <code>JMP</code> memberikan wawasan mendalam tentang bagaimana program tingkat tinggi (seperti C++) diterjemahkan ke level perangkat keras nyata.
            </p>
          </div>
        </div>
      </template>

      <template v-else-if="activeTab === 'transfer'">
        <DataTransferTab :currentArch="currentArch" />
      </template>

      <template v-else-if="activeTab === 'arith'">
        <ArithmeticTab :currentArch="currentArch" />
      </template>

      <template v-else-if="activeTab === 'cond'">
        <LogikaTab :currentArch="currentArch" />
      </template>

      <!-- Old template layout for loop -->
      <template v-else>
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
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DebuggerPanel from '../components/DebuggerPanel.vue'
import RegisterValue from '../components/RegisterValue.vue'
import FlagsRegister from '../components/FLAGS.vue'
import CodePanel from '../components/CodePanel.vue'
import { animDb } from '../data/cpp_asm_data.js'
import DataTransferTab from '../components/DataTransferTab.vue'
import ArithmeticTab from '../components/ArithmeticTab.vue'
import LogikaTab from '../components/LogikaTab.vue'

const tabs = [
  { id: 'fund', label: 'Fundamental' },
  { id: 'inst', label: 'Instruksi' },
  { id: 'transfer', label: 'Data Transfer' },
  { id: 'arith', label: 'Aritmatika' },
  { id: 'cond', label: 'Perbandingan' },
  { id: 'loop', label: 'Looping' }
]

const currentArch = ref('x64')
const activeTab = ref('fund')
const currentStep = ref(0)

const step61 = ref(0)
const step62 = ref(0)
const step63 = ref(0)

const activeData = computed(() => {
  if (activeTab.value === 'inst') {
    return { title: 'Instruksi Bahasa Mesin vs Assembly', desc: { x64: 'x64', x86: 'x86' } }
  }
  if (activeTab.value === 'transfer') {
    return { title: 'Data Transfer', desc: { x64: 'x64', x86: 'x86' } }
  }
  return animDb[activeTab.value]
})

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

// --- Interactive Simulation Data for Tab: Instruksi ---
const sim61 = {
  x64: {
    code: [
      "main:",
      "  push rbp",
      "  mov rbp, rsp",
      "  sub rsp, 16            ; Alokasi stack",
      "  mov DWORD [rbp-4], 5   ; x = 5",
      "  mov DWORD [rbp-8], 10  ; y = 10",
      "  mov edi, DWORD [rbp-4] ; edi = 5 (param 1)",
      "  mov esi, DWORD [rbp-8] ; esi = 10 (param 2)",
      "  call tambah            ; Panggil fungsi tambah()",
      "  mov DWORD [rbp-12], eax; z = eax (15)",
      "  ret",
      "",
      "tambah:",
      "  push rbp",
      "  mov rbp, rsp",
      "  mov DWORD [rbp-4], edi ; Simpan param a",
      "  mov DWORD [rbp-8], esi ; Simpan param b",
      "  mov eax, DWORD [rbp-4] ; eax = a (5)",
      "  add eax, DWORD [rbp-8] ; eax = a + b (15)",
      "  pop rbp",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { rdi: "0x00", esi: "0x00", eax: "0x00", rbp: "0x00007FFFFFFFE010", rsp: "0x00007FFFFFFFE010" }, disasm: [{ addr: "004000b0", bytes: "55", inst: "push rbp", active: true }], stack: [{ addr: "00007FFFFFFFE010", bytes: "00 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 3, regs: { rdi: "0x00", esi: "0x00", eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000b4", bytes: "48 83 ec 10", inst: "sub rsp, 16", active: true }], stack: [{ addr: "00007FFFFFFFE000", bytes: "10 E0 FF FF FF 7F 00 00", ascii: "........" }] },
      { l: 4, regs: { rdi: "0x00", esi: "0x00", eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000b8", bytes: "c7 45 fc 05...", inst: "mov DWORD [rbp-4], 5", active: true }], stack: [{ addr: "00007FFFFFFFDFFC", bytes: "05 00 00 00", ascii: "...." }] },
      { l: 5, regs: { rdi: "0x00", esi: "0x00", eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000bf", bytes: "c7 45 f8 0a...", inst: "mov DWORD [rbp-8], 10", active: true }], stack: [{ addr: "00007FFFFFFFDFFC", bytes: "05 00 00 00", ascii: "...." }, { addr: "00007FFFFFFFDFF8", bytes: "0A 00 00 00", ascii: "...." }] },
      { l: 6, regs: { rdi: "0x05", esi: "0x00", eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000c6", bytes: "8b 7d fc", inst: "mov edi, [rbp-4]", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "0A 00 00 00", ascii: "...." }] },
      { l: 7, regs: { rdi: "0x05", esi: "0x0a", eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000c9", bytes: "8b 75 f8", inst: "mov esi, [rbp-8]", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "0A 00 00 00", ascii: "...." }] },
      { l: 12, regs: { rdi: "0x05", esi: "0x0a", eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000cc", bytes: "e8 10 00 00 00", inst: "call tambah", active: true }], stack: [{ addr: "00007FFFFFFFDFF0", bytes: "D1 00 40 00 00 00 00 00", ascii: "..@....." }] },
      { l: 17, regs: { rdi: "0x05", esi: "0x0a", eax: "0x05", rbp: "0x00007FFFFFFFDFF0", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000e0", bytes: "8b 45 fc", inst: "mov eax, [rbp-4]", active: true }], stack: [{ addr: "00007FFFFFFFDFF0", bytes: "D1 00 40 00 00 00 00 00", ascii: "..@....." }] },
      { l: 18, regs: { rdi: "0x05", esi: "0x0a", eax: "0x0f", rbp: "0x00007FFFFFFFDFF0", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000e3", bytes: "03 45 f8", inst: "add eax, [rbp-8]", active: true }], stack: [{ addr: "00007FFFFFFFDFF0", bytes: "D1 00 40 00 00 00 00 00", ascii: "..@....." }] },
      { l: 9, regs: { rdi: "0x05", esi: "0x0a", eax: "0x0f", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "004000d1", bytes: "89 45 f4", inst: "mov [rbp-12], eax", active: true }], stack: [{ addr: "00007FFFFFFFDFF4", bytes: "0F 00 00 00", ascii: "...." }] }
    ]
  },
  x86: {
    code: [
      "main:",
      "  push ebp",
      "  mov ebp, esp",
      "  sub esp, 16            ; Alokasi stack",
      "  mov DWORD [ebp-4], 5   ; x = 5",
      "  mov DWORD [ebp-8], 10  ; y = 10",
      "  push DWORD [ebp-8]     ; Push parameter y (10)",
      "  push DWORD [ebp-4]     ; Push parameter x (5)",
      "  call tambah            ; Panggil fungsi tambah()",
      "  add esp, 8             ; Bersihkan stack parameter",
      "  mov DWORD [ebp-12], eax; z = eax (15)",
      "  ret",
      "",
      "tambah:",
      "  push ebp",
      "  mov ebp, esp",
      "  mov eax, DWORD [ebp+8] ; Ambil param a (5)",
      "  add eax, DWORD [ebp+12]; Tambah param b (10)",
      "  pop ebp",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00402000", esp: "0x00402000" }, disasm: [{ addr: "004000b0", bytes: "55", inst: "push ebp", active: true }], stack: [{ addr: "00402000", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 3, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401ffc", esp: "0x00401fec" }, disasm: [{ addr: "004000b4", bytes: "83 ec 10", inst: "sub esp, 16", active: true }], stack: [{ addr: "00401ffc", bytes: "00 20 40 00", ascii: ". @." }] },
      { l: 4, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401ffc", esp: "0x00401fec" }, disasm: [{ addr: "004000b7", bytes: "c7 45 fc 05...", inst: "mov DWORD [ebp-4], 5", active: true }], stack: [{ addr: "00401ff8", bytes: "05 00 00 00", ascii: "...." }] },
      { l: 5, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401ffc", esp: "0x00401fec" }, disasm: [{ addr: "004000be", bytes: "c7 45 f8 0a...", inst: "mov DWORD [ebp-8], 10", active: true }], stack: [{ addr: "00401ff8", bytes: "05 00 00 00", ascii: "...." }, { addr: "00401ff4", bytes: "0a 00 00 00", ascii: "...." }] },
      { l: 6, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401ffc", esp: "0x00401fe8" }, disasm: [{ addr: "004000c5", bytes: "ff 75 f8", inst: "push DWORD [ebp-8]", active: true }], stack: [{ addr: "00401fe8", bytes: "0a 00 00 00", ascii: "...." }] },
      { l: 7, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401ffc", esp: "0x00401fe4" }, disasm: [{ addr: "004000c8", bytes: "ff 75 fc", inst: "push DWORD [ebp-4]", active: true }], stack: [{ addr: "00401fe4", bytes: "05 00 00 00", ascii: "...." }, { addr: "00401fe8", bytes: "0a 00 00 00", ascii: "...." }] },
      { l: 13, regs: { eax: "0x00", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401ffc", esp: "0x00401fe0" }, disasm: [{ addr: "004000cb", bytes: "e8 10 00 00 00", inst: "call tambah", active: true }], stack: [{ addr: "00401fe0", bytes: "d0 00 40 00", ascii: "..@." }] },
      { l: 16, regs: { eax: "0x05", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401fdc", esp: "0x00401fdc" }, disasm: [{ addr: "004000dd", bytes: "8b 45 08", inst: "mov eax, [ebp+8]", active: true }], stack: [{ addr: "00401fe4", bytes: "05 00 00 00", ascii: "...." }, { addr: "00401fe8", bytes: "0a 00 00 00", ascii: "...." }] },
      { l: 17, regs: { eax: "0x0f", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401fdc", esp: "0x00401fdc" }, disasm: [{ addr: "004000e0", bytes: "03 45 0c", inst: "add eax, [ebp+12]", active: true }], stack: [{ addr: "00401fe4", bytes: "05 00 00 00", ascii: "...." }, { addr: "00401fe8", bytes: "0a 00 00 00", ascii: "...." }] },
      { l: 9, regs: { eax: "0x0f", ebx: "0x00", ecx: "0x00", edx: "0x00", ebp: "0x00401ffc", esp: "0x00401fec" }, disasm: [{ addr: "004000d0", bytes: "83 c4 08", inst: "add esp, 8", active: true }], stack: [{ addr: "00401ff0", bytes: "00 00 00 00", ascii: "...." }] }
    ]
  }
}

const sim62 = {
  x64: {
    code: [
      "main:",
      "  push rbp",
      "  mov rbp, rsp",
      "  mov DWORD [rbp-4], 10  ; a = 10",
      "  mov DWORD [rbp-8], 20  ; b = 20",
      "  mov eax, DWORD [rbp-4] ; eax = a (10)",
      "  cmp eax, DWORD [rbp-8] ; Bandingkan 10 dengan 20",
      "  jle .L2                ; Lompat jika <= (10 <= 20)",
      "  mov eax, DWORD [rbp-4]",
      "  mov DWORD [rbp-12], eax",
      "  jmp .L3",
      ".L2:",
      "  mov eax, DWORD [rbp-8] ; eax = b (20)",
      "  mov DWORD [rbp-12], eax; max = b (20)",
      ".L3:",
      "  mov eax, DWORD [rbp-12]; return max",
      "  pop rbp",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE010", rsp: "0x00007FFFFFFFE010", rflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "00400100", bytes: "55", inst: "push rbp", active: true }], stack: [{ addr: "00007FFFFFFFE010", bytes: "00 00 00 00 00 00 00 00", ascii: "........" }] },
      { l: 3, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "00400104", bytes: "c7 45 fc 0a...", inst: "mov DWORD [rbp-4], 10", active: true }], stack: [{ addr: "00007FFFFFFFDFFC", bytes: "0A 00 00 00", ascii: "...." }] },
      { l: 4, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "0040010b", bytes: "c7 45 f8 14...", inst: "mov DWORD [rbp-8], 20", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 5, regs: { eax: "0x0a", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "00400112", bytes: "8b 45 fc", inst: "mov eax, [rbp-4]", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 6, regs: { eax: "0x0a", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "00400115", bytes: "3b 45 f8", inst: "cmp eax, [rbp-8]", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 7, regs: { eax: "0x0a", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "00400118", bytes: "7e 0a", inst: "jle .L2", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 12, regs: { eax: "0x14", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "0040011a", bytes: "8b 45 f8", inst: "mov eax, [rbp-8]", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 13, regs: { eax: "0x14", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "0040011d", bytes: "89 45 f4", inst: "mov [rbp-12], eax", active: true }], stack: [{ addr: "00007FFFFFFFDFF4", bytes: "14 00 00 00", ascii: "...." }] }
    ]
  },
  x86: {
    code: [
      "main:",
      "  push ebp",
      "  mov ebp, esp",
      "  mov DWORD [ebp-4], 10  ; a = 10",
      "  mov DWORD [ebp-8], 20  ; b = 20",
      "  mov eax, DWORD [ebp-4] ; eax = a (10)",
      "  cmp eax, DWORD [ebp-8] ; Bandingkan 10 dengan 20",
      "  jle .L2                ; Lompat jika <= (10 <= 20)",
      "  mov eax, DWORD [ebp-4]",
      "  mov DWORD [ebp-12], eax",
      "  jmp .L3",
      ".L2:",
      "  mov eax, DWORD [ebp-8] ; eax = b (20)",
      "  mov DWORD [ebp-12], eax; max = b (20)",
      ".L3:",
      "  mov eax, DWORD [ebp-12]; return max",
      "  pop ebp",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { eax: "0x00", ebp: "0x00402000", esp: "0x00402000", eflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "00400100", bytes: "55", inst: "push ebp", active: true }], stack: [{ addr: "00402000", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 3, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "00400104", bytes: "c7 45 fc 0a...", inst: "mov DWORD [ebp-4], 10", active: true }], stack: [{ addr: "00401ff8", bytes: "0A 00 00 00", ascii: "...." }] },
      { l: 4, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "0040010b", bytes: "c7 45 f8 14...", inst: "mov DWORD [ebp-8], 20", active: true }], stack: [{ addr: "00401ff4", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 5, regs: { eax: "0x0a", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=0 SF=0 ]" }, disasm: [{ addr: "00400112", bytes: "8b 45 fc", inst: "mov eax, [ebp-4]", active: true }], stack: [{ addr: "00401ff4", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 6, regs: { eax: "0x0a", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "00400115", bytes: "3b 45 f8", inst: "cmp eax, [ebp-8]", active: true }], stack: [{ addr: "00401ff4", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 7, regs: { eax: "0x0a", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "00400118", bytes: "7e 0a", inst: "jle .L2", active: true }], stack: [{ addr: "00401ff4", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 12, regs: { eax: "0x14", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "0040011a", bytes: "8b 45 f8", inst: "mov eax, [ebp-8]", active: true }], stack: [{ addr: "00401ff4", bytes: "14 00 00 00", ascii: "...." }] },
      { l: 13, regs: { eax: "0x14", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=0 SF=1 OF=0 CF=1 ]" }, disasm: [{ addr: "0040011d", bytes: "89 45 f4", inst: "mov [ebp-12], eax", active: true }], stack: [{ addr: "00401ff0", bytes: "14 00 00 00", ascii: "...." }] }
    ]
  }
}

const sim63 = {
  x64: {
    code: [
      "main:",
      "  push rbp",
      "  mov rbp, rsp",
      "  mov DWORD [rbp-8], 0   ; sum = 0",
      "  mov DWORD [rbp-4], 0   ; i = 0",
      "  jmp .L2                ; Lompat ke kondisi",
      ".L3:",
      "  mov eax, DWORD [rbp-4] ; eax = i",
      "  add DWORD [rbp-8], eax ; sum += i",
      "  add DWORD [rbp-4], 1   ; i++",
      ".L2:",
      "  cmp DWORD [rbp-4], 9   ; i <= 9?",
      "  jle .L3                ; Jika ya, loop balik",
      "  mov eax, DWORD [rbp-8] ; eax = sum",
      "  pop rbp",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE010", rsp: "0x00007FFFFFFFE010" }, disasm: [{ addr: "00400140", bytes: "55", inst: "push rbp", active: true }], stack: [] },
      { l: 3, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "00400144", bytes: "c7 45 f8 00...", inst: "mov DWORD [rbp-8], 0", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 4, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "0040014b", bytes: "c7 45 fc 00...", inst: "mov DWORD [rbp-4], 0", active: true }], stack: [{ addr: "00007FFFFFFFDFFC", bytes: "00 00 00 00", ascii: "...." }, { addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 5, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "00400152", bytes: "eb 0e", inst: "jmp .L2", active: true }], stack: [] },
      { l: 11, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0", rflags: "[ ZF=1 SF=0 ]" }, disasm: [{ addr: "00400162", bytes: "83 7d fc 09", inst: "cmp DWORD [rbp-4], 9", active: true }], stack: [] },
      { l: 12, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "00400166", bytes: "7e e8", inst: "jle .L3", active: true }], stack: [] },
      { l: 7, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "00400154", bytes: "8b 45 fc", inst: "mov eax, [rbp-4]", active: true }], stack: [] },
      { l: 8, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "00400157", bytes: "01 45 f8", inst: "add [rbp-8], eax", active: true }], stack: [{ addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 9, regs: { eax: "0x00", rbp: "0x00007FFFFFFFE000", rsp: "0x00007FFFFFFFDFF0" }, disasm: [{ addr: "0040015a", bytes: "83 45 fc 01", inst: "add DWORD [rbp-4], 1", active: true }], stack: [{ addr: "00007FFFFFFFDFFC", bytes: "01 00 00 00", ascii: "...." }] }
    ]
  },
  x86: {
    code: [
      "main:",
      "  push ebp",
      "  mov ebp, esp",
      "  mov DWORD [ebp-8], 0   ; sum = 0",
      "  mov DWORD [ebp-4], 0   ; i = 0",
      "  jmp .L2                ; Lompat ke kondisi",
      ".L3:",
      "  mov eax, DWORD [ebp-4] ; eax = i",
      "  add DWORD [ebp-8], eax ; sum += i",
      "  add DWORD [ebp-4], 1   ; i++",
      ".L2:",
      "  cmp DWORD [ebp-4], 9   ; i <= 9?",
      "  jle .L3                ; Jika ya, loop balik",
      "  mov eax, DWORD [ebp-8] ; eax = sum",
      "  pop ebp",
      "  ret"
    ],
    steps: [
      { l: 0, regs: { eax: "0x00", ebp: "0x00402000", esp: "0x00402000" }, disasm: [{ addr: "00400140", bytes: "55", inst: "push ebp", active: true }], stack: [] },
      { l: 3, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0" }, disasm: [{ addr: "00400144", bytes: "c7 45 f8 00...", inst: "mov DWORD [ebp-8], 0", active: true }], stack: [{ addr: "00401ff4", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 4, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0" }, disasm: [{ addr: "0040014b", bytes: "c7 45 fc 00...", inst: "mov DWORD [ebp-4], 0", active: true }], stack: [{ addr: "00401ff8", bytes: "00 00 00 00", ascii: "...." }, { addr: "00401ff4", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 5, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0" }, disasm: [{ addr: "00400152", bytes: "eb 0e", inst: "jmp .L2", active: true }], stack: [] },
      { l: 11, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0", eflags: "[ ZF=1 SF=0 ]" }, disasm: [{ addr: "00400162", bytes: "83 7d fc 09", inst: "cmp DWORD [ebp-4], 9", active: true }], stack: [] },
      { l: 12, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0" }, disasm: [{ addr: "00400166", bytes: "7e e8", inst: "jle .L3", active: true }], stack: [] },
      { l: 7, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0" }, disasm: [{ addr: "00400154", bytes: "8b 45 fc", inst: "mov eax, [ebp-4]", active: true }], stack: [] },
      { l: 8, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0" }, disasm: [{ addr: "00400157", bytes: "01 45 f8", inst: "add [ebp-8], eax", active: true }], stack: [{ addr: "00401ff4", bytes: "00 00 00 00", ascii: "...." }] },
      { l: 9, regs: { eax: "0x00", ebp: "0x00401ffc", esp: "0x00401ff0" }, disasm: [{ addr: "0040015a", bytes: "83 45 fc 01", inst: "add DWORD [ebp-4], 1", active: true }], stack: [{ addr: "00401ff8", bytes: "01 00 00 00", ascii: "...." }] }
    ]
  }
}

function setArch(arch) {
  currentArch.value = arch
  currentStep.value = 0
  step61.value = 0
  step62.value = 0
  step63.value = 0
}

function setTab(tabId) {
  activeTab.value = tabId
  currentStep.value = 0
  step61.value = 0
  step62.value = 0
  step63.value = 0
}

function nextStep() {
  if (currentSim.value && currentStep.value < currentSim.value.steps.length - 1) {
    currentStep.value++
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function nextStep61() {
  if (step61.value < sim61[currentArch.value].steps.length - 1) {
    step61.value++
  }
}

function prevStep61() {
  if (step61.value > 0) {
    step61.value--
  }
}

function nextStep62() {
  if (step62.value < sim62[currentArch.value].steps.length - 1) {
    step62.value++
  }
}

function prevStep62() {
  if (step62.value > 0) {
    step62.value--
  }
}

function nextStep63() {
  if (step63.value < sim63[currentArch.value].steps.length - 1) {
    step63.value++
  }
}

function prevStep63() {
  if (step63.value > 0) {
    step63.value--
  }
}
</script>

