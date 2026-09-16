# DOTSIXTWOO Project Control Center — MVP v2.2

PWA internal untuk monitoring project DOTSIXTWOO dengan arsitektur gratis:

- Frontend: GitHub Pages
- Backend/API: Google Apps Script Web App
- Database: Google Sheets
- File: Google Drive links
- Target: ±25 internal users

## V2 additions

- Project Detail page
- Update Task cepat oleh masing-masing PIC
- Multi-task per project
- Meeting + MOM wajib
- Multiple action item MOM → otomatis menjadi task
- Budget editor + calculation + alert
- Daily Update
- Notification Center
- Richer CEO/PM dashboard
- Alfa's Schedule Today / Tomorrow / This Week
- User management
- Change Password
- Basic server-side role / ownership validation
- Activity Log
- PWA icons dari logo resmi DOTSIXTWOO
- Offline indicator

## Design system

Hanya menggunakan:

- `#FFFFFF` — putih dominan
- `#FFFF00` — kuning highlight/action
- `#000000` — hitam text/border

Tidak menggunakan gradient atau warna lain.

---

## 1. Setup Google Sheets

Buat Google Sheet baru bernama misalnya:

`DOTSIXTWOO Project Control DB`

Copy Spreadsheet ID dari URL Google Sheets.

Contoh URL:

`https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`

---

## 2. Setup Google Apps Script

Dari Google Sheet:

**Extensions → Apps Script**

Buat file dengan nama yang sama seperti folder `GAS/`:

- Code.gs
- Config.gs
- Database.gs
- Auth.gs
- Project.gs
- Task.gs
- Meeting.gs
- MOM.gs
- Budget.gs
- Dashboard.gs
- Notification.gs
- ActivityLog.gs

Copy isi masing-masing file.

Di `Config.gs` ubah:

```javascript
var APP={SPREADSHEET_ID:'PASTE_SPREADSHEET_ID',SESSION_HOURS:12};
```

menjadi Spreadsheet ID Anda.

---

## 3. Initialize database

Di Apps Script pilih fungsi:

`setupSystem`

Klik **Run**.

Berikan permission saat Google meminta otorisasi.

Script akan membuat sheet:

- USERS
- PROJECTS
- TASKS
- MEETINGS
- MOM
- MOM_ACTIONS
- DAILY_UPDATES
- BUDGET
- DOCUMENTS
- ACTIVITY_LOG
- NOTIFICATIONS
- SETTINGS

User awal otomatis:

- Name: MIMO
- Email: `CHANGE_ME@example.com`
- Password: `ChangeMe123!`
- Role: PM

**Sebelum dipakai, ganti email pada sheet USERS** menjadi email MIMO yang benar.

Setelah login, gunakan menu **More → Change Password**.

---

## 4. Deploy GAS

Apps Script:

**Deploy → New deployment → Web app**

- Execute as: Me
- Who has access: Anyone

Copy URL deployment yang berakhir `/exec`.

Contoh:

`https://script.google.com/macros/s/XXXX/exec`

Jika source GAS diubah:

**Deploy → Manage deployments → Edit → New version → Deploy**

---

## 5. Configure frontend

Buka:

`js/config.js`

Isi URL Apps Script:

```javascript
window.APP_CONFIG={
  API_URL:'https://script.google.com/macros/s/XXXX/exec',
  TOKEN_KEY:'dotsix_token'
};
```

Gunakan URL `/exec`, bukan `/dev`.

---

## 6. GitHub Pages

Buat repository, misalnya:

`dotsix-two-project-control`

Upload isi folder project ke root repository sehingga `index.html` berada di root.

Kemudian:

**Settings → Pages → Deploy from a branch → main → /root → Save**

GitHub akan memberi URL seperti:

`https://USERNAME.github.io/dotsix-two-project-control/`

---

## 7. Tambah 25 user

Login sebagai role `ADMIN` atau `LEADER`.

Buka:

**More → Users → + User**

Isi:

- Nama
- Email
- Phone
- Role
- Temporary Password

Role tersedia:

- PM
- ADMIN
- TALENT
- LOGISTIC
- PERMITTER
- LEADER

Default temporary password yang disarankan saat onboarding:

`ChangeMe123!`

Minta masing-masing user mengganti password setelah login.

---

## 8. Workflow test MVP v2.2

### Project

Buat:

- Project: XYZ
- Type: Upcoming Project
- PM: MIMO

### Tasks

- Quotation → MIMO
- Sourcing SPG → Nay
- Booth Preparation → Eki
- Permit → Om Agung
- Administration → Adel

### Meeting

Buat meeting Project XYZ.

Setelah meeting, klik **Buat MOM**.

Isi:

- Discussion
- Decision
- Client Request
- MOM Link

Tambahkan beberapa Action Item sekaligus.

Setelah Save, setiap action otomatis menjadi Task baru.

### Budget

- Approved: 50,000,000
- Planned: 40,000,000
- Actual: 25,000,000

Sistem menghitung:

- Remaining
- Variance
- Estimated Profit
- Margin
- Usage
- Budget Status

---

## Important security notes

- Jangan simpan secret/token Google di GitHub.
- GitHub frontend dianggap public code.
- Database tidak berada di GitHub.
- Semua write dilakukan melalui GAS.
- Role dan ownership divalidasi di backend.
- Untuk production internal yang lebih ketat, authentication sebaiknya ditingkatkan ke Google Workspace identity atau identity provider yang sesuai.

## WhatsApp

MVP v2.2 belum mengirim pesan otomatis ke WhatsApp Group.

Database notification dan notification center sudah disiapkan sebagai foundation untuk integrasi provider/API WhatsApp pada fase berikutnya.


## MVP v2.2 — Meeting & Alfa Schedule

- Participants sekarang dipilih melalui checklist user, bukan mengetik nama bebas.
- Toggle **Pak Alfa Required** otomatis memasukkan Pak Alfa sebagai participant dan ke Alfa's Schedule.
- Alfa's Schedule membaca participant berdasarkan User ID, dengan fallback nama lama untuk data v2.
- Status meeting: Scheduled, Rescheduled, Completed, Cancelled.
- Tombol **Selesai → MOM** mengubah meeting menjadi Completed dan MOM menjadi Pending.
- Meeting Cancelled tidak tampil di Alfa's Schedule.
- MOM baru menjadi Pending setelah meeting ditandai selesai; setelah MOM dibuat status menjadi Done.

### Upgrade dari v2
1. Ganti seluruh file GAS dan frontend dengan v2.2.
2. Jalankan `setupSystem()` sekali. Kolom `participantIds` dan `alfaRequired` ditambahkan di akhir schema MEETINGS agar data lama tetap kompatibel.
3. Deploy Apps Script sebagai **New version**.
4. Commit frontend ke GitHub Pages.
5. Hard refresh / reinstall PWA jika cache lama masih terlihat.


## Workload (v2.2)
Untuk PM/Admin/Leader:
1. Buka `More` → `Workload`.
2. Sistem otomatis menghitung task aktif setiap personal dari sheet `TASKS`.
3. Filter `Overdue` atau `Blocked` untuk melihat personal yang perlu follow-up.
4. Klik nama personal untuk melihat daftar task aktif, deadline, progress, next action, dan blocker.

Workload tidak perlu diinput manual. Sumber datanya adalah assignment PIC pada task.

## v2.3 upgrade notes
1. Replace frontend files and GAS files with v2.3.
2. In Google Sheets, open **File / Settings** and make sure the spreadsheet timezone is **GMT+07:00 Jakarta** (or your actual operating timezone).
3. Redeploy Apps Script: **Deploy → Manage deployments → Edit → New version → Deploy**.
4. Push frontend changes to GitHub Pages.
5. Close/reopen the PWA or hard refresh so service worker cache v2.3 replaces v2.2.

### Meeting date/time fix
Google Sheets can return a time-only cell as a JavaScript Date based on `1899-12-30`. v2.3 normalizes meeting dates and times inside GAS before returning them to the PWA, and the frontend also includes a fallback normalizer.

### Form cancellation fix
The **Batal** and **X** buttons are now `type="button"` and close the dialog directly. They no longer submit the form, so required fields do not block cancellation.
