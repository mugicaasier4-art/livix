#!/usr/bin/env python3
import csv
import re
import time
import os
import requests
from requests.exceptions import RequestException
from urllib.parse import urlparse

# Source 1: Existing "inmobiliarias con mail.csv" (which has 36)
input_path = "/Users/asiermugica/Downloads/inmobiliarias con mail.csv"
output_path = "/Users/asiermugica/Downloads/inmobiliarias con mail.csv"

# Leads for merging + specific requests
user_leads = [
    {"nombre": "CUNZA Inmobiliaria", "email": "info@cunza.es", "web": "https://www.cunza.es/nuestra-empresa/", "telefono": "976 23 32 08"},
    {"nombre": "PoppyRooms", "email": "miguel@poppyrooms.es", "telefono": "628 050 836", "direccion": "Miguel Bruned (Administrador)"}
]

browser_data = [
    ("Alierta Inmuebles y Gestión S.L.", "http://www.alierta.com/"),
    ("Inmuebles Pérez Guerrero S.l.", "http://www.inmueblesperezguerrero.com/"),
    ("Inmobiliaria Zaragoza Nueva Estación Redpiso", "http://www.redpiso.es/"),
    ("Servicios Inmobiliarios Zgz Sl", "http://www.serviciosinmobiliarioszaragoza.net/"),
    ("Inmobiliaria Martin Aznar S.A.", "http://www.inmobiliariamartinaznar.es/"),
    ("Estudio Actur Sur Sociedad Limitada", "http://www.estudioactursur.es/"),
    ("Tasaciones Del Nordeste", "http://www.tasacionesdelnordeste.com/"),
    ("Espacio Útil 23", "http://www.espacioutil23.es/"),
    ("Fincas E&MM", "http://www.fincasemm.es/"),
    ("Despacho Jurídico Advocatus", "https://legaladvocatus.com/"),
    ("Zaraurbana", "http://www.zaraurbana.es/"),
    ("Gestoría JP Juan Peña", "https://gestoriajp.es/"),
    ("API Nadal Inmobiliaria", "https://www.apinadal.com/"),
    ("Torrero Inmobiliaria Nucleo", "https://inmobiliarianucleo.com/"),
    ("Ardemi Gestión", "https://ardemigestion.com/"),
    ("CASACUATRO", "https://www.casacuatro.com/"),
    ("Fincas Sierra S.L.", "http://www.fincas-sierra.com/"),
    ("I.C.INMUEBLES S.A.", "http://www.icinmuebles.com/"),
    ("ASESORÍA INMOBILIARIA MARCO", "http://www.inmobiliariamarco.com/"),
    ("Api Ferrer", "http://www.apiferrer.com/"),
    ("Marin Y Sender", "http://www.marinysender.com/"),
    ("De Luis Asociados", "http://www.deluisasociados.com/"),
    ("LOOK & FIND ZARAGOZA", "https://www.lookandfind.es/"),
    ("CBRE REAL ESTATE", "https://www.cbre.es/"),
    ("Dr. Property Inmobiliaria", "http://www.doctorproperty.es/"),
    ("Residencia Universitas", "http://www.residenciauniversitas.com/")
]

# Email scraping config
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"}
CONTACT_SLUGS = ["/contacto", "/contacta", "/contact", "/quienes-somos"]
EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

def extract_emails(html):
    found = EMAIL_REGEX.findall(html)
    return list(set(found))

def scrape_website(base_url):
    try:
        r = requests.get(base_url, headers=HEADERS, timeout=5)
        if r.status_code == 200:
            emails = extract_emails(r.text)
            if emails: return emails[0]
    except RequestException as e:
        print(f"  Error scraping {base_url}: {e}")
    return ""

# Main logic
leads = []
if os.path.exists(input_path):
    with open(input_path, newline='', encoding='utf-8') as f:
        leads = list(csv.DictReader(f))

seen_emails = {l['email'].lower() for l in leads if l.get('email')}
seen_names = {l['nombre'].lower() for l in leads if l.get('nombre')}

# Add specific requested ones
for l in user_leads:
    if l['email'].lower() not in seen_emails:
        leads.append(l)
        seen_emails.add(l['email'].lower())

# Add and scrape browser ones
for name, web in browser_data:
    if name.lower() not in seen_names:
        print(f"Scraping {name}...")
        email = scrape_website(web) if web else ""
        leads.append({"nombre": name, "web": web, "email": email})
        seen_names.add(name.lower())

# Clean and Save
with open(output_path, 'w', newline='', encoding='utf-8') as f:
    fn = ['nombre', 'email', 'telefono', 'web', 'direccion', 'valoracion']
    writer = csv.DictWriter(f, fieldnames=fn, extrasaction='ignore')
    writer.writeheader()
    writer.writerows(leads)

print(f"Final lead count: {len(leads)}")
