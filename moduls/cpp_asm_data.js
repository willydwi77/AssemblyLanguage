/*
 * Data simulasi untuk cpp_vs_asm_guide.html
 */

const animDb = {
  fund: {
    title: 'Fundamental Penulisan: C++ vs Assembly',
    desc: {
      x64: 'Sebelum masuk ke kode spesifik, penting untuk memahami kerangka dasar dan cara pandang masing-masing bahasa. C++ memberikan abstraksi tingkat tinggi, sedangkan Assembly x64 memaksa Anda mengatur register 64-bit dan calling convention modern.',
      x86: 'Di x86 (32-bit), arsitekturnya lebih tua. Alih-alih register ekstra (r8-r15), kita mengandalkan pergerakan data via tumpukan memori (Stack) untuk memanggil fungsi eksternal.'
    },
    isAnim: false
  },

  hello: {
    title: 'Kasus: Hello World',
    desc: {
      x64: 'Mencetak teks di Assembly x64 membutuhkan pemanggilan fungsi C-Library eksternal seperti printf. Di Windows x64, kita diwajibkan menyiapkan memori khusus (Shadow Space) sebesar 32 byte di Stack.',
      x86: 'Di x86, argumen untuk fungsi printf dimasukkan ke Stack (menggunakan instruksi PUSH). Setelah fungsi selesai, pemanggil (caller) bertanggung jawab membersihkan memori argumen tersebut (ADD ESP, 4).'
    },
    isAnim: true,
    cppCode: `#include &lt;iostream&gt;

int main() {
    std::cout &lt;&lt; "Hello\\n";
    return 0;
}`,
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
          l: 7,
          regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
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
        {
          l: 8,
          regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFE0", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000b0", bytes: "48 83 ec 20", inst: "sub rsp, 0x20", active: false },
            { addr: "004000b4", bytes: "48 8d 0d 45...", inst: "lea rcx, [rip+0x402000]", active: true },
            { addr: "004000bb", bytes: "e8 00 00 00...", inst: "call printf", active: false }
          ],
          stack: [
            { addr: "00007FFFFFFFE000", bytes: "00 00 00 00 00 00 00 00", ascii: "........" },
            { addr: "00007FFFFFFFDFE0", bytes: "00 00 00 00 00 00 00 00", ascii: "........" }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_world\n"
        },
        {
          l: 9,
          regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFE0", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000b4", bytes: "48 8d 0d 45...", inst: "lea rcx, [rip+0x402000]", active: false },
            { addr: "004000bb", bytes: "e8 00 00 00...", inst: "call printf", active: true },
            { addr: "004000c0", bytes: "48 83 c4 20", inst: "add rsp, 0x20", active: false }
          ],
          stack: [
            { addr: "00007FFFFFFFE000", bytes: "00 00 00 00 00 00 00 00", ascii: "........" },
            { addr: "00007FFFFFFFDFE0", bytes: "00 00 00 00 00 00 00 00", ascii: "........" }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_world\n<span class='hl-term'>Hello</span>\n"
        },
        {
          l: 10,
          regs: { "rax": "0x06", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFE0", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000bb", bytes: "e8 00 00 00...", inst: "call printf", active: false },
            { addr: "004000c0", bytes: "48 83 c4 20", inst: "add rsp, 0x20", active: true },
            { addr: "004000c4", bytes: "c3", inst: "ret", active: false }
          ],
          stack: [
            { addr: "00007FFFFFFFE000", bytes: "00 00 00 00 00 00 00 00", ascii: "........" },
            { addr: "00007FFFFFFFDFE0", bytes: "00 00 00 00 00 00 00 00", ascii: "........" }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_world\n<span class='hl-term'>Hello</span>\n"
        },
        {
          l: 11,
          regs: { "rax": "0x06", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000c0", bytes: "48 83 c4 20", inst: "add rsp, 0x20", active: false },
            { addr: "004000c4", bytes: "c3", inst: "ret", active: true }
          ],
          stack: [
            { addr: "00007FFFFFFFE000", bytes: "00 00 00 00 00 00 00 00", ascii: "........" }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_world\n<span class='hl-term'>Hello</span>\n[Process exited]"
        }
      ]
    },
    x86: {
      code: [
        "; Windows x86 ABI (CDECL)",
        "extern printf",
        "section .data",
        "  msg db 'Hello', 0",
        "section .text",
        "global main",
        "main:",
        "  push msg            ; 1. Argumen 1",
        "  call printf         ; 2. Panggil",
        "  add esp, 4          ; 3. Cleanup Stack",
        "  ret"
      ],
      steps: [
        {
          l: 7,
          regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000b0", bytes: "68 00 20 40 00", inst: "push 0x402000", active: true },
            { addr: "004000b5", bytes: "e8 00 00 00 00", inst: "call printf", active: false },
            { addr: "004000ba", bytes: "83 c4 04", inst: "add esp, 4", active: false }
          ],
          stack: [
            { addr: "00402000", bytes: "00 00 00 00", ascii: "...." },
            { addr: "00401FFC", bytes: "00 00 00 00", ascii: "...." }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_x86\n"
        },
        {
          l: 8,
          regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000b0", bytes: "68 00 20 40 00", inst: "push 0x402000", active: false },
            { addr: "004000b5", bytes: "e8 00 00 00 00", inst: "call printf", active: true },
            { addr: "004000ba", bytes: "83 c4 04", inst: "add esp, 4", active: false }
          ],
          stack: [
            { addr: "00402000", bytes: "00 00 00 00", ascii: "...." },
            { addr: "00401FFC", bytes: "00 20 40 00", ascii: ". @" }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_x86\n<span class='hl-term'>Hello</span>\n"
        },
        {
          l: 9,
          regs: { "eax": "0x06", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000b5", bytes: "e8 00 00 00 00", inst: "call printf", active: false },
            { addr: "004000ba", bytes: "83 c4 04", inst: "add esp, 4", active: true },
            { addr: "004000bd", bytes: "c3", inst: "ret", active: false }
          ],
          stack: [
            { addr: "00402000", bytes: "00 00 00 00", ascii: "...." },
            { addr: "00401FFC", bytes: "00 20 40 00", ascii: ". @" }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_x86\n<span class='hl-term'>Hello</span>\n"
        },
        {
          l: 10,
          regs: { "eax": "0x06", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [
            { addr: "004000ba", bytes: "83 c4 04", inst: "add esp, 4", active: false },
            { addr: "004000bd", bytes: "c3", inst: "ret", active: true }
          ],
          stack: [
            { addr: "00402000", bytes: "00 00 00 00", ascii: "...." }
          ],
          term: "<span class='hl-term-prompt'>$</span> ./hello_x86\n<span class='hl-term'>Hello</span>\n[Process exited]"
        }
      ]
    }
  },

  arith: {
    title: 'Kasus: Aritmatika & Variabel Lokal (Stack)',
    desc: {
      x64: 'Variabel lokal (seperti a) disimpan di dalam Stack RAM. Setelah ruang dialokasikan (sub rsp, 40), nilai diperbarui langsung di alamat memori tersebut, lalu dikirim ke printf.',
      x86: 'Mirip dengan x64, variabel lokal disimpan di Stack. Di x86, kita menggunakan EBP (Base Pointer) sebagai patokan alamat absolut untuk mengakses memori variabel tersebut secara aman.'
    },
    isAnim: true,
    cppCode: `#include &lt;iostream&gt;\n\nint main() {\n    int a = 10;\n    a += 5;\n    a -= 2;\n    std::cout &lt;&lt; a &lt;&lt; "\\n";\n    return 0;\n}`,
    x64: {
      code: [
        "extern printf",
        "section .data",
        "  fmt db \"%d\", 10, 0",
        "section .text",
        "global main",
        "main:",
        "  sub rsp, 40            ; 1. Alokasi stack",
        "  mov dword [rsp+32], 10 ; 2. a = 10",
        "  add dword [rsp+32], 5  ; 3. a += 5",
        "  sub dword [rsp+32], 2  ; 4. a -= 2",
        "  lea rcx, [rel fmt]     ; 5. arg1",
        "  mov edx, [rsp+32]      ; 6. arg2",
        "  call printf            ; 7. print",
        "  add rsp, 40            ; 8. cleanup",
        "  ret"
      ],
      steps: [
        {
          l: 6, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "48 83 ec 28", inst: "sub rsp, 0x28", active: true }, { addr: "004000b4", bytes: "c7 44 24 20...", inst: "mov dword [rsp+0x20], 0xa", active: false } ],
          stack: [ { addr: "00007FFFFFFFE000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n"
        },
        {
          l: 7, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "48 83 ec 28", inst: "sub rsp, 0x28", active: false }, { addr: "004000b4", bytes: "c7 44 24 20...", inst: "mov dword [rsp+0x20], 0xa", active: true }, { addr: "004000bc", bytes: "83 44 24 20 05", inst: "add dword [rsp+0x20], 5", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "?? ?? ?? ??", ascii: "...." }, { addr: "00007FFFFFFFDFF0", "bytes": "00 00 00 00", ascii: "...." }, { addr: "00007FFFFFFFE000", bytes: "...", ascii: "" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n"
        },
        {
          l: 8, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b4", bytes: "c7 44 24 20...", inst: "mov dword [rsp+0x20], 0xa", active: false }, { addr: "004000bc", bytes: "83 44 24 20 05", inst: "add dword [rsp+0x20], 5", active: true }, { addr: "004000c2", bytes: "83 6c 24 20 02", inst: "sub dword [rsp+0x20], 2", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "0a 00 00 00", ascii: ".(a=10)" }, { addr: "00007FFFFFFFDFF0", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n"
        },
        {
          l: 9, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000bc", bytes: "83 44 24 20 05", inst: "add dword [rsp+0x20], 5", active: false }, { addr: "004000c2", bytes: "83 6c 24 20 02", inst: "sub dword [rsp+0x20], 2", active: true }, { addr: "004000c7", bytes: "48 8d 0d 32...", inst: "lea rcx, [rip+0x402000]", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "0f 00 00 00", ascii: ".(a=15)" }, { addr: "00007FFFFFFFDFF0", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n"
        },
        {
          l: 10, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000c2", bytes: "83 6c 24 20 02", inst: "sub dword [rsp+0x20], 2", active: false }, { addr: "004000c7", bytes: "48 8d 0d 32...", inst: "lea rcx, [rip+0x402000]", active: true }, { addr: "004000ce", bytes: "8b 54 24 20", inst: "mov edx, [rsp+0x20]", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "0d 00 00 00", ascii: ".(a=13)" }, { addr: "00007FFFFFFFDFF0", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n"
        },
        {
          l: 11, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000c7", bytes: "48 8d 0d 32...", inst: "lea rcx, [rip+0x402000]", active: false }, { addr: "004000ce", bytes: "8b 54 24 20", inst: "mov edx, [rsp+0x20]", active: true }, { addr: "004000d2", bytes: "e8 29 00 00...", inst: "call printf", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "0d 00 00 00", ascii: ".(a=13)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n"
        },
        {
          l: 12, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x0D", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000ce", bytes: "8b 54 24 20", inst: "mov edx, [rsp+0x20]", active: false }, { addr: "004000d2", bytes: "e8 29 00 00...", inst: "call printf", active: true }, { addr: "004000d7", bytes: "48 83 c4 28", inst: "add rsp, 0x28", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "0d 00 00 00", ascii: ".(a=13)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n<span class='hl-term'>13</span>\n"
        },
        {
          l: 13, regs: { "rax": "0x03", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x0D", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000d2", bytes: "e8 29 00 00...", inst: "call printf", active: false }, { addr: "004000d7", bytes: "48 83 c4 28", inst: "add rsp, 0x28", active: true }, { addr: "004000db", bytes: "c3", inst: "ret", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "0d 00 00 00", ascii: ".(a=13)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n<span class='hl-term'>13</span>\n"
        },
        {
          l: 14, regs: { "rax": "0x03", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x0D", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000d7", bytes: "48 83 c4 28", inst: "add rsp, 0x28", active: false }, { addr: "004000db", bytes: "c3", inst: "ret", active: true } ],
          stack: [ { addr: "00007FFFFFFFE000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic\n<span class='hl-term'>13</span>\n[Process exited]"
        }
      ]
    },
    x86: {
      code: [
        "extern printf",
        "section .data",
        "  fmt db \"%d\", 10, 0",
        "section .text",
        "global main",
        "main:",
        "  push ebp               ; 1. Prologue",
        "  mov ebp, esp",
        "  sub esp, 4             ; 2. Variabel lokal a",
        "  mov dword [ebp-4], 10  ; 3. a = 10",
        "  add dword [ebp-4], 5   ; 4. a += 5",
        "  sub dword [ebp-4], 2   ; 5. a -= 2",
        "  push dword [ebp-4]     ; 6. arg2 = a",
        "  push fmt               ; 7. arg1 = fmt",
        "  call printf            ; 8. Panggil printf",
        "  add esp, 8             ; 9. CDECL Cleanup",
        "  mov esp, ebp           ; 10. Epilogue",
        "  pop ebp",
        "  ret"
      ],
      steps: [
        {
          l: 6, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "55", inst: "push ebp", active: true }, { addr: "004000b1", bytes: "89 e5", inst: "mov ebp, esp", active: false } ],
          stack: [ { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 7, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "55", inst: "push ebp", active: false }, { addr: "004000b1", bytes: "89 e5", inst: "mov ebp, esp", active: true }, { addr: "004000b3", bytes: "83 ec 04", inst: "sub esp, 4", active: false } ],
          stack: [ { addr: "00401FFC", bytes: "00 00 00 00", ascii: "...." }, { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 8, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b1", bytes: "89 e5", inst: "mov ebp, esp", active: false }, { addr: "004000b3", bytes: "83 ec 04", inst: "sub esp, 4", active: true }, { addr: "004000b6", bytes: "c7 45 fc 0a...", inst: "mov dword [ebp-4], 0xa", active: false } ],
          stack: [ { addr: "00401FFC", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 9, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b3", bytes: "83 ec 04", inst: "sub esp, 4", active: false }, { addr: "004000b6", bytes: "c7 45 fc 0a...", inst: "mov dword [ebp-4], 0xa", active: true }, { addr: "004000bd", bytes: "83 45 fc 05", inst: "add dword [ebp-4], 5", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "?? ?? ?? ??", ascii: "...." }, { addr: "00401FFC", bytes: "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 10, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b6", bytes: "c7 45 fc 0a...", inst: "mov dword [ebp-4], 0xa", active: false }, { addr: "004000bd", bytes: "83 45 fc 05", inst: "add dword [ebp-4], 5", active: true }, { addr: "004000c1", bytes: "83 6d fc 02", inst: "sub dword [ebp-4], 2", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "0a 00 00 00", ascii: ".(a=10)" }, { addr: "00401FFC", bytes: "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 11, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000bd", bytes: "83 45 fc 05", inst: "add dword [ebp-4], 5", active: false }, { addr: "004000c1", bytes: "83 6d fc 02", inst: "sub dword [ebp-4], 2", active: true }, { addr: "004000c5", bytes: "ff 75 fc", inst: "push dword [ebp-4]", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "0f 00 00 00", ascii: ".(a=15)" }, { addr: "00401FFC", bytes: "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 12, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000c1", bytes: "83 6d fc 02", inst: "sub dword [ebp-4], 2", active: false }, { addr: "004000c5", bytes: "ff 75 fc", inst: "push dword [ebp-4]", active: true }, { addr: "004000c8", bytes: "68 00 20 40...", inst: "push 0x402000", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "0d 00 00 00", ascii: ".(a=13)" }, { addr: "00401FFC", bytes: "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 13, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000c5", bytes: "ff 75 fc", inst: "push dword [ebp-4]", active: false }, { addr: "004000c8", bytes: "68 00 20 40...", inst: "push 0x402000", active: true }, { addr: "004000cd", bytes: "e8 2e 00 00...", inst: "call printf", active: false } ],
          stack: [ { addr: "00401FF4", bytes: "0d 00 00 00", ascii: ".(arg2)" }, { addr: "00401FF8", bytes: "0d 00 00 00", ascii: ".(a=13)" }, { addr: "00401FFC", bytes: "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n"
        },
        {
          l: 14, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF0", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000c8", bytes: "68 00 20 40...", inst: "push 0x402000", active: false }, { addr: "004000cd", bytes: "e8 2e 00 00...", inst: "call printf", active: true }, { addr: "004000d2", bytes: "83 c4 08", inst: "add esp, 8", active: false } ],
          stack: [ { addr: "00401FF0", bytes: "00 20 40 00", ascii: ". @" }, { addr: "00401FF4", bytes: "0d 00 00 00", ascii: ".(arg2)" }, { addr: "00401FF8", bytes: "0d 00 00 00", ascii: ".(a=13)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n<span class='hl-term'>13</span>\n"
        },
        {
          l: 15, regs: { "eax": "0x03", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF0", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000cd", bytes: "e8 2e 00 00...", inst: "call printf", active: false }, { addr: "004000d2", bytes: "83 c4 08", inst: "add esp, 8", active: true }, { addr: "004000d5", bytes: "89 ec", inst: "mov esp, ebp", active: false } ],
          stack: [ { addr: "00401FF0", bytes: "00 20 40 00", ascii: ". @" }, { addr: "00401FF4", bytes: "0d 00 00 00", ascii: ".(arg2)" }, { addr: "00401FF8", bytes: "0d 00 00 00", ascii: ".(a=13)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n<span class='hl-term'>13</span>\n"
        },
        {
          l: 16, regs: { "eax": "0x03", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000d2", bytes: "83 c4 08", inst: "add esp, 8", active: false }, { addr: "004000d5", bytes: "89 ec", inst: "mov esp, ebp", active: true }, { addr: "004000d7", bytes: "5d", inst: "pop ebp", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "0d 00 00 00", ascii: ".(a=13)" }, { addr: "00401FFC", bytes: "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n<span class='hl-term'>13</span>\n"
        },
        {
          l: 17, regs: { "eax": "0x03", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000d5", bytes: "89 ec", inst: "mov esp, ebp", active: false }, { addr: "004000d7", bytes: "5d", inst: "pop ebp", active: true }, { addr: "004000d8", bytes: "c3", inst: "ret", active: false } ],
          stack: [ { addr: "00401FFC", bytes: "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n<span class='hl-term'>13</span>\n"
        },
        {
          l: 18, regs: { "eax": "0x03", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000d7", bytes: "5d", inst: "pop ebp", active: false }, { addr: "004000d8", bytes: "c3", inst: "ret", active: true } ],
          stack: [ { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./arithmetic_x86\n<span class='hl-term'>13</span>\n[Process exited]"
        }
      ]
    }
  }

,  cond: {
    title: 'Kasus: Evaluasi Kondisi (If/Else)',
    desc: {
      x64: 'Percabangan if/else diterjemahkan menjadi 2 instruksi: Compare (CMP) untuk mengurangi dua operand secara logis (tanpa menyimpan hasil pengurangannya) dan Jump (Jxx) untuk bereaksi terhadap hasil RFLAGS (contoh: ZF=1 jika operand sama).',
      x86: 'Sama persis dengan x64, logika percabangan berakar pada pembacaan EFLAGS. Jika instruksi lompat tidak terpenuhi, CPU akan terus mengeksekusi instruksi di bawahnya.'
    },
    isAnim: true,
    cppCode: `#include &lt;iostream&gt;\n\nint main() {\n    int pw = 42;\n    if (pw == 42) {\n        std::cout &lt;&lt; "Akses Diterima\\n";\n    } else {\n        std::cout &lt;&lt; "Akses Ditolak\\n";\n    }\n    return 0;\n}`,
    x64: {
      code: [
        "extern printf",
        "section .data",
        "  msg_ok db \"Akses Diterima\", 10, 0",
        "  msg_er db \"Akses Ditolak\", 10, 0",
        "section .text",
        "global main",
        "main:",
        "  sub rsp, 40               ; 1. Alokasi stack",
        "  mov dword [rsp+32], 42    ; 2. pw = 42",
        "  cmp dword [rsp+32], 42    ; 3. if (pw == 42)",
        "  jne .salah                ; 4. Lompat jika Tak Sama (ZF=0)",
        "  lea rcx, [rel msg_ok]     ; 5. Argumen: msg_ok",
        "  call printf               ; 6. Print",
        "  jmp .selesai              ; 7. Lewati blok else",
        ".salah:",
        "  lea rcx, [rel msg_er]",
        "  call printf",
        ".selesai:",
        "  mov eax, 0                ; 8. return 0",
        "  add rsp, 40               ; 9. Cleanup",
        "  ret"
      ],
      steps: [
        {
          l: 7, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "48 83 ec 28", inst: "sub rsp, 0x28", active: true }, { addr: "004000b4", bytes: "c7 44 24 20...", inst: "mov dword [rsp+0x20], 0x2a", active: false } ],
          stack: [ { addr: "00007FFFFFFFE000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n"
        },
        {
          l: 8, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "48 83 ec 28", inst: "sub rsp, 0x28", active: false }, { addr: "004000b4", bytes: "c7 44 24 20...", inst: "mov dword [rsp+0x20], 0x2a", active: true }, { addr: "004000bc", bytes: "83 7c 24 20 2a", inst: "cmp dword [rsp+0x20], 0x2a", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "?? ?? ?? ??", ascii: "...." }, { addr: "00007FFFFFFFDFF0", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n"
        },
        {
          l: 9, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b4", bytes: "c7 44 24 20...", inst: "mov dword [rsp+0x20], 0x2a", active: false }, { addr: "004000bc", bytes: "83 7c 24 20 2a", inst: "cmp dword [rsp+0x20], 0x2a", active: true }, { addr: "004000c2", bytes: "75 0c", inst: "jne 0x4000d0", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n"
        },
        {
          l: 10, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "<span class='text-yellow-400 font-bold'>[ ZF=1 SF=0 ]</span>" },
          disasm: [ { addr: "004000bc", bytes: "83 7c 24 20 2a", inst: "cmp dword [rsp+0x20], 0x2a", active: false }, { addr: "004000c2", bytes: "75 0c", inst: "jne 0x4000d0", active: true }, { addr: "004000c4", bytes: "48 8d 0d 25...", inst: "lea rcx, [rip+0x402000]", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n<span class='text-slate-400'>(CMP: 42 - 42 = 0. Mengubah RFLAGS -&gt; Zero Flag = 1)</span>\n"
        },
        {
          l: 11, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000c2", bytes: "75 0c", inst: "jne 0x4000d0", active: false }, { addr: "004000c4", bytes: "48 8d 0d 25...", inst: "lea rcx, [rip+0x402000]", active: true }, { addr: "004000cb", bytes: "e8 40 00 00...", inst: "call printf", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n<span class='text-slate-400'>(JNE diabaikan karena ZF=1)</span>\n"
        },
        {
          l: 12, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000c4", bytes: "48 8d 0d 25...", inst: "lea rcx, [rip+0x402000]", active: false }, { addr: "004000cb", bytes: "e8 40 00 00...", inst: "call printf", active: true }, { addr: "004000d0", bytes: "eb 0c", inst: "jmp 0x4000de", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n"
        },
        {
          l: 13, regs: { "rax": "0x0E", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000cb", bytes: "e8 40 00 00...", inst: "call printf", active: false }, { addr: "004000d0", bytes: "eb 0c", inst: "jmp 0x4000de", active: true }, { addr: "004000de", bytes: "b8 00 00 00...", inst: "mov eax, 0", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 18, regs: { "rax": "0x0E", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000d0", bytes: "eb 0c", inst: "jmp 0x4000de", active: false }, { addr: "004000de", bytes: "b8 00 00 00...", inst: "mov eax, 0", active: true }, { addr: "004000e3", bytes: "48 83 c4 28", inst: "add rsp, 0x28", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 19, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000de", bytes: "b8 00 00 00...", inst: "mov eax, 0", active: false }, { addr: "004000e3", bytes: "48 83 c4 28", inst: "add rsp, 0x28", active: true }, { addr: "004000e7", bytes: "c3", inst: "ret", active: false } ],
          stack: [ { addr: "00007FFFFFFFDFF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 20, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000e3", bytes: "48 83 c4 28", inst: "add rsp, 0x28", active: false }, { addr: "004000e7", bytes: "c3", inst: "ret", active: true } ],
          stack: [ { addr: "00007FFFFFFFE000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n[Process exited with code 0]"
        }
      ]
    },
    x86: {
      code: [
        "extern printf",
        "section .data",
        "  msg_ok db \"Akses Diterima\", 10, 0",
        "  msg_er db \"Akses Ditolak\", 10, 0",
        "section .text",
        "global main",
        "main:",
        "  push ebp                  ; 1. Prologue",
        "  mov ebp, esp",
        "  sub esp, 4                ; 2. Local var pw",
        "  mov dword [ebp-4], 42     ; 3. pw = 42",
        "  cmp dword [ebp-4], 42     ; 4. if (pw == 42)",
        "  jne .salah                ; 5. Lompat jika Tak Sama (ZF=0)",
        "  push msg_ok               ; 6. Argumen: msg_ok",
        "  call printf               ; 7. Print",
        "  add esp, 4                ; 8. Cleanup args",
        "  jmp .selesai              ; 9. Lewati blok else",
        ".salah:",
        "  push msg_er",
        "  call printf",
        "  add esp, 4",
        ".selesai:",
        "  mov eax, 0                ; 10. return 0",
        "  mov esp, ebp              ; 11. Epilogue",
        "  pop ebp",
        "  ret"
      ],
      steps: [
        {
          l: 7, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "55", inst: "push ebp", active: true }, { addr: "004000b1", bytes: "89 e5", inst: "mov ebp, esp", active: false } ],
          stack: [ { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n"
        },
        {
          l: 8, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b0", bytes: "55", inst: "push ebp", active: false }, { addr: "004000b1", bytes: "89 e5", inst: "mov ebp, esp", active: true }, { addr: "004000b3", bytes: "83 ec 04", inst: "sub esp, 4", active: false } ],
          stack: [ { addr: "00401FFC", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n"
        },
        {
          l: 9, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b1", bytes: "89 e5", inst: "mov ebp, esp", active: false }, { addr: "004000b3", bytes: "83 ec 04", inst: "sub esp, 4", active: true }, { addr: "004000b6", bytes: "c7 45 fc 2a...", inst: "mov dword [ebp-4], 0x2a", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n"
        },
        {
          l: 10, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" },
          disasm: [ { addr: "004000b3", bytes: "83 ec 04", inst: "sub esp, 4", active: false }, { addr: "004000b6", bytes: "c7 45 fc 2a...", inst: "mov dword [ebp-4], 0x2a", active: true }, { addr: "004000bd", bytes: "83 7d fc 2a", inst: "cmp dword [ebp-4], 0x2a", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n"
        },
        {
          l: 11, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "<span class='text-yellow-400 font-bold'>[ ZF=1 SF=0 ]</span>" },
          disasm: [ { addr: "004000b6", bytes: "c7 45 fc 2a...", inst: "mov dword [ebp-4], 0x2a", active: false }, { addr: "004000bd", bytes: "83 7d fc 2a", inst: "cmp dword [ebp-4], 0x2a", active: true }, { addr: "004000c1", bytes: "75 10", inst: "jne 0x4000d3", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='text-slate-400'>(CMP: 42 - 42 = 0. EFLAGS -&gt; Zero Flag = 1)</span>\n"
        },
        {
          l: 12, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000bd", bytes: "83 7d fc 2a", inst: "cmp dword [ebp-4], 0x2a", active: false }, { addr: "004000c1", bytes: "75 10", inst: "jne 0x4000d3", active: true }, { addr: "004000c3", bytes: "68 00 20 40...", inst: "push 0x402000", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='text-slate-400'>(JNE diabaikan karena ZF=1)</span>\n"
        },
        {
          l: 13, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000c1", bytes: "75 10", inst: "jne 0x4000d3", active: false }, { addr: "004000c3", bytes: "68 00 20 40...", inst: "push 0x402000", active: true }, { addr: "004000c8", bytes: "e8 33 00 00...", inst: "call printf", active: false } ],
          stack: [ { addr: "00401FF4", bytes: "00 20 40 00", ascii: ". @" }, { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n"
        },
        {
          l: 14, regs: { "eax": "0x0E", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000c3", bytes: "68 00 20 40...", inst: "push 0x402000", active: false }, { addr: "004000c8", bytes: "e8 33 00 00...", inst: "call printf", active: true }, { addr: "004000cd", bytes: "83 c4 04", inst: "add esp, 4", active: false } ],
          stack: [ { addr: "00401FF4", bytes: "00 20 40 00", ascii: ". @" }, { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 15, regs: { "eax": "0x0E", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000c8", bytes: "e8 33 00 00...", inst: "call printf", active: false }, { addr: "004000cd", bytes: "83 c4 04", inst: "add esp, 4", active: true }, { addr: "004000d0", bytes: "eb 0e", inst: "jmp 0x4000e0", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 16, regs: { "eax": "0x0E", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000cd", bytes: "83 c4 04", inst: "add esp, 4", active: false }, { addr: "004000d0", bytes: "eb 0e", inst: "jmp 0x4000e0", active: true }, { addr: "004000e0", bytes: "b8 00 00 00...", inst: "mov eax, 0", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 22, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF8", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000d0", bytes: "eb 0e", inst: "jmp 0x4000e0", active: false }, { addr: "004000e0", bytes: "b8 00 00 00...", inst: "mov eax, 0", active: true }, { addr: "004000e5", bytes: "89 ec", inst: "mov esp, ebp", active: false } ],
          stack: [ { addr: "00401FF8", bytes: "2a 00 00 00", ascii: "*...(pw=42)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 23, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000e0", bytes: "b8 00 00 00...", inst: "mov eax, 0", active: false }, { addr: "004000e5", bytes: "89 ec", inst: "mov esp, ebp", active: true }, { addr: "004000e7", bytes: "5d", inst: "pop ebp", active: false } ],
          stack: [ { addr: "00401FFC", "bytes": "00 00 00 00", ascii: ".(ebp)" } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 24, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000e5", bytes: "89 ec", inst: "mov esp, ebp", active: false }, { addr: "004000e7", bytes: "5d", inst: "pop ebp", active: true }, { addr: "004000e8", bytes: "c3", inst: "ret", active: false } ],
          stack: [ { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n"
        },
        {
          l: 25, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" },
          disasm: [ { addr: "004000e7", bytes: "5d", inst: "pop ebp", active: false }, { addr: "004000e8", bytes: "c3", inst: "ret", active: true } ],
          stack: [ { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ],
          term: "<span class='hl-term-prompt'>$</span> ./ifelse_x86\n<span class='hl-term text-[#4af626] font-bold'>Akses Diterima</span>\n[Process exited with code 0]"
        }
      ]
    }
  },loop: {
    title: 'Kasus: Perulangan (Looping)',
    desc: {
      x64: 'Dalam Assembly, struktur for/while tidak ada secara native. Compiler memecahnya menjadi instruksi Evaluasi (CMP), instruksi Lompat Bersyarat (JLE untuk keluar loop), dan Lompat Mutlak (JMP) di akhir blok untuk memutar kembali eksekusi ke atas.',
      x86: 'Variabel indeks i dan sum dimanipulasi secara intensif di Stack RAM ([ebp-4] dan [ebp-8]). EFLAGS terus berubah pada setiap iterasi untuk menentukan apakah loop harus terus berjalan atau berhenti.'
    },
    isAnim: true,
    cppCode: `#include &lt;iostream&gt;\n\nint main() {\n    int sum = 0;\n    for (int i = 2; i &gt; 0; i--) {\n        sum += i;\n    }\n    std::cout &lt;&lt; "Sum = " &lt;&lt; sum &lt;&lt; "\\n";\n    return 0;\n}`,
    x64: {
      code: [
        "extern printf",
        "section .data",
        "  fmt db \"Sum = %d\", 10, 0",
        "section .text",
        "global main",
        "main:",
        "  sub rsp, 40               ; 1. Alokasi",
        "  mov dword [rsp+32], 0     ; 2. sum = 0",
        "  mov dword [rsp+36], 2     ; 3. i = 2",
        ".loop_start:",
        "  cmp dword [rsp+36], 0     ; 4. i > 0 ?",
        "  jle .loop_end             ; 5. Berhenti jika <= 0",
        "  mov eax, [rsp+36]         ; 6. Ambil i",
        "  add [rsp+32], eax         ; 7. sum += i",
        "  dec dword [rsp+36]        ; 8. i--",
        "  jmp .loop_start           ; 9. Putar balik",
        ".loop_end:",
        "  lea rcx, [rel fmt]        ; 10. arg1",
        "  mov edx, [rsp+32]         ; 11. arg2",
        "  call printf               ; 12. print",
        "  mov eax, 0                ; 13. return 0",
        "  add rsp, 40               ; 14. Cleanup",
        "  ret"
      ],
      steps: [
        // INIT
        { l: 6, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000b0", bytes: "48 83 ec 28", inst: "sub rsp, 0x28", active: true } ], stack: [ { addr: "00007FFFFFFFE000", bytes: "00 00 00 00", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n" },
        { l: 7, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000b4", bytes: "c7 44 24 20...", inst: "mov dword [rsp+0x20], 0", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "?? ?? ?? ??", ascii: "...." }, { addr: "00007FFFFFFFDFFC", bytes: "?? ?? ?? ??", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n" },
        { l: 8, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000bc", bytes: "c7 44 24 24...", inst: "mov dword [rsp+0x24], 2", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: ".(sum=0)" }, { addr: "00007FFFFFFFDFFC", bytes: "?? ?? ?? ??", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n" },
        // ITER 1 (i=2)
        { l: 10, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c4", bytes: "83 7c 24 24 00", inst: "cmp dword [rsp+0x24], 0", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: ".(sum=0)" }, { addr: "00007FFFFFFFDFFC", bytes: "02 00 00 00", ascii: ".(i=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 1] --</span>\n" },
        { l: 11, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c9", bytes: "7e 12", inst: "jle 0x4000dd", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: ".(sum=0)" }, { addr: "00007FFFFFFFDFFC", bytes: "02 00 00 00", ascii: ".(i=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 1] --\n(JLE diabaikan karena i=2 &gt; 0)</span>\n" },
        { l: 12, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000cb", bytes: "8b 44 24 24", inst: "mov eax, [rsp+0x24]", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: ".(sum=0)" }, { addr: "00007FFFFFFFDFFC", bytes: "02 00 00 00", ascii: ".(i=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 1] --</span>\n" },
        { l: 13, regs: { "rax": "0x02", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000cf", bytes: "01 44 24 20", inst: "add [rsp+0x20], eax", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "00 00 00 00", ascii: ".(sum=0)" }, { addr: "00007FFFFFFFDFFC", bytes: "02 00 00 00", ascii: ".(i=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 1] --</span>\n" },
        { l: 14, regs: { "rax": "0x02", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000d3", bytes: "ff 4c 24 24", inst: "dec dword [rsp+0x24]", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "02 00 00 00", ascii: ".(sum=2)" }, { addr: "00007FFFFFFFDFFC", bytes: "02 00 00 00", ascii: ".(i=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 1] --</span>\n" },
        { l: 15, regs: { "rax": "0x02", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000d7", bytes: "eb eb", inst: "jmp 0x4000c4", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "02 00 00 00", ascii: ".(sum=2)" }, { addr: "00007FFFFFFFDFFC", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 1] --\n(JMP memaksa putar balik ke atas)</span>\n" },
        // ITER 2 (i=1)
        { l: 10, regs: { "rax": "0x02", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c4", bytes: "83 7c 24 24 00", inst: "cmp dword [rsp+0x24], 0", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "02 00 00 00", ascii: ".(sum=2)" }, { addr: "00007FFFFFFFDFFC", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 2] --</span>\n" },
        { l: 11, regs: { "rax": "0x02", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c9", bytes: "7e 12", inst: "jle 0x4000dd", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "02 00 00 00", ascii: ".(sum=2)" }, { addr: "00007FFFFFFFDFFC", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 2] --</span>\n" },
        { l: 12, regs: { "rax": "0x02", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000cb", bytes: "8b 44 24 24", inst: "mov eax, [rsp+0x24]", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "02 00 00 00", ascii: ".(sum=2)" }, { addr: "00007FFFFFFFDFFC", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 2] --</span>\n" },
        { l: 13, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000cf", bytes: "01 44 24 20", inst: "add [rsp+0x20], eax", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "02 00 00 00", ascii: ".(sum=2)" }, { addr: "00007FFFFFFFDFFC", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 2] --</span>\n" },
        { l: 14, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000d3", bytes: "ff 4c 24 24", inst: "dec dword [rsp+0x24]", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" }, { addr: "00007FFFFFFFDFFC", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 2] --</span>\n" },
        { l: 15, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "<span class='text-yellow-400 font-bold'>[ ZF=1 SF=0 ]</span>" }, disasm: [ { addr: "004000d7", bytes: "eb eb", inst: "jmp 0x4000c4", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" }, { addr: "00007FFFFFFFDFFC", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 2] --</span>\n" },
        // ITER 3 (i=0) (BERHENTI)
        { l: 10, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "<span class='text-yellow-400 font-bold'>[ ZF=1 SF=0 ]</span>" }, disasm: [ { addr: "004000c4", bytes: "83 7c 24 24 00", inst: "cmp dword [rsp+0x24], 0", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" }, { addr: "00007FFFFFFFDFFC", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 3] --\n(CMP: 0 - 0 = 0. ZF=1)</span>\n" },
        { l: 11, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000c9", bytes: "7e 12", inst: "jle 0x4000dd", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" }, { addr: "00007FFFFFFFDFFC", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='text-slate-400'>-- [Iterasi 3] --\n(JLE terpenuhi! Keluar dari loop)</span>\n" },
        // LOOP END
        { l: 17, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x00", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000dd", bytes: "48 8d 0d 25...", inst: "lea rcx, [rip+0x402000]", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n" },
        { l: 18, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x00", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000e4", bytes: "8b 54 24 20", inst: "mov edx, [rsp+0x20]", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n" },
        { l: 19, regs: { "rax": "0x01", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x03", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000e8", bytes: "e8 33 00 00...", inst: "call printf", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='hl-term text-[#4af626] font-bold'>Sum = 3</span>\n" },
        { l: 20, regs: { "rax": "0x08", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x03", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000ed", bytes: "b8 00 00 00...", inst: "mov eax, 0", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='hl-term text-[#4af626] font-bold'>Sum = 3</span>\n" },
        { l: 21, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x03", "rbp": "0x00", "rsp": "0x00007FFFFFFFDFD8", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000f2", bytes: "48 83 c4 28", inst: "add rsp, 0x28", active: true } ], stack: [ { addr: "00007FFFFFFFDFF8", bytes: "03 00 00 00", ascii: ".(sum=3)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='hl-term text-[#4af626] font-bold'>Sum = 3</span>\n" },
        { l: 22, regs: { "rax": "0x00", "rbx": "0x00", "rcx": "0x0000000000402000", "rdx": "0x03", "rbp": "0x00", "rsp": "0x00007FFFFFFFE000", "rsi": "0x00", "rdi": "0x00", "rflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000f6", bytes: "c3", inst: "ret", active: true } ], stack: [ { addr: "00007FFFFFFFE000", bytes: "00 00 00 00", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping\n<span class='hl-term text-[#4af626] font-bold'>Sum = 3</span>\n[Process exited with code 0]" }
      ]
    },
    x86: {
      code: [
        "extern printf",
        "section .data",
        "  fmt db \"Sum = %d\", 10, 0",
        "section .text",
        "global main",
        "main:",
        "  push ebp                  ; 1. Prologue",
        "  mov ebp, esp",
        "  sub esp, 8                ; 2. sum & i",
        "  mov dword [ebp-4], 0      ; 3. sum = 0",
        "  mov dword [ebp-8], 2      ; 4. i = 2",
        ".loop_start:",
        "  cmp dword [ebp-8], 0      ; 5. i > 0 ?",
        "  jle .loop_end             ; 6. Keluar jk <=0",
        "  mov eax, [ebp-8]          ; 7. eax = i",
        "  add [ebp-4], eax          ; 8. sum += i",
        "  dec dword [ebp-8]         ; 9. i--",
        "  jmp .loop_start           ; 10. Ulang",
        ".loop_end:",
        "  push dword [ebp-4]        ; 11. arg2: sum",
        "  push fmt                  ; 12. arg1: fmt",
        "  call printf               ; 13. print",
        "  add esp, 8                ; 14. Cleanup",
        "  mov eax, 0                ; 15. return 0",
        "  mov esp, ebp              ; 16. Epilogue",
        "  pop ebp",
        "  ret"
      ],
      steps: [
        { l: 6, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000b0", bytes: "55", inst: "push ebp", active: true } ], stack: [ { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 7, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000b1", bytes: "89 e5", inst: "mov ebp, esp", active: true } ], stack: [ { addr: "00401FFC", bytes: "00 00 00 00", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 8, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FFC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000b3", bytes: "83 ec 08", inst: "sub esp, 8", active: true } ], stack: [ { addr: "00401FF4", bytes: "?? ?? ?? ??", ascii: "...." }, { addr: "00401FF8", bytes: "?? ?? ?? ??", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 9, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000b6", bytes: "c7 45 fc 00...", inst: "mov dword [ebp-4], 0", active: true } ], stack: [ { addr: "00401FF4", bytes: "?? ?? ?? ??", ascii: "...." }, { addr: "00401FF8", bytes: "00 00 00 00", ascii: ".(sum)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 10, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000bd", bytes: "c7 45 f8 02...", inst: "mov dword [ebp-8], 2", active: true } ], stack: [ { addr: "00401FF4", bytes: "02 00 00 00", ascii: ".(i=2)" }, { addr: "00401FF8", bytes: "00 00 00 00", ascii: ".(sum)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        
        // Iterasi 1
        { l: 12, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c4", bytes: "83 7d f8 00", inst: "cmp dword [ebp-8], 0", active: true } ], stack: [ { addr: "00401FF4", bytes: "02 00 00 00", ascii: ".(i=2)" }, { addr: "00401FF8", bytes: "00 00 00 00", ascii: ".(sum)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='text-slate-400'>-- [Iterasi 1] --</span>\n" },
        { l: 13, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c8", bytes: "7e 0e", inst: "jle 0x4000d8", active: true } ], stack: [ { addr: "00401FF4", bytes: "02 00 00 00", ascii: ".(i=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='text-slate-400'>-- [Iterasi 1] --\n(JLE diabaikan)</span>\n" },
        { l: 14, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000ca", bytes: "8b 45 f8", inst: "mov eax, [ebp-8]", active: true } ], stack: [ { addr: "00401FF4", bytes: "02 00 00 00", ascii: ".(i=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 15, regs: { "eax": "0x02", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000cd", bytes: "01 45 fc", inst: "add [ebp-4], eax", active: true } ], stack: [ { addr: "00401FF4", bytes: "02 00 00 00", ascii: ".(i=2)" }, { addr: "00401FF8", bytes: "02 00 00 00", ascii: ".(sum=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 16, regs: { "eax": "0x02", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000d0", bytes: "ff 4d f8", inst: "dec dword [ebp-8]", active: true } ], stack: [ { addr: "00401FF4", bytes: "01 00 00 00", ascii: ".(i=1)" }, { addr: "00401FF8", bytes: "02 00 00 00", ascii: ".(sum=2)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 17, regs: { "eax": "0x02", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000d3", bytes: "eb ef", inst: "jmp 0x4000c4", active: true } ], stack: [ { addr: "00401FF4", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='text-slate-400'>(Ulangi Loop)</span>\n" },
        
        // Iterasi 2
        { l: 12, regs: { "eax": "0x02", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c4", bytes: "83 7d f8 00", inst: "cmp dword [ebp-8], 0", active: true } ], stack: [ { addr: "00401FF4", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='text-slate-400'>-- [Iterasi 2] --</span>\n" },
        { l: 13, regs: { "eax": "0x02", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000c8", bytes: "7e 0e", inst: "jle 0x4000d8", active: true } ], stack: [ { addr: "00401FF4", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 14, regs: { "eax": "0x02", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000ca", bytes: "8b 45 f8", inst: "mov eax, [ebp-8]", active: true } ], stack: [ { addr: "00401FF4", bytes: "01 00 00 00", ascii: ".(i=1)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 15, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000cd", bytes: "01 45 fc", inst: "add [ebp-4], eax", active: true } ], stack: [ { addr: "00401FF4", bytes: "01 00 00 00", ascii: ".(i=1)" }, { addr: "00401FF8", bytes: "03 00 00 00", ascii: ".(sum=3)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 16, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000d0", bytes: "ff 4d f8", inst: "dec dword [ebp-8]", active: true } ], stack: [ { addr: "00401FF4", bytes: "00 00 00 00", ascii: ".(i=0)" }, { addr: "00401FF8", bytes: "03 00 00 00", ascii: ".(sum=3)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 17, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=0 SF=0 ]" }, disasm: [ { addr: "004000d3", bytes: "eb ef", inst: "jmp 0x4000c4", active: true } ], stack: [ { addr: "00401FF4", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='text-slate-400'>(Ulangi Loop)</span>\n" },
        
        // Iterasi 3 (Berhenti)
        { l: 12, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "<span class='text-yellow-400 font-bold'>[ ZF=1 SF=0 ]</span>" }, disasm: [ { addr: "004000c4", bytes: "83 7d f8 00", inst: "cmp dword [ebp-8], 0", active: true } ], stack: [ { addr: "00401FF4", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='text-slate-400'>-- [Iterasi 3] --\n(ZF=1, i tidak lagi > 0)</span>\n" },
        { l: 13, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000c8", bytes: "7e 0e", inst: "jle 0x4000d8", active: true } ], stack: [ { addr: "00401FF4", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='text-slate-400'>-- [Iterasi 3] --\n(JLE terpenuhi! Keluar)</span>\n" },
        
        // End
        { l: 19, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF0", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000d8", bytes: "ff 75 fc", inst: "push dword [ebp-4]", active: true } ], stack: [ { addr: "00401FF0", bytes: "03 00 00 00", ascii: ".(arg2)" }, { addr: "00401FF4", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 20, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FEC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000db", bytes: "68 00 20 40...", inst: "push 0x402000", active: true } ], stack: [ { addr: "00401FEC", bytes: "00 20 40 00", ascii: ". @" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n" },
        { l: 21, regs: { "eax": "0x01", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FEC", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000e0", bytes: "e8 33 00 00...", inst: "call printf", active: true } ], stack: [ { addr: "00401FEC", bytes: "00 20 40 00", ascii: ". @" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='hl-term text-[#4af626] font-bold'>Sum = 3</span>\n" },
        { l: 22, regs: { "eax": "0x08", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00401FFC", "esp": "0x00401FF4", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000e5", bytes: "83 c4 08", inst: "add esp, 8", active: true } ], stack: [ { addr: "00401FF4", bytes: "00 00 00 00", ascii: ".(i=0)" } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='hl-term text-[#4af626] font-bold'>Sum = 3</span>\n" },
        { l: 26, regs: { "eax": "0x00", "ebx": "0x00", "ecx": "0x00", "edx": "0x00", "ebp": "0x00000000", "esp": "0x00402000", "esi": "0x00", "edi": "0x00", "eflags": "[ ZF=1 SF=0 ]" }, disasm: [ { addr: "004000f0", bytes: "c3", inst: "ret", active: true } ], stack: [ { addr: "00402000", bytes: "00 00 00 00", ascii: "...." } ], term: "<span class='hl-term-prompt'>$</span> ./looping_x86\n<span class='hl-term text-[#4af626] font-bold'>Sum = 3</span>\n[Process exited with code 0]" }
      ]
    }
  }
}