# Fundamental Bahasa Mesin x86 Intel

## 1. Arsitektur Dasar x86/x86-64

Arsitektur x86 adalah arsitektur instruksi kompleks (CISC) yang mendominasi komputasi desktop dan server. Versi 64-bit-nya, yang dikenal sebagai x86-64 atau AMD64, memperluas kemampuan arsitektur 32-bit (IA-32) asli. Pemahaman tentang arsitektur ini sangat penting untuk menulis kode assembly yang efisien .

Komponen utama dari arsitektur ini meliputi:

### a. **Registers (Register)**

Register adalah lokasi penyimpanan data berkecepatan tinggi di dalam CPU. Setiap register memiliki fungsi tertentu. Pada x86-64, terdapat 16 register tujuan umum 64-bit :

| Register 64-bit | Register 32-bit | Register 16-bit | Register 8-bit (Low/High) | Fungsi Utama |
| :--- | :--- | :--- | :--- | :--- |
| **RAX** | EAX | AX | AL / AH | Akumulator; digunakan untuk operasi aritmetika dan menyimpan hasil fungsi . |
| **RBX** | EBX | BX | BL / BH | Base; register tujuan umum. |
| **RCX** | ECX | CX | CL / CH | Counter; sering digunakan sebagai penghitung loop. |
| **RDX** | EDX | DX | DL / DH | Data; digunakan dalam operasi I/O dan aritmetika (misal, `mul`, `div`) . |
| **RSI** | ESI | SI | SIL | Source Index; digunakan untuk operasi string dan sebagai sumber data . |
| **RDI** | EDI | DI | DIL | Destination Index; digunakan untuk operasi string dan sebagai tujuan data . |
| **RSP** | ESP | SP | SPL | Stack Pointer; menunjuk ke puncak tumpukan (stack) . |
| **RBP** | EBP | BP | BPL | Base Pointer; digunakan untuk menunjuk ke frame stack . |
| **RIP** | EIP | IP | - | Instruction Pointer; menyimpan alamat instruksi selanjutnya yang akan dieksekusi . |

Selain itu, terdapat **RFLAGS** (atau EFLAGS pada 32-bit), sebuah register bendera yang menyimpan status hasil operasi, seperti *Zero Flag* (ZF), *Carry Flag* (CF), dan *Overflow Flag* (OF) .

### b. **Memory Addressing (Pengalamatan Memori)**

x86 mendukung berbagai mode pengalamatan untuk mengakses data di memori :
*   **Register:** Operan berada di dalam register (contoh: `mov rax, rbx`).
*   **Immediate:** Operan adalah nilai konstanta (contoh: `mov rax, 5`).
*   **Direct:** Alamat memori ditentukan secara langsung (contoh: `mov rax, [0x00402000]`).
*   **Indirect:** Alamat memori disimpan dalam sebuah register (contoh: `mov rax, [rbx]`).
*   **Base-Index with Displacement:** Kombinasi yang umum dan powerful (contoh: `mov rax, [rbx + rcx*4 + 8]`), digunakan untuk mengakses array dan struktur data .

### c. **Instruction Set (Set Instruksi)**

Set instruksi dasar mencakup operasi-operasi seperti :
*   **Data Transfer:** `mov` (memindahkan data).
*   **Aritmetika:** `add`, `sub`, `mul`, `div` (perkalian dan pembagian seringkali menggunakan register RAX/RDX secara implisit) .
*   **Logika:** `and`, `or`, `xor`, `not`.
*   **Kontrol Alur:** `jmp` (lompat tak bersyarat), `je`/`jz` (lompat jika sama/nol), `call` (panggil fungsi), `ret` (kembali dari fungsi) .
*   **Stack:** `push` (masukkan data ke stack), `pop` (keluarkan data dari stack).

## 2. Ekstensi Modern dan SIMD

Prosesor x86 modern memiliki ekstensi untuk pemrosesan data paralel, yang dikenal sebagai **SIMD (Single Instruction, Multiple Data)**. Instruksi-instruksi ini memungkinkan satu instruksi untuk melakukan operasi yang sama pada beberapa data sekaligus, yang sangat berguna untuk komputasi berat seperti pemrosesan gambar, machine learning, dan grafik .

*   **MMX, SSE, SSE2, SSE3, SSSE3, SSE4:** Generasi awal ekstensi SIMD yang menggunakan register 64-bit atau 128-bit (`XMM0` - `XMM15`).
*   **AVX, AVX2, AVX-512:** Generasi terbaru. AVX menggunakan register 256-bit (`YMM0` - `YMM15`), dan AVX-512 menggunakan register 512-bit (`ZMM0` - `ZMM15`). Ekstensi ini menawarkan peningkatan performa yang sangat signifikan untuk aplikasi yang dapat diparalelkan .

## 3. Perbedaan Sintaks: Intel vs. AT&T

Ada dua gaya sintaks utama untuk assembly x86, yang sering membingungkan pemula :
*   **Intel Syntax:** Lebih umum digunakan di Windows (oleh assembler seperti MASM) dan didukung oleh NASM. Ciri khasnya: **`tujuan, sumber`**. Tidak menggunakan awalan untuk register atau konstanta.
    *   Contoh: `mov eax, 1` (Pindahkan nilai 1 ke register EAX).
*   **AT&T Syntax:** Digunakan di lingkungan Unix/Linux oleh assembler GNU (GAS). Ciri khasnya: **`sumber, tujuan`**. Menggunakan awalan `%` untuk register dan `$` untuk konstanta.
    *   Contoh: `mov $1, %eax` (Pindahkan nilai 1 ke register EAX).

## 4. Perkakas (Tools) dan Lingkungan

Untuk memulai pemrograman assembly, Anda memerlukan assembler dan linker :
*   **NASM (Netwide Assembler):** Assembler populer yang mendukung sintaks Intel, tersedia untuk Windows dan Linux.
*   **MASM (Microsoft Macro Assembler):** Assembler standar untuk Windows.
*   **GAS (GNU Assembler):** Assembler di balik GCC yang menggunakan sintaks AT&T.
*   **Linker:** Program seperti `ld` (Linux) atau `link.exe` (Windows) untuk menggabungkan kode objek menjadi file yang dapat dieksekusi.
*   **Debugger:** Alat seperti `GDB` (Linux) atau `WinDbg` / `x64dbg` (Windows) sangat penting untuk menelusuri kode assembly dan memeriksa status register serta memori .

## 5. Rekomendasi untuk Pembelajaran Lebih Lanjut

Karena tautan yang Anda berikan tidak aktif, berikut adalah beberapa sumber belajar yang direkomendasikan:
1.  **Buku: *Modern X86 Assembly Language Programming* oleh Daniel Kusswurm.** Buku ini sangat komprehensif, mencakup arsitektur dasar hingga ekstensi AVX-512, dengan contoh untuk Windows dan Linux. Sangat direkomendasikan untuk pemahaman mendalam .
2.  **Buku: *X86 Assembly Language and C Fundamentals*.** Pilihan yang baik untuk memahami dasar-dasar arsitektur dan hubungannya dengan bahasa C .
3.  **Dokumentasi Resmi Intel:** *Intel® 64 and IA-32 Architectures Software Developer Manuals*. Ini adalah sumber utama dan paling otoritatif, tetapi sangat tebal dan lebih cocok sebagai referensi .
4.  **Panduan Online:** Cari tutorial dengan kata kunci "x86-64 assembly tutorial NASM" atau "x86 assembly GAS tutorial" untuk menemukan berbagai panduan langkah demi langkah.
5.  **Sumber Daya dari Universitas:** Banyak universitas menyediakan materi kuliah tentang arsitektur komputer dan assembly, seperti dari CMU atau Washington State University .

---

Semoga rangkuman ini bermanfaat sebagai titik awal Anda untuk memahami fundamental bahasa mesin x86 Intel.