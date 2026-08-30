# Perbandingan C++ Modern vs NASM Assembly (Windows x64)

Panduan ini menyandingkan kode **C++ modern** dengan **Assembly x64 (NASM)**. Karena Anda beroperasi di Windows, kode Assembly di bawah ini menggunakan konvensi **Windows x64 ABI** (menggunakan register `RCX`, `RDX`, `R8`, `R9` untuk parameter fungsi dan menyediakan 32-byte *shadow space* di Stack).

---

## 1. Kasus Umum: Hello World

Mari kita mulai dengan program paling sederhana: mencetak teks ke layar. Di C++ kita menggunakan `std::cout`, sedangkan di Assembly kita akan memanggil fungsi `printf` dari C Standard Library (yang disediakan OS melalui `msvcrt.dll`).

### 💻 Kode C++
```cpp
#include <iostream>

int main() {
    std::cout << "Hello, Assembly World!\n";
    return 0;
}
```

### ⚙️ Kode Assembly (NASM)
```nasm
default rel           ; Menggunakan RIP-relative addressing secara default (Aman untuk ASLR)
extern printf         ; Memberitahu NASM bahwa fungsi printf ada di file eksternal (DLL)
extern ExitProcess    ; Fungsi API Windows untuk keluar dari program

section .data
    ; Mendefinisikan data string statis. '10' adalah karakter NewLine (\n), '0' adalah Null-terminator (\0).
    msg db "Hello, Assembly World!", 10, 0

section .text
global main           ; Entry point program
main:
    ; --- PROLOGUE ---
    ; Fungsi pemanggil wajib menyediakan minimal 32 byte (0x20) di stack untuk shadow space.
    ; Kita alokasikan 40 byte (0x28) sekaligus untuk menjaga 16-byte stack alignment.
    sub rsp, 40       

    ; --- MEMANGGIL printf ---
    ; Aturan Windows x64 ABI: Argumen pertama masuk ke RCX.
    lea rcx, [msg]    ; Load Effective Address: Memuat alamat memori 'msg' ke register RCX
    call printf       ; Eksekusi fungsi printf

    ; --- EPILOGUE & EXIT ---
    add rsp, 40       ; Bersihkan stack yang dialokasikan tadi
    xor ecx, ecx      ; Set ECX = 0 (Return/Exit code 0). Lebih cepat dari 'mov ecx, 0'
    call ExitProcess  ; Matikan program dengan aman
```

> [!NOTE]
> Pada x64 Windows, pemanggil fungsi wajib menyiapkan memori kosong di stack sebesar 32 byte yang disebut **Shadow Space** setiap kali memanggil fungsi eksternal, meskipun argumen dikirim lewat register.

---

## 2. Perhitungan Aritmatika (Add, Sub, Mul, Div)

Operasi matematika dasar. Di Assembly, operasi pembagian (`DIV` / `IDIV`) cukup unik karena ia secara eksplisit menggunakan dua register sekaligus (`RDX` dan `RAX`).

### 💻 Kode C++
```cpp
#include <iostream>

int main() {
    long long a = 15;
    long long b = 4;
    
    long long sum  = a + b; // 19
    long long diff = a - b; // 11
    long long prod = a * b; // 60
    long long quot = a / b; // 3
    long long rem  = a % b; // 3
    
    return 0;
}
```

### ⚙️ Kode Assembly (NASM)
```nasm
section .text
global main
main:
    ; Inisialisasi variabel ke dalam register
    mov rax, 15       ; a = 15
    mov rcx, 4        ; b = 4

    ; 1. PENJUMLAHAN (ADD)
    mov r8, rax       ; Copy a(15) ke R8
    add r8, rcx       ; r8 = r8 + rcx -> r8 berisi 19 (sum)

    ; 2. PENGURANGAN (SUB)
    mov r9, rax       ; Copy a(15) ke R9
    sub r9, rcx       ; r9 = r9 - rcx -> r9 berisi 11 (diff)

    ; 3. PERKALIAN (IMUL - Integer Multiply)
    mov r10, rax      ; Copy a(15) ke R10
    imul r10, rcx     ; r10 = r10 * rcx -> r10 berisi 60 (prod)

    ; 4. PEMBAGIAN (IDIV - Integer Divide)
    ; Syarat instruksi IDIV:
    ; Pembilang (15) HARUS berada di RAX.
    ; Kita harus men-sign-extend RAX ke RDX sebelum membagi menggunakan CQO.
    mov rax, 15       ; Set RAX menjadi 15
    cqo               ; Perluas RAX ke RDX:RAX (Nilai RDX otomatis menjadi 0 untuk angka positif)
    
    idiv rcx          ; Membagi RDX:RAX dengan RCX (4)
    
    ; Setelah instruksi 'idiv' berjalan:
    ; -> RAX berisi Hasil Bagi (Quotient) = 3
    ; -> RDX berisi Sisa Bagi (Remainder) = 3

    ret               ; Kembali ke OS
```

> [!TIP]
> Instruksi `CQO` (Convert Quadword to Octaword) sangat krusial sebelum melakukan pembagian 64-bit (`IDIV`). Ia menyiapkan register `RDX` agar siap digabungkan dengan `RAX` menjadi memori sebesar 128-bit yang akan dibagi.

---

## 3. Logika Percabangan (If / Else Condition)

Tidak ada kata kunci `if` di Assembly. Anda harus menggunakan operasi banding (`CMP`) lalu melompat ke blok memori tertentu (`Jxx`).

### 💻 Kode C++
```cpp
#include <iostream>

int main() {
    int password = 99;
    
    if (password == 42) {
        std::cout << "Akses Diberikan\n";
    } else {
        std::cout << "Akses Ditolak\n";
    }
    
    return 0;
}
```

### ⚙️ Kode Assembly (NASM)
```nasm
default rel
extern printf

section .data
    msg_ok   db "Akses Diberikan", 10, 0
    msg_fail db "Akses Ditolak", 10, 0

section .text
global main
main:
    sub rsp, 40       ; Shadow space & alignment

    mov rax, 99       ; Set password = 99
    
    ; MULAI LOGIKA IF
    cmp rax, 42       ; Bandingkan RAX dengan 42 (RAX - 42)
    je .akses_ok      ; JE (Jump if Equal): Lompat ke label .akses_ok JIKA sama (ZF=1)

.akses_gagal:
    ; Blok ELSE (Jika tidak melompat, eksekusi akan jatuh ke sini)
    lea rcx, [msg_fail]
    call printf
    jmp .selesai      ; PENTING! Harus melompat keluar agar tidak tak sengaja mengeksekusi blok OK.

.akses_ok:
    ; Blok IF TRUE
    lea rcx, [msg_ok]
    call printf

.selesai:
    add rsp, 40
    ret
```

> [!WARNING]
> Jika Anda melupakan instruksi `jmp .selesai` di akhir blok Else, maka EIP/RIP akan terus membaca kode ke bawah (*fall-through*) dan mengeksekusi blok `.akses_ok` yang seharusnya bukan untuknya!

---

## 4. Perulangan (Loop Condition)

Looping `for` atau `while` diimplementasikan persis seperti instruksi `if` yang melompat mundur ke atas secara terus-menerus hingga kondisi pembatas tercapai.

### 💻 Kode C++
```cpp
#include <iostream>

int main() {
    for (int i = 0; i < 3; i++) {
        std::cout << "Iterasi ke-" << i << "\n";
    }
    return 0;
}
```

### ⚙️ Kode Assembly (NASM)
```nasm
default rel
extern printf

section .data
    msg_loop db "Iterasi ke-%d", 10, 0

section .text
global main
main:
    ; Prologue lengkap karena kita butuh menggunakan register RBX
    push rbp
    mov rbp, rsp
    sub rsp, 32       ; Alokasi Shadow Space

    ; Mengapa menggunakan RBX sebagai variabel 'i'?
    ; Karena berdasarkan ABI, fungsi seperti 'printf' boleh merusak RAX, RCX, RDX, dll (Caller-saved).
    ; Namun RBX adalah register "Callee-saved", nilainya dijamin aman meski printf dipanggil.
    mov rbx, 0        ; i = 0

.loop_start:
    ; CEK KONDISI LOOP
    cmp rbx, 3        ; Bandingkan i dengan 3
    jge .loop_end     ; JGE (Jump if Greater or Equal): Jika i >= 3, lompat keluar dari loop!

    ; BLOK EKSEKUSI (Cetak teks)
    lea rcx, [msg_loop] ; Arg 1: String format
    mov rdx, rbx        ; Arg 2: Variabel 'i' (dilempar ke %d)
    call printf

    ; INCREMENT & ULANGI
    inc rbx           ; Tambah 'i' sebanyak 1 (Sama dengan i++)
    jmp .loop_start   ; Lompat kembali ke atas untuk mengecek kondisi (cmp)

.loop_end:
    ; Epilogue
    add rsp, 32
    pop rbp
    ret
```

> [!IMPORTANT]
> Saat melakukan loop yang memanggil fungsi eksternal (seperti `printf`), sangat disarankan menaruh variabel *counter loop* (seperti iterasi `i`) di dalam register yang bersifat **Callee-saved** (contoh: `RBX`, `RDI`, `RSI` di Windows) agar nilainya tidak tiba-tiba di-reset menjadi sampah oleh fungsi `printf`. Atau, simpan nilai counter ke dalam Stack Memory `[rsp]`.
