---
description: Proceso para desplegar cambios a producción (Vercel)
---

# Despliegue a Producción

Este workflow describe el proceso completo para subir cambios a la web live de Livix.

## Pasos

1. **Sincronizar con remoto** (evitar conflictos con Asier):
```bash
git pull origin main --rebase
```

2. **Añadir cambios al staging**:
```bash
git add .
```

3. **Crear commit con mensaje descriptivo**:
```bash
git commit -m "descripción del cambio"
```

4. **Subir a GitHub** (esto dispara el despliegue en Vercel):
// turbo
```bash
git push origin main
```

5. **Verificar despliegue en Vercel** (esperar ~30 segundos y abrir la web live).

## Nota Importante
El paso 4 (`git push`) requiere autenticación de GitHub. Si falla, el usuario debe ejecutarlo manualmente en su terminal.
