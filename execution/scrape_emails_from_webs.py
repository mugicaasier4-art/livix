#!/usr/bin/env python3
"""
scrape_emails_from_webs.py
---------------------------
Lee inmobiliarias_zaragoza_googlemaps.csv, visita la web de cada una
(priorizando /contacto, /contacta, /contact) y extrae emails via regex.
No necesita API key — scraping directo.

Salida: ~/Downloads/inmobiliarias_con_email.csv
"""

import csv
import re
import time
import os
from urllib.parse import urljoin, urlparse

import requests
from requests.exceptions import RequestException

# ── Config ─────────────────────────────────────────────────────────────────
INPUT_CSV  = os.path.expanduser("~/Downloads/inmobiliarias_zaragoza_googlemaps.csv")
OUTPUT_CSV = os.path.expanduser("~/Downloads/inmobiliarias_con_email.csv")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-ES,es;q=0.9",
}
TIMEOUT = 8
DELAY   = 0.5   # segundos entre requests

# Sufijos de contacto para probar
CONTACT_SLUGS = ["/contacto", "/contacta", "/contactanos", "/contact", "/quienes-somos", "/sobre-nosotros"]

EMAIL_REGEX = re.compile(
    r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
)

# Dominios/patrones que NO son emails reales
IGNORE_PATTERNS = [
    "example.com", "wixpress.com", "sentry.io", "yourdomain",
    ".png", ".jpg", ".gif", ".svg", "schema.org",
]


def is_valid_email(email: str) -> bool:
    email = email.lower()
    return not any(p in email for p in IGNORE_PATTERNS)


def fetch(url: str) -> str | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)
        if r.status_code == 200 and "text" in r.headers.get("content-type", ""):
            return r.text
    except RequestException:
        pass
    return None


def extract_emails(html: str) -> list[str]:
    found = EMAIL_REGEX.findall(html)
    return [e for e in set(found) if is_valid_email(e)]


def best_email(emails: list[str]) -> str:
    """Prioriza emails genéricos tipo info@, contacto@, admin@..."""
    priority = ("info", "contacto", "contact", "hola", "inmobiliaria", "oficina", "admin")
    for prefix in priority:
        for e in emails:
            if e.startswith(prefix):
                return e
    return emails[0] if emails else ""


def scrape_website(base_url: str) -> str:
    """Intenta homepage + páginas de contacto y devuelve el mejor email."""
    all_emails: list[str] = []

    # 1. Homepage
    html = fetch(base_url)
    if html:
        all_emails.extend(extract_emails(html))

    # Si ya tenemos algo bueno, paramos
    if all_emails:
        return best_email(all_emails)

    # 2. Páginas de contacto
    parsed = urlparse(base_url)
    base = f"{parsed.scheme}://{parsed.netloc}"
    for slug in CONTACT_SLUGS:
        url = base + slug
        html = fetch(url)
        if html:
            emails = extract_emails(html)
            if emails:
                return best_email(emails)
        time.sleep(0.2)

    return ""


# ── Main ────────────────────────────────────────────────────────────────────
def main():
    with open(INPUT_CSV, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    # Filtrar solo filas con web y dentro de España (excluir resultados EEUU, etc.)
    spain_rows = []
    for r in rows:
        web  = r.get("web", "").strip()
        addr = r.get("direccion", "").lower()
        # Quedarnos con webs válidas y que sean de España o sin dirección clara
        skip_countries = ["md ", "california", "texas", "new york", ", al ", "ontario"]
        if web and not any(c in addr for c in skip_countries):
            spain_rows.append(r)

    print(f"📋 {len(rows)} inmobiliarias en CSV")
    print(f"🇪🇸 {len(spain_rows)} con web válida (filtrando resultados fuera de España)\n")

    found_count = 0
    already_count = 0

    for i, row in enumerate(spain_rows, 1):
        nombre = row.get("nombre", "—")
        web    = row.get("web", "").strip()
        email_existente = row.get("email", "").strip()

        if email_existente:
            print(f"  [{i}/{len(spain_rows)}] ✅ {nombre}: ya tiene → {email_existente}")
            already_count += 1
            continue

        print(f"  [{i}/{len(spain_rows)}] 🔍 {nombre} ({web})")
        found = scrape_website(web)

        if found:
            row["email"] = found
            print(f"     ✅ {found}")
            found_count += 1
        else:
            print(f"     ❌ No encontrado")

        time.sleep(DELAY)

    # Guardar resultado (solo filas España)
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=spain_rows[0].keys())
        writer.writeheader()
        writer.writerows(spain_rows)

    total_with_email = sum(1 for r in spain_rows if r.get("email", "").strip())
    print(f"\n📊 Resultado:")
    print(f"   - {already_count} ya tenían email")
    print(f"   - {found_count} emails encontrados ahora")
    print(f"   - {total_with_email} en total con email")
    print(f"\n💾 Guardado en: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
