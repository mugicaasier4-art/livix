#!/usr/bin/env python3
"""
enrich_inmobiliarias_email.py
------------------------------
Lee inmobiliarias_zaragoza.csv, busca el email de las que tienen Web
pero no Email usando Hunter.io Domain Search API (free: 25 búsquedas/mes).
Guarda el resultado en .tmp/inmobiliarias_enriched.csv

Requiere: HUNTER_API_KEY en .env
Instalar:  pip install requests python-dotenv
"""

import csv
import json
import os
import time
from urllib.parse import urlparse

import requests
from dotenv import load_dotenv

# ── Config ──────────────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))

HUNTER_API_KEY = os.getenv("HUNTER_API_KEY")
INPUT_CSV  = os.path.expanduser("~/Downloads/inmobiliarias_zaragoza.csv")
OUTPUT_CSV = os.path.join(BASE_DIR, ".tmp", "inmobiliarias_enriched.csv")
os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)

# ── Helpers ──────────────────────────────────────────────────────────────────
def extract_domain(url: str) -> str | None:
    """Extrae el dominio raíz de una URL."""
    if not url:
        return None
    parsed = urlparse(url if url.startswith("http") else f"https://{url}")
    domain = parsed.netloc or parsed.path
    return domain.replace("www.", "").strip("/") or None


def hunter_domain_search(domain: str) -> str | None:
    """
    Llama a Hunter.io /domain-search y devuelve el primer email encontrado.
    Documentación: https://hunter.io/api-documentation/v2#domain-search
    """
    if not HUNTER_API_KEY:
        raise ValueError("HUNTER_API_KEY no está definido en .env")

    url = "https://api.hunter.io/v2/domain-search"
    params = {
        "domain": domain,
        "api_key": HUNTER_API_KEY,
        "limit": 5,
        "type": "generic",  # emails genéricos tipo info@, contacto@, etc.
    }
    try:
        r = requests.get(url, params=params, timeout=10)
        r.raise_for_status()
        data = r.json()
        emails = data.get("data", {}).get("emails", [])
        if emails:
            # Priorizar emails genéricos (info@, contacto@, etc.)
            generic = [e for e in emails if any(
                e["value"].startswith(p) for p in ("info", "contact", "hola", "inmobiliaria", "oficina")
            )]
            return (generic or emails)[0]["value"]
    except requests.RequestException as e:
        print(f"  ⚠️  Hunter error para {domain}: {type(e).__name__}")
    return None


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    if not HUNTER_API_KEY:
        print("❌ HUNTER_API_KEY no encontrado en .env")
        print("   1. Regístrate gratis en https://hunter.io (25 búsquedas/mes)")
        print("   2. Añade HUNTER_API_KEY=tu_api_key al archivo .env")
        return

    rows = []
    enriched = 0
    skipped = 0

    with open(INPUT_CSV, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames + ["Email_enriched"] if "Email_enriched" not in (reader.fieldnames or []) else reader.fieldnames
        raw_rows = list(reader)

    print(f"📋 {len(raw_rows)} inmobiliarias encontradas en el CSV\n")

    for row in raw_rows:
        name   = row.get("Nombre", "").strip()
        email  = row.get("Email", "").strip()
        web    = row.get("Web", "").strip()

        # Si ya tiene email, no hacemos nada
        if email:
            row["Email_enriched"] = ""
            masked = email.split('@')[0][:3] + '***@' + email.split('@')[1] if '@' in email else '***'
            print(f"  ✅ {name}: ya tiene email → {masked}")
            skipped += 1
            rows.append(row)
            continue

        # Si no tiene web, no podemos buscar
        domain = extract_domain(web)
        if not domain:
            row["Email_enriched"] = ""
            print(f"  ⛔ {name}: sin web, imposible enriquecer")
            rows.append(row)
            continue

        # Buscar con Hunter.io
        print(f"  🔍 {name} ({domain}) → buscando en Hunter.io...")
        found_email = hunter_domain_search(domain)

        if found_email:
            row["Email_enriched"] = found_email
            masked_found = found_email.split('@')[0][:3] + '***@' + found_email.split('@')[1] if '@' in found_email else '***'
            print(f"     ✅ Encontrado: {masked_found}")
            enriched += 1
        else:
            row["Email_enriched"] = ""
            print(f"     ❌ No encontrado")

        rows.append(row)
        time.sleep(0.5)  # Cortesía con la API

    # Guardar resultado
    all_fieldnames = list(raw_rows[0].keys()) + (["Email_enriched"] if "Email_enriched" not in raw_rows[0] else [])
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=all_fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\n📊 Resultado:")
    print(f"   - {skipped} ya tenían email")
    print(f"   - {enriched} emails encontrados por Hunter.io")
    print(f"   - {len(rows) - skipped - enriched} sin email encontrado")
    print(f"\n💾 Guardado en: {OUTPUT_CSV}")


if __name__ == "__main__":
    main()
