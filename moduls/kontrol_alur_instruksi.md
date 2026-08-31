# Instruksi Kontrol Alur (Control Flow)

## 1. JMP – Lompat Tak Bersyarat (Unconditional Jump)

### 1.1 Deskripsi
`JMP` adalah instruksi untuk **mengubah alur eksekusi program** secara paksa ke alamat atau label yang ditentukan. Berbeda dengan instruksi lompat bersyarat, `JMP` selalu dieksekusi tanpa memperhatikan kondisi apapun.

### 1.2 Sintaks Dasar
```assembly
JMP target    ; target bisa label, register, atau alamat memori
```

### 1.3 Jenis-jenis JMP

#### a. Short Jump (Lompat Pendek)
- Jarak lompatan **-128 s/d +127 byte** dari instruksi berikutnya.
- Hanya membutuhkan 2 byte dalam kode mesin.

```assembly
JMP SHORT label  ; Lompat pendek (eksplisit)
JMP label        ; Assembler akan memilih bentuk optimal
```

#### b. Near Jump (Lompat Dekat)
- Jarak lompatan **dalam segment yang sama** (32-bit atau 64-bit offset).
- Membutuhkan 3-5 byte dalam kode mesin.

```assembly
JMP NEAR label   ; Lompat dekat dalam segment yang sama
```

#### c. Far Jump (Lompat Jauh)
- Lompat ke **segment yang berbeda** (jarang digunakan di mode 64-bit).
- Membutuhkan 5 byte atau lebih.

```assembly
JMP FAR [pointer]  ; Lompat ke segment lain
```

### 1.4 Contoh Penggunaan

#### a. Lompat ke Label
```assembly
_start:
    MOV RAX, 10
    JMP skip_code    ; Lompat ke label 'skip_code'

    ; Kode ini akan dilewati
    MOV RBX, 20

skip_code:
    MOV RCX, 30      ; Eksekusi dilanjutkan di sini
```

#### b. Lompat ke Alamat di Register
```assembly
MOV RAX, target_label
JMP RAX            ; Lompat ke alamat yang ada di RAX
```

#### c. Lompat ke Alamat Memori
```assembly
JMP [jump_table]   ; Lompat ke alamat yang disimpan di jump_table
```

#### d. Infinite Loop
```assembly
loop_infinite:
    ; Lakukan sesuatu
    JMP loop_infinite   ; Ulangi terus menerus
```

### 1.5 Penggunaan Umum JMP

| Kasus Penggunaan | Contoh |
| :--- | :--- |
| **Loop tak terbatas** | `JMP loop_start` |
| **Melewati kode** | `JMP after_condition` |
| **Switch/Case** | `JMP [jump_table + index*8]` |
| **Keluar dari loop** | `JMP loop_exit` |

### 1.6 Perbedaan JMP dengan Instruksi Lain

| Instruksi | Kondisi | Penggunaan |
| :--- | :--- | :--- |
| **JMP** | Selalu | Lompat tak bersyarat |
| **JE/JNE, JG/JL, dll** | Bergantung flag | Lompat bersyarat |
| **CALL** | Selalu | Panggil fungsi (menyimpan return) |
| **RET** | Selalu | Kembali dari fungsi |

---

## 2. JE / JNE – Lompat Bersyarat (Sama / Tidak Sama)

### 2.1 Deskripsi
- **JE** (*Jump if Equal*) = Lompat jika **sama** (ZF = 1)
- **JNE** (*Jump if Not Equal*) = Lompat jika **tidak sama** (ZF = 0)

### 2.2 Sintaks Dasar
```assembly
JE  label   ; Lompat jika ZF = 1 (hasil sebelumnya sama)
JNE label   ; Lompat jika ZF = 0 (hasil sebelumnya tidak sama)
```

### 2.3 Cara Kerja
`JE` dan `JNE` memeriksa **Zero Flag (ZF)** yang biasanya diatur oleh:
- `CMP` (perbandingan)
- `TEST` (operasi AND tanpa simpan)
- Operasi aritmetika/logika (ADD, SUB, AND, OR, XOR, dll)

### 2.4 Contoh Penggunaan

#### a. Membandingkan Dua Nilai
```assembly
MOV RAX, 10
MOV RBX, 10
CMP RAX, RBX    ; RAX == RBX? Ya, ZF = 1
JE  equal_label ; Lompat ke equal_label

equal_label:
    ; Kode di sini akan dieksekusi
```

#### b. Cek Hasil Operasi
```assembly
XOR RAX, RAX    ; RAX = 0
TEST RAX, RAX   ; Cek apakah RAX = 0
JE  zero_label  ; Lompat jika RAX = 0 (ZF = 1)

zero_label:
    ; RAX = 0, lakukan sesuatu
```

#### c. Loop Sederhana
```assembly
MOV RCX, 10
loop_start:
    ; Lakukan sesuatu
    DEC RCX
    CMP RCX, 0
    JNE loop_start  ; Lompat jika RCX != 0 (ulangi)
    ; Jika RCX == 0, keluar dari loop
```

### 2.5 JE vs JZ (Sama Saja!)
- **JE** dan **JZ** (*Jump if Zero*) adalah instruksi yang sama, hanya nama alternatif.
- Keduanya memeriksa ZF = 1.

```assembly
CMP RAX, 10
JE  equal       ; Bisa juga ditulis JZ equal
JNE not_equal   ; Bisa juga ditulis JNZ not_equal
```

### 2.6 Contoh Program
```assembly
section .data
    msg_equal   db 'Nilai sama!', 0xa
    msg_not_eq  db 'Nilai berbeda!', 0xa

section .text
    global _start

_start:
    MOV RAX, 25
    MOV RBX, 25
    CMP RAX, RBX
    JE  equal_label
    JNE not_equal_label

equal_label:
    ; Tampilkan pesan "Nilai sama!"
    MOV RDX, 13
    MOV RCX, msg_equal
    JMP display

not_equal_label:
    ; Tampilkan pesan "Nilai berbeda!"
    MOV RDX, 16
    MOV RCX, msg_not_eq

display:
    ; Code untuk menampilkan pesan
    MOV RSI, RCX
    MOV RDI, 1
    MOV RAX, 1
    SYSCALL
```

---

## 3. JG / JLE – Lompat Bersyarat (Besar / Kecil-Sama) untuk Signed

### 3.1 Deskripsi
Instruksi ini digunakan untuk **membandingkan bilangan bertanda (signed)**:

| Instruksi | Kondisi | Arti |
| :--- | :--- | :--- |
| **JG** | ZF = 0 dan SF = OF | Lebih besar (*Greater*) |
| **JGE** | SF = OF | Lebih besar atau sama |
| **JL** | SF ≠ OF | Lebih kecil (*Less*) |
| **JLE** | ZF = 1 atau SF ≠ OF | Lebih kecil atau sama |

### 3.2 Sintaks Dasar
```assembly
JG  label   ; Lompat jika > (signed)
JGE label   ; Lompat jika >= (signed)
JL  label   ; Lompat jika < (signed)
JLE label   ; Lompat jika <= (signed)
```

### 3.3 Perbandingan Signed vs Unsigned

| Perbandingan | Signed (bertanda) | Unsigned (tanpa tanda) |
| :--- | :--- | :--- |
| **Lebih besar** | `JG` | `JA` (*Jump if Above*) |
| **Lebih besar/sama** | `JGE` | `JAE` (*Jump if Above or Equal*) |
| **Lebih kecil** | `JL` | `JB` (*Jump if Below*) |
| **Lebih kecil/sama** | `JLE` | `JBE` (*Jump if Below or Equal*) |

### 3.4 Mengapa Dibedakan?
Karena representasi biner untuk signed dan unsigned berbeda:
- `-1` (signed) = `0xFFFFFFFF` (unsigned) = 4.294.967.295

```assembly
; Contoh perbedaan
MOV EAX, -1      ; EAX = 0xFFFFFFFF
MOV EBX, 1
CMP EAX, EBX
JG  signed_greater  ; -1 > 1? Salah (tidak lompat)
JA  unsigned_greater ; 0xFFFFFFFF > 1? Benar (lompat!)
```

### 3.5 Contoh Penggunaan

#### a. Mencari Nilai Maksimum
```assembly
MOV RAX, 100
MOV RBX, 200
CMP RAX, RBX
JG  rax_bigger   ; Lompat jika RAX > RBX
JMP rbx_bigger

rax_bigger:
    ; RAX lebih besar
    MOV RCX, RAX
    JMP done

rbx_bigger:
    ; RBX lebih besar
    MOV RCX, RBX

done:
    ; RCX berisi nilai maksimum
```

#### b. Validasi Range
```assembly
; Cek apakah nilai di antara 10 dan 20 (10 <= nilai <= 20)
CMP EAX, 10
JL  invalid      ; Lompat jika EAX < 10
CMP EAX, 20
JG  invalid      ; Lompat jika EAX > 20
; Jika sampai sini, nilai valid
```

#### c. Implementasi if-else di C++
```cpp
if (a > b) {
    // Blok IF
} else {
    // Blok ELSE
}
```

```assembly
; Assembly yang dihasilkan
CMP EAX, EBX     ; Bandingkan a dan b
JG  if_block     ; Jika a > b, lompat ke IF
; Blok ELSE
JMP after_if
if_block:
; Blok IF
after_if:
```

### 3.6 Contoh Lengkap dengan C++

#### Kode C++
```cpp
int a = 10, b = 5;
if (a > b) {
    a = a - b;
} else {
    b = b - a;
}
```

#### Assembly (x86-64)
```assembly
MOV EAX, 10
MOV EBX, 5
CMP EAX, EBX
JG  if_greater    ; Jika EAX > EBX

; Blok ELSE (b = b - a)
SUB EBX, EAX
JMP after_if

if_greater:
; Blok IF (a = a - b)
SUB EAX, EBX

after_if:
; Lanjutkan program
```

---

## 4. CALL / RET – Panggil dan Kembali dari Fungsi

### 4.1 Deskripsi
- **CALL**: Memanggil fungsi/subrutin. Menyimpan alamat return (alamat instruksi setelah CALL) ke stack, lalu melompat ke fungsi.
- **RET**: Kembali dari fungsi. Mengambil alamat return dari stack dan melompat ke alamat tersebut.

### 4.2 Sintaks Dasar
```assembly
CALL function_name   ; Panggil fungsi
RET                  ; Kembali dari fungsi
RET 16               ; Kembali dan bersihkan 16 byte dari stack
```

### 4.3 Cara Kerja CALL/RET

```
SEBELUM CALL:
Stack: [data lain]
RSP → [alamat return ?]

SAAT CALL:
1. Push alamat return ke stack (RSP -= 8)
2. Simpan alamat return = alamat instruksi setelah CALL
3. Lompat ke fungsi

Stack setelah CALL:
RSP → [alamat return]
      [data lain]

SAAT RET:
1. Pop alamat return dari stack (RSP += 8)
2. Lompat ke alamat return

Stack setelah RET:
RSP → [data lain]
```

### 4.4 Contoh Penggunaan

#### a. Fungsi Sederhana
```assembly
section .text
    global _start

_start:
    CALL my_function   ; Panggil fungsi
    ; Kode setelah CALL dieksekusi setelah RET
    MOV RAX, 60        ; Exit syscall
    XOR RDI, RDI
    SYSCALL

my_function:
    ; Lakukan sesuatu di sini
    MOV RAX, 10
    ADD RAX, 20
    RET                ; Kembali ke pemanggil
```

#### b. Fungsi dengan Parameter
```assembly
; Fungsi: tambah(a, b) -> return a + b
; Parameter: a di RDI, b di RSI
tambah:
    MOV RAX, RDI
    ADD RAX, RSI
    RET
```

#### c. Fungsi dengan Stack Frame
```assembly
my_function:
    PUSH RBP            ; Simpan base pointer lama
    MOV RBP, RSP        ; Atur base pointer baru
    SUB RSP, 16         ; Alokasi ruang untuk variabel lokal

    ; Gunakan RBP untuk akses parameter dan variabel lokal
    MOV DWORD [RBP-4], 10    ; Variabel lokal pertama
    MOV DWORD [RBP-8], 20    ; Variabel lokal kedua

    ; Kembalikan nilai di EAX
    MOV EAX, [RBP-4]
    ADD EAX, [RBP-8]

    ; Bersihkan stack frame
    MOV RSP, RBP
    POP RBP
    RET
```

### 4.5 Stack Frame (Prolog dan Epilog)

#### Prolog Fungsi (Setup)
```assembly
push rbp          ; Simpan RBP lama
mov rbp, rsp      ; RBP = RSP (base pointer baru)
sub rsp, 32       ; Alokasi 32 byte untuk variabel lokal
```

#### Epilog Fungsi (Cleanup)
```assembly
leave             ; Setara dengan: mov rsp, rbp; pop rbp
ret               ; Kembali ke pemanggil
```

### 4.6 Passing Parameter (Calling Convention)

#### System V AMD64 (Linux/macOS)
| Parameter | Register |
| :--- | :--- |
| **1** | RDI |
| **2** | RSI |
| **3** | RDX |
| **4** | RCX |
| **5** | R8 |
| **6** | R9 |
| **Hasil** | RAX |

#### Microsoft x64 (Windows)
| Parameter | Register |
| :--- | :--- |
| **1** | RCX |
| **2** | RDX |
| **3** | R8 |
| **4** | R9 |
| **Hasil** | RAX |

### 4.7 Contoh Fungsi dengan Banyak Parameter

#### Fungsi C++
```cpp
int hitung(int a, int b, int c, int d, int e, int f) {
    return a + b + c + d + e + f;
}
```

#### Assembly (System V AMD64)
```assembly
hitung:
    ; Parameter: a=RDI, b=RSI, c=RDX, d=RCX, e=R8, f=R9
    MOV RAX, RDI
    ADD RAX, RSI
    ADD RAX, RDX
    ADD RAX, RCX
    ADD RAX, R8
    ADD RAX, R9
    RET
```

### 4.8 Ret dengan Argument (RET n)

**`RET n`** digunakan untuk membersihkan parameter dari stack setelah fungsi selesai, umumnya pada calling convention **cdecl** (32-bit).

```assembly
; Fungsi dengan 2 parameter (32-bit, cdecl)
; Parameter: [ESP+4], [ESP+8]
my_func:
    MOV EAX, [ESP+4]   ; Parameter pertama
    ADD EAX, [ESP+8]   ; Tambah parameter kedua
    RET 8              ; Kembali dan bersihkan 8 byte (2 parameter)
```

### 4.9 Contoh Program Lengkap

```assembly
; Program: Fungsi Penjumlahan dan Pengurangan

section .text
    global _start

_start:
    ; Panggil fungsi tambah(10, 20)
    MOV RDI, 10
    MOV RSI, 20
    CALL tambah
    ; Hasil ada di RAX = 30

    ; Panggil fungsi kurang(30, 5)
    MOV RDI, 30
    MOV RSI, 5
    CALL kurang
    ; Hasil ada di RAX = 25

    ; Keluar dari program
    MOV RAX, 60
    XOR RDI, RDI
    SYSCALL

; Fungsi: tambah(a, b) = a + b
tambah:
    MOV RAX, RDI
    ADD RAX, RSI
    RET

; Fungsi: kurang(a, b) = a - b
kurang:
    MOV RAX, RDI
    SUB RAX, RSI
    RET
```

---

## 5. Perbandingan dengan C++

### 5.1 If-Else Statement
```cpp
int a = 10, b = 20;
if (a > b) {
    a = a + 5;
} else {
    b = b + 5;
}
```

```assembly
MOV EAX, 10
MOV EBX, 20
CMP EAX, EBX
JG  if_greater
ADD EBX, 5        ; Blok ELSE
JMP after_if
if_greater:
ADD EAX, 5        ; Blok IF
after_if:
```

### 5.2 While Loop
```cpp
int i = 0;
while (i < 10) {
    i++;
}
```

```assembly
MOV EAX, 0        ; i = 0
while_start:
CMP EAX, 10
JGE while_end     ; Jika i >= 10, keluar
INC EAX           ; i++
JMP while_start
while_end:
```

### 5.3 For Loop
```cpp
int sum = 0;
for (int i = 0; i < 10; i++) {
    sum += i;
}
```

```assembly
MOV EAX, 0        ; sum = 0
MOV ECX, 0        ; i = 0
for_start:
CMP ECX, 10
JGE for_end       ; Jika i >= 10, keluar
ADD EAX, ECX      ; sum += i
INC ECX           ; i++
JMP for_start
for_end:
```

### 5.4 Fungsi (Function Call)
```cpp
int tambah(int a, int b) {
    return a + b;
}

int main() {
    int hasil = tambah(5, 10);
    return hasil;
}
```

```assembly
tambah:
    MOV RAX, RDI
    ADD RAX, RSI
    RET

main:
    MOV RDI, 5
    MOV RSI, 10
    CALL tambah
    ; Hasil di RAX
    RET
```

---

## 6. Ringkasan Instruksi Kontrol Alur

| Instruksi | Kondisi | Flag | Penggunaan |
| :--- | :--- | :--- | :--- |
| **JMP** | Selalu | — | Lompat tak bersyarat |
| **JE / JZ** | Sama / Nol | ZF = 1 | `if (a == b)` |
| **JNE / JNZ** | Tidak sama / Bukan nol | ZF = 0 | `if (a != b)` |
| **JG** | Lebih besar (signed) | ZF=0, SF=OF | `if (a > b)` (signed) |
| **JGE** | Lebih besar/sama | SF=OF | `if (a >= b)` (signed) |
| **JL** | Lebih kecil | SF≠OF | `if (a < b)` (signed) |
| **JLE** | Lebih kecil/sama | ZF=1 atau SF≠OF | `if (a <= b)` (signed) |
| **JA** | Lebih besar (unsigned) | CF=0, ZF=0 | `if (a > b)` (unsigned) |
| **JAE** | Lebih besar/sama | CF=0 | `if (a >= b)` (unsigned) |
| **JB** | Lebih kecil | CF=1 | `if (a < b)` (unsigned) |
| **JBE** | Lebih kecil/sama | CF=1 atau ZF=1 | `if (a <= b)` (unsigned) |
| **CALL** | Selalu | — | Panggil fungsi |
| **RET** | Selalu | — | Kembali dari fungsi |

---

## 7. Tips dan Praktik Terbaik

1. **Gunakan CMP sebelum Jcc**: Selalu gunakan `CMP` atau `TEST` sebelum lompatan bersyarat.
2. **Pilih signed/unsigned yang tepat**: Gunakan `JG/JL` untuk signed, `JA/JB` untuk unsigned.
3. **Seimbangkan CALL/RET**: Setiap `CALL` harus punya `RET` yang sesuai.
4. **Simpan register** yang akan diubah di fungsi dengan `PUSH`/`POP`.
5. **Gunakan `LEAVE`** untuk membersihkan stack frame (lebih ringkas).
6. **JMP untuk optimasi**: Gunakan `JMP` untuk melewati kode atau loop tak terbatas.

---

## 8. Latihan

### Soal 1
Buat fungsi `max(a, b)` yang mengembalikan nilai maksimum dari dua angka menggunakan `CMP`, `JG`, dan `RET`.

### Soal 2
Implementasikan loop `while` dalam assembly untuk menjumlahkan angka dari 1 sampai 100.

### Soal 3
Buat program yang membandingkan 3 angka dan menentukan nilai terkecil menggunakan instruksi lompatan bersyarat.

### Soal 4
Tulis fungsi `factorial(n)` secara rekursif (gunakan `CALL` dan `RET`) untuk menghitung faktorial dari n.

### Soal 5
Buat implementasi `switch-case` dalam assembly menggunakan `CMP` dan lompatan bersyarat.
