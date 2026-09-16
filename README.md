# DOTSIXTWOO Project Control Center — MVP v1

PWA internal: GitHub Pages + Google Apps Script + Google Sheets + Google Drive links.

## 1. Frontend
Edit `js/config.js` lalu isi `API_URL` dengan URL deployment Apps Script `/exec`.

Upload folder ini ke GitHub repository, aktifkan **Settings → Pages → Deploy from branch → main / root**.

## 2. Database Google Sheets
Buat 1 Google Spreadsheet kosong. Copy Spreadsheet ID ke `GAS/Config.gs`.

## 3. Apps Script
Buka Extensions → Apps Script dari spreadsheet atau standalone Apps Script.
Buat file sesuai folder `GAS/`, copy isinya, lalu jalankan `setupSystem()` sekali.

Default seed user:
- Email: `CHANGE_ME@example.com`
- Password: `ChangeMe123!`

**WAJIB ganti email/password seed sebelum production.** Untuk produksi, tambahkan fungsi admin user management / reset password dan jangan gunakan default password.

Deploy → New deployment → Web app.
- Execute as: Me
- Who has access: sesuai kebijakan akun/Workspace Anda.

Copy `/exec` URL ke `js/config.js`.

## 4. Logo
Letakkan logo resmi yang sudah disiapkan sebagai `assets/logo.png`. File ini sengaja tidak diubah oleh source code.

## 5. Struktur Drive per Project
01 Brief
02 Pitching Deck
03 Quotation
04 Costing
05 PO Contract
06 Timeline
07 Talent
08 Logistic
09 Permit
10 Meeting MOM
11 Documentation
12 Final Report

Simpan link folder utama ke field `driveFolder`.

## 6. Scope MVP ini
Sudah ada pondasi untuk:
- Login session
- Project
- Multi-task
- My Tasks
- Meeting + MOM status
- MOM → Task backend
- Budget calculation
- Dashboard ringkas
- Alfa Schedule
- Activity Log
- PWA shell / offline app shell
- Notification table/service foundation

Belum final production untuk:
- UI edit/update task detail
- UI form MOM lengkap
- User management UI
- Password reset
- WhatsApp provider/API
- Google Calendar integration
- Offline mutation queue/sync
- Advanced role permission matrix

## 7. Catatan CORS / Apps Script
Deployment Apps Script dan kebijakan akun Google dapat memengaruhi request cross-origin dari GitHub Pages. Uji deployment `/exec` dari domain GitHub Pages sebelum go-live. Jika kebijakan Workspace memblokir pola ini, gunakan deployment/configuration yang diizinkan organisasi atau pindahkan frontend shell ke Apps Script HTMLService.

## 8. Design system
Hanya:
- #FFFFFF 80%
- #FFFF00 15%
- #000000 5%

Tidak ada warna lain dan tidak ada gradient.
