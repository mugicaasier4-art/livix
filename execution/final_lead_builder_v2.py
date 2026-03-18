#!/usr/bin/env python3
import csv
import re
import time
import os
import requests
from requests.exceptions import RequestException

input_path = "/Users/asiermugica/Downloads/inmobiliarias con mail.csv"
output_path = "/Users/asiermugica/Downloads/inmobiliarias con mail.csv"

# More comprehensive list from browser turn 217
browser_text = """
Alierta Inmuebles y Gestión S.L.,http://www.alierta.com/
Inmuebles Pérez Guerrero S.l.,http://www.inmueblesperezguerrero.com/
Inmobiliaria Zaragoza Nueva Estación Redpiso,http://www.redpiso.es/
Servicios Inmobiliarios Zgz Sl,http://www.serviciosinmobiliarioszaragoza.net/
Inmobiliaria Martin Aznar S.A.,http://www.inmobiliariamartinaznar.es/
Estudio Actur Sur Sociedad Limitada,http://www.estudioactursur.es/
Tasaciones Del Nordeste - Tasadores en Zaragoza,http://www.tasacionesdelnordeste.com/
Espacio Útil 23,http://www.espacioutil23.es/
Fincas E&MM,http://www.fincasemm.es/
Despacho Jurídico Advocatus,https://legaladvocatus.com/
Mónica Leticia Ariza Rodríguez,https://bemoclean.es/
Zaraurbana,http://www.zaraurbana.es/
Gestoría JP Juan Peña,https://gestoriajp.es/
API Nadal Inmobiliaria,https://www.apinadal.com/
Torrero Inmobiliaria Nucleo,https://inmobiliarianucleo.com/
Ardemi Gestión,https://ardemigestion.com/
CASACUATRO,https://www.casacuatro.com/
Fincas Sierra S.L.,http://www.fincas-sierra.com/
I.C.INMUEBLES S.A.,http://www.icinmuebles.com/
ASESORÍA INMOBILIARIA MARCO,http://www.inmobiliariamarco.com/
Api Ferrer,http://www.apiferrer.com/
Marin Y Sender,http://www.marinysender.com/
De Luis Asociados Promociones E Inmuebles S.A.,http://www.deluisasociados.com/
LOOK & FIND ZARAGOZA,https://www.lookandfind.es/
INMOBILIARIA ALMOZARA S.L.,
Tu Piso Zaragoza,
Fleta 2002,
Publipisos,
CBRE REAL ESTATE,https://www.cbre.es/
Inmoaragon,
Las Torres,
Consulting Fincas Fusión,
Complejo Inmobiliario Inbisa Empresarium,
ZARAEXIM S.L.,
Abecid Sl,
Pemajo Sa,
Inmobiliaria Fincas Olympo,
Aldebor Inmuebles Sl,
Rabal,
Europiso Blanber,
Imago Gestión,
"""

# Scraper part
HEADERS = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"}
EMAIL_REGEX = re.compile(r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}")

def scrape_website(url):
    if not url or 'http' not in url: return ""
    try:
        r = requests.get(url, headers=HEADERS, timeout=5)
        if r.status_code == 200:
            found = EMAIL_REGEX.findall(r.text)
            if found: return list(set(found))[0]
    except RequestException as e:
        print(f"  Error scraping {url}: {e}")
    return ""

leads = []
if os.path.exists(input_path):
    with open(input_path, newline='', encoding='utf-8') as f:
        leads = list(csv.DictReader(f))

seen_names = {l['nombre'].lower() for l in leads if l.get('nombre')}
seen_emails = {l['email'].lower() for l in leads if l.get('email')}

for line in browser_text.strip().split("\n"):
    parts = line.split(",")
    name = parts[0].strip()
    web = parts[1].strip() if len(parts) > 1 else ""
    if name.lower() not in seen_names:
        print(f"Adding/Scraping {name}...")
        email = scrape_website(web)
        leads.append({"nombre": name, "web": web, "email": email})
        seen_names.add(name.lower())

with open(output_path, 'w', newline='', encoding='utf-8') as f:
    fn = ['nombre', 'email', 'telefono', 'web', 'direccion', 'valoracion']
    writer = csv.DictWriter(f, fieldnames=fn, extrasaction='ignore')
    writer.writeheader()
    writer.writerows(leads)

print(f"Final lead count: {len(leads)}")
