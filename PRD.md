# DOTSIXTWOO Project Control Center — PRD / MVP v2.2

# DOTSIXTWOO Project Control Center — PRD v1.0

Tujuan: single source of truth untuk lifecycle project DOTSIXTWOO.

Core flow: Project → Multi Task → PIC → Deadline → Update → Meeting → MOM → Action → Task → Budget → Dashboard → Close.

Platform: PWA hosted GitHub Pages, backend Google Apps Script, database Google Sheets, document links Google Drive, ±25 internal users.

Design: #FFFFFF 80%, #FFFF00 15%, #000000 5% only.

MVP acceptance scenario: Project XYZ / Upcoming Project / PM MIMO; tasks Quotation→MIMO, Sourcing SPG→Nay, Booth Preparation→Eki, Permit→Om Agung, Administration→Adel; meeting + MOM; action to task; budget approved 50m, planned 40m, actual 25m; dashboard and activity log reflect changes.


## v2.2 Meeting Acceptance Criteria
- Meeting participant selection uses active USERS checklist.
- Pak Alfa Required automatically includes Pak Alfa and feeds Alfa's Schedule.
- Schedule filters Today / Tomorrow / This Week.
- Cancelled meetings do not appear on Alfa's Schedule.
- Completed meeting without MOM becomes MOM Pending.
- Creating MOM marks MOM Done.


## MVP v2.2 — WORKLOAD CONTROL

Workload is calculated automatically from active tasks assigned to each user.

### Workload summary
- Active Tasks
- People Active
- Overdue
- Blocked

### Per-person metrics
- Active
- Not Started
- On Progress
- Waiting
- Blocked
- Overdue
- Completed

### Interaction
PM/Admin/Leader can open `More → Workload`, filter the list, search a person, and tap a person to see their active task details.

No manual workload field is required. TASKS remain the single source of truth for workload.
