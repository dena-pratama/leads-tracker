# Panduan Setup Meta App (Facebook Developers)

Ikuti langkah ini untuk mendapatkan **App ID** dan **App Secret**.

## 1. Buat App Baru
1. Buka [developers.facebook.com](https://developers.facebook.com/).
2. Login dengan akun Facebook kamu.
3. Klik **My Apps** (pojok kanan atas) -> **Create App**.
4. Pilih **"Other"** (atau "Lainnya") -> **Next**.
5. Pilih **"Business"** (Bisnis) -> **Next**.
6. Isi nama App: `Leads Tracker [Nama Kamu]`.
7. Isi email kontak.
8. (Opsional) Pilih Business Account jika ada.
9. Sliders "App purpose": Pilih **"Yourself or your own business"**.
10. Klik **Create App**.

## 2. Tambahkan Produk
Setelah App jadi, kamu akan masuk ke dashboard App. Tambahkan produk ini:

### A. Facebook Login for Business
1. Cari **"Facebook Login for Business"** -> klik **Set Up**.
2. Pilih **WWW (Web)**.
3. Site URL: Masukkan `http://localhost:3000/` (atau `3001` sesuai port kamu).
4. Klik **Save**, lalu **Continue**.
5. Di sidebar kiri, buka **Facebook Login for Business** -> **Settings**.
6. Pastikan **Valid OAuth Redirect URIs** diisi:
   - `http://localhost:3000/api/auth/callback/meta`
   - `http://localhost:3001/api/auth/callback/meta`
   - (Nanti tambah domain production kalau sudah deploy).
7. Klik **Save Changes**.

### B. Marketing API
1. Kembali ke Dashboard utama (klik **Add Product** di sidebar kiri).
2. Cari **"Marketing API"** -> klik **Set Up**.
3. Selesai (ikon ceklis hijau muncul di sidebar).

## 3. Ambil App ID & Secret
1. Di sidebar kiri, buka **App Settings** -> **Basic**.
2. Copy **App ID**.
3. Klik tombol **Show** di sebelah **App Secret**, masukkan password FB, lalu Copy **App Secret**.

---
**Simpan data ini untuk langkah selanjutnya!**
Kirimkan App ID & App Secret (atau masukkan sendiri ke .env).
