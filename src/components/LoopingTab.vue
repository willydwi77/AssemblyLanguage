<template>
  <div class="looping-tab pb-10">
    <h2 class="section-title">Instruksi Kontrol Alur (Control Flow) &amp; Looping</h2>
    <p class="content-desc mb-6">
      Instruksi kontrol alur mengatur alur eksekusi instruksi di dalam CPU. Di assembly, tidak ada konstruksi <code>if-else</code>, 
      <code>while</code>, atau <code>for</code> tingkat tinggi bawaan. Semuanya dibangun dari kombinasi instruksi <strong>Lompatan (Jump)</strong>, 
      <strong>Perbandingan (CMP/TEST)</strong>, serta <strong>Pemanggilan Subrutin (CALL &amp; RET)</strong>.
    </p>

    <!-- 1. JMP – Lompat Tak Bersyarat -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">1</span>
        JMP – Lompat Tak Bersyarat (Unconditional Jump)
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <code>JMP</code> adalah instruksi untuk <strong>mengubah alur eksekusi program</strong> secara paksa ke alamat atau label target yang ditentukan. Berbeda dengan lompatan bersyarat, <code>JMP</code> selalu dieksekusi tanpa bergantung pada status <em>flags</em> apapun.
        </p>
        <div class="bg-slate-800 rounded p-3 mb-3">
          <code class="text-green-400 font-mono text-sm">JMP target  ; target bisa berupa label, register, atau alamat memori</code>
        </div>
      </div>

      <!-- Jenis-jenis JMP -->
      <h4 class="font-bold text-slate-700 text-xs uppercase mb-2">Jenis-jenis JMP Berdasarkan Jarak Offset</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="border border-slate-200 rounded p-3 bg-slate-50 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-blue-700 uppercase">a. Short Jump</span>
            <p class="text-xs text-slate-600 mt-1 mb-2">
              Jarak lompatan <strong>-128 s/d +127 byte</strong> dari instruksi berikutnya. Hanya butuh 2 byte opcode mesin.
            </p>
          </div>
          <pre class="bg-slate-800 text-emerald-400 p-2 rounded text-[11px] font-mono">JMP SHORT label
JMP label  ; assembler optimasi</pre>
        </div>

        <div class="border border-slate-200 rounded p-3 bg-slate-50 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-emerald-700 uppercase">b. Near Jump</span>
            <p class="text-xs text-slate-600 mt-1 mb-2">
              Jarak lompatan <strong>dalam segment yang sama</strong> (32-bit atau 64-bit offset). Butuh 3–5 byte opcode mesin.
            </p>
          </div>
          <pre class="bg-slate-800 text-emerald-400 p-2 rounded text-[11px] font-mono">JMP NEAR label
JMP RAX    ; indirect register</pre>
        </div>

        <div class="border border-slate-200 rounded p-3 bg-slate-50 flex flex-col justify-between">
          <div>
            <span class="text-xs font-bold text-amber-700 uppercase">c. Far Jump</span>
            <p class="text-xs text-slate-600 mt-1 mb-2">
              Lompat ke <strong>segment yang berbeda</strong> (jarang dipakai di arsitektur flat-memory 64-bit modern).
            </p>
          </div>
          <pre class="bg-slate-800 text-emerald-400 p-2 rounded text-[11px] font-mono">JMP FAR [pointer]
; Lompat lintas segmen</pre>
        </div>
      </div>

      <!-- Contoh Penggunaan JMP -->
      <h4 class="font-bold text-slate-700 text-xs uppercase mb-2">Contoh Pola Penggunaan JMP</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Melewati Blok Kode</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">_start:
    MOV {{ currentArch === 'x64' ? 'RAX' : 'EAX' }}, 10
    JMP skip_code    ; Langsung lompat, lewati baris bawah

    ; Kode di bawah ini dilewati (tidak dieksekusi)
    MOV {{ currentArch === 'x64' ? 'RBX' : 'EBX' }}, 20

skip_code:
    MOV {{ currentArch === 'x64' ? 'RCX' : 'ECX' }}, 30    ; Eksekusi lanjut di sini</pre>
        </div>

        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">Lompat Tak Terbatas (Infinite Loop)</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">loop_infinite:
    ; Jalankan tugas berulang (polling/event-loop)
    ; ...
    JMP loop_infinite ; Ulangi eksekusi tanpa henti

; Lompat via Pointer Register / Jump Table:
MOV {{ currentArch === 'x64' ? 'RAX' : 'EAX' }}, target_label
JMP {{ currentArch === 'x64' ? 'RAX' : 'EAX' }}            ; Indirect Jump</pre>
        </div>
      </div>

      <!-- Tabel Penggunaan & Komparasi JMP -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border border-slate-200 rounded">
            <thead>
              <tr class="bg-slate-100 border-b text-slate-700">
                <th class="p-2 border-r">Kasus Penggunaan</th>
                <th class="p-2">Contoh Sintaks</th>
              </tr>
            </thead>
            <tbody class="text-slate-600 font-mono">
              <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800 font-sans">Loop tak terbatas</td><td class="p-2">JMP loop_start</td></tr>
              <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800 font-sans">Melewati cabang else</td><td class="p-2">JMP after_condition</td></tr>
              <tr class="border-b"><td class="p-2 border-r font-bold text-slate-800 font-sans">Switch / Jump Table</td><td class="p-2">JMP [table + {{ currentArch === 'x64' ? 'RAX*8' : 'EAX*4' }}]</td></tr>
              <tr><td class="p-2 border-r font-bold text-slate-800 font-sans">Keluar dari loop</td><td class="p-2">JMP loop_exit</td></tr>
            </tbody>
          </table>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border border-slate-200 rounded">
            <thead>
              <tr class="bg-slate-100 border-b text-slate-700">
                <th class="p-2 border-r">Instruksi</th>
                <th class="p-2 border-r">Kondisi</th>
                <th class="p-2">Tujuan Penggunaan</th>
              </tr>
            </thead>
            <tbody class="text-slate-600">
              <tr class="border-b"><td class="p-2 border-r font-bold text-blue-600 font-mono">JMP</td><td class="p-2 border-r">Selalu (Unconditional)</td><td class="p-2">Lompat langsung tanpa syarat</td></tr>
              <tr class="border-b"><td class="p-2 border-r font-bold text-emerald-600 font-mono">JE / JNE, dll</td><td class="p-2 border-r">Bergantung Flags</td><td class="p-2">Lompat kondisional (if/else)</td></tr>
              <tr class="border-b"><td class="p-2 border-r font-bold text-purple-600 font-mono">CALL</td><td class="p-2 border-r">Selalu (Simpan Return)</td><td class="p-2">Panggil subrutin / fungsi</td></tr>
              <tr><td class="p-2 border-r font-bold text-purple-600 font-mono">RET</td><td class="p-2 border-r">Selalu (Ambil Return)</td><td class="p-2">Kembali ke pemanggil fungsi</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Simulator Visualizer Lompatan JMP -->
      <JMPVisualizer :mode="currentArch" class="mt-6" />
    </div>

    <!-- Fondasi Percabangan: CMP & TEST dalam Reverse Engineering -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <div class="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-lg border border-indigo-800 text-slate-100 shadow-xl mb-6">
        <div class="flex items-center gap-2 mb-2">
          <span class="bg-indigo-600 text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
            Reverse Engineering Insights
          </span>
          <span class="text-xs text-indigo-300 font-mono">IDA Pro • Ghidra • x64dbg • Binary Ninja</span>
        </div>
        <h3 class="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <svg class="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Fondasi Percabangan: Membaca Pola CMP &amp; TEST di Disassembly
        </h3>
        <p class="text-xs text-slate-300 leading-relaxed">
          Dalam analisis biner dan reverse engineering, Anda akan <strong>hampir selalu menemukan <code>CMP</code> atau <code>TEST</code> tepat sebelum instruksi lompat <code>Jcc</code></strong>. Keduanya dirancang khusus untuk memperbarui status bit bendera CPU (<code>EFLAGS / RFLAGS</code>) <strong>tanpa pernah mengubah nilai asli operand</strong> di register maupun RAM.
        </p>
      </div>

      <!-- Komparasi Anatomi CMP vs TEST -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-slate-800 text-sm font-mono text-blue-700">CMP destination, source</h4>
            <span class="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase">Operasi Pengurangan (dest - src)</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed mb-3">
            Melakukan operasi matematika pengurangan semu <strong>(destination - source)</strong>. Nilai hasil pengurangan dibuang, namun <strong>seluruh status bendera diperbarui</strong>:
          </p>
          <div class="bg-slate-800 text-slate-200 p-2.5 rounded font-mono text-[11px] mb-2">
            CMP EAX, 10 ; Hitung (EAX - 10)<br>
            ; Mengubah ZF, SF, OF, CF, AF, PF
          </div>
          <ul class="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
            <li><strong>ZF = 1</strong>: Jika nilai kedua operand persis sama (a == b).</li>
            <li><strong>SF &amp; OF</strong>: Digunakan bersama untuk relasi signed (a &gt; b, a &lt; b).</li>
            <li><strong>CF = 1</strong>: Terjadi borrow pada unsigned (a &lt; b).</li>
          </ul>
        </div>

        <div class="border border-slate-200 rounded-lg p-4 bg-slate-50">
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-slate-800 text-sm font-mono text-emerald-700">TEST destination, source</h4>
            <span class="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">Operasi Bitwise AND (dest &amp; src)</span>
          </div>
          <p class="text-xs text-slate-600 leading-relaxed mb-3">
            Melakukan operasi logika bitwise semu <strong>(destination &amp; source)</strong>. Nilai register tidak berubah. <strong>OF dan CF selalu di-reset paksa ke 0</strong>:
          </p>
          <div class="bg-slate-800 text-slate-200 p-2.5 rounded font-mono text-[11px] mb-2">
            TEST EAX, EAX ; Hitung (EAX &amp; EAX)<br>
            ; Mengubah ZF, SF, PF (CF=0, OF=0)
          </div>
          <ul class="text-[11px] text-slate-600 space-y-1 list-disc pl-4">
            <li><strong>TEST EAX, EAX</strong>: Cek apakah EAX bernilai 0 (NULL) atau negatif.</li>
            <li><strong>TEST AL, 0x01</strong>: Cek apakah bit tertentu bernilai 1 (bitmask / flags).</li>
            <li><strong>Efisiensi Opcode</strong>: Ukuran byte mesin jauh lebih kecil dan cepat.</li>
          </ul>
        </div>
      </div>

      <!-- 4 Pola Khas Disassembly yang Sering Ditemui di Reverse Engineering -->
      <h4 class="font-bold text-slate-800 text-xs uppercase mb-3 flex items-center gap-1.5">
        <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Pola-Pola Khas Disassembly yang Wajib Dikenali Reverse Engineer
      </h4>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-mono text-xs">
        <!-- Pola 1 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 font-sans border-b flex justify-between">
            <span>1. Null-Pointer / Return Check</span>
            <span class="text-blue-600">if (ptr == NULL)</span>
          </div>
          <pre class="p-3 bg-slate-800 text-slate-200 text-[11px] overflow-x-auto">CALL malloc           ; Alokasi memori
TEST {{ currentArch === 'x64' ? 'RAX, RAX' : 'EAX, EAX' }}      ; Cek apakah pointer NULL (0)?
JZ   allocation_fail  ; Jika 0 (ZF=1), lompat ke error handler
; Pointer valid, lanjutkan program...</pre>
          <div class="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 font-sans border-t border-slate-800">
            <strong>Mengapa bukan CMP RAX, 0?</strong> <code>TEST RAX, RAX</code> hanya butuh 3 byte opcode (<code>48 85 C0</code>), sedangkan <code>CMP RAX, 0</code> butuh 4-7 byte. Compiler selalu memilih TEST untuk efisiensi binary.
          </div>
        </div>

        <!-- Pola 2 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 font-sans border-b flex justify-between">
            <span>2. Error Status Negatif</span>
            <span class="text-purple-600">if (NT_ERROR(status))</span>
          </div>
          <pre class="p-3 bg-slate-800 text-slate-200 text-[11px] overflow-x-auto">CALL NtCreateFile     ; Panggil Windows Native API
TEST EAX, EAX         ; Cek status NTSTATUS
JS   nt_error_handler ; JS = Jump if Sign (SF=1 -> negatif)
; API sukses (status >= 0)...</pre>
          <div class="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 font-sans border-t border-slate-800">
            Nilai negatif (bit MSB=1) menunjukkan kode error NTSTATUS / HRESULT. <code>TEST</code> mengatur <code>SF=1</code> sehingga <code>JS</code> langsung menangkap status error tanpa instruksi tambahan.
          </div>
        </div>

        <!-- Pola 3 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 font-sans border-b flex justify-between">
            <span>3. Pengujian Bitmask Flag</span>
            <span class="text-emerald-600">if (flags &amp; 0x04)</span>
          </div>
          <pre class="p-3 bg-slate-800 text-slate-200 text-[11px] overflow-x-auto">MOV EAX, [user_permissions]
TEST EAX, 0x00000004  ; Masking Bit ke-2 (Write Permission)
JNZ  allow_write      ; Jika bit aktif (hasil != 0, ZF=0), izinkan
; Izin ditolak...</pre>
          <div class="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 font-sans border-t border-slate-800">
            Digunakan untuk membaca flag hak akses, header file PE/ELF, token enkripsi, atau parameter register kontrol periferal.
          </div>
        </div>

        <!-- Pola 4 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 font-bold text-slate-700 font-sans border-b flex justify-between">
            <span>4. Perbandingan Nilai Relasional</span>
            <span class="text-amber-600">if (count &gt;= MAX_LIMIT)</span>
          </div>
          <pre class="p-3 bg-slate-800 text-slate-200 text-[11px] overflow-x-auto">MOV EAX, [current_users]
CMP EAX, 100          ; Bandingkan dengan batas kapasitas
JGE server_full       ; Jika EAX >= 100, alihkan ke server_full
; Masih ada slot, terima koneksi...</pre>
          <div class="bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 font-sans border-t border-slate-800">
            <code>CMP</code> digunakan saat membandingkan dua kuantitas numerik (relasional lebih besar, lebih kecil, batas perulangan loop).
          </div>
        </div>
      </div>

      <!-- Tabel Cheat Sheet Reverse Engineering: Pola Disassembly -> Terjemahan C/C++ -->
      <h4 class="font-bold text-slate-800 text-xs uppercase mb-2 font-sans">
        Tabel Cheat-Sheet Reverse Engineering: Pola Assembly &rarr; Makna Logika C/C++
      </h4>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded bg-white">
          <thead>
            <tr class="bg-slate-100 border-b text-slate-700">
              <th class="p-2 border-r">Instruksi Disassembly</th>
              <th class="p-2 border-r">Status EFLAGS Diuji</th>
              <th class="p-2 border-r">Terjemahan Logika C/C++</th>
              <th class="p-2">Penjelasan Konteks Kasus</th>
            </tr>
          </thead>
          <tbody class="text-slate-600 font-mono">
            <tr class="border-b">
              <td class="p-2 border-r font-bold text-blue-700">TEST EAX, EAX ; JZ target</td>
              <td class="p-2 border-r">ZF = 1</td>
              <td class="p-2 border-r text-emerald-700 font-bold font-sans">if (eax == 0) / if (!ptr)</td>
              <td class="p-2 font-sans">Cek pointer kosong (NULL) atau nilai kembalian fungsi bernilai 0 / FALSE.</td>
            </tr>
            <tr class="border-b">
              <td class="p-2 border-r font-bold text-blue-700">TEST EAX, EAX ; JNZ target</td>
              <td class="p-2 border-r">ZF = 0</td>
              <td class="p-2 border-r text-emerald-700 font-bold font-sans">if (eax != 0) / if (ptr)</td>
              <td class="p-2 font-sans">Cek pointer valid atau fungsi mengembalikan nilai berhasil (non-zero / TRUE).</td>
            </tr>
            <tr class="border-b">
              <td class="p-2 border-r font-bold text-purple-700">TEST EAX, EAX ; JS target</td>
              <td class="p-2 border-r">SF = 1</td>
              <td class="p-2 border-r text-emerald-700 font-bold font-sans">if (eax &lt; 0)</td>
              <td class="p-2 font-sans">Cek status error bernilai negatif (NTSTATUS, HRESULT, status syscall Linux).</td>
            </tr>
            <tr class="border-b">
              <td class="p-2 border-r font-bold text-amber-700">TEST AL, 0x01 ; JNZ target</td>
              <td class="p-2 border-r">ZF = 0</td>
              <td class="p-2 border-r text-emerald-700 font-bold font-sans">if (al &amp; 0x01)</td>
              <td class="p-2 font-sans">Pemeriksaan bit genap/ganjil atau pembacaan bit flag izin akses (bitmask).</td>
            </tr>
            <tr class="border-b">
              <td class="p-2 border-r font-bold text-indigo-700">CMP EAX, EBX ; JE target</td>
              <td class="p-2 border-r">ZF = 1</td>
              <td class="p-2 border-r text-emerald-700 font-bold font-sans">if (a == b)</td>
              <td class="p-2 font-sans">Membandingkan kesamaan dua variabel numerik atau string hash.</td>
            </tr>
            <tr class="border-b">
              <td class="p-2 border-r font-bold text-indigo-700">CMP EAX, 10 ; JG target</td>
              <td class="p-2 border-r">ZF=0 &amp; SF=OF</td>
              <td class="p-2 border-r text-emerald-700 font-bold font-sans">if (a &gt; 10) [signed]</td>
              <td class="p-2 font-sans">Pengecekan batas maksimum bilangan bertanda (integer positif/negatif).</td>
            </tr>
            <tr>
              <td class="p-2 border-r font-bold text-indigo-700">CMP EAX, 10 ; JA target</td>
              <td class="p-2 border-r">CF=0 &amp; ZF=0</td>
              <td class="p-2 border-r text-emerald-700 font-bold font-sans">if (a &gt; 10) [unsigned]</td>
              <td class="p-2 font-sans">Pengecekan batas ukuran array, panjang string (size_t), atau alamat memory pointer.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 2. JE / JNE – Lompat Bersyarat Sama / Beda -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">2</span>
        JE / JNE – Lompat Bersyarat (Sama / Tidak Sama)
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <strong>JE (Jump if Equal):</strong> Melakukan lompatan jika kedua operand bernilai <strong>sama</strong> (kondisi <code>ZF = 1</code>).<br>
          <strong>JNE (Jump if Not Equal):</strong> Melakukan lompatan jika kedua operand bernilai <strong>tidak sama</strong> (kondisi <code>ZF = 0</code>).
        </p>
        <p class="text-xs text-slate-500 mb-3">
          Status Zero Flag (ZF) biasanya ditentukan oleh instruksi <code>CMP</code>, <code>TEST</code>, atau operasi aritmetika/logika sebelumnya.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-xs text-green-400">
          <div class="bg-slate-800 rounded p-2.5">JE  target_label  ; Lompat jika ZF = 1 (Equal / Zero)</div>
          <div class="bg-slate-800 rounded p-2.5">JNE target_label  ; Lompat jika ZF = 0 (Not Equal / Not Zero)</div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">1. Membandingkan 2 Nilai</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV {{ currentArch === 'x64' ? 'RAX' : 'EAX' }}, 10
MOV {{ currentArch === 'x64' ? 'RBX' : 'EBX' }}, 10
CMP {{ currentArch === 'x64' ? 'RAX, RBX' : 'EAX, EBX' }}  ; RAX == RBX? (ZF=1)
JE  equal_label ; Lompat ke equal_label

equal_label:
    ; Kode dieksekusi jika sama</pre>
        </div>

        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">2. Cek Hasil Operasi (Nol)</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">XOR {{ currentArch === 'x64' ? 'RAX, RAX' : 'EAX, EAX' }}  ; Set 0
TEST {{ currentArch === 'x64' ? 'RAX, RAX' : 'EAX, EAX' }} ; Cek apakah nol
JE  zero_label   ; Lompat jika nol (ZF=1)

zero_label:
    ; Lakukan sesuatu jika nol</pre>
        </div>

        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">3. Loop Sederhana Counter</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV {{ currentArch === 'x64' ? 'RCX' : 'ECX' }}, 10
loop_start:
    ; Lakukan tugas berulang
    DEC {{ currentArch === 'x64' ? 'RCX' : 'ECX' }}
    CMP {{ currentArch === 'x64' ? 'RCX' : 'ECX' }}, 0
    JNE loop_start ; Ulangi selama != 0
    ; Keluar saat counter = 0</pre>
        </div>
      </div>

      <!-- JE vs JZ Alias Info -->
      <div class="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-blue-900 mb-4 flex items-start gap-2">
        <svg class="w-4 h-4 text-blue-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <strong>Catatan Alias:</strong> <code>JE</code> (Jump if Equal) dan <code>JZ</code> (Jump if Zero) adalah instruksi opcode biner yang persis sama. Begitu juga dengan <code>JNE</code> dan <code>JNZ</code>. Penamaan berbeda hanya untuk kemudahan pembacaan konteks kode oleh programmer.
        </div>
      </div>

      <!-- Contoh Kode Lengkap JE/JNE -->
      <div class="border border-slate-200 rounded overflow-hidden">
        <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">
          Contoh Program Lengkap: Percabangan Nilai Sama vs Berbeda
        </div>
        <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200 overflow-x-auto"><span v-if="currentArch === 'x64'">section .data
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
    MOV RDX, 13           ; Panjang string
    MOV RSI, msg_equal    ; Buffer teks
    JMP display

not_equal_label:
    MOV RDX, 16
    MOV RSI, msg_not_eq

display:
    MOV RDI, 1            ; stdout
    MOV RAX, 1            ; sys_write
    SYSCALL</span><span v-else>section .data
    msg_equal   db 'Nilai sama!', 0xa
    msg_not_eq  db 'Nilai berbeda!', 0xa

section .text
    global _start
_start:
    MOV EAX, 25
    MOV EBX, 25
    CMP EAX, EBX
    JE  equal_label
    JNE not_equal_label

equal_label:
    MOV EDX, 13           ; Panjang string
    MOV ECX, msg_equal    ; Buffer teks
    JMP display

not_equal_label:
    MOV EDX, 16
    MOV ECX, msg_not_eq

display:
    MOV EBX, 1            ; stdout
    MOV EAX, 4            ; sys_write (Linux x86)
    INT 0x80</span></pre>
      </div>

      <!-- Simulator Visualizer JE / JNE -->
      <JEJNEVisualizer :mode="currentArch" class="mt-6" />
    </div>

    <!-- 3. JG / JLE – Lompat Bersyarat Signed & Unsigned -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">3</span>
        JG / JLE – Lompat Bersyarat (Signed vs Unsigned)
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          Instruksi lompat perbandingan relasional (lebih besar / lebih kecil) dibedakan secara ketat antara <strong>bilangan bertanda (Signed)</strong> dan <strong>bilangan tanpa tanda (Unsigned)</strong> karena representasi bit binernya berbeda.
        </p>
      </div>

      <!-- Tabel Komparasi Signed vs Unsigned -->
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-left text-xs border border-slate-200 rounded">
          <thead>
            <tr class="bg-slate-100 border-b text-slate-700">
              <th class="p-2 border-r">Perbandingan</th>
              <th class="p-2 border-r text-emerald-700 font-bold">Signed (Bertanda / Positif-Negatif)</th>
              <th class="p-2 border-r text-blue-700 font-bold">Unsigned (Tanpa Tanda / Positif Saja)</th>
              <th class="p-2">Kondisi Bendera (Flags)</th>
            </tr>
          </thead>
          <tbody class="text-slate-600 font-mono">
            <tr class="border-b">
              <td class="p-2 border-r font-sans font-bold">Lebih Besar (&gt;)</td>
              <td class="p-2 border-r text-emerald-600 font-bold">JG (Jump if Greater)</td>
              <td class="p-2 border-r text-blue-600 font-bold">JA (Jump if Above)</td>
              <td class="p-2 text-slate-500">Signed: ZF=0 &amp; SF=OF | Unsigned: CF=0 &amp; ZF=0</td>
            </tr>
            <tr class="border-b">
              <td class="p-2 border-r font-sans font-bold">Lebih Besar / Sama (&gt;=)</td>
              <td class="p-2 border-r text-emerald-600 font-bold">JGE (Greater or Equal)</td>
              <td class="p-2 border-r text-blue-600 font-bold">JAE (Above or Equal)</td>
              <td class="p-2 text-slate-500">Signed: SF=OF | Unsigned: CF=0</td>
            </tr>
            <tr class="border-b">
              <td class="p-2 border-r font-sans font-bold">Lebih Kecil (&lt;)</td>
              <td class="p-2 border-r text-emerald-600 font-bold">JL (Jump if Less)</td>
              <td class="p-2 border-r text-blue-600 font-bold">JB (Jump if Below)</td>
              <td class="p-2 text-slate-500">Signed: SF ≠ OF | Unsigned: CF=1</td>
            </tr>
            <tr>
              <td class="p-2 border-r font-sans font-bold">Lebih Kecil / Sama (&lt;=)</td>
              <td class="p-2 border-r text-emerald-600 font-bold">JLE (Less or Equal)</td>
              <td class="p-2 border-r text-blue-600 font-bold">JBE (Below or Equal)</td>
              <td class="p-2 text-slate-500">Signed: ZF=1 | SF ≠ OF | Unsigned: CF=1 | ZF=1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mengapa Dibedakan? -->
      <div class="bg-amber-50 border border-amber-200 rounded p-4 mb-4">
        <h4 class="font-bold text-amber-900 text-xs uppercase mb-1">Mengapa Signed &amp; Unsigned Harus Dibedakan?</h4>
        <p class="text-xs text-amber-800 leading-relaxed mb-2">
          Nilai heksadesimal <code>0xFFFFFFFF</code> memiliki dua interpretasi: jika dianggap <strong>Signed</strong> nilainya adalah <code>-1</code>, namun jika dianggap <strong>Unsigned</strong> nilainya adalah <code>4.294.967.295</code>.
        </p>
        <pre class="bg-slate-800 text-slate-200 p-2.5 rounded font-mono text-[11px]">MOV EAX, -1       ; EAX = 0xFFFFFFFF
MOV EBX, 1
CMP EAX, EBX
JG  signed_label   ; -1 > 1? SALAH! (Tidak melompat)
JA  unsigned_label ; 4.294.967.295 > 1? BENAR! (Melompat)</pre>
      </div>

      <!-- Contoh Praktis Signed Jump -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">1. Mencari Nilai Maksimum (Max)</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">MOV {{ currentArch === 'x64' ? 'RAX' : 'EAX' }}, 100
MOV {{ currentArch === 'x64' ? 'RBX' : 'EBX' }}, 200
CMP {{ currentArch === 'x64' ? 'RAX, RBX' : 'EAX, EBX' }}
JG  rax_bigger      ; Lompat jika RAX > RBX
JMP rbx_bigger

rax_bigger:
    MOV {{ currentArch === 'x64' ? 'RCX, RAX' : 'ECX, EAX' }}     ; Max = RAX
    JMP done
rbx_bigger:
    MOV {{ currentArch === 'x64' ? 'RCX, RBX' : 'ECX, EBX' }}     ; Max = RBX
done:</pre>
        </div>

        <div class="border border-slate-200 rounded overflow-hidden">
          <div class="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 border-b">2. Validasi Range Angka (10 &lt;= x &lt;= 20)</div>
          <pre class="p-3 text-xs font-mono bg-slate-800 text-slate-200">; Cek apakah nilai EAX valid di antara 10 dan 20
CMP EAX, 10
JL  invalid_input   ; Jika EAX < 10 -> Tidak Valid
CMP EAX, 20
JG  invalid_input   ; Jika EAX > 20 -> Tidak Valid

valid_input:
    ; Nilai 10 <= EAX <= 20, aman diproses
    JMP continue_proc
invalid_input:
    ; Tangani error input
continue_proc:</pre>
        </div>
      </div>

      <!-- Simulator Visualizer JG / JL (Signed vs Unsigned) -->
      <JGJLEVisualizer :mode="currentArch" class="mt-6" />
    </div>

    <!-- 4. CALL / RET – Panggil dan Kembali dari Fungsi -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">4</span>
        CALL / RET – Subrutin &amp; Pemanggilan Fungsi
      </h3>
      <div class="bg-slate-50 border border-slate-200 rounded p-4 mb-4">
        <p class="text-sm text-slate-700 mb-2">
          <strong>CALL:</strong> Memanggil fungsi subrutin. CPU secara otomatis menyimpan alamat instruksi berikutnya (<em>Return Address</em>) ke dalam Stack RAM (<code>RSP -= 8</code> atau <code>ESP -= 4</code>), lalu melompat ke alamat fungsi.<br>
          <strong>RET:</strong> Kembali dari fungsi. CPU mengambil alamat return dari Stack (<code>POP RIP/EIP</code>) dan melompat kembali melanjutkan eksekusi program pemanggil.
        </p>
        <div class="bg-slate-800 rounded p-3 mb-3">
          <code class="text-green-400 font-mono text-sm">CALL my_function  ; Push Return Address -&gt; Lompat ke target<br>RET                ; Pop Return Address -&gt; Kembali ke pemanggil</code>
        </div>
      </div>

      <!-- Diagram Visualisasi Stack Saat CALL dan RET -->
      <h4 class="font-bold text-slate-700 text-xs uppercase mb-2">Visualisasi Perubahan Stack pada CALL &amp; RET</h4>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 font-mono text-xs">
        <div class="border border-slate-200 rounded p-3 bg-slate-900 text-slate-200">
          <div class="text-blue-400 font-bold mb-2 pb-1 border-b border-slate-700">1. Sebelum CALL</div>
          <div class="space-y-1 text-[11px]">
            <div class="text-slate-400">[Data Stack Lama]</div>
            <div class="bg-slate-800 p-1.5 rounded text-amber-400">&gt; {{ currentArch === 'x64' ? 'RSP' : 'ESP' }} -&gt; 0x...E010</div>
            <div class="text-slate-500 italic font-sans text-[10px]">Alamat IP menunjuk ke baris CALL.</div>
          </div>
        </div>

        <div class="border border-slate-200 rounded p-3 bg-slate-900 text-slate-200">
          <div class="text-emerald-400 font-bold mb-2 pb-1 border-b border-slate-700">2. Saat CALL Dieksekusi</div>
          <div class="space-y-1 text-[11px]">
            <div class="bg-emerald-950 border border-emerald-500 p-1.5 rounded text-emerald-300">
              [RETURN ADDRESS] {{ currentArch === 'x64' ? '(8B)' : '(4B)' }}
            </div>
            <div class="bg-slate-800 p-1.5 rounded text-amber-400">&gt; {{ currentArch === 'x64' ? 'RSP' : 'ESP' }} -= {{ currentArch === 'x64' ? '8' : '4' }}</div>
            <div class="text-slate-500 italic font-sans text-[10px]">CPU melompat masuk ke fungsi target.</div>
          </div>
        </div>

        <div class="border border-slate-200 rounded p-3 bg-slate-900 text-slate-200">
          <div class="text-purple-400 font-bold mb-2 pb-1 border-b border-slate-700">3. Saat RET Dieksekusi</div>
          <div class="space-y-1 text-[11px]">
            <div class="text-slate-400">[Return Address di-POP]</div>
            <div class="bg-slate-800 p-1.5 rounded text-amber-400">&gt; {{ currentArch === 'x64' ? 'RSP' : 'ESP' }} += {{ currentArch === 'x64' ? '8' : '4' }}</div>
            <div class="text-slate-500 italic font-sans text-[10px]">CPU lompat kembali ke baris setelah CALL.</div>
          </div>
        </div>
      </div>

      <!-- Calling Conventions & Stack Frame -->
      <h4 class="font-bold text-slate-700 text-xs uppercase mb-2">Konvensi Pemanggilan Fungsi (Calling Convention)</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div class="border border-slate-200 rounded p-4 bg-slate-50">
          <h5 class="font-bold text-slate-800 text-xs mb-2">Prolog &amp; Epilog Stack Frame (Setup Variabel Lokal)</h5>
          <pre class="bg-slate-800 text-slate-200 p-3 rounded text-xs font-mono mb-2">; === PROLOG FUNGSI ===
PUSH {{ currentArch === 'x64' ? 'RBP' : 'EBP' }}          ; Simpan frame pointer lama
MOV  {{ currentArch === 'x64' ? 'RBP, RSP' : 'EBP, ESP' }}    ; Pasang base pointer baru
SUB  {{ currentArch === 'x64' ? 'RSP, 16' : 'ESP, 16' }}     ; Alokasi ruang variabel lokal

; Logika fungsi...
MOV DWORD [{{ currentArch === 'x64' ? 'RBP-4' : 'EBP-4' }}], 10

; === EPILOG FUNGSI ===
MOV  {{ currentArch === 'x64' ? 'RSP, RBP' : 'ESP, EBP' }}    ; Bersihkan stack lokal
POP  {{ currentArch === 'x64' ? 'RBP' : 'EBP' }}          ; Kembalikan frame pointer lama
RET                  ; (Bisa diganti instruksi LEAVE; RET)</pre>
        </div>

        <div class="border border-slate-200 rounded p-4 bg-slate-50">
          <h5 class="font-bold text-slate-800 text-xs mb-2">Penyaluran Parameter Antar Arsitektur</h5>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs border border-slate-200 bg-white">
              <thead class="bg-slate-100"><tr class="border-b"><th class="p-1.5 border-r">Urutan Param</th><th class="p-1.5 border-r">System V (Linux x64)</th><th class="p-1.5 border-r">MS x64 (Win)</th><th class="p-1.5">cdecl (x86 32-bit)</th></tr></thead>
              <tbody class="font-mono text-slate-600">
                <tr class="border-b"><td class="p-1.5 border-r font-sans font-bold">Param 1</td><td class="p-1.5 border-r text-blue-600 font-bold">RDI</td><td class="p-1.5 border-r text-blue-600 font-bold">RCX</td><td class="p-1.5 text-purple-600 font-bold">Stack [ESP+4]</td></tr>
                <tr class="border-b"><td class="p-1.5 border-r font-sans font-bold">Param 2</td><td class="p-1.5 border-r text-blue-600 font-bold">RSI</td><td class="p-1.5 border-r text-blue-600 font-bold">RDX</td><td class="p-1.5 text-purple-600 font-bold">Stack [ESP+8]</td></tr>
                <tr class="border-b"><td class="p-1.5 border-r font-sans font-bold">Param 3</td><td class="p-1.5 border-r text-blue-600 font-bold">RDX</td><td class="p-1.5 border-r text-blue-600 font-bold">R8</td><td class="p-1.5 text-purple-600 font-bold">Stack [ESP+12]</td></tr>
                <tr class="border-b"><td class="p-1.5 border-r font-sans font-bold">Param 4</td><td class="p-1.5 border-r text-blue-600 font-bold">RCX</td><td class="p-1.5 border-r text-blue-600 font-bold">R9</td><td class="p-1.5 text-purple-600 font-bold">Stack [ESP+16]</td></tr>
                <tr><td class="p-1.5 border-r font-sans font-bold text-emerald-700">Hasil (Return)</td><td class="p-1.5 border-r text-emerald-600 font-bold">RAX</td><td class="p-1.5 border-r text-emerald-600 font-bold">RAX</td><td class="p-1.5 text-emerald-600 font-bold">EAX</td></tr>
              </tbody>
            </table>
          </div>
          <p class="text-[11px] text-slate-500 mt-2 italic font-sans">
            Di 32-bit (cdecl), parameter di-push ke stack dari kanan ke kiri, dan pemanggil (caller) membersihkan stack dengan <code>ADD ESP, n</code> atau fungsi menggunakan <code>RET n</code>.
          </p>
        </div>
      </div>

      <!-- Simulator Visualizer CALL & RET -->
      <CallRetVisualizer :mode="currentArch" class="mt-6" />
    </div>

    <!-- 5. Perbandingan dengan C++ -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">5</span>
        Perbandingan Konstruksi Kontrol Alur C++ vs Assembly
      </h3>
      <p class="text-sm text-slate-700 mb-4">
        Berikut adalah bagaimana konstruksi pemrograman tingkat tinggi (C++) diterjemahkan ke dalam instruksi mesin perakitan nyata:
      </p>

      <!-- 5.1 If-Else Statement -->
      <h4 class="font-bold text-slate-800 text-xs uppercase mb-2">5.1 Percabangan If-Else</h4>
      <CodePanel
        cppCode="int a = 10, b = 20;
if (a > b) {
    a = a + 5;
} else {
    b = b + 5;
}"
        asmX64="MOV EAX, 10
MOV EBX, 20
CMP EAX, EBX       ; Bandingkan a dan b
JG  if_greater     ; Jika a > b, lompat ke blok IF

; Blok ELSE (b = b + 5)
ADD EBX, 5
JMP after_if       ; Lewati blok IF

if_greater:
; Blok IF (a = a + 5)
ADD EAX, 5

after_if:
; Lanjutkan program"
        asmX86="MOV EAX, 10
MOV EBX, 20
CMP EAX, EBX       ; Bandingkan a dan b
JG  if_greater     ; Jika a > b, lompat ke blok IF

; Blok ELSE (b = b + 5)
ADD EBX, 5
JMP after_if       ; Lewati blok IF

if_greater:
; Blok IF (a = a + 5)
ADD EAX, 5

after_if:
; Lanjutkan program"
        :currentArch="currentArch"
      />

      <!-- 5.2 While Loop -->
      <h4 class="font-bold text-slate-800 text-xs uppercase mb-2 mt-6">5.2 Perulangan While (While Loop)</h4>
      <CodePanel
        cppCode="int i = 0;
while (i < 10) {
    i++;
}"
        asmX64="MOV EAX, 0          ; i = 0

while_start:
CMP EAX, 10         ; Cek kondisi i < 10
JGE while_end       ; Jika i >= 10, keluar loop

INC EAX             ; Badan loop: i++
JMP while_start     ; Putar kembali ke pengecekan kondisi

while_end:
; Selesai perulangan"
        asmX86="MOV EAX, 0          ; i = 0

while_start:
CMP EAX, 10         ; Cek kondisi i < 10
JGE while_end       ; Jika i >= 10, keluar loop

INC EAX             ; Badan loop: i++
JMP while_start     ; Putar kembali ke pengecekan kondisi

while_end:
; Selesai perulangan"
        :currentArch="currentArch"
      />

      <!-- 5.3 For Loop -->
      <h4 class="font-bold text-slate-800 text-xs uppercase mb-2 mt-6">5.3 Perulangan For (For Loop)</h4>
      <CodePanel
        cppCode="int sum = 0;
for (int i = 0; i < 10; i++) {
    sum += i;
}"
        asmX64="MOV EAX, 0          ; sum = 0
MOV ECX, 0          ; i = 0

for_start:
CMP ECX, 10         ; Cek i < 10
JGE for_end         ; Jika i >= 10, keluar loop

ADD EAX, ECX        ; sum += i
INC ECX             ; i++
JMP for_start       ; Ulangi loop

for_end:
; Hasil sum tersimpan di register EAX"
        asmX86="MOV EAX, 0          ; sum = 0
MOV ECX, 0          ; i = 0

for_start:
CMP ECX, 10         ; Cek i < 10
JGE for_end         ; Jika i >= 10, keluar loop

ADD EAX, ECX        ; sum += i
INC ECX             ; i++
JMP for_start       ; Ulangi loop

for_end:
; Hasil sum tersimpan di register EAX"
        :currentArch="currentArch"
      />

      <!-- 5.4 Function Call -->
      <h4 class="font-bold text-slate-800 text-xs uppercase mb-2 mt-6">5.4 Pemanggilan Fungsi (Function Call)</h4>
      <CodePanel
        cppCode="int tambah(int a, int b) {
    return a + b;
}

int main() {
    int hasil = tambah(5, 10);
    return hasil;
}"
        asmX64="; System V AMD64 Calling Convention
tambah:
    MOV RAX, RDI     ; Param 1 (a)
    ADD RAX, RSI     ; Tambah Param 2 (b)
    RET              ; Return result di RAX

main:
    MOV RDI, 5       ; Argumen 1 = 5
    MOV RSI, 10      ; Argumen 2 = 10
    CALL tambah      ; Panggil fungsi
    ; Nilai return ada di RAX = 15
    RET"
        asmX86="; x86 cdecl Calling Convention
tambah:
    PUSH EBP
    MOV EBP, ESP
    MOV EAX, [EBP+8]  ; Ambil Param 1 (5)
    ADD EAX, [EBP+12] ; Tambah Param 2 (10)
    POP EBP
    RET

main:
    PUSH 10          ; Push argumen kedua
    PUSH 5           ; Push argumen pertama
    CALL tambah      ; Panggil fungsi
    ADD ESP, 8       ; Bersihkan argumen stack
    ; Nilai return ada di EAX = 15
    RET"
        :currentArch="currentArch"
      />
    </div>

    <!-- 6. Ringkasan Instruksi Kontrol Alur -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">6</span>
        Ringkasan Tabel Referensi Kontrol Alur Lengkap
      </h3>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border border-slate-200 rounded">
          <thead>
            <tr class="bg-slate-100 border-b text-slate-700">
              <th class="p-2 border-r font-bold">Instruksi</th>
              <th class="p-2 border-r font-bold">Kondisi / Makna</th>
              <th class="p-2 border-r font-bold">Pemeriksaan Flag</th>
              <th class="p-2 font-bold">Pola Penggunaan C++</th>
            </tr>
          </thead>
          <tbody class="text-slate-600 font-mono">
            <tr class="border-b"><td class="p-2 border-r font-bold text-blue-700">JMP</td><td class="p-2 border-r font-sans">Selalu lompat</td><td class="p-2 border-r text-slate-400">—</td><td class="p-2 font-sans"><code>goto label;</code> / loop mutlak</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-emerald-700">JE / JZ</td><td class="p-2 border-r font-sans">Sama / Hasil Nol</td><td class="p-2 border-r">ZF = 1</td><td class="p-2 font-sans"><code>if (a == b)</code></td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-emerald-700">JNE / JNZ</td><td class="p-2 border-r font-sans">Tidak sama / Bukan Nol</td><td class="p-2 border-r">ZF = 0</td><td class="p-2 font-sans"><code>if (a != b)</code></td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-purple-700">JG / JNLE</td><td class="p-2 border-r font-sans">Lebih besar (Signed)</td><td class="p-2 border-r">ZF=0 &amp; SF=OF</td><td class="p-2 font-sans"><code>if (a &gt; b)</code> [signed]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-purple-700">JGE / JNL</td><td class="p-2 border-r font-sans">Lebih besar / sama (Signed)</td><td class="p-2 border-r">SF = OF</td><td class="p-2 font-sans"><code>if (a &gt;= b)</code> [signed]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-purple-700">JL / JNGE</td><td class="p-2 border-r font-sans">Lebih kecil (Signed)</td><td class="p-2 border-r">SF ≠ OF</td><td class="p-2 font-sans"><code>if (a &lt; b)</code> [signed]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-purple-700">JLE / JNG</td><td class="p-2 border-r font-sans">Lebih kecil / sama (Signed)</td><td class="p-2 border-r">ZF=1 | SF ≠ OF</td><td class="p-2 font-sans"><code>if (a &lt;= b)</code> [signed]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-amber-700">JA / JNBE</td><td class="p-2 border-r font-sans">Lebih besar (Unsigned)</td><td class="p-2 border-r">CF=0 &amp; ZF=0</td><td class="p-2 font-sans"><code>if (a &gt; b)</code> [unsigned]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-amber-700">JAE / JNB</td><td class="p-2 border-r font-sans">Lebih besar / sama (Unsigned)</td><td class="p-2 border-r">CF = 0</td><td class="p-2 font-sans"><code>if (a &gt;= b)</code> [unsigned]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-amber-700">JB / JNAE</td><td class="p-2 border-r font-sans">Lebih kecil (Unsigned)</td><td class="p-2 border-r">CF = 1</td><td class="p-2 font-sans"><code>if (a &lt; b)</code> [unsigned]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-amber-700">JBE / JNA</td><td class="p-2 border-r font-sans">Lebih kecil / sama (Unsigned)</td><td class="p-2 border-r">CF=1 | ZF=1</td><td class="p-2 font-sans"><code>if (a &lt;= b)</code> [unsigned]</td></tr>
            <tr class="border-b"><td class="p-2 border-r font-bold text-indigo-700">CALL</td><td class="p-2 border-r font-sans">Panggil Subrutin</td><td class="p-2 border-r text-slate-400">—</td><td class="p-2 font-sans"><code>hasil = func(x, y);</code></td></tr>
            <tr><td class="p-2 border-r font-bold text-indigo-700">RET</td><td class="p-2 border-r font-sans">Kembali dari Subrutin</td><td class="p-2 border-r text-slate-400">—</td><td class="p-2 font-sans"><code>return hasil;</code></td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 7. Tips dan Praktik Terbaik -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">7</span>
        Tips dan Praktik Terbaik (Best Practices)
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="border border-slate-200 rounded p-3 bg-slate-50 flex items-start gap-3">
          <div class="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</div>
          <div>
            <h5 class="text-xs font-bold text-slate-800 mb-1">Gunakan CMP atau TEST Sebelum Jcc</h5>
            <p class="text-xs text-slate-600 leading-relaxed">Selalu pastikan ada instruksi pengatur flag (<code>CMP</code>, <code>TEST</code>, <code>SUB</code>, dll) tepat sebelum instruksi lompat bersyarat dieksekusi.</p>
          </div>
        </div>

        <div class="border border-slate-200 rounded p-3 bg-slate-50 flex items-start gap-3">
          <div class="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</div>
          <div>
            <h5 class="text-xs font-bold text-slate-800 mb-1">Pilih Signed vs Unsigned yang Tepat</h5>
            <p class="text-xs text-slate-600 leading-relaxed">Gunakan pasangan <code>JG/JL</code> untuk perbandingan bilangan bertanda (int), dan <code>JA/JB</code> untuk pointer atau unsigned integer.</p>
          </div>
        </div>

        <div class="border border-slate-200 rounded p-3 bg-slate-50 flex items-start gap-3">
          <div class="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</div>
          <div>
            <h5 class="text-xs font-bold text-slate-800 mb-1">Seimbangkan Alur CALL &amp; RET</h5>
            <p class="text-xs text-slate-600 leading-relaxed">Setiap <code>CALL</code> harus selalu berpasangan dengan <code>RET</code>. Pastikan posisi pointer Stack (RSP/ESP) seimbang sebelum memicu <code>RET</code>.</p>
          </div>
        </div>

        <div class="border border-slate-200 rounded p-3 bg-slate-50 flex items-start gap-3">
          <div class="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</div>
          <div>
            <h5 class="text-xs font-bold text-slate-800 mb-1">Gunakan PUSH &amp; POP untuk Register Callee-Saved</h5>
            <p class="text-xs text-slate-600 leading-relaxed">Jika fungsi Anda memodifikasi register penting (seperti RBX, RBP, R12-R15), simpan dengan <code>PUSH</code> di awal dan <code>POP</code> sebelum kembali.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. Latihan & Solusi Interaktif -->
    <div class="mb-8 border-b pb-6 border-slate-200">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">8</span>
        Latihan Pemrograman &amp; Studi Kasus
      </h3>
      <p class="text-xs text-slate-600 mb-4">
        Klik setiap soal latihan di bawah ini untuk melihat contoh implementasi kode assembly-nya:
      </p>

      <div class="space-y-3">
        <!-- Soal 1 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <button @click="toggleExercise(1)" class="w-full bg-slate-100 p-3 text-left font-bold text-xs text-slate-800 flex justify-between items-center hover:bg-slate-200 transition-colors">
            <span>Soal 1: Fungsi Nilai Maksimum max(a, b) menggunakan CMP, JG, dan RET</span>
            <span class="text-slate-500">{{ openEx === 1 ? '▲ Tutup Solusi' : '▼ Buka Solusi' }}</span>
          </button>
          <div v-show="openEx === 1" class="p-3 bg-slate-900 border-t border-slate-800">
            <pre class="text-xs font-mono text-emerald-400 overflow-x-auto"><span v-if="currentArch === 'x64'">; Fungsi: max(a, b) -&gt; mengembalikan nilai terbesar
; Parameter: RDI = a, RSI = b
max_func:
    CMP RDI, RSI
    JG  a_is_max
    MOV RAX, RSI       ; b lebih besar atau sama
    RET
a_is_max:
    MOV RAX, RDI       ; a lebih besar
    RET</span><span v-else>; x86 (32-bit): max(a, b)
max_func:
    PUSH EBP
    MOV EBP, ESP
    MOV EAX, [EBP+8]   ; a
    MOV EDX, [EBP+12]  ; b
    CMP EAX, EDX
    JG  a_is_max
    MOV EAX, EDX       ; b lebih besar
a_is_max:
    POP EBP
    RET</span></pre>
          </div>
        </div>

        <!-- Soal 2 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <button @click="toggleExercise(2)" class="w-full bg-slate-100 p-3 text-left font-bold text-xs text-slate-800 flex justify-between items-center hover:bg-slate-200 transition-colors">
            <span>Soal 2: Penjumlahan Deret 1 sampai 100 dengan While Loop</span>
            <span class="text-slate-500">{{ openEx === 2 ? '▲ Tutup Solusi' : '▼ Buka Solusi' }}</span>
          </button>
          <div v-show="openEx === 2" class="p-3 bg-slate-900 border-t border-slate-800">
            <pre class="text-xs font-mono text-emerald-400 overflow-x-auto">MOV EAX, 0           ; sum = 0
MOV ECX, 1           ; i = 1

while_100:
    CMP ECX, 100
    JG  while_100_end    ; Berhenti jika i > 100
    ADD EAX, ECX         ; sum += i
    INC ECX              ; i++
    JMP while_100

while_100_end:
    ; EAX = 5050 (1+2+...+100)</pre>
          </div>
        </div>

        <!-- Soal 3 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <button @click="toggleExercise(3)" class="w-full bg-slate-100 p-3 text-left font-bold text-xs text-slate-800 flex justify-between items-center hover:bg-slate-200 transition-colors">
            <span>Soal 3: Mencari Nilai Terkecil (Min) dari Tiga Angka</span>
            <span class="text-slate-500">{{ openEx === 3 ? '▲ Tutup Solusi' : '▼ Buka Solusi' }}</span>
          </button>
          <div v-show="openEx === 3" class="p-3 bg-slate-900 border-t border-slate-800">
            <pre class="text-xs font-mono text-emerald-400 overflow-x-auto">; Input di EAX (a), EBX (b), ECX (c)
; Hasil nilai terkecil disimpan di EAX
MOV EDX, EAX         ; Anggap min = a
CMP EBX, EDX
JGE check_c
MOV EDX, EBX         ; min = b

check_c:
CMP ECX, EDX
JGE min_done
MOV EDX, ECX         ; min = c

min_done:
MOV EAX, EDX         ; EAX berisi nilai minimum dari a, b, c</pre>
          </div>
        </div>

        <!-- Soal 4 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <button @click="toggleExercise(4)" class="w-full bg-slate-100 p-3 text-left font-bold text-xs text-slate-800 flex justify-between items-center hover:bg-slate-200 transition-colors">
            <span>Soal 4: Fungsi Faktorial Rekursif (factorial(n))</span>
            <span class="text-slate-500">{{ openEx === 4 ? '▲ Tutup Solusi' : '▼ Buka Solusi' }}</span>
          </button>
          <div v-show="openEx === 4" class="p-3 bg-slate-900 border-t border-slate-800">
            <pre class="text-xs font-mono text-emerald-400 overflow-x-auto"><span v-if="currentArch === 'x64'">; int factorial(int n) -> n di RDI
factorial:
    CMP RDI, 1
    JLE base_case
    PUSH RDI             ; Simpan nilai n saat ini ke stack
    DEC  RDI             ; n - 1
    CALL factorial       ; Rekursi: hasil di RAX
    POP  RDI             ; Ambil kembali n asli
    IMUL RAX, RDI        ; RAX = factorial(n-1) * n
    RET

base_case:
    MOV RAX, 1           ; factorial(0) = factorial(1) = 1
    RET</span><span v-else>; int factorial(int n)
factorial:
    PUSH EBP
    MOV EBP, ESP
    MOV EAX, [EBP+8]     ; n
    CMP EAX, 1
    JLE base_case
    DEC EAX              ; n - 1
    PUSH EAX
    CALL factorial       ; factorial(n-1) di EAX
    ADD ESP, 4
    MOV EDX, [EBP+8]     ; n asli
    IMUL EAX, EDX        ; EAX = factorial(n-1) * n
    POP EBP
    RET

base_case:
    MOV EAX, 1
    POP EBP
    RET</span></pre>
          </div>
        </div>

        <!-- Soal 5 -->
        <div class="border border-slate-200 rounded overflow-hidden">
          <button @click="toggleExercise(5)" class="w-full bg-slate-100 p-3 text-left font-bold text-xs text-slate-800 flex justify-between items-center hover:bg-slate-200 transition-colors">
            <span>Soal 5: Implementasi Switch-Case Menggunakan CMP &amp; Jump</span>
            <span class="text-slate-500">{{ openEx === 5 ? '▲ Tutup Solusi' : '▼ Buka Solusi' }}</span>
          </button>
          <div v-show="openEx === 5" class="p-3 bg-slate-900 border-t border-slate-800">
            <pre class="text-xs font-mono text-emerald-400 overflow-x-auto">; switch (pilihan in EAX)
CMP EAX, 1
JE  case_1
CMP EAX, 2
JE  case_2
CMP EAX, 3
JE  case_3
JMP case_default

case_1:
    ; Aksi pilihan 1
    JMP switch_end
case_2:
    ; Aksi pilihan 2
    JMP switch_end
case_3:
    ; Aksi pilihan 3
    JMP switch_end
case_default:
    ; Aksi default fallback
switch_end:</pre>
          </div>
        </div>
      </div>
    </div>

    <!-- 9. Simulasi Interaktif Debugger Looping -->
    <div class="mb-8">
      <h3 class="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span class="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">9</span>
        Simulasi Debugger: Perulangan Looping Interaktif
      </h3>
      <p class="text-sm text-slate-600 mb-4">
        Amati bagaimana CPU mengevaluasi batas iterasi, mengurangi counter indeks di memori stack, memperbarui register <em>flags</em>, dan melompat balik menggunakan <code>JMP</code>:
      </p>

      <div v-if="currentSim" class="border border-slate-200 rounded overflow-hidden flex flex-col shadow-lg">
        <div class="bg-slate-800 text-white px-3 py-1.5 text-[11px] font-bold border-b border-slate-700 flex justify-between">
          <span>Simulasi Eksekusi Loop (Counter &amp; Akumulator)</span>
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
import JMPVisualizer from './JMPVisualizer.vue'
import JEJNEVisualizer from './JEJNEVisualizer.vue'
import JGJLEVisualizer from './JGJLEVisualizer.vue'
import CallRetVisualizer from './CallRetVisualizer.vue'
import { animDb } from '../data/cpp_asm_data.js'

const props = defineProps({
  currentArch: {
    type: String,
    default: 'x64'
  }
})

const openEx = ref(1)
function toggleExercise(num) {
  openEx.value = openEx.value === num ? 0 : num
}

const stepVal = ref(0)

const currentSim = computed(() => {
  const loopData = animDb.loop
  return loopData ? loopData[props.currentArch] : null
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
