# ForgeBooks, Invoice Automation Dashboard (Demo / Concept)

A working demo of a secure AI MVP: login, invoice dashboard, search and filter, add and delete invoices, a rule-based invoice summary, and CSV export. All data lives in the browser.

Live demo: https://vedansh2821.github.io/invoice-automation-dashboard/

Demo login: `demo@forgebooks.demo` / `demo123` (or use "Continue as demo user").

## What it shows

- Demo login screen (no real auth, nothing leaves the browser)
- Dashboard KPIs computed live from the data, plus a monthly totals chart
- Invoice table with 16 sample invoices, search by vendor or number, status filter, sort by date or amount
- Add invoice form with validation, saved to localStorage; delete with confirmation
- Invoice detail view with a rule-based summary: categorisation by vendor keywords, overdue and duplicate flags. Labelled "Rule-based demo summary (no live AI call)".
- CSV export of the currently filtered invoices
- Logout, responsive on mobile

## Demo workspace

Malwa Trading Co., Dewas, Madhya Pradesh. Vendors are fictional local-style sample names.

## Tech

Plain HTML, CSS, and JavaScript. No build step, no backend, no paid services. Open `index.html` or serve the folder with any static host.

## Honesty note

Demo / Concept project by Vedansh Vyas. All figures are sample data, nothing is real.
