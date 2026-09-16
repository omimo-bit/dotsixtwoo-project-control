# DOTSIXTWOO Project Control Center — MVP v2

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

## 8. Workflow test MVP v2

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

MVP v2 belum mengirim pesan otomatis ke WhatsApp Group.

Database notification dan notification center sudah disiapkan sebagai foundation untuk integrasi provider/API WhatsApp pada fase berikutnya.
