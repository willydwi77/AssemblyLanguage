/**
 * app.js
 * Standarisasi fungsi interaktif untuk antarmuka panduan Assembly.
 */

// State arsitektur aktif
let currentArch = 'x64';

/**
 * Mengubah arsitektur dan memperbarui status tombol toggle.
 * Memanggil `renderApp()` jika terdefinisi di file HTML.
 * @param {string} arch - 'x64' atau 'x86'
 */
function setArch(arch) {
    currentArch = arch;
    
    const btn64 = document.getElementById('toggle-x64');
    const btn86 = document.getElementById('toggle-x86');
    
    if (btn64 && btn86) {
        btn64.className = arch === 'x64' ? "arch-btn active" : "arch-btn inactive";
        btn86.className = arch === 'x86' ? "arch-btn active" : "arch-btn inactive";
    }
    
    if (typeof renderApp === 'function') {
        renderApp();
    }
}

/**
 * Fungsi pembantu (helper) untuk mendapatkan string berdasarkan arsitektur terpilih.
 * @param {object|string} prop - Data arsitektur (contoh: {x64: 'RAX', x86: 'EAX'})
 * @returns {string} String yang sesuai dengan currentArch
 */
function archData(prop) {
    if (typeof prop === 'object' && !Array.isArray(prop) && prop !== null) {
        return prop[currentArch] !== undefined ? prop[currentArch] : (prop['x64'] || prop);
    }
    return prop;
}

/**
 * Menukar status aktif pada elemen tab navigasi utama (menu index).
 * @param {HTMLElement} btn - Elemen tombol yang diklik
 */
function setActiveTabUI(btn) {
    const navGroup = btn.closest('.nav-group');
    if (navGroup) {
        navGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    } else {
        document.querySelectorAll('#mainTabs .tab-btn').forEach(b => b.classList.remove('active'));
    }
    btn.classList.add('active');
}
