# Directive: Upload to Google Sheets via API

## Goal
Automate the transfer of the 90-day TikTok plan from the CSV file to a live Google Sheet.

## Inputs
- `LIVIX_ULTIMATE_TIKTOK_90DAY_PLAN.csv`
- `credentials.json` (OAuth client ID)

## Tools
- `execution/upload_to_sheets.py`: Python script using `googleapiclient`.

## Output
- A new Google Sheet (or a new tab in an existing one) containing the full plan.

## Process
1. Initialize Google Sheets service using OAuth.
2. Read the CSV content.
3. Create/Update the spreadsheet.
4. Apply formatting (bold headers, alternating colors).
