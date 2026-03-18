#!/usr/bin/env python3
import csv
import os
import re

# Source 1: Existing 36
existing_path = "/Users/asiermugica/Downloads/inmobiliarias con mail.csv"
leads = []
if os.path.exists(existing_path):
    with open(existing_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        leads = list(reader)

seen_emails = {l['email'].lower() for l in leads if l.get('email')}
seen_names = {l['nombre'].lower() for l in leads if l.get('nombre')}

# Source 2: Specific User Requests
user_leads = [
    {
        "nombre": "CUNZA Inmobiliaria",
        "email": "info@cunza.es",
        "web": "https://www.cunza.es/nuestra-empresa/",
        "telefono": "976 23 32 08"
    },
    {
        "nombre": "PoppyRooms",
        "email": "miguel@poppyrooms.es",
        "telefono": "628 050 836",
        "direccion": "Miguel Bruned (Administrador)"
    }
]

for l in user_leads:
    if l['email'].lower() not in seen_emails:
        leads.append(l)
        seen_emails.add(l['email'].lower())

# Source 3: Browser Scraped (parsed from earlier turn)
browser_data = """
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
Zaraurbana,http://www.zaraurbana.es/
Gestoría JP Juan Peña - Gestión de herencias y patrimonios,https://gestoriajp.es/
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
Consulting Fincas Fusión,
Dr. Property Inmobiliaria - Plaza San Francisco,http://www.doctorproperty.es/
Residencia Universitas,http://www.residenciauniversitas.com/
"""

# We only add browser ones if they have a website AND we don't have them yet.
for line in browser_data.strip().split("\n"):
    parts = line.split(",")
    if len(parts) >= 1:
        name = parts[0].strip()
        web = parts[1].strip() if len(parts) > 1 else ""
        if name.lower() not in seen_names:
            leads.append({
                "nombre": name,
                "web": web,
                "email": ""
            })
            seen_names.add(name.lower())

# Save current state
final_path = "/Users/asiermugica/Downloads/inmobiliarias con mail.csv"
fieldnames = ['nombre', 'email', 'telefono', 'web', 'direccion', 'valoracion']
with open(final_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction='ignore')
    writer.writeheader()
    writer.writerows(leads)

print(f"✅ Total leads (including browser-names): {len(leads)}")
