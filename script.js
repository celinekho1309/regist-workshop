// ===== 1. Ambil elemen ===== 
const form = document.querySelector('#formDaftar'); 
const fields = form.querySelectorAll('input'); 
const inputTanggal = document.querySelector('#tanggal'); 
const inputTglLahir = document.querySelector('#tgl_lahir'); 
const inputPassword = document.querySelector('#password'); 
const inputRepassword = document.querySelector('#repassword'); 
const statusForm = document.querySelector('#statusForm'); 

// ===== 2. Daftar pesan error khusus per input (SOP Sesuai Gambar) ===== 
const pesan = { 
  nama: { 
    kosong: 'Nama wajib diisi.', 
    pendek: 'Nama minimal 3 huruf.' 
  }, 
  email: { 
    kosong: 'Email wajib diisi.', 
    format: 'Format email belum benar. Contoh: nama@domain.com' 
  }, 
  hp: { 
    kosong: 'Nomor WhatsApp wajib diisi.', 
    format: 'Nomor diawali 08 dan terdiri dari 10–13 digit.' 
  }, 
  password: { 
    kosong: 'Password wajib diisi.', 
    pendek: 'Password minimal terdiri dari 8 karakter.' 
  }, 
  repassword: { 
    kosong: 'Ulangi password wajib diisi.', 
    beda: 'Password dan re-type password tidak cocok.' 
  }, 
  tgl_lahir: { 
    kosong: 'Tanggal lahir wajib diisi.', 
    umur: 'Usia minimal harus 20 tahun.',
    lampau: 'Format tanggal tidak valid.' 
  }, 
  tanggal: { 
    kosong: 'Pilih tanggal kehadiran.', 
    lampau: 'Tanggal paling cepat hari ini.' 
  } 
}; 

// ===== 3. Helper Pengaturan Tanggal ===== 
function getFormattedDate(d) { 
  const bulan = String(d.getMonth() + 1).padStart(2, '0'); 
  const tgl = String(d.getDate()).padStart(2, '0'); 
  return `${d.getFullYear()}-${bulan}-${tgl}`; 
} 

// Set tanggal kehadiran minimal hari ini
if (inputTanggal) {
  inputTanggal.min = getFormattedDate(new Date()); 
}

// Set batas maksimal tanggal lahir (Maksimal hari ini - 20 tahun)
if (inputTglLahir) {
  const hariIni = new Date(); 
  const maxTglLahir = new Date(hariIni.getFullYear() - 20, hariIni.getMonth(), hariIni.getDate()); 
  inputTglLahir.max = getFormattedDate(maxTglLahir); 
}

// ===== 4. Tampilkan dan hapus error ===== 
function showError(input, teks) { 
  input.classList.add('is-invalid'); 
  input.setAttribute('aria-invalid', 'true'); 
  const errorElement = document.getElementById(input.id + '-error');
  if (errorElement) {
    errorElement.textContent = teks; 
  }
  return false; 
} 

function clearError(input) { 
  input.classList.remove('is-invalid'); 
  input.removeAttribute('aria-invalid'); 
  const errorElement = document.getElementById(input.id + '-error');
  if (errorElement) {
    errorElement.textContent = ''; 
  }
  return true; 
} 

// ===== 5. Pengecekan field individual ===== 
function cekField(input) { 
  const v = input.validity; 
  const p = pesan[input.id]; 

  // Pengecekan valueMissing (kosong)
  if (v.valueMissing || input.value.trim() === '') { 
    return showError(input, p.kosong); 
  } 

  // Validasi khusus Password Re-type (Kriteria B)
  if (input.id === 'repassword') { 
    if (input.value !== inputPassword.value) { 
      return showError(input, p.beda); 
    } 
  } 

  // Validasi khusus Tanggal Lahir umur < 20 tahun (Kriteria C)
  if (input.id === 'tgl_lahir' && v.rangeOverflow) { 
    return showError(input, p.umur); 
  } 

  // Pengecekan bawaan HTML5 Validation API
  if (v.tooShort) return showError(input, p.pendek); 
  if (v.patternMismatch || v.typeMismatch) return showError(input, p.format); 
  if (v.rangeUnderflow) {
    if (input.id === 'tanggal') return showError(input, p.lampau);
  } 

  return clearError(input); 
} 

function semuaFieldValid() { 
  let valid = true; 
  for (const input of fields) { 
    if (!cekField(input)) {
      valid = false; 
    }
  } 
  return valid; 
} 

// ===== 6. Event listeners (Blur) ===== 
function saatBlur(event) { 
  cekField(event.target); 

  // Jika input password diubah, validasi semula repassword jika sudah diisi
  if (event.target.id === 'password' && inputRepassword.value !== '') { 
    cekField(inputRepassword); 
  } 
} 

for (const input of fields) { 
  input.addEventListener('blur', saatBlur); 
} 

// ===== 7. Event: saat form dikirim ===== 
function saatSubmit(event) { 
  event.preventDefault(); 
  
  if (statusForm) {
    statusForm.className = ''; 
    statusForm.textContent = ''; 
  }

  if (!semuaFieldValid()) { 
    const invalidInput = form.querySelector('[aria-invalid="true"]');
    if (invalidInput) {
      invalidInput.focus(); 
    }
    return; 
  } 

  if (statusForm) {
    statusForm.textContent = 'Pendaftaran sukses! Sampai jumpa di workshop.'; 
    statusForm.className = 'alert alert-success mt-3'; 
  }
  
  form.reset(); 
  fields.forEach(input => {
    input.classList.remove('is-invalid');
    input.removeAttribute('aria-invalid');
  });
} 

if (form) {
  form.addEventListener('submit', saatSubmit);
}