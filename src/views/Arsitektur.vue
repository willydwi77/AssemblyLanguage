<template>
  <div class="main-container py-6">
    <!-- Header -->
    <div class="card bg-white mb-6">
      <h1 class="page-title">Panduan Instruksi Mesin (x86 & x64)</h1>
      <p class="page-subtitle">Pelajari detail instruksi memori, aritmatika, dan alur kontrol secara dinamis dengan sintaks Intel.</p>
      
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
          { tab.label }
        </button>
    </div>

    <!-- Content -->
    <div v-if="activeData" class="card bg-white">
      <h2 class="section-title">{ activeData.title }</h2>
      <p class="content-desc">{ activeData.desc[currentArch] }</p>

      <div v-if="activeData.note" class="info-box">
        { activeData.note[currentArch] }
      </div>

      <div v-if="activeData.code" class="w-full flex mt-4 overflow-hidden rounded-lg shadow-sm">
        <pre class="code-block w-full flex-1 min-w-0"><code v-html="activeData.code[currentArch]"></code></pre>
      </div>

      <div v-if="activeData.items" class="space-y-6 mt-6">
        <div v-for="(item, idx) in activeData.items" :key="idx" class="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
          <div class="bg-white px-4 py-4 border-b border-slate-200">
            <h3 class="font-bold text-slate-800 text-base mb-2">{ item.name }</h3>
            <p class="text-[0.95rem] text-slate-600">{ item.desc }</p>
          </div>
          <div class="w-full flex">
            <pre class="code-block w-full flex-1 min-w-0 !rounded-none !border-0"><code v-html="item.code[currentArch]"></code></pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const contentDb = {
    mem: {
      title: 'Memori & Addressing Modes',
      desc: {
        x64: 'Di x86-64, memori beralamat 8 Byte (64-bit). Alamat diakses menggunakan offset dari lokasi instruksi yang sedang berjalan.',
        x86: 'Di x86 klasik, memori beralamat 4 Byte (32-bit). Alamat sering dipanggil secara absolut dari awal, atau diakses menggunakan perhitungan kombinasi dari basis dan indeks register memori.'
      },
      note: {
        x64: 'Salah satu fitur terpenting di x64 adalah RIP-relative addressing yang memungkinkan Position Independent Code (PIC) di mana memori aman diacak oleh sistem keamanan.',
        x86: 'Pengalamatan 32-bit tidak memiliki fitur EIP-relative (relatif dari posisi eksekusi).'
      },
      code: {
        x64: `; 1. RIP-Relative (Standar x64 Modern)
mov rax, [rel my_var]

; 2. Register Indirect
mov rax, [rbx]

; 3. Base + Displacement
mov rax, [rbp - 16]

; 4. Base + Index * Scale + Displacement
mov rax, [rsi + rcx*8 + 24] ; Scale maksimal 8 untuk 64-bit

; Penunjuk Ukuran (Size Directives)
mov QWORD PTR [rbx], 2 ; Menulis 8 Byte ke memori
mov DWORD PTR [rbx], 2 ; Menulis 4 Byte ke memori`,
        x86: `; 1. Direct (Absolut ke alamat statis)
mov eax, [0x403000]

; 2. Register Indirect
mov eax, [ebx]

; 3. Base + Displacement
mov eax, [ebp - 8]

; 4. Base + Index * Scale + Displacement
mov eax, [esi + ecx*4 + 12] ; Scale maksimal 4 untuk 32-bit

; Penunjuk Ukuran (Size Directives)
mov DWORD PTR [ebx], 2 ; Menulis 4 Byte ke memori
mov BYTE PTR [ebx], 2  ; Menulis 1 Byte ke memori`
      }
    },
    data: {
      title: 'Instruksi Data Movement',
      desc: {
        x64: 'Keluarga instruksi yang ditugaskan murni untuk memindahkan data antar register atau RAM di lingkungan x64 tanpa mengubah nilai matematika aslinya.',
        x86: 'Keluarga instruksi yang ditugaskan murni untuk memindahkan data antar register atau RAM di lingkungan x86 tanpa mengubah nilai matematika aslinya.'
      },
      items: [
        {
          name: 'MOV (Move)',
          desc: 'Menyalin data dari sumber ke tujuan.',
          note: 'Catatan penting: Menyalin secara langsung dari RAM ke RAM tidak diperbolehkan secara arsitektur. Anda harus menggunakan satu register tambahan sebagai perantara.',
          code: {
            x64: `mov rax, rbx       ; Salin isi RBX ke RAX\nmov rax, [rbx]     ; BACA RAM di alamat RBX, salin ke RAX\nmov [rbx], rax     ; TULIS nilai RAX ke RAM alamat RBX`,
            x86: `mov eax, ebx       ; Salin isi EBX ke EAX\nmov eax, [ebx]     ; BACA RAM di alamat EBX, salin ke EAX\nmov [ebx], eax     ; TULIS nilai EAX ke RAM alamat EBX`
          }
        },
        {
          name: 'LEA (Load Effective Address)',
          desc: 'Menghitung rumusan alamat memori dan MENYIMPAN alamat/koordinat angkanya ke register.',
          note: 'Perlu diperhatikan: LEA tidak membaca atau menyentuh memori di RAM. Instruksi ini murni perhitungan matematis (A = B + C*4). Sering dipakai compiler (gcc/clang) untuk perhitungan cepat tiga bilangan.',
          code: {
            x64: `lea rax, [rbx+rcx*4] ; RAX murni diisi hasil (RBX + RCX*4)\nlea rdi, [rel msg]   ; Dapatkan alamat dinamis 'msg'`,
            x86: `lea eax, [ebx+ecx*4] ; EAX murni diisi hasil (EBX + ECX*4)\nlea edi, [msg]       ; Dapatkan alamat statis 'msg'`
          }
        }
      ]
    },
    arith: {
      title: 'Instruksi Aritmatika',
      desc: {
        x64: 'Operasi perhitungan matematis dasar. Eksekusi instruksi ini akan otomatis mengubah penanda Flags (seperti status Nol, Overflow, atau Negatif) di dalam register RFLAGS.',
        x86: 'Operasi perhitungan matematis dasar. Eksekusi instruksi ini akan otomatis mengubah penanda Flags (seperti status Nol, Overflow, atau Negatif) di dalam register EFLAGS.'
      },
      items: [
        {
          name: 'ADD / SUB (Penjumlahan / Pengurangan)',
          desc: 'Mengoperasikan Penjumlahan (ADD) atau Pengurangan (SUB) dan menyimpan nilai akhirnya menimpa argumen pertama.',
          code: {
            x64: `add rax, 10    ; RAX = RAX + 10\nsub rbx, rcx   ; RBX = RBX - RCX`,
            x86: `add eax, 10    ; EAX = EAX + 10\nsub ebx, ecx   ; EBX = EBX - ECX`
          }
        },
        {
          name: 'MUL / IMUL (Perkalian)',
          desc: 'Instruksi perkalian standar. Terdapat dua jenis: MUL untuk angka mutlak (tanpa tanda) dan IMUL untuk angka bertanda.',
          note: 'Bila nilai perkalian meluap (overflow) dari satu register (menjadi terlalu besar), nilai tersebut akan ditampung di gabungan 2 register berpasangan (contoh: RDX:RAX).',
          code: {
            x64: `imul rdx, rcx  ; RDX = RDX * RCX\n\n; Perkalian 64-bit yang meluap menjadi 128-bit\nmov rax, 5\nmul rcx        ; Pasangan RDX:RAX = RAX * RCX`,
            x86: `imul edx, ecx  ; EDX = EDX * ECX\n\n; Perkalian 32-bit yang meluap menjadi 64-bit\nmov eax, 5\nmul ecx        ; Pasangan EDX:EAX = EAX * ECX`
          }
        },
        {
          name: 'DIV / IDIV (Pembagian)',
          desc: 'Instruksi pembagian. Sama seperti perkalian, hasil dan sisa pembagian (remainder) didistribusikan ke dua register.',
          note: 'Sebelum memanggil perintah IDIV, Anda sangat diwajibkan memanggil instruksi perluasan (CQO / CDQ) agar pembilang disiapkan di 2 blok register secara benar dan tidak merusak hasil.',
          code: {
            x64: `mov rax, 15    ; Pembilang\ncqo            ; Perintah Sign-extend RAX ke pasangan RDX:RAX\nidiv rcx       ; Hasil pembagian = RAX, Sisa (Remainder) = RDX`,
            x86: `mov eax, 15    ; Pembilang\ncdq            ; Perintah Sign-extend EAX ke pasangan EDX:EAX\nidiv ecx       ; Hasil pembagian = EAX, Sisa (Remainder) = EDX`
          }
        }
      ]
    },
    flow: {
      title: 'Instruksi Control Flow',
      desc: {
        x64: 'Instruksi untuk mengatur kendali aliran logika eksekusi program. Biasanya melibatkan kombinasi dari perbandingan terlebih dahulu, baru kemudian memutuskan untuk melompat ke blok memori lain.',
        x86: 'Instruksi untuk mengatur kendali aliran logika eksekusi program. Biasanya melibatkan kombinasi dari perbandingan terlebih dahulu, baru kemudian memutuskan untuk melompat ke blok memori lain.'
      },
      items: [
        {
          name: 'CMP / TEST (Pemeriksaan Kondisi)',
          desc: 'Instruksi ini melakukan komputasi matematika namun hasilnya TIDAK disimpan, melainkan hanya bit indikator Flags (ZF/SF/OF) saja yang akan terpengaruh.',
          note: 'Penggunaan TEST lebih cepat diproses oleh CPU daripada CMP jika tujuan akhirnya murni hanya untuk mengecek apakah register bernilai nol atau tidak.',
          code: {
            x64: `cmp rax, rbx   ; Kurangi RAX - RBX maya. Jika sama, ZF (Zero Flag) diset 1\ntest rax, rax  ; Bitwise AND maya. Cepat mengecek RAX apakah bernilai 0.`,
            x86: `cmp eax, ebx   ; Kurangi EAX - EBX maya. Jika sama, ZF (Zero Flag) diset 1\ntest eax, eax  ; Bitwise AND maya. Cepat mengecek EAX apakah bernilai 0.`
          }
        },
        {
          name: 'JMP (Unconditional Jump)',
          desc: 'Melompat paksa ke label/alamat tujuan tanpa perlu mengecek syarat apapun.',
          code: {
            x64: `jmp .selesai_program`,
            x86: `jmp .selesai_program`
          }
        },
        {
          name: 'JE / JNE (Jump Kesamaan)',
          desc: 'Lompatan bersyarat yang sangat sering ditempelkan persis di bawah instruksi CMP. Lompatan hanya akan terjadi apabila nilai bendera Flags memenuhi kriteria.',
          code: {
            x64: `cmp rax, 10\nje .kondisi_sama     ; Lompat JIKA ZF = 1 (Karena 10-10 = 0)\njne .kondisi_beda    ; Lompat JIKA ZF = 0`,
            x86: `cmp eax, 10\nje .kondisi_sama     ; Lompat JIKA ZF = 1 (Karena 10-10 = 0)\njne .kondisi_beda    ; Lompat JIKA ZF = 0`
          }
        },
        {
          name: 'JG / JL / JGE / JLE (Jump Besar/Kecil)',
          desc: 'Lompatan bersyarat untuk pengecekan tipe rentang angka (Lebih Besar, Lebih Kecil, dsj). Digunakan pada angka bertanda (Signed).',
          code: {
            x64: `cmp rax, 10\njg .lebih_besar\njl .lebih_kecil\njge .besar_sama_dengan`,
            x86: `cmp eax, 10\njg .lebih_besar\njl .lebih_kecil\njge .besar_sama_dengan`
          }
        }
      ]
    },
    call: {
      title: 'Calling Convention (Pemanggilan Fungsi)',
      desc: {
        x64: 'Aturan baku yang ditetapkan produsen sistem operasi mengenai bagaimana fungsi A boleh memanggil fungsi B dengan menyerahkan argumen di antara mereka. Lingkungan x64 (Windows Fastcall) sangat agresif menggunakan register hardware agar super cepat.',
        x86: 'Aturan baku mengenai penyetoran argumen fungsi A ke fungsi B. Lingkungan 32-bit (CDECL/STDCALL) relatif lambat karena mengandalkan pengiriman satu per satu parameter ke memori RAM/Stack.'
      },
      note: {
        x64: 'Di Windows x64 ABI, setiap caller Wajib mengalokasikan area khusus sebesar 32 byte di stack (Shadow Space / Spill Space) sesaat sebelum memanggil fungsi.',
        x86: 'Di x86 klasik, caller bertanggung jawab memulihkan kembali sisa sampah memori (Stack Cleanup) yang tadinya dialokasikan untuk lempar parameter sesaat setelah fungsi terpanggil kembali/selesai.'
      },
      code: {
        x64: `; Kasus: Memanggil fungsi my_func(10, 20, 30)\n\n; 1. Masukkan argumen (Aturan baku: RCX, RDX, R8, R9)\nmov rcx, 10\nmov rdx, 20\nmov r8, 30\n\n; 2. Alokasikan Shadow Space (32 byte)\nsub rsp, 32\n\n; 3. Panggil fungsi\ncall my_func\n\n; 4. Bebaskan/bersihkan Shadow Space\nadd rsp, 32\n\n; Hasil nilai (Return Value) tersimpan otomatis di register RAX`,
        x86: `; Kasus: Memanggil fungsi my_func(10, 20, 30)\n\n; 1. Masukkan argumen (Didorong masuk Stack dari Kanan ke Kiri)\npush 30\npush 20\npush 10\n\n; 2. Panggil fungsi\ncall my_func\n\n; 3. Bebaskan memori Stack kotor (3 argumen x 4 byte = 12 byte)\nadd esp, 12\n\n; Hasil nilai (Return Value) tersimpan otomatis di register EAX`
      }
    }
  };

const tabs = [
  { id: 'mem', label: 'Memori & Addressing' },
  { id: 'data', label: 'Data Movement' },
  { id: 'arith', label: 'Aritmatika Dasar' },
  { id: 'logic', label: 'Logika & Bitwise' },
  { id: 'ctrl', label: 'Control Flow (Percabangan)' }
]

const currentArch = ref('x64')
const activeTab = ref('mem')

const activeData = computed(() => contentDb[activeTab.value])

function setArch(arch) {
  currentArch.value = arch
}

function setTab(tabId) {
  activeTab.value = tabId
}
</script>
