import os
import csv
import pickle
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

def get_service():
    creds = None
    token_path = 'token_sheets.json'
    if os.path.exists(token_path):
        with open(token_path, 'rb') as token:
            creds = pickle.load(token)
    
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open(token_path, 'wb') as token:
            pickle.dump(creds, token)

    return build('sheets', 'v4', credentials=creds)

def upload_plan():
    service = get_service()
    csv_file = 'LIVIX_ULTIMATE_TIKTOK_90DAY_PLAN.csv'
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        values = list(reader)

    # Use the spreadsheet ID from the user's previous project or create a new one
    # For a "Product of 10", we'll create a new, beautifully named one
    spreadsheet_body = {
        'properties': {
            'title': 'LIVIX - Master Content Plan TikTok (Elite)'
        }
    }
    
    request = service.spreadsheets().create(body=spreadsheet_body, fields='spreadsheetId')
    response = request.execute()
    spreadsheet_id = response.get('spreadsheetId')
    
    print(f"Spreadsheet created: https://docs.google.com/spreadsheets/d/{spreadsheet_id}")

    # Get the first sheet's title dynamically
    sheet_metadata = service.spreadsheets().get(spreadsheetId=spreadsheet_id).execute()
    sheet_title = sheet_metadata['sheets'][0]['properties']['title']
    sheet_id = sheet_metadata['sheets'][0]['properties']['sheetId']

    # Write data
    range_name = f"'{sheet_title}'!A1"
    body = {
        'values': values
    }
    service.spreadsheets().values().update(
        spreadsheetId=spreadsheet_id, range=range_name,
        valueInputOption='RAW', body=body).execute()

    # Basic formatting: Bold header
    batch_update_spreadsheet_request_body = {
        'requests': [
            {
                'repeatCell': {
                    'range': {
                        'sheetId': sheet_id,
                        'startRowIndex': 0,
                        'endRowIndex': 1
                    },
                    'cell': {
                        'userEnteredFormat': {
                            'backgroundColor': {'red': 0.1, 'green': 0.1, 'blue': 0.1},
                            'textFormat': {
                                'foregroundColor': {'red': 1.0, 'green': 1.0, 'blue': 1.0},
                                'bold': True
                            }
                        }
                    },
                    'fields': 'userEnteredFormat(backgroundColor,textFormat)'
                }
            }
        ]
    }
    service.spreadsheets().batchUpdate(
        spreadsheetId=spreadsheet_id, body=batch_update_spreadsheet_request_body).execute()

    print("Data uploaded and formatted successfully.")

if __name__ == "__main__":
    upload_plan()
