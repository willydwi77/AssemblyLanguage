# Instruksi Bahasa Mesin vs Assembly

### 2.1 Bahasa Mesin
Prosesor hanya mengerti **instruksi bahasa mesin** (kode biner 0 dan 1). Contoh instruksi biner (fiktif):
```
01000011 00000000 01000101 11111000
```

### 2.2 Assembly Language
Representasi simbolis dari instruksi mesin yang lebih mudah dipahami manusia. Setiap instruksi assembly (`mnemonic`) diterjemahkan langsung menjadi satu instruksi mesin oleh *assembler* (NASM, MASM, dll.).
```assembly
add DWORD [rbp-8], eax   ; Jauh lebih mudah dipahami!
```

### 2.3 Proses Kompilasi

```
Kode C++ → (Compiler) → Kode Assembly (.s) → (Assembler) → Bahasa Mesin (.o/.obj)
```

---

## 3. Anatomi Instruksi Assembly

### 3.1 Format Dasar

Instruksi assembly mengikuti format:
```
[label]   mnemonic   [operands]   [;comment]
```

### 3.2 Komponen Instruksi

#### a. Label (`label`)
Penanda lokasi di dalam kode, diikuti oleh titik dua (`:`). Berfungsi sebagai target lompatan.
```assembly
_start:          ; Label untuk entry point
    jmp _start   ; Lompat ke label
```

#### b. Mnemonic (`mnemonic`)
Inti instruksi, singkatan operasi yang akan dilakukan CPU.
```assembly
MOV   ; Pindahkan data
ADD   ; Tambahkan
SUB   ; Kurangkan
CMP   ; Bandingkan
JMP   ; Lompat
```

#### c. Operand (`operands`)
Parameter untuk instruksi. Bisa 0, 1, atau 2 operand.
```assembly
NOP              ; Tanpa operand
INC EAX          ; Satu operand (register)
MOV EAX, 1       ; Dua operand (tujuan, sumber)
```

**Aturan Penting untuk 2 Operand:**
- **Operand pertama = tujuan (*destination*)**
- **Operand kedua = sumber (*source*)**

```assembly
MOV  DESTINASI, SUMBER
ADD  EAX, 1      ; Tambahkan 1 ke EAX, hasil di EAX
SUB  EBX, ECX    ; Kurangkan ECX dari EBX, hasil di EBX
```

**Jenis-jenis Operand:**
1. **Register Addressing**: Data di dalam register CPU (tercepat).
   ```assembly
   MOV EAX, EBX    ; Kedua operand register
   ADD AL, BH      ; Register 8-bit
   ```

2. **Immediate Addressing**: Nilai konstanta langsung.
   ```assembly
   MOV EAX, 45H    ; 45H adalah konstanta
   ADD EBX, 10     ; 10 adalah konstanta
   ```

3. **Memory Addressing**: Data di lokasi memori.
   - **Direct**: Alamat langsung dengan nama variabel.
     ```assembly
     ADD BYTE_VALUE, DL  ; Tambahkan DL ke BYTE_VALUE
     MOV BX, WORD_VALUE  ; Pindahkan WORD_VALUE ke BX
     ```
   - **Direct-Offset**: Mengakses array/struktur.
     ```assembly
     MOV CL, BYTE_TABLE[2] ; Elemen ke-3 dari array
     ```
   - **Indirect**: Alamat dalam register.
     ```assembly
     MOV [EBX], 110   ; Simpan 110 ke alamat di EBX
     ```

#### d. Komentar (`;comment`)
Dimulai dengan titik koma (`;`), diabaikan oleh assembler.
```assembly
; Ini komentar satu baris
MOV EAX, EBX   ; Komentar di akhir instruksi
```

### 3.3 Sintaks Intel vs AT&T

| Aspek | **Intel Syntax** | **AT&T Syntax** |
| :--- | :--- | :--- |
| **Urutan Operand** | `tujuan, sumber` | `sumber, tujuan` |
| **Register** | Tanpa awalan (EAX) | Dengan awalan `%` (%eax) |
| **Konstanta** | Tanpa awalan (1) | Dengan awalan `$` ($1) |
| **Contoh** | `mov eax, 1` | `mov $1, %eax` |

---

## 4. Struktur Program Assembly

### 4.1 Tiga Bagian Utama

```assembly
; ========================================
; BAGIAN .data (Data Terinisialisasi)
; ========================================
section .data
    msg db 'Hello, world!', 0xa  ; Variabel dengan nilai awal
    len equ $ - msg              ; Konstanta

; ========================================
; BAGIAN .bss (Data Tidak Terinisialisasi)
; ========================================
section .bss
    num resb 1   ; Variabel 1 byte tanpa nilai awal
    array resw 100  ; Array 100 word

; ========================================
; BAGIAN .text (Kode Instruksi)
; ========================================
section .text
    global _start   ; Entry point untuk linker

_start:
    ; Instruksi-instruksi di sini
    mov edx, len
    mov ecx, msg
    mov ebx, 1
    mov eax, 4
    int 0x80
    ; ... dan seterusnya
```

### 4.2 Contoh Program "Hello World" Lengkap

```assembly
; ============================================
; PROGRAM HELLO WORLD (NASM - Linux x86-64)
; ============================================

section .text
    global _start     ; Entry point

_start:
    ; Tulis "Hello, world!" ke stdout
    mov   edx, len    ; Panjang string
    mov   ecx, msg    ; Alamat string
    mov   ebx, 1      ; File descriptor: stdout
    mov   eax, 4      ; Syscall: write
    int   0x80        ; Panggil kernel

    ; Keluar dari program
    mov   eax, 1      ; Syscall: exit
    int   0x80        ; Panggil kernel

section .data
    msg db 'Hello, world!', 0xa  ; String + newline
    len equ $ - msg              ; Panjang string
```

---

## 5. Klasifikasi Instruksi (Mnemonic)

### 5.1 Instruksi Pemindahan Data (Data Transfer)

| Instruksi | Deskripsi | Contoh |
| :--- | :--- | :--- |
| **MOV** | Memindahkan data | `MOV EAX, 10` |
| **PUSH** | Masukkan ke stack | `PUSH EAX` |
| **POP** | Keluarkan dari stack | `POP EBX` |
| **XCHG** | Tukar dua nilai | `XCHG EAX, EBX` |

### 5.2 Instruksi Aritmetika (Arithmetic)

| Instruksi | Deskripsi | Contoh |
| :--- | :--- | :--- |
| **ADD** | Penjumlahan | `ADD EAX, 5` |
| **SUB** | Pengurangan | `SUB EBX, ECX` |
| **INC** | Tambah 1 | `INC EAX` |
| **DEC** | Kurang 1 | `DEC EAX` |
| **MUL** | Perkalian (unsigned) | `MUL EBX` (hasil di EDX:EAX) |
| **DIV** | Pembagian (unsigned) | `DIV ECX` (hasil di EAX, sisa di EDX) |
| **IMUL** | Perkalian (signed) | `IMUL EAX, EBX, 5` |

### 5.3 Instruksi Logika (Logical)

| Instruksi | Deskripsi | Contoh |
| :--- | :--- | :--- |
| **AND** | Logika AND | `AND EAX, 0xFF` |
| **OR** | Logika OR | `OR EBX, ECX` |
| **XOR** | Logika XOR | `XOR EAX, EAX` (set ke 0) |
| **NOT** | Negasi bitwise | `NOT EAX` |
| **TEST** | AND tanpa simpan | `TEST EAX, EAX` (set flag) |

### 5.4 Instruksi Kontrol Alur (Control Flow)

| Instruksi | Deskripsi | Contoh |
| :--- | :--- | :--- |
| **JMP** | Lompat tak bersyarat | `JMP _start` |
| **JE / JZ** | Lompat jika sama/nol | `JE label` |
| **JNE / JNZ** | Lompat jika tidak sama | `JNE label` |
| **JG / JLE** | Lompat jika > / ≤ (signed) | `JG label` |
| **JA / JBE** | Lompat jika > / ≤ (unsigned) | `JA label` |
| **CALL** | Panggil fungsi | `CALL fungsi` |
| **RET** | Kembali dari fungsi | `RET` |
| **LOOP** | Loop dengan ECX | `LOOP label` |

### 5.5 Instruksi Perbandingan (Comparison)

| Instruksi | Deskripsi | Contoh |
| :--- | :--- | :--- |
| **CMP** | Bandingkan dua nilai | `CMP EAX, 10` (set flag) |

### 5.6 Instruksi Floating-Point & SIMD (x86-64)

| Instruksi | Deskripsi | Contoh |
| :--- | :--- | :--- |
| **ADDSD** | Tambah floating-point | `ADDSD XMM0, XMM1` |
| **MOVSD** | Pindah floating-point | `MOVSD XMM0, [mem]` |
| **CVTSI2SD** | Konversi int ke float | `CVTSI2SD XMM0, EAX` |

---

## 6. Perbandingan C++ vs Assembly

### 6.1 Contoh 1: Fungsi Penjumlahan

#### Kode C++ (`fungsi.cpp`)
```cpp
int tambah(int a, int b) {
    return a + b;
}

int main() {
    int x = 5;
    int y = 10;
    int z = tambah(x, y);
    return z;
}
```

#### Kode Assembly (x86-64) yang Dihasilkan
```assembly
section .text
    global main

tambah:
    push   rbp           ; Simpan base pointer lama
    mov    rbp, rsp      ; Atur base pointer baru
    mov    DWORD [rbp-4], edi  ; Simpan parameter a (dari EDI)
    mov    DWORD [rbp-8], esi  ; Simpan parameter b (dari ESI)
    mov    eax, DWORD [rbp-4]  ; EAX = a
    add    eax, DWORD [rbp-8]  ; EAX = a + b
    pop    rbp           ; Kembalikan base pointer
    ret                   ; Kembali, hasil di EAX

main:
    push   rbp
    mov    rbp, rsp
    sub    rsp, 16       ; Alokasi ruang lokal

    mov    DWORD [rbp-4], 5    ; x = 5
    mov    DWORD [rbp-8], 10   ; y = 10
    mov    edi, DWORD [rbp-4]  ; Parameter pertama (x)
    mov    esi, DWORD [rbp-8]  ; Parameter kedua (y)
    call   tambah              ; CALL: panggil fungsi
    mov    DWORD [rbp-12], eax ; z = hasil
    mov    eax, DWORD [rbp-12] ; return z
    leave                     ; Kembalikan stack frame
    ret                       ; Kembali ke sistem
```

**Analisis:**
- `CALL` menyimpan alamat instruksi berikutnya ke stack, lalu melompat ke fungsi.
- `MOV` dan `ADD` adalah instruksi paling dominan.
- `RET` mengambil alamat dari stack dan melanjutkan eksekusi.

### 6.2 Contoh 2: Struktur Kontrol `if-else`

#### Kode C++ (`kondisi.cpp`)
```cpp
int main() {
    int a = 10;
    int b = 20;
    int max;

    if (a > b) {
        max = a;
    } else {
        max = b;
    }

    return max;
}
```

#### Kode Assembly (x86-64) yang Dihasilkan
```assembly
main:
    push   rbp
    mov    rbp, rsp
    mov    DWORD [rbp-4], 10   ; a = 10
    mov    DWORD [rbp-8], 20   ; b = 20

    mov    eax, DWORD [rbp-4]  ; EAX = a
    cmp    eax, DWORD [rbp-8]  ; Bandingkan a dengan b
    jle    .L2                 ; Lompat ke .L2 jika a <= b

    ; Blok IF (a > b)
    mov    eax, DWORD [rbp-4]  ; EAX = a
    mov    DWORD [rbp-12], eax ; max = a
    jmp    .L3                 ; Lompat ke akhir

.L2:                          ; Blok ELSE
    mov    eax, DWORD [rbp-8]  ; EAX = b
    mov    DWORD [rbp-12], eax ; max = b

.L3:                          ; Akhir if-else
    mov    eax, DWORD [rbp-12] ; return max
    leave
    ret
```

**Analisis:**
- `CMP` menghitung `a - b` dan mengatur *flag* (ZF, CF, OF).
- `JLE` (*Jump if Less or Equal*) melompat ke ELSE jika `a <= b`.
- `JMP` di akhir blok IF mencegah eksekusi jatuh ke ELSE.

### 6.3 Contoh 3: Perulangan `for`

#### Kode C++ (`loop.cpp`)
```cpp
int main() {
    int sum = 0;
    for (int i = 0; i < 10; i++) {
        sum += i;
    }
    return sum;
}
```

#### Kode Assembly (x86-64) yang Dihasilkan
```assembly
main:
    push   rbp
    mov    rbp, rsp
    mov    DWORD [rbp-8], 0   ; sum = 0
    mov    DWORD [rbp-4], 0   ; i = 0 (inisialisasi)
    jmp    .L2                ; Lompat ke kondisi

.L3:                          ; Badan loop
    mov    eax, DWORD [rbp-4] ; EAX = i
    add    DWORD [rbp-8], eax ; sum += i
    add    DWORD [rbp-4], 1   ; i++ (increment)

.L2:                          ; Kondisi perulangan
    cmp    DWORD [rbp-4], 9   ; Bandingkan i dengan 9 (i < 10)
    jle    .L3                ; Jika i <= 9, lompat ke badan

    mov    eax, DWORD [rbp-8] ; return sum
    leave
    ret
```

**Analisis:**
- Struktur loop: Inisialisasi → Kondisi → Badan → Increment.
- `JMP` digunakan untuk pertama kali melewati badan loop ke kondisi.
- `CMP` dan `JLE` bekerja sama mengimplementasikan `i < 10`.
- `ADD` digunakan untuk dua hal: menambahkan `i` ke `sum` dan `i++`.

### 6.4 Ilustrasi: Dari C++ ke Hardware

| Lapisan | Deskripsi | Contoh untuk `sum += i` |
| :--- | :--- | :--- |
| **Kode C++** | Bahasa tingkat tinggi | `sum += i;` |
| **Assembly** | Representasi simbolis | `add DWORD [rbp-8], eax` |
| **Bahasa Mesin** | Kode biner | `01000011 00000000 01000101 11111000` (fiktif) |
| **CPU (Hardware)** | Eksekusi fisik | ALU melakukan penjumlahan biner |

### 6.5 Hal Penting yang Perlu Diingat

1. **Compiler adalah "Penerjemah" Utama**: Compiler memilih instruksi assembly dan urutannya berdasarkan optimasi.
2. **Optimasi Mengubah Segalanya**: Dengan `-O2` atau `-O3`, output assembly sangat berbeda (variabel dihilangkan, *loop unrolling*, dll.).
3. **Calling Convention**: Cara fungsi menerima parameter dan mengembalikan nilai diatur oleh *calling convention*.
   - **System V AMD64** (Linux): Parameter di RDI, RSI, RDX, RCX, R8, R9; hasil di RAX.
   - **Microsoft x64** (Windows): Parameter di RCX, RDX, R8, R9; hasil di RAX.
4. **Arsitektur Spesifik**: Assembly x86 tidak berjalan di ARM (ponsel, Raspberry Pi).

---

## 7. Glosarium Singkat

| Istilah | Deskripsi |
| :--- | :--- |
| **Assembler** | Program yang menerjemahkan assembly ke bahasa mesin (NASM, MASM, GAS) |
| **Instruction Set** | Kumpulan instruksi yang dimengerti oleh prosesor |
| **Mnemonic** | Singkatan untuk instruksi (MOV, ADD, JMP) |
| **Operand** | Data yang dioperasikan oleh instruksi |
| **Register** | Lokasi penyimpanan data berkecepatan tinggi di dalam CPU |
| **Stack** | Area memori untuk penyimpanan sementara (LIFO) |
| **Calling Convention** | Aturan bagaimana fungsi dipanggil dan parameter diteruskan |
| **SIMD** | Single Instruction, Multiple Data (pemrosesan paralel dengan SSE/AVX) |
| **CISC** | Complex Instruction Set Computer (arsitektur x86) |
| **RISC** | Reduced Instruction Set Computer (arsitektur ARM) |

---

## 8. Kesimpulan

**Bahasa mesin x86/x86-64 adalah fondasi dari semua operasi komputer.** Memahami instruksi dasar seperti `MOV`, `ADD`, `CMP`, dan `JMP` memberikan wawasan mendalam tentang bagaimana program tingkat tinggi (seperti C++) bekerja di level hardware.

**Poin-poin kunci:**
1. Setiap instruksi C++ → diterjemahkan menjadi serangkaian instruksi assembly.
2. Instruksi assembly terdiri dari **mnemonic + operand**.
3. Dua sintaks utama: **Intel** (`tujuan, sumber`) dan **AT&T** (`sumber, tujuan`).
4. Program assembly terbagi menjadi **.data, .bss, .text**.
5. Instruksi dikelompokkan menjadi: **data transfer, aritmetika, logika, control flow**.

**Sumber Daya untuk Pembelajaran Lebih Lanjut:**
- **NASM Manual**: Dokumentasi resmi NASM
- **Intel® 64 and IA-32 Architectures Manuals**: Referensi paling otoritatif
- **Buku**: *Modern X86 Assembly Language Programming* oleh Daniel Kusswurm
- **Online**: Tutorials Point, GeeksforGeeks, OSDev Wiki