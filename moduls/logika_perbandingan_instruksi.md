# Instruksi Logika & Perbandingan

## 1. AND – Operasi Logika AND Bitwise

### 1.1 Deskripsi
`AND` melakukan operasi **bitwise AND** antara dua operand dan menyimpan hasil di operand pertama (destination). Setiap bit hasil adalah 1 hanya jika kedua bit sumber bernilai 1. Instruksi ini mempengaruhi flag OF, SF, ZF, AF, CF, PF (CF dan OF selalu di-reset ke 0).

### 1.2 Sintaks Dasar
```assembly
AND destination, source   ; destination = destination AND source
```

### 1.3 Contoh Penggunaan

#### a. Register dengan Immediate
```assembly
AND RAX, 0xFF     ; Pertahankan hanya 8 bit terendah (RAX = RAX & 0xFF)
AND EAX, 0x0F     ; Pertahankan 4 bit terendah
AND AL, 0x01      ; Ambil bit ke-0 (LSB)
```

#### b. Register dengan Register
```assembly
AND RAX, RBX      ; RAX = RAX & RBX
AND EAX, ECX      ; 32-bit
AND AX, BX        ; 16-bit
```

#### c. Memory dengan Register
```assembly
AND [var], RAX    ; var = var & RAX
AND RAX, [var]    ; RAX = RAX & var
AND [RBP-8], EAX  ; stack = stack & EAX
```

### 1.4 Penggunaan Umum

| Tujuan | Contoh | Penjelasan |
| :--- | :--- | :--- |
| **Masking (menyembunyikan bit)** | `AND EAX, 0xFF` | Menjaga 8 bit rendah, sisanya 0 |
| **Cek bit tertentu** | `AND AL, 0x80` | Hasil 0 atau 0x80, mempengaruhi ZF |
| **Konversi huruf ke uppercase** | `AND AL, 0xDF` | Huruf kecil menjadi besar (ASCII) |
| **Genapkan ke kelipatan** | `AND EAX, -16` | Bulatkan ke bawah kelipatan 16 |

### 1.5 Pengaruh pada Flag
- **OF = 0, CF = 0** (selalu di-reset)
- **SF** = bit ke-7 (8-bit) / ke-15 (16-bit) / ke-31 (32-bit) / ke-63 (64-bit) dari hasil
- **ZF** = 1 jika hasil = 0
- **PF** = 1 jika jumlah bit 1 pada byte rendah genap

### 1.6 Contoh Program
```assembly
section .data
    value   db 0xAB      ; 10101011
    mask    db 0x0F      ; 00001111

section .text
    global _start

_start:
    MOV AL, [value]      ; AL = 0xAB (171)
    AND AL, [mask]       ; AL = 0x0B (11)  ; 10101011 & 00001111 = 00001011
    ; Flag: ZF=0, SF=0, PF=1 (0x0B memiliki 3 bit 1 -> ganjil? PF=0? Perlu dicek)
```

---

## 2. OR – Operasi Logika OR Bitwise

### 2.1 Deskripsi
`OR` melakukan operasi **bitwise OR** antara dua operand dan menyimpan hasil di destination. Bit hasil adalah 1 jika setidaknya satu bit sumber bernilai 1. Pengaruh pada flag sama dengan AND (OF=CF=0).

### 2.2 Sintaks Dasar
```assembly
OR destination, source    ; destination = destination OR source
```

### 2.3 Contoh Penggunaan

#### a. Register dengan Immediate
```assembly
OR RAX, 0x0F      ; Set 4 bit rendah menjadi 1
OR AL, 0x80       ; Set bit ke-7 (MSB) menjadi 1
OR EAX, 0x1000    ; Set bit ke-12
```

#### b. Register dengan Register
```assembly
OR RAX, RBX       ; RAX = RAX | RBX
OR EAX, ECX
```

#### c. Memory
```assembly
OR [var], RAX     ; var = var | RAX
OR RAX, [var]
```

### 2.4 Penggunaan Umum

| Tujuan | Contoh | Penjelasan |
| :--- | :--- | :--- |
| **Set bit tertentu** | `OR AL, 0x20` | Set bit ke-5 menjadi 1 |
| **Konversi ke lowercase** | `OR AL, 0x20` | Huruf besar menjadi kecil (ASCII) |
| **Kombinasi flag** | `OR EAX, EBX` | Gabungkan dua set bit |
| **Pastikan nilai positif** | `OR EAX, 0` | Tidak mengubah, hanya set flag |

### 2.5 Contoh Konversi ASCII
```assembly
; Ubah huruf kecil ke besar dengan AND, besar ke kecil dengan OR
MOV AL, 'a'      ; AL = 0x61
AND AL, 0xDF     ; AL = 0x41 ('A')

MOV AL, 'A'      ; AL = 0x41
OR AL, 0x20      ; AL = 0x61 ('a')
```

---

## 3. XOR – Exclusive OR Bitwise

### 3.1 Deskripsi
`XOR` melakukan operasi **bitwise XOR** (exclusive OR). Bit hasil adalah 1 jika kedua bit berbeda. Ini adalah instruksi yang sangat serbaguna. Mempengaruhi flag OF=CF=0.

### 3.2 Sintaks Dasar
```assembly
XOR destination, source   ; destination = destination XOR source
```

### 3.3 Contoh Penggunaan

#### a. Mengosongkan Register (set ke 0)
```assembly
XOR RAX, RAX      ; RAX = 0 (cara paling cepat dan pendek)
XOR EAX, EAX      ; EAX = 0
XOR AX, AX        ; AX = 0
```

#### b. Toggle (membalik) Bit
```assembly
XOR AL, 0x80      ; Balik bit ke-7
XOR EAX, 0x0F     ; Balik 4 bit rendah
```

#### c. Enkripsi Sederhana (XOR cipher)
```assembly
; Enkripsi byte dengan key
XOR AL, key       ; byte terenkripsi
; Dekripsi dengan key yang sama
XOR AL, key       ; byte asli kembali
```

#### d. Swap Tanpa Temporary
```assembly
XOR RAX, RBX      ; RAX = RAX ^ RBX
XOR RBX, RAX      ; RBX = RAX ^ RBX (asli RAX)
XOR RAX, RBX      ; RAX = RBX (asli RBX)
; Sekarang RAX dan RBX tertukar
```

### 3.4 Pengaruh pada Flag
- **OF = 0, CF = 0**
- **SF, ZF, PF** sesuai hasil
- **ZF** = 1 jika hasil = 0 (sering digunakan untuk test)

### 3.5 Perbedaan AND, OR, XOR

| Operasi | Bit Hasil | Simbol | Kegunaan |
| :--- | :--- | :--- | :--- |
| **AND** | 1 jika keduanya 1 | `&` | Masking, clear bit |
| **OR** | 1 jika salah satu 1 | `\|` | Set bit |
| **XOR** | 1 jika berbeda | `^` | Toggle bit, swap, zeroing |

---

## 4. NOT – Negasi Bitwise (Complement)

### 4.1 Deskripsi
`NOT` membalik semua bit operand (one's complement). Berbeda dengan AND/OR/XOR, NOT hanya menerima satu operand dan **tidak** mempengaruhi flag.

### 4.2 Sintaks Dasar
```assembly
NOT operand       ; operand = ~operand
```

### 4.3 Contoh Penggunaan
```assembly
NOT RAX           ; RAX = bitwise complement dari RAX
NOT AL            ; AL = ~AL
NOT [var]         ; var = ~var
```

### 4.4 Penggunaan Umum
- Membuat mask negatif (misal `NOT 0` menghasilkan semua bit 1)
- Membalik semua bit untuk operasi tertentu
- Persiapan untuk aritmetika two's complement (NOT + 1 = negasi)

### 4.5 Contoh
```assembly
MOV AL, 0x0F      ; AL = 00001111
NOT AL            ; AL = 11110000 (0xF0)
```

---

## 5. TEST – Bitwise Test (Tanpa Menyimpan Hasil)

### 5.1 Deskripsi
`TEST` melakukan operasi **AND** antara dua operand, tetapi **tidak** menyimpan hasil. Hanya mempengaruhi flag (sama seperti AND). Digunakan untuk menguji bit tertentu tanpa mengubah nilai register/memori.

### 5.2 Sintaks Dasar
```assembly
TEST operand1, operand2   ; operand1 AND operand2, hanya set flag
```

### 5.3 Contoh Penggunaan

#### a. Cek apakah nilai nol
```assembly
TEST RAX, RAX     ; AND RAX, RAX -> ZF=1 jika RAX=0
JZ  label_zero    ; Lompat jika ZF=1 (nilai nol)
JNZ label_not_zero
```

#### b. Cek bit tertentu
```assembly
TEST AL, 0x01     ; Cek bit ke-0 (LSB)
JZ  even          ; Lompat jika bit = 0 (genap)
JNZ odd           ; Lompat jika bit = 1 (ganjil)

TEST EAX, 0x80000000 ; Cek bit tanda (MSB)
JNZ negative      ; Lompat jika negatif
```

#### c. Cek lebih dari satu bit
```assembly
TEST EAX, 0x0F    ; Cek apakah salah satu dari 4 bit rendah bernilai 1
JNZ bits_set      ; Setidaknya satu bit set
```

### 5.4 Perbedaan TEST vs AND

| Aspek | TEST | AND |
| :--- | :--- | :--- |
| **Menyimpan hasil** | Tidak | Ya (di destination) |
| **Mengubah operand** | Tidak | Mengubah destination |
| **Flag** | Sama seperti AND | Sama seperti AND |
| **Penggunaan** | Hanya untuk tes/kondisi | Untuk tes sekaligus modifikasi |

### 5.5 Contoh Praktis
```assembly
section .data
    flags   db 0b10101010

section .text
    global _start

_start:
    MOV AL, [flags]
    TEST AL, 0x01     ; Cek apakah bit 0 = 1
    JZ  bit0_zero     ; Lompat jika bit0 = 0

bit0_zero:
    ; bit0 = 0, lanjutkan
    TEST AL, 0x02     ; Cek bit1
    JNZ bit1_one
```

---

## 6. CMP – Compare (Bandingkan) Dua Operan

### 6.1 Deskripsi
`CMP` melakukan operasi **pengurangan** (subtraction) antara operand pertama dan kedua (dest - source), tetapi **tidak** menyimpan hasil. Hanya mempengaruhi flag (sama seperti SUB). Digunakan untuk membandingkan nilai sebelum instruksi lompatan bersyarat.

### 6.2 Sintaks Dasar
```assembly
CMP operand1, operand2   ; operand1 - operand2, set flag
```

### 6.3 Pengaruh pada Flag (Penting!)
Flag yang dihasilkan sama dengan instruksi `SUB`, yaitu:

| Flag | Arti |
| :--- | :--- |
| **ZF** | 1 jika operand1 == operand2 (hasil 0) |
| **CF** | 1 jika operand1 < operand2 (unsigned) |
| **SF** | 1 jika hasil negatif (MSB=1) untuk signed |
| **OF** | 1 jika terjadi overflow signed |
| **AF, PF** | Seperti SUB |

### 6.4 Kombinasi CMP dengan Lompatan Bersyarat

#### Untuk Unsigned Numbers (tanpa tanda)

| Instruksi | Kondisi | Arti |
| :--- | :--- | :--- |
| **JE / JZ** | ZF = 1 | Sama dengan (equal) |
| **JNE / JNZ** | ZF = 0 | Tidak sama |
| **JA** | CF = 0 dan ZF = 0 | Lebih besar (above) |
| **JAE** | CF = 0 | Lebih besar atau sama |
| **JB / JC** | CF = 1 | Lebih kecil (below) |
| **JBE** | CF = 1 atau ZF = 1 | Lebih kecil atau sama |

#### Untuk Signed Numbers (bertanda)

| Instruksi | Kondisi | Arti |
| :--- | :--- | :--- |
| **JE / JZ** | ZF = 1 | Sama dengan |
| **JNE / JNZ** | ZF = 0 | Tidak sama |
| **JG** | ZF = 0 dan SF = OF | Lebih besar (greater) |
| **JGE** | SF = OF | Lebih besar atau sama |
| **JL** | SF ≠ OF | Lebih kecil (less) |
| **JLE** | ZF = 1 atau SF ≠ OF | Lebih kecil atau sama |

### 6.5 Contoh Penggunaan

#### a. Membandingkan Dua Nilai
```assembly
CMP RAX, 10
JE  equal          ; Lompat jika RAX == 10
JNE not_equal      ; Lompat jika RAX != 10
JL  less           ; Lompat jika RAX < 10 (signed)
JG  greater        ; Lompat jika RAX > 10 (signed)
```

#### b. Loop dengan CMP
```assembly
MOV RCX, 10
loop_start:
    ; lakukan operasi
    DEC RCX
    CMP RCX, 0       ; bandingkan RCX dengan 0
    JNE loop_start   ; ulangi jika RCX != 0
```

#### c. Pengecekan Batas Array
```assembly
; Cek index array agar tidak out-of-bounds
CMP EAX, array_size
JAE error_out_of_bounds  ; jika index >= array_size
```

### 6.6 Perbedaan CMP vs SUB

| Aspek | CMP | SUB |
| :--- | :--- | :--- |
| **Menyimpan hasil** | Tidak | Ya (di destination) |
| **Mengubah operand** | Tidak | Mengubah destination |
| **Flag** | Sama seperti SUB | Sama seperti SUB |
| **Penggunaan** | Untuk kondisi | Untuk perhitungan |

---

## 7. Contoh Lengkap dengan C++

### 7.1 Kode C++
```cpp
int a = 5, b = 10;
bool flag = false;

// Operasi logika
int c = a & b;        // AND
int d = a | b;        // OR
int e = a ^ b;        // XOR
int f = ~a;           // NOT

// Perbandingan
if (a > b) {
    flag = true;
} else {
    flag = false;
}
```

### 7.2 Assembly yang dihasilkan (x86-64)
```assembly
MOV EAX, 5
MOV EBX, 10
AND EAX, EBX          ; c = a & b
MOV ECX, 5
OR  ECX, 10           ; d = a | b
MOV EDX, 5
XOR EDX, 10           ; e = a ^ b
MOV EDI, 5
NOT EDI               ; f = ~a

; Perbandingan a > b
CMP EAX, EBX
JG  a_greater
MOV [flag], 0         ; flag = false
JMP done
a_greater:
MOV [flag], 1         ; flag = true
done:
```

---

## 8. Ringkasan Pengaruh pada Flag

| Instruksi | OF | SF | ZF | AF | CF | PF | Catatan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **AND** | 0 | Ya | Ya | ? | 0 | Ya | ? = undefined |
| **OR** | 0 | Ya | Ya | ? | 0 | Ya | |
| **XOR** | 0 | Ya | Ya | ? | 0 | Ya | |
| **NOT** | — | — | — | — | — | — | Tidak mempengaruhi flag |
| **TEST** | 0 | Ya | Ya | ? | 0 | Ya | Sama seperti AND |
| **CMP** | Ya | Ya | Ya | Ya | Ya | Ya | Sama seperti SUB |

---

## 9. Tips dan Trik

1. **Zeroing register**: Gunakan `XOR reg, reg` (lebih cepat dan pendek daripada `MOV reg, 0`).
2. **Cek nilai negatif**: `TEST RAX, RAX` lalu `JS negative` atau `JNS non_negative`.
3. **Cek bit parity**: Setelah operasi, gunakan `JP` atau `JNP` berdasarkan PF.
4. **Membandingkan dengan 0**: Gunakan `TEST` (lebih baik dari `CMP reg, 0`).
5. **Menggabungkan flag**: Kombinasikan `CMP` dengan `AND`/`OR`/`XOR` untuk kondisi kompleks.

---

## 10. Latihan

### Soal 1
Buat fungsi yang menentukan apakah suatu bilangan (32-bit) adalah kelipatan 8. Gunakan `TEST` dan lompatan bersyarat.

### Soal 2
Tulis kode assembly untuk mengubah huruf kapital menjadi huruf kecil dan sebaliknya pada sebuah string (gunakan `OR` dan `AND`).

### Soal 3
Gunakan `XOR` untuk menukar dua register tanpa menggunakan register tambahan, dan implementasikan swap array dua elemen.

### Soal 4
Buat kode yang membandingkan dua angka signed dan menyimpan nilai maksimum di RAX menggunakan `CMP` dan lompatan.