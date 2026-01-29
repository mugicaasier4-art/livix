# Directive: Export TikTok Plan to Sheet

## Goal
Export the defined TikTok Content Plan into a structured spreadsheet format (CSV/Google Sheet) for easier execution and tracking.

## Inputs
- `tiktok_content_master_plan.md` (Source of truth)

## Tools
- `execution/generate_tiktok_csv.py`

## Output
- `tiktok_content_plan.csv` (to be imported into Google Sheets)

## Edge Cases
- If Google API credentials are missing, default to CSV generation.
