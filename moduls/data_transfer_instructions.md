# Data Transfer Instructions

## Daftar Instruksi

| Instruksi | Deskripsi | Contoh |
| :--- | :--- | :--- |
| **MOV** | Pindahkan data | `MOV RAX, 10` |
| **PUSH** | Push ke stack | `PUSH RAX` |
| **POP** | Pop dari stack | `POP RBX` |
| **XCHG** | Tukar dua nilai | `XCHG RAX, RBX` |
| **LEA** | Ambil alamat memori (pointer) | `LEA RAX, [RBP-8]` |

---

## 1. MOV - Pindahkan Data

### 1.1 Deskripsi
`MOV` adalah instruksi paling fundamental dalam assembly. Fungsinya adalah **memindahkan (menyalin) data** dari *source* (sumber) ke *destination* (tujuan). Data yang dipindahkan bisa berupa:
- Nilai konstanta (immediate)
- Nilai dari register lain
- Nilai dari alamat memori

### 1.2 Sintaks Dasar
```assembly
MOV destination, source
```

### 1.3 Contoh Penggunaan

#### a. Immediate to Register
```assembly
MOV RAX, 10          ; RAX = 10 (64-bit)
MOV EAX, 5           ; EAX = 5 (32-bit, bagian bawah RAX)
MOV AX, 0xFF         ; AX = 255 (16-bit)
MOV AL, 'A'          ; AL = 65 (8-bit, karakter 'A')
```

#### b. Register to Register
```assembly
MOV RAX, RBX         ; RAX = RBX (salin nilai RBX ke RAX)
MOV EAX, ECX         ; EAX = ECX
MOV AX, BX           ; AX = BX
```

#### c. Memory to Register
```assembly
MOV RAX, [var]       ; Ambil nilai dari variabel 'var' ke RAX
MOV EAX, [0x00402000] ; Ambil nilai dari alamat memori 0x00402000
MOV BX, [RBP-4]      ; Ambil nilai dari stack
```

#### d. Register to Memory
```assembly
MOV [var], RAX       ; Simpan nilai RAX ke variabel 'var'
MOV [RBP-8], EAX     ; Simpan EAX ke stack
MOV [array + RCX*4], EBX ; Simpan ke array dengan indeks
```

#### e. Immediate to Memory
```assembly
MOV [var], 10        ; Simpan nilai 10 ke variabel 'var'
MOV [RBP-4], BYTE 5  ; Simpan nilai 5 (1 byte) ke stack
```

### 1.4 Aturan dan Batasan Penting

| Aturan | Penjelasan |
| :--- | :--- |
| **Ukuran data harus sesuai** | Tidak bisa memindahkan 32-bit ke register 16-bit tanpa konversi |
| **Tidak bisa MOV dari memori ke memori** | Harus melalui register sebagai perantara |
| **Tidak bisa MOV ke immediate** | Tujuan harus register atau memori |
| **Segment register terbatas** | Hanya bisa dimodifikasi dengan aturan tertentu |

#### Contoh Pelanggaran (SALAH):
```assembly
MOV [var1], [var2]   ; ❌ Memori ke memori tidak boleh
MOV AL, 0x1234       ; ❌ Ukuran tidak sesuai (AL 8-bit, nilai 16-bit)
MOV 5, RAX           ; ❌ Immediate tidak bisa jadi tujuan
```

#### Cara yang Benar:
```assembly
MOV RAX, [var2]      ; ✓ Pindahkan ke register dulu
MOV [var1], RAX      ; ✓ Kemudian ke memori

MOV AL, 0x34         ; ✓ Nilai sesuai ukuran (8-bit)
MOV AX, 0x1234       ; ✓ Nilai sesuai ukuran (16-bit)
```

### 1.5 Contoh Program

```assembly
section .data
    nilai   dd 100       ; Variabel nilai = 100 (4 byte)
    hasil   dq 0         ; Variabel hasil = 0 (8 byte)

section .text
    global _start

_start:
    ; Contoh 1: MOV immediate ke register
    MOV RAX, 42          ; RAX = 42

    ; Contoh 2: MOV dari register ke memori
    MOV [nilai], EAX     ; Simpan 42 ke variabel nilai

    ; Contoh 3: MOV dari memori ke register
    MOV RBX, [nilai]     ; RBX = 42

    ; Contoh 4: Operasi matematika sederhana
    ADD RBX, 10          ; RBX = 52
    MOV [hasil], RBX     ; Simpan ke hasil

    ; Contoh 5: MOV alamat (bukan nilai)
    MOV RCX, nilai       ; RCX = alamat dari variabel 'nilai'
    MOV RDX, [nilai]     ; RDX = nilai yang disimpan di alamat 'nilai'
```

---

## 2. PUSH - Push ke Stack

### 2.1 Deskripsi
`PUSH` **menyimpan nilai** ke dalam **stack** (tumpukan). Stack adalah area memori LIFO (*Last In, First Out*) yang digunakan untuk:
- Menyimpan data sementara
- Menyimpan alamat return saat pemanggilan fungsi
- Menyimpan parameter fungsi
- Menyimpan register sebelum operasi kritis

### 2.2 Cara Kerja Stack

```
Stack tumbuh ke bawah (alamat menurun)
----------------------------------------
Alamat Tinggi  | ... (data lain)
               |-----------------|
               | [nilai lama]    | ← RSP sebelum PUSH
               |-----------------|
               | [nilai baru]    | ← RSP setelah PUSH (RSP = RSP - 8)
               |-----------------|
Alamat Rendah  | ... (data lain)
----------------------------------------
```

### 2.3 Sintaks Dasar
```assembly
PUSH source
```

### 2.4 Contoh Penggunaan

#### a. Push Register
```assembly
PUSH RAX           ; Simpan nilai RAX ke stack (RSP = RSP - 8)
PUSH RBX           ; Simpan nilai RBX ke stack (RSP = RSP - 8)
PUSH RBP           ; Simpan nilai RBP (base pointer)
```

#### b. Push Immediate
```assembly
PUSH 10            ; Push nilai 10 ke stack
PUSH 0xFF          ; Push nilai 255 (hex)
PUSH 'A'           ; Push karakter 'A' (65)
```

#### c. Push Memory
```assembly
PUSH [var]         ; Push nilai dari variabel 'var'
PUSH [RBP-4]       ; Push nilai dari stack
```

### 2.5 Ukuran Data pada PUSH

| Mode | Ukuran | Contoh |
| :--- | :--- | :--- |
| **64-bit** | 8 byte | `PUSH RAX` (RSP -= 8) |
| **32-bit** | 4 byte | `PUSH EAX` (RSP -= 4) |
| **16-bit** | 2 byte | `PUSH AX` (RSP -= 2) |

### 2.6 Contoh Penggunaan di Fungsi

```assembly
section .text
    global _start

_start:
    ; Persiapan stack frame
    PUSH RBP           ; Simpan base pointer lama
    MOV RBP, RSP       ; Atur base pointer baru

    ; Simpan register yang akan dimodifikasi
    PUSH RAX
    PUSH RBX
    PUSH RCX

    ; Lakukan operasi (register bisa dimodifikasi dengan aman)
    MOV RAX, 10
    MOV RBX, 20
    ADD RAX, RBX       ; RAX = 30

    ; Kembalikan register yang disimpan (urutan terbalik!)
    POP RCX
    POP RBX
    POP RAX

    ; Kembalikan stack frame
    MOV RSP, RBP       ; Reset stack pointer
    POP RBP            ; Kembalikan base pointer lama
    RET
```

---

## 3. POP - Pop dari Stack

### 3.1 Deskripsi
`POP` adalah kebalikan dari `PUSH`. Fungsinya **mengambil nilai** dari puncak stack dan menyimpannya ke tujuan. Instruksi ini:
- Membaca nilai dari alamat yang ditunjuk RSP
- Menyimpan nilai ke destination
- Menambahkan RSP (RSP += ukuran data)

### 3.2 Sintaks Dasar
```assembly
POP destination
```

### 3.3 Contoh Penggunaan

#### a. Pop ke Register
```assembly
POP RAX            ; Ambil nilai dari stack ke RAX (RSP = RSP + 8)
POP RBX            ; Ambil nilai dari stack ke RBX
POP RBP            ; Ambil base pointer lama
```

#### b. Pop ke Memori
```assembly
POP [var]          ; Simpan nilai dari stack ke variabel 'var'
POP [RBP-4]        ; Simpan ke stack
```

### 3.4 Aturan Penting

| Aturan | Penjelasan |
| :--- | :--- |
| **Ukuran harus sesuai** | Register tujuan harus sesuai ukuran data di stack |
| **Stack harus seimbang** | Jumlah PUSH dan POP harus sama dalam fungsi |
| **Urutan terbalik** | Data yang di-POP adalah yang terakhir di-PUSH |

### 3.5 Contoh Kode Stack Seimbang

```assembly
; FUNGSI YANG SALAH (stack tidak seimbang)
my_function_bad:
    PUSH RAX        ; Push RAX (RSP -= 8)
    PUSH RBX        ; Push RBX (RSP -= 8)
    RET             ; ❌ RSP tidak kembali ke posisi awal!
                    ; RET mengambil alamat return yang salah!

; FUNGSI YANG BENAR (stack seimbang)
my_function_good:
    PUSH RAX        ; Push RAX (RSP -= 8)
    PUSH RBX        ; Push RBX (RSP -= 8)

    ; ... lakukan operasi ...

    POP RBX         ; Pop RBX (RSP += 8)
    POP RAX         ; Pop RAX (RSP += 8)
    RET             ; ✓ RSP kembali ke posisi awal
```

### 3.6 Contoh Praktis

```assembly
section .data
    var1    dq 0
    var2    dq 0

section .text
    global _start

_start:
    ; Simpan data ke stack
    MOV RAX, 100
    MOV RBX, 200
    PUSH RAX          ; Stack: [100]
    PUSH RBX          ; Stack: [100, 200] (200 di puncak)

    ; Ambil data dari stack (LIFO)
    POP RCX           ; RCX = 200, Stack: [100]
    POP RDX           ; RDX = 100, Stack: []

    ; Simpan ke variabel
    MOV [var1], RCX   ; var1 = 200
    MOV [var2], RDX   ; var2 = 100

    ; Contoh penggunaan untuk swap (tukar nilai)
    MOV RAX, 10
    MOV RBX, 20
    PUSH RAX          ; Simpan 10
    PUSH RBX          ; Simpan 20
    POP RAX           ; RAX = 20 (nilai RBX)
    POP RBX           ; RBX = 10 (nilai RAX)
    ; Sekarang RAX=20, RBX=10 (tertukar)
```

---

## 4. XCHG - Tukar Dua Nilai

### 4.1 Deskripsi
`XCHG` (**Exchange**) menukar nilai antara dua operand. Instruksi ini:
- Membaca nilai dari operand pertama
- Membaca nilai dari operand kedua
- Menulis nilai pertama ke operand kedua
- Menulis nilai kedua ke operand pertama

### 4.2 Sintaks Dasar
```assembly
XCHG operand1, operand2
```

### 4.3 Contoh Penggunaan

#### a. Register to Register
```assembly
XCHG RAX, RBX      ; Tukar nilai RAX dan RBX
XCHG EAX, ECX      ; Tukar nilai EAX dan ECX
XCHG AX, BX        ; Tukar nilai AX dan BX
```

#### b. Register to Memory
```assembly
XCHG RAX, [var]    ; Tukar nilai RAX dengan variabel 'var'
XCHG [RBP-4], EBX  ; Tukar nilai stack dengan EBX
```

#### c. Memory to Memory
```assembly
; ❌ XCHG tidak bisa digunakan langsung antara dua alamat memori!
XCHG [var1], [var2]  ; SALAH!

; Cara yang benar:
MOV RAX, [var1]      ; Ambil nilai var1
XCHG RAX, [var2]     ; Tukar RAX dengan var2
MOV [var1], RAX      ; Simpan nilai baru ke var1
```

### 4.4 Contoh Praktis

```assembly
section .data
    nilai1  dq 10
    nilai2  dq 20

section .text
    global _start

_start:
    ; Contoh 1: Tukar dua register
    MOV RAX, 100
    MOV RBX, 200
    XCHG RAX, RBX      ; RAX=200, RBX=100

    ; Contoh 2: Tukar register dengan memori
    MOV RCX, 999
    XCHG RCX, [nilai1] ; RCX=10, nilai1=999

    ; Contoh 3: Tukar dua variabel (menggunakan register)
    MOV RAX, [nilai1]  ; RAX = 999
    XCHG RAX, [nilai2] ; RAX = 20, nilai2 = 999
    MOV [nilai1], RAX  ; nilai1 = 20

    ; Hasil akhir:
    ; nilai1 = 20
    ; nilai2 = 999
    ; RCX = 10
```

### 4.5 Kegunaan XCHG

| Kasus Penggunaan | Contoh |
| :--- | :--- |
| **Swap variabel** | Tukar dua variabel dengan cepat |
| **Algoritma sorting** | Tukar elemen array |
| **Operasi atomik** | Dalam multithreading (versi lock) |
| **Optimasi** | Lebih cepat dari 3x MOV untuk swap |

---

## 5. LEA - Load Effective Address

### 5.1 Deskripsi
`LEA` (**Load Effective Address**) menghitung **alamat memori** (bukan nilai) dari operand dan menyimpannya ke register. Ini adalah instruksi yang sering disalahpahami:
- **TIDAK** mengakses memori (tidak membaca/menulis data)
- Hanya **menghitung alamat** berdasarkan mode pengalamatan
- Sangat berguna untuk pointer, array, dan aritmetika

### 5.2 Perbedaan MOV vs LEA

```assembly
MOV RAX, [RBP-8]    ; Membaca NILAI dari alamat RBP-8
LEA RAX, [RBP-8]    ; Menyimpan ALAMAT (RBP-8) ke RAX
```

### 5.3 Sintaks Dasar
```assembly
LEA destination, source_memory_address
```

### 5.4 Contoh Penggunaan

#### a. Mendapatkan Alamat Variabel
```assembly
section .data
    my_var  dq 123

section .text
    global _start

_start:
    MOV RAX, [my_var]   ; RAX = 123 (nilai)
    LEA RAX, [my_var]   ; RAX = alamat dari my_var (pointer)
```

#### b. Pointer ke Stack
```assembly
my_function:
    PUSH RBP
    MOV RBP, RSP
    SUB RSP, 16         ; Alokasi 16 byte di stack

    LEA RAX, [RBP-8]    ; RAX = alamat variabel lokal pertama
    LEA RBX, [RBP-16]   ; RBX = alamat variabel lokal kedua

    ; Sekarang RAX dan RBX adalah pointer ke stack
    MOV [RAX], DWORD 10 ; Simpan 10 ke variabel lokal pertama
```

#### c. Aritmetika dengan LEA
`LEA` bisa melakukan perhitungan sederhana! Ini adalah trik optimasi.

```assembly
; LEA melakukan perhitungan alamat, tapi hasilnya bisa digunakan
; untuk operasi matematika

MOV RAX, 5
LEA RBX, [RAX + RAX*4]   ; RBX = 5 + 5*4 = 25 (RAX * 5)
LEA RCX, [RAX*8]         ; RCX = 5*8 = 40
LEA RDX, [RAX + 10]      ; RDX = 5 + 10 = 15
```

### 5.5 Keuntungan LEA

| Keuntungan | Penjelasan |
| :--- | :--- |
| **Cepat** | Dikerjakan oleh unit address calculation (bukan ALU) |
| **Fleksibel** | Bisa menghitung berbagai kombinasi alamat |
| **Aman** | Tidak memicu akses memori (tidak ada page fault) |
| **Berguna** | Untuk pointer, array, struktur data |

### 5.6 Contoh Penggunaan di Array

```assembly
section .data
    array   dd 10, 20, 30, 40, 50   ; Array 5 elemen (4 byte each)

section .text
    global _start

_start:
    ; Indexing array
    MOV RCX, 2          ; Indeks ke-2 (mulai dari 0)
    LEA RAX, [array]    ; RAX = alamat dasar array
    LEA RBX, [RAX + RCX*4]  ; RBX = alamat array[2]

    ; Ambil nilai array[2]
    MOV EDX, [RBX]      ; EDX = 30

    ; Cara alternatif dengan base+index
    LEA RSI, [array + RCX*4]  ; RSI = alamat array[2]
    MOV EDI, [RSI]      ; EDI = 30
```

### 5.7 LEA untuk Perhitungan (Optimasi)

```assembly
; Menghitung tanpa menggunakan instruksi MUL/ADD
; Rumus: y = x * 3 + 7

MOV RAX, 10
LEA RBX, [RAX*2 + RAX + 7]   ; RBX = 10*2 + 10 + 7 = 37

; Rumus: z = x * 5 + y
MOV RAX, 5
MOV RCX, 20
LEA RDX, [RAX*4 + RAX + RCX] ; RDX = 5*4 + 5 + 20 = 45
```

### 5.8 Perbandingan Lengkap

| Aspek | MOV | LEA |
| :--- | :--- | :--- |
| **Fungsi** | Memindahkan nilai | Menghitung alamat |
| **Akses Memori** | Ya (baca/tulis) | Tidak (hitung) |
| **Sumber** | Register, memori, immediate | Alamat memori |
| **Tujuan** | Register, memori | Hanya register |
| **Kecepatan** | Bergantung pada akses memori | Sangat cepat |
| **Kegunaan** | Data transfer | Pointer, array, aritmetika |

---

## 6. Ringkasan Perbandingan

| Instruksi | Fungsi | Contoh | Kapan Digunakan |
| :--- | :--- | :--- | :--- |
| **MOV** | Pindahkan data | `MOV RAX, 10` | Setiap kali perlu transfer data |
| **PUSH** | Simpan ke stack | `PUSH RAX` | Simpan data sementara, fungsi |
| **POP** | Ambil dari stack | `POP RBX` | Kembalikan data dari stack |
| **XCHG** | Tukar nilai | `XCHG RAX, RBX` | Swap variabel, sorting |
| **LEA** | Ambil alamat | `LEA RAX, [RBP-8]` | Pointer, array, optimasi |

---

## 7. Latihan Praktis

### Latihan 1: Fungsi Swap
```assembly
; Buat fungsi yang menukar dua nilai dalam memori
; void swap(int *a, int *b)

swap:
    ; Parameter: RDI = alamat a, RSI = alamat b
    MOV RAX, [RDI]   ; RAX = *a
    XCHG RAX, [RSI]  ; Tukar RAX dengan *b
    MOV [RDI], RAX   ; *a = RAX (nilai b yang lama)
    RET
```

### Latihan 2: Push dan Pop dalam Loop
```assembly
; Simpan semua register sebelum operasi loop

mov_loop:
    PUSH RAX
    PUSH RBX
    PUSH RCX
    PUSH RDX

    ; Lakukan operasi loop di sini
    MOV RAX, 100
    MOV RBX, 200
    ADD RAX, RBX

    ; Kembalikan register
    POP RDX
    POP RCX
    POP RBX
    POP RAX
    RET
```

### Latihan 3: LEA untuk Array
```assembly
; Akses array 2D menggunakan LEA
; int matrix[3][4], akses matrix[row][col]

section .data
    matrix  dd 1,2,3,4, 5,6,7,8, 9,10,11,12
    row     dq 1
    col     dq 2

section .text
    global _start

_start:
    MOV RCX, [row]      ; RCX = row
    MOV RDX, [col]      ; RDX = col
    LEA RAX, [matrix]   ; RAX = alamat dasar matrix

    ; Hitung alamat: matrix + (row * 4 + col) * 4
    LEA RBX, [RAX + RCX*16 + RDX*4]  ; offset = row*16 + col*4
    MOV EAX, [RBX]      ; EAX = matrix[row][col]
```

---

## 8. Catatan Penting

1. **MOV tidak mengubah flag** (tidak mempengaruhi EFLAGS/RFLAGS).
2. **PUSH dan POP mengubah RSP/ESP/SP** secara otomatis.
3. **Stack harus seimbang** - setiap PUSH harus ada POP yang sesuai.
4. **LEA tidak mengakses memori** - hanya menghitung alamat.
5. **XCHG bisa menggunakan lock prefix** untuk operasi atomik.
6. **Ukuran operand harus konsisten** untuk semua instruksi.
