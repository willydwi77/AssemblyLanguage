<template>
  <div class="logika-tab pb-10">
    <h2 class="section-title">Instruksi Logika & Perbandingan</h2>
    <p class="content-desc mb-6">
      Instruksi logika dan perbandingan adalah fondasi untuk pengambilan keputusan (kondisional) di tingkat perangkat keras CPU,
      digunakan untuk memanipulasi bit, menguji kondisi, dan mengarahkan alur eksekusi program.
    </p>

    <!-- 1. AND -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">1</span>
        AND – Operasi Logika AND Bitwise
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <code>AND</code> melakukan operasi <strong>bitwise AND</strong> antara dua operand. Bit hasil bernilai 1 hanya jika kedua bit sumber bernilai 1. CF dan OF selalu di-reset ke 0.
        </p>
        <div class="bg-slate-800 rounded p-3">
          <code class="text-green-400 font-mono text-sm">AND destination, source  ; dest = dest &amp; src</code>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Masking (Sembunyikan Bit)</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">AND RAX, 0xFF   ; Pertahankan 8 bit bawah
AND EAX, 0x0F   ; Pertahankan 4 bit bawah
AND AL, 0x01    ; Ambil bit LSB saja</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Register ke Register</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">AND RAX, RBX    ; RAX = RAX & RBX
AND EAX, ECX    ; EAX = EAX & ECX
AND AX, BX      ; 16-bit</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Akses Memori</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">AND [var], RAX    ; var = var & RAX
AND RAX, [var]    ; RAX = RAX & var
AND [RBP-8], EAX  ; stack &= EAX</pre>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded">
          <thead>
            <tr class="bg-slate-100 border-b text-slate-700">
              <th class="p-2 border-r">Tujuan Penggunaan</th>
              <th class="p-2 border-r">Contoh</th>
              <th class="p-2">Penjelasan</th>
            </tr>
          </thead>
          <tbody class="text-slate-600">
            <tr class="border-b"><td class="p-2 border-r font-bold">Masking Bit</td><td class="p-2 border-r font-mono">AND EAX, 0xFF</td><td class="p-2">Menjaga 8 bit rendah, sisanya 0</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold">Cek Bit Tertentu</td><td class="p-2 border-r font-mono">AND AL, 0x80</td><td class="p-2">Hasil 0 atau 0x80, mempengaruhi ZF</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold">Uppercase ASCII</td><td class="p-2 border-r font-mono">AND AL, 0xDF</td><td class="p-2">Huruf kecil → huruf besar (ASCII)</td></tr>
            <tr><td class="p-2 border-r font-bold">Bulatkan ke Kelipatan</td><td class="p-2 border-r font-mono">AND EAX, -16</td><td class="p-2">Bulatkan ke bawah ke kelipatan 16</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. OR -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">2</span>
        OR – Operasi Logika OR Bitwise
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <code>OR</code> melakukan operasi <strong>bitwise OR</strong>. Bit hasil bernilai 1 jika setidaknya satu bit sumber bernilai 1. CF dan OF selalu di-reset ke 0.
        </p>
        <div class="bg-slate-800 rounded p-3">
          <code class="text-green-400 font-mono text-sm">OR destination, source   ; dest = dest | src</code>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Set Bit Tertentu</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">OR RAX, 0x0F    ; Set 4 bit rendah menjadi 1
OR AL, 0x80     ; Set bit MSB (bit ke-7)
OR EAX, 0x1000  ; Set bit ke-12</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Konversi ASCII Case</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV AL, 'A'  ; AL = 0x41
OR AL, 0x20  ; AL = 0x61 ('a')
; Huruf besar → huruf kecil (lowercase)</pre>
        </div>
      </div>
    </div>

    <!-- 3. XOR -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">3</span>
        XOR – Exclusive OR Bitwise
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <code>XOR</code> melakukan operasi <strong>exclusive OR</strong>. Bit hasil bernilai 1 jika kedua bit berbeda. Instruksi yang sangat serbaguna: zeroing, toggle bit, enkripsi, dan swap.
        </p>
        <div class="bg-slate-800 rounded p-3">
          <code class="text-green-400 font-mono text-sm">XOR destination, source  ; dest = dest ^ src</code>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Zeroing Register (paling cepat)</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">XOR RAX, RAX  ; RAX = 0
XOR EAX, EAX  ; EAX = 0
XOR AX, AX    ; AX = 0</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Toggle Bit</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">XOR AL, 0x80   ; Balik bit MSB
XOR EAX, 0x0F  ; Balik 4 bit rendah</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Swap tanpa Register Temp</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">XOR RAX, RBX  ; RAX = RAX ^ RBX
XOR RBX, RAX  ; RBX = asli RAX
XOR RAX, RBX  ; RAX = asli RBX</pre>
        </div>
      </div>

      <!-- Tabel Perbedaan AND/OR/XOR -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded">
          <thead>
            <tr class="bg-slate-100 border-b text-slate-700">
              <th class="p-2 border-r">Operasi</th>
              <th class="p-2 border-r">Bit Hasil</th>
              <th class="p-2 border-r">Simbol C</th>
              <th class="p-2">Kegunaan Umum</th>
            </tr>
          </thead>
          <tbody class="text-slate-600">
            <tr class="border-b"><td class="p-2 border-r font-bold text-blue-700">AND</td><td class="p-2 border-r">1 jika keduanya 1</td><td class="p-2 border-r font-mono">&amp;</td><td class="p-2">Masking, clear bit</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-emerald-700">OR</td><td class="p-2 border-r">1 jika salah satu 1</td><td class="p-2 border-r font-mono">|</td><td class="p-2">Set bit</td></tr>
            <tr><td class="p-2 border-r font-bold text-orange-700">XOR</td><td class="p-2 border-r">1 jika berbeda</td><td class="p-2 border-r font-mono">^</td><td class="p-2">Toggle, swap, zeroing</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 4. NOT -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">4</span>
        NOT – Negasi Bitwise (One's Complement)
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <code>NOT</code> membalik semua bit operand (one's complement). Berbeda dari instruksi logika lainnya, <code>NOT</code> hanya menerima <strong>satu operand</strong> dan <strong>tidak mempengaruhi flags sama sekali</strong>.
        </p>
        <div class="bg-slate-800 rounded p-3 mb-3">
          <code class="text-green-400 font-mono text-sm">NOT operand  ; operand = ~operand</code>
        </div>
        <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200 rounded">MOV AL, 0x0F   ; AL = 00001111
NOT AL         ; AL = 11110000 (0xF0)

NOT RAX        ; RAX = bitwise complement dari RAX
NOT [var]      ; nilai di memori var = ~var</pre>
      </div>
      <div class="bg-amber-50 border border-amber-100 rounded p-3 text-xs text-amber-800">
        <i class="fas fa-lightbulb"></i> <strong>Tips:</strong> NOT + 1 = Negasi aritmetika (Two's Complement). Contoh: <code>NOT EAX; INC EAX</code> setara dengan <code>NEG EAX</code>.
      </div>
    </div>

    <!-- 5. TEST -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">5</span>
        TEST – Bitwise Test (Tanpa Menyimpan Hasil)
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <code>TEST</code> melakukan operasi AND tetapi <strong>tidak menyimpan hasil</strong> — hanya mempengaruhi flags. Digunakan untuk menguji bit tertentu tanpa mengubah nilai register atau memori.
        </p>
        <div class="bg-slate-800 rounded p-3">
          <code class="text-green-400 font-mono text-sm">TEST operand1, operand2  ; Set flags saja, tidak simpan</code>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Cek apakah nilai nol</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">TEST RAX, RAX  ; ZF=1 jika RAX=0
JZ  label_zero  ; Lompat jika nol
JNZ label_nz    ; Lompat jika tidak nol</pre>
        </div>
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Cek Bit Tertentu</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">TEST AL, 0x01    ; Cek bit ke-0 (genap/ganjil)
JZ   even        ; Lompat jika bit=0 (genap)
JNZ  odd         ; Lompat jika bit=1 (ganjil)</pre>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded">
          <thead>
            <tr class="bg-slate-100 border-b text-slate-700">
              <th class="p-2 border-r">Aspek</th>
              <th class="p-2 border-r">TEST</th>
              <th class="p-2">AND</th>
            </tr>
          </thead>
          <tbody class="text-slate-600">
            <tr class="border-b"><td class="p-2 border-r font-bold">Simpan Hasil</td><td class="p-2 border-r text-red-600">Tidak</td><td class="p-2 text-green-600">Ya (di destination)</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold">Ubah Operand</td><td class="p-2 border-r text-red-600">Tidak</td><td class="p-2 text-green-600">Mengubah destination</td></tr>
            <tr><td class="p-2 border-r font-bold">Penggunaan</td><td class="p-2 border-r">Hanya untuk tes/kondisi</td><td class="p-2">Tes sekaligus modifikasi</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 6. CMP -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">6</span>
        CMP – Perbandingan Dua Operand
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <code>CMP</code> melakukan operasi pengurangan (<code>dest - src</code>) tetapi <strong>tidak menyimpan hasil</strong> — hanya mempengaruhi flags. Digunakan bersama instruksi lompatan bersyarat (<code>JE</code>, <code>JG</code>, <code>JL</code>, dll).
        </p>
        <div class="bg-slate-800 rounded p-3">
          <code class="text-green-400 font-mono text-sm">CMP operand1, operand2  ; Flags = operand1 - operand2</code>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <!-- Unsigned jumps table -->
        <div class="border border-slate-200 rounded p-4 bg-slate-50">
          <h4 class="font-bold text-slate-800 text-xs uppercase mb-2">Lompatan Bersyarat — Unsigned (Tanpa Tanda)</h4>
          <table class="w-full text-xs border border-slate-200 bg-white">
            <thead class="bg-slate-100"><tr class="border-b"><th class="p-1.5 border-r">Instruksi</th><th class="p-1.5 border-r">Kondisi Flag</th><th class="p-1.5">Arti</th></tr></thead>
            <tbody class="font-mono text-slate-600">
              <tr class="border-b"><td class="p-1.5 border-r text-blue-600">JE / JZ</td><td class="p-1.5 border-r">ZF=1</td><td class="p-1.5">Sama dengan (equal)</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-blue-600">JNE / JNZ</td><td class="p-1.5 border-r">ZF=0</td><td class="p-1.5">Tidak sama</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-blue-600">JA</td><td class="p-1.5 border-r">CF=0 &amp; ZF=0</td><td class="p-1.5">Lebih besar (above)</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-blue-600">JAE</td><td class="p-1.5 border-r">CF=0</td><td class="p-1.5">Lebih besar atau sama</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-blue-600">JB / JC</td><td class="p-1.5 border-r">CF=1</td><td class="p-1.5">Lebih kecil (below)</td></tr>
              <tr><td class="p-1.5 border-r text-blue-600">JBE</td><td class="p-1.5 border-r">CF=1 | ZF=1</td><td class="p-1.5">Lebih kecil atau sama</td></tr>
            </tbody>
          </table>
        </div>
        <!-- Signed jumps table -->
        <div class="border border-slate-200 rounded p-4 bg-slate-50">
          <h4 class="font-bold text-slate-800 text-xs uppercase mb-2">Lompatan Bersyarat — Signed (Bertanda)</h4>
          <table class="w-full text-xs border border-slate-200 bg-white">
            <thead class="bg-slate-100"><tr class="border-b"><th class="p-1.5 border-r">Instruksi</th><th class="p-1.5 border-r">Kondisi Flag</th><th class="p-1.5">Arti</th></tr></thead>
            <tbody class="font-mono text-slate-600">
              <tr class="border-b"><td class="p-1.5 border-r text-emerald-600">JE / JZ</td><td class="p-1.5 border-r">ZF=1</td><td class="p-1.5">Sama dengan</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-emerald-600">JNE / JNZ</td><td class="p-1.5 border-r">ZF=0</td><td class="p-1.5">Tidak sama</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-emerald-600">JG</td><td class="p-1.5 border-r">ZF=0 &amp; SF=OF</td><td class="p-1.5">Lebih besar (greater)</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-emerald-600">JGE</td><td class="p-1.5 border-r">SF=OF</td><td class="p-1.5">Lebih besar atau sama</td></tr>
              <tr class="border-b"><td class="p-1.5 border-r text-emerald-600">JL</td><td class="p-1.5 border-r">SF≠OF</td><td class="p-1.5">Lebih kecil (less)</td></tr>
              <tr><td class="p-1.5 border-r text-emerald-600">JLE</td><td class="p-1.5 border-r">ZF=1 | SF≠OF</td><td class="p-1.5">Lebih kecil atau sama</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200 rounded">CMP RAX, 10
JE  equal    ; Lompat jika RAX == 10
JG  greater  ; Lompat jika RAX > 10 (signed)
JL  less     ; Lompat jika RAX < 10 (signed)</pre>
    </div>

    <!-- 7. Ringkasan Flag -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">7</span>
        Ringkasan Pengaruh pada Flags
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded">
          <thead>
            <tr class="bg-slate-100 border-b text-slate-700">
              <th class="p-2 border-r">Instruksi</th>
              <th class="p-2 border-r">OF</th>
              <th class="p-2 border-r">SF</th>
              <th class="p-2 border-r">ZF</th>
              <th class="p-2 border-r">CF</th>
              <th class="p-2">Catatan</th>
            </tr>
          </thead>
          <tbody class="text-slate-600 font-mono">
            <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800">AND</td><td class="p-2 border-r text-red-500">0</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r text-red-500">0</td><td class="p-2">CF dan OF selalu di-reset</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800">OR</td><td class="p-2 border-r text-red-500">0</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r text-red-500">0</td><td class="p-2">CF dan OF selalu di-reset</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800">XOR</td><td class="p-2 border-r text-red-500">0</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r text-red-500">0</td><td class="p-2">CF dan OF selalu di-reset</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800">NOT</td><td class="p-2 border-r text-slate-400">—</td><td class="p-2 border-r text-slate-400">—</td><td class="p-2 border-r text-slate-400">—</td><td class="p-2 border-r text-slate-400">—</td><td class="p-2">Tidak mempengaruhi flags sama sekali</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800">TEST</td><td class="p-2 border-r text-red-500">0</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r text-red-500">0</td><td class="p-2">Sama seperti AND, hasil tidak disimpan</td></tr>
            <tr><td class="p-2 border-r font-bold text-slate-800">CMP</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r">Ya</td><td class="p-2 border-r">Ya</td><td class="p-2">Sama seperti SUB, hasil tidak disimpan</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 8. Perbandingan C++ vs Assembly -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">8</span>
        Perbandingan Kode C++ vs Assembly
      </h3>
      <p class="text-sm text-slate-700 mb-4">
        Terjemahan operasi logika dan kondisional C++ ke dalam instruksi bahasa mesin:
      </p>
      <CodePanel
        cppCode='int a = 5, b = 10;
// Operasi logika
int c = a &amp; b;   // AND
int d = a | b;   // OR
int e = a ^ b;   // XOR
int f = ~a;      // NOT

// Kondisional
if (a > b) {
    // greater branch
} else {
    // else branch
}'
        asmX64="MOV EAX, 5
MOV EBX, 10
AND EAX, EBX     ; c = a & b
MOV ECX, 5
OR  ECX, EBX     ; d = a | b
MOV EDX, 5
XOR EDX, EBX     ; e = a ^ b
MOV EDI, 5
NOT EDI          ; f = ~a

; Kondisional if (a > b)
CMP EAX, EBX
JG  a_greater
; -- else branch --
JMP done
a_greater:
; -- greater branch --
done:"
        asmX86="MOV EAX, 5
MOV EBX, 10
AND EAX, EBX     ; c = a & b
MOV ECX, 5
OR  ECX, EBX     ; d = a | b
MOV EDX, 5
XOR EDX, EBX     ; e = a ^ b
MOV EDI, 5
NOT EDI          ; f = ~a

; Kondisional if (a > b)
CMP EAX, EBX
JG  a_greater
; -- else branch --
JMP done
a_greater:
; -- greater branch --
done:"
        :currentArch="currentArch"
      />
    </div>

    <!-- 9. Simulasi Debugger -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">9</span>
        Simulasi Debugger: Evaluasi Kondisi (If / Else)
      </h3>
      <p class="text-sm text-slate-600 mb-4">
        Simulasi langkah demi langkah bagaimana CPU mengevaluasi kondisi menggunakan <code>CMP</code> dan lompatan bersyarat:
      </p>

      <div v-if="currentSim" class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-lg">
        <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
          <span>Simulasi Evaluasi If/Else</span>
          <span class="text-blue-400 normal-case">{{ currentArch === 'x64' ? 'x64 (64-bit)' : 'x86 (32-bit)' }}</span>
        </div>

        <DebuggerPanel
          v-if="currentStepData"
          :mode="currentArch"
          :codeLines="currentSim.code"
          :activeLine="currentStepData.l"
          :registers="currentStepData.regs"
          :disassembly="currentStepData.disasm"
          :stack="currentStepData.stack"
          :terminal="currentStepData.term"
          class="!border-none !rounded-none shadow-none h-[500px]"
        />

        <div class="bg-[#1e1e24] p-3 flex items-center justify-between border-t border-[#3c3c44]">
          <div class="text-slate-400 text-xs">Step {{ stepVal + 1 }} of {{ stepsCount }}</div>
          <div class="flex gap-2">
            <button @click="prevStep" :disabled="stepVal === 0" class="px-4 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">&lt; Mundur</button>
            <button @click="nextStep" :disabled="stepVal === stepsCount - 1" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm font-bold transition-colors">Langkah Selanjutnya ⏭️</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import DebuggerPanel from './DebuggerPanel.vue'
import CodePanel from './CodePanel.vue'
import { animDb } from '../data/cpp_asm_data.js'

const props = defineProps({
  currentArch: {
    type: String,
    default: 'x64'
  }
})

const stepVal = ref(0)

const currentSim = computed(() => {
  const condData = animDb.cond
  return condData ? condData[props.currentArch] : null
})

const currentStepData = computed(() => {
  const sim = currentSim.value
  return sim && sim.steps ? sim.steps[stepVal.value] : null
})

const stepsCount = computed(() => {
  const sim = currentSim.value
  return sim && sim.steps ? sim.steps.length : 0
})

function nextStep() {
  if (stepVal.value < stepsCount.value - 1) stepVal.value++
}
function prevStep() {
  if (stepVal.value > 0) stepVal.value--
}

watch(() => props.currentArch, () => {
  stepVal.value = 0
})
</script>
