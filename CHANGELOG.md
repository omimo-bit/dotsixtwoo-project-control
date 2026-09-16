# Changelog

## v2.3
- Modern UI refresh while preserving DOTSIXTWOO's strict white/yellow/black design system.
- Fixed meeting time display from Google Sheets time cells (no more `1899-12-30T...Z`).
- Fixed Home "Meeting Hari Ini" date matching by using local/spreadsheet timezone instead of UTC date slicing.
- Alfa's Schedule and Meeting cards now receive normalized `yyyy-MM-dd` and `HH:mm` values from GAS.
- Cancel/X buttons in all modal forms now close immediately without triggering HTML required-field validation.
- PWA cache version bumped to v2.3.

## v2.2
- Added Workload Control page and workload detail.
