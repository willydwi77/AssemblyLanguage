---
name: Frontend Conventions
description: Panduan penulisan dan konvensi komponen frontend untuk proyek AssemblyLanguage.
---

# Aturan Penulisan dan Penggunaan Debugger Panel

Komponen `DebuggerPanel.vue` digunakan untuk mensimulasikan eksekusi kode Assembly dengan antarmuka debugger secara interaktif. Panel ini mencakup *Source Code*, *Terminal*, *Registers*, *Disassembly*, dan *Stack Memory*.

## 1. Konvensi Internal `DebuggerPanel.vue`

- **State Retention / History**: Komponen menggunakan variabel `disasmHistory` dan `stackHistory` untuk secara cerdas mengingat riwayat memori dari *props* `disassembly` dan `stack` pada setiap langkah (*step*) baru. Ini mencegah baris memori melompat-lompat saat simulasi berjalan.
- **Padding Otomatis**: 
  - Komponen secara statis menampilkan 15 baris untuk *Disassembly* dan 128 baris untuk *Stack Memory*. 
  - Jika data dari _step_ saat ini kurang, panel otomatis membuat data _dummy_.
  - Untuk `x86` (32-bit), alamat *stack dummy* bertambah sebanyak 4 byte (+4) dengan isian 4 blok byte (`00 00 00 00`).
  - Untuk `x64` (64-bit), alamat *stack dummy* bertambah sebanyak 8 byte (+8) dengan isian 8 blok byte (`00 00 00 00 00 00 00 00`).
  - Untuk *Disassembly*, instruksi dummy akan mengisi ruang kosong dan alamat bertambah 4 byte berurutan.
- **Scroll Bar Permanen**: Setiap kotak tampilan (*Source Code, Terminal, Registers, Disassembly, Stack*) menggunakan kelas CSS `overflow-y-scroll overflow-x-auto` yang dipadukan dengan *flex* `min-h-0` dan `min-w-0` agar *scrollbar* bisa digunakan tanpa merusak batas struktural *layout flexbox*.
- **Clear History**: Riwayat (history) pada panel otomatis dibersihkan (reset) jika *props* arsitektur (`mode`) atau kode (`codeLines`) berubah.

## 2. Contoh Penerapan (`Fundamental.vue`)

Dalam sebuah view (contoh: `Fundamental.vue`), `DebuggerPanel` biasanya dipanggil bersamaan dengan data simulasi yang diambil berdasarkan step dan arsitektur aktif.

```vue
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
```

## 3. Struktur Data Animasi Menu "Hello World"

Data eksekusi dari masing-masing simulasi sebaiknya disimpan terpisah (misalnya di `cpp_asm_data.js`). Struktur untuk menu "Hello World" harus mematuhi hierarki arsitektur (`x64` / `x86`) dan array `steps`.

Berikut adalah struktur referensi berdasarkan menu "Hello World":

```javascript
export const animDb = {
  hello: {
    title: 'Kasus: Hello World',
    desc: {
      x64: 'Deskripsi untuk arsitektur 64-bit...',
      x86: 'Deskripsi untuk arsitektur 32-bit...'
    },
    isAnim: true,
    cppCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello\\n";\n    return 0;\n}`,
    x64: {
      code: [
        "; Windows x64 ABI",
        "extern printf",
        "section .data",
        "  msg db 'Hello', 0",
        "section .text",
        "global main",
        "main:",
        "  sub rsp, 32         ; 1. Shadow Space",
        "  lea rcx, [rel msg]  ; 2. Argumen 1",
        "  call printf         ; 3. Panggil",
        "  add rsp, 32         ; 4. Cleanup",
        "  ret"
      ],
      steps: [
        {
          l: 7, // Indeks baris aktif (Source Code, mulai dari 0)
          regs: { 
            "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", 
            "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", 
            "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" 
          },
          disasm: [
            { addr: "004000b0", bytes: "48 83 ec 20", inst: "sub rsp, 0x20", active: true },
            { addr: "004000b4", bytes: "48 8d 0d 45...", inst: "lea rcx, [rip+0x402000]", active: false },
            { addr: "004000bb", bytes: "e8 00 00 00...", inst: "call printf", active: false }
          ],
          stack: [
            { addr: "00007FFFFFFFE000", bytes: "00 00 00 00 00 00 00 00", ascii: "........" },
            { addr: "00007FFFFFFFDFE0", bytes: "00 00 00 00 00 00 00 00", ascii: "........" }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_world\n"
        },
        // ... langkah (steps) berikutnya
      ]
    },
    x86: {
      // Struktur serupa untuk x86 (Register dengan e- prefix, stack 4 byte, dst.)
    }
  }
}
```

### Panduan Properti pada setiap *Step* (`currentStepData`)
- **`l` (Line):** Menentukan indeks elemen baris pada array `code` (dimulai dari 0) yang akan diberikan indikator *highlight* pada *Source Code*.
- **`regs`:** Objek Key-Value berisi nama register dan nilainya. (x64: rax, rbx dsb. x86: eax, ebx, dsb.).
- **`disasm`:** Kumpulan instruksi per langkah. Cukup sertakan sedikit instruksi di sekitar baris eksekusi karena fitur *history accumulation* akan merekam dan menyatukan semua yang sudah pernah dimuat. Gunakan properti `active: true` untuk menyorot baris saat ini.
- **`stack`:** Perubahan pada memori stack untuk tahapan eksekusi tersebut. Panjang byte harus 4-byte untuk arsitektur x86 dan 8-byte untuk x64.
- **`term`:** String teks atau HTML yang akan ditampilkan sebagai *output* terminal (contoh: *prompt shell* atau cetakan layar program).
