# Instruksi Aritmetika

## 1. ADD dan SUB – Penjumlahan dan Pengurangan

### 1.1 Deskripsi
- **ADD**: Menjumlahkan dua operand dan menyimpan hasil di operand pertama (destination).
- **SUB**: Mengurangkan operand kedua (source) dari operand pertama (destination) dan menyimpan hasil di destination.
Kedua instruksi ini mempengaruhi *flags* (OF, SF, ZF, AF, CF, PF) sesuai hasil operasi.

### 1.2 Sintaks Dasar
```assembly
ADD destination, source   ; destination = destination + source
SUB destination, source   ; destination = destination - source
```

### 1.3 Contoh Penggunaan

#### a. Immediate ke Register
```assembly
ADD RAX, 10      ; RAX = RAX + 10
SUB RBX, 5       ; RBX = RBX - 5
ADD EAX, 0xFF    ; EAX = EAX + 255
```

#### b. Register ke Register
```assembly
ADD RAX, RBX     ; RAX = RAX + RBX
SUB RCX, RDX     ; RCX = RCX - RDX
ADD EAX, EBX     ; 32-bit
```

#### c. Memory ke Register atau Register ke Memory
```assembly
ADD RAX, [var]   ; RAX = RAX + nilai di var
SUB [var], RBX   ; var = var - RBX
ADD [RBP-8], EAX ; stack += EAX
```

### 1.4 Aturan Penting
- Operand harus berukuran sama (tidak bisa mencampur 8-bit dan 32-bit).
- Tidak bisa langsung `ADD [mem1], [mem2]`; harus melalui register.
- Operasi dilakukan pada nilai *unsigned* maupun *signed*, tetapi flag yang dihasilkan bisa digunakan untuk deteksi overflow.

### 1.5 Pengaruh pada Flag (EFLAGS/RFLAGS)

| Flag | Keterangan |
| :--- | :--- |
| **ZF (Zero)** | Set jika hasil = 0 |
| **SF (Sign)** | Set jika hasil negatif (MSB=1) |
| **CF (Carry)** | Set jika ada carry keluar (untuk unsigned overflow) |
| **OF (Overflow)** | Set jika ada overflow signed |
| **AF (Aux Carry)** | Untuk BCD |
| **PF (Parity)** | Parity dari byte rendah |

### 1.6 Contoh Program Sederhana
```assembly
section .data
    a   dq 15
    b   dq 7
    c   dq 0

section .text
    global _start

_start:
    MOV RAX, [a]     ; RAX = 15
    ADD RAX, [b]     ; RAX = 15 + 7 = 22
    MOV [c], RAX     ; c = 22

    SUB RAX, 5       ; RAX = 22 - 5 = 17
    MOV [c], RAX     ; c = 17
```

---

## 2. INC dan DEC – Increment dan Decrement

### 2.1 Deskripsi
- **INC**: Menambah operand dengan 1.
- **DEC**: Mengurangi operand dengan 1.
Keduanya lebih ringkas dan cepat dibanding `ADD x, 1` atau `SUB x, 1`. Mereka mempengaruhi flag OF, SF, ZF, AF, PF, tetapi **tidak** mempengaruhi CF (Carry Flag).

### 2.2 Sintaks Dasar
```assembly
INC operand
DEC operand
```

### 2.3 Contoh Penggunaan
```assembly
INC RAX          ; RAX += 1
DEC RBX          ; RBX -= 1
INC [var]        ; variabel di memori += 1
DEC [RBP-4]      ; stack value -= 1
```

### 2.4 Aturan
- Operand bisa register atau memori.
- Tidak bisa menggunakan immediate (misal `INC 5` salah).
- Nilai operand bertipe unsigned, tetapi flag SF/OF berguna untuk signed.

### 2.5 Penggunaan Umum
- **Loop counter**: `DEC RCX; JNZ label`
- **Pointer traversal**: `INC RSI` (bergerak ke elemen berikutnya)

### 2.6 Contoh Loop dengan INC/DEC
```assembly
MOV RCX, 10      ; counter = 10
loop_start:
    ; lakukan sesuatu
    DEC RCX       ; counter--
    JNZ loop_start ; jika tidak nol, ulangi
```

---

## 3. MUL dan DIV – Perkalian dan Pembagian (Unsigned)

### 3.1 Deskripsi
- **MUL** (Multiply) : Perkalian bilangan **tanpa tanda** (unsigned). Hasil perkalian disimpan di register khusus.
- **DIV** (Divide)   : Pembagian bilangan **tanpa tanda** (unsigned). Hasil bagi dan sisa disimpan di register khusus.

Kedua instruksi ini memiliki perilaku yang bergantung pada ukuran operand.

### 3.2 Sintaks Dasar
```assembly
MUL source   ; multiplicand (implicit) dikali source
DIV source   ; dividend (implicit) dibagi source
```

### 3.3 Detail MUL

| Ukuran Operand | Multiplicand (implisit) | Hasil (produk) |
| :--- | :--- | :--- |
| **8-bit** | AL | AX (16-bit) |
| **16-bit** | AX | DX:AX (32-bit) |
| **32-bit** | EAX | EDX:EAX (64-bit) |
| **64-bit** | RAX | RDX:RAX (128-bit) |

**Contoh:**
```assembly
MOV AL, 5
MOV BL, 10
MUL BL        ; AX = 5 * 10 = 50 (0x32), AH=0, AL=0x32

MOV EAX, 1000
MOV ECX, 200
MUL ECX       ; EDX:EAX = 1000 * 200 = 200000 (0x30D40)
```

### 3.4 Detail DIV

| Ukuran Operand | Dividend (implisit) | Hasil Bagi (Quotient) | Sisa (Remainder) |
| :--- | :--- | :--- | :--- |
| **8-bit** | AX | AL | AH |
| **16-bit** | DX:AX | AX | DX |
| **32-bit** | EDX:EAX | EAX | EDX |
| **64-bit** | RDX:RAX | RAX | RDX |

**Peringatan:** Jika hasil bagi tidak muat dalam register tujuan, terjadi *division overflow* (exception).

**Contoh:**
```assembly
MOV AX, 100    ; dividend = 100
MOV BL, 3
DIV BL         ; AL = 33 (hasil bagi), AH = 1 (sisa)

; Untuk 32-bit
MOV EDX, 0     ; bersihkan EDX (karena kita hanya butuh 32-bit)
MOV EAX, 200
MOV ECX, 7
DIV ECX        ; EAX = 28, EDX = 4
```

### 3.5 Aturan Penting
- Sebelum `DIV`, pastikan bagian high (DX/EDX/RDX) bernilai 0 jika dividend tidak lebih dari 32/64-bit.
- `MUL` dan `DIV` hanya untuk **unsigned**. Untuk signed, gunakan `IMUL` dan `IDIV`.

---

## 4. IMUL – Perkalian Bertanda (Signed)

### 4.1 Deskripsi
`IMUL` adalah instruksi perkalian untuk bilangan **bertanda** (signed). Ia memiliki beberapa varian sintaks yang lebih fleksibel dibanding `MUL`. Hasilnya mempertimbangkan tanda (two's complement).

### 4.2 Varian Sintaks

#### a. Satu Operand (seperti MUL)
```assembly
IMUL source
```
- Sumber bisa register atau memori.
- Perilaku sama dengan MUL, tetapi operasi signed.
- Hasil disimpan di AX, DX:AX, EDX:EAX, atau RDX:RAX sesuai ukuran.

#### b. Dua Operand
```assembly
IMUL destination, source
```
- `destination` = register, `source` = register/memori/immediate.
- Hasil disimpan di `destination` (tidak overflow, hasil dipotong sesuai ukuran).

#### c. Tiga Operand
```assembly
IMUL destination, source1, immediate
```
- `destination` = register, `source1` = register/memori, `immediate` = konstanta.
- Hasil = source1 * immediate, disimpan di destination.

### 4.3 Contoh Penggunaan

#### Varian Satu Operand
```assembly
MOV AL, -5      ; AL = 0xFB (251)
MOV BL, 4
IMUL BL         ; AX = -20 (0xFFEC), AH=0xFF, AL=0xEC
```

#### Varian Dua Operand
```assembly
IMUL EAX, EBX   ; EAX = EAX * EBX (signed)
IMUL RAX, [var] ; RAX = RAX * var
IMUL ECX, 10    ; ECX = ECX * 10
```

#### Varian Tiga Operand
```assembly
IMUL RAX, RBX, 5   ; RAX = RBX * 5
IMUL EAX, [mem], 3 ; EAX = mem * 3
```

### 4.4 Pengaruh pada Flag
`IMUL` mempengaruhi CF dan OF untuk mendeteksi overflow. Jika hasil terlalu besar untuk ukuran destination, CF=OF=1; jika muat, CF=OF=0. Flag lain tidak terdefinisi.

### 4.5 Perbedaan MUL vs IMUL

| Aspek | MUL | IMUL |
| :--- | :--- | :--- |
| **Jenis operand** | Unsigned | Signed |
| **Overflow** | CF/OF menunjukkan carry | CF/OF menunjukkan overflow signed |
| **Varian** | Hanya 1 operand | 1, 2, atau 3 operand |
| **Hasil** | Full product di register | Potongan sesuai ukuran untuk 2/3 operand |

---

## 5. Contoh Perbandingan dengan C++

### C++ (operasi aritmetika)
```cpp
int a = 10, b = 20;
int c = a + b;      // ADD
int d = b - a;      // SUB
a++;                // INC
b--;                // DEC
int e = a * 5;      // IMUL (signed)
unsigned int f = 15;
unsigned int g = 3;
unsigned int h = f / g;  // DIV
```

### Assembly yang dihasilkan (x86-64)
```assembly
MOV EAX, 10
MOV EBX, 20
ADD EAX, EBX        ; c = a + b
MOV ECX, EBX
SUB ECX, EAX        ; d = b - a
INC EAX             ; a++
DEC EBX             ; b--
IMUL EAX, EBX, 5    ; e = b * 5 (signed)
MOV EAX, 15
MOV ECX, 3
XOR EDX, EDX        ; clear high part
DIV ECX             ; h = 15 / 3 (unsigned)
```

---

## 6. Ringkasan dan Tips

| Instruksi | Operasi | Jenis | Catatan |
| :--- | :--- | :--- | :--- |
| **ADD** | dest += src | signed/unsigned | Mempengaruhi semua flag |
| **SUB** | dest -= src | signed/unsigned | Mempengaruhi semua flag |
| **INC** | dest += 1 | signed/unsigned | Tidak mempengaruhi CF |
| **DEC** | dest -= 1 | signed/unsigned | Tidak mempengaruhi CF |
| **MUL** | AX/DX:AX dst = src | unsigned | Hanya 1 operand |
| **DIV** | quotient/remainder | unsigned | Hati-hati dengan overflow |
| **IMUL** | dest = src1 * src2 | signed | Varian 1, 2, 3 operand |

---

## 7. Latihan

### Soal 1: Hitung rata-rata
Buat kode assembly untuk menjumlahkan 5 angka (word) dan bagi hasilnya dengan 5 menggunakan `DIV`.

### Soal 2: Perkalian signed
Gunakan `IMUL` dengan 3 operand untuk menghitung `z = (x * 7) + y` tanpa menggunakan ADD tambahan.

### Soal 3: Loop dengan INC
Tulis loop yang mengisi array 10 elemen dengan nilai 0..9 menggunakan `INC`.

---

*Dokumen ini adalah bagian dari Panduan Fundamental Bahasa Mesin x86/x86-64 Intel.*