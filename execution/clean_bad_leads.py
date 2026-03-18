import csv
import re
import os

input_file = "/Users/asiermugica/Downloads/leads eneko.csv"
output_file = "/Users/asiermugica/Downloads/leads eneko_limpios.csv"

with open(input_file, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    leads = list(reader)

clean_leads = []
for lead in leads:
    email = lead.get('email', '').strip()
    # Validate email with proper regex
    if email and re.match(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$', email):
        clean_leads.append(lead)

with open(output_file, mode='w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=reader.fieldnames)
    writer.writeheader()
    writer.writerows(clean_leads)

# Replace the original file with the clean one
os.replace(output_file, input_file)

print(f"Total leads before cleanup: {len(leads)}")
print(f"Total leads after cleanup (ONLY valid emails): {len(clean_leads)}")
print(f"Removed {len(leads) - len(clean_leads)} bad leads.")
