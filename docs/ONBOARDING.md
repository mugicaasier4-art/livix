# Onboarding — Livix Development

Guia para configurar el entorno de desarrollo completo de Livix.

## 1. Clonar y arrancar el proyecto

```bash
git clone https://github.com/mugicaasier4-art/livix.git
cd livix
npm install
```

## 2. Variables de entorno

Copia el template y rellena con los valores que te pase Asier por canal seguro (1Password / Signal):

```bash
cp .env.example .env
```

Variables necesarias:
| Variable | Que es |
|----------|--------|
| `VITE_SUPABASE_PROJECT_ID` | ID del proyecto Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Anon key (publica, RLS protege datos) |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_GOOGLE_MAPS_API_KEY` | API key Google Maps |
| `VITE_GA4_MEASUREMENT_ID` | ID de medicion Google Analytics 4 |

## 3. Verificar que funciona

```bash
npm run dev
# Abrir http://localhost:5173
```

## 4. Instalar Claude Code

```bash
npm install -g @anthropic-ai/claude-code
```

Necesitas una cuenta de Anthropic con plan activo. Claude Code leera automaticamente el `CLAUDE.md` del repo con todo el contexto del proyecto.

## 5. Configurar Claude Code (opcional pero recomendado)

### 5.1 Instrucciones personales

Crea `~/.claude/CLAUDE.md` con tus preferencias:

```markdown
# Global Instructions — Eneko

## User Preferences
- Idioma principal: espanol (respuestas en espanol salvo codigo)
- No emojis salvo que se pidan

## Agents
Los agentes en ~/.claude/agents/ se activan automaticamente segun su campo description.
Lee ~/.claude/docs/auto-trigger-reference.md para la tabla completa.

## Rules Engine
Cuando me corrijas, append una regla a "Learned Rules".

---

## Learned Rules
```

### 5.2 Agentes compartidos

Asier te pasara un zip (`eneko-claude-setup.zip`). Descomprime y copia:

```bash
# Desde donde descomprimiste el zip:
mkdir -p ~/.claude/agents ~/.claude/docs ~/.claude/hooks

cp agents/*.md ~/.claude/agents/
cp docs/*.md ~/.claude/docs/
cp hooks/*.sh ~/.claude/hooks/
chmod +x ~/.claude/hooks/*.sh
```

Agentes incluidos:
| Agente | Funcion |
|--------|---------|
| prompt-contracts | Define contratos (goal/constraints/format/failure) antes de implementar |
| stochastic-consensus | Spawn N agentes para analizar un problema por consenso |
| business-idea-evaluator | Evaluador de ideas de negocio |
| reverse-prompting | Fuerza preguntas de clarificacion antes de empezar |
| video-to-action | Extrae pasos ejecutables de videos YouTube |
| context-optimizer | Optimiza tokens en sesiones largas |
| agent-chatrooms | Debate entre agentes para decisiones de arquitectura |
| subagent-verification | Verifica output con agentes revisores |

### 5.3 Settings de Claude Code

Crea `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreCompact": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/pre-compact.sh",
            "timeout": 5000
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "bash ~/.claude/hooks/enrich-prompt.sh",
            "timeout": 3000
          }
        ]
      }
    ]
  },
  "enabledPlugins": {
    "skill-creator@claude-plugins-official": true,
    "frontend-design@claude-plugins-official": true
  },
  "alwaysThinkingEnabled": true,
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

Los hooks hacen:
- **PreCompact:** Indica que preservar al compactar contexto (decisiones, errores, estado)
- **UserPromptSubmit:** Avisa si un prompt es demasiado corto (<12 palabras)

## 6. Git Workflow

```bash
# Siempre empezar desde main actualizado
git checkout main
git pull

# Crear branch
git checkout -b feature/mi-cambio

# Hacer cambios, commits
git add archivos-modificados
git commit -m "feat: descripcion del cambio"

# Push y crear PR
git push -u origin feature/mi-cambio
# Crear PR en GitHub y pedir review
```

**Reglas:**
- Nunca push directo a `main`
- Commits en ingles con prefijo convencional: `feat/`, `fix/`, `chore/`, `docs/`
- PRs obligatorios
- Squash merge

## 7. Recursos utiles

- **Supabase Dashboard:** https://supabase.com/dashboard (pide acceso a Asier)
- **Vercel Dashboard:** https://vercel.com (pide acceso a Asier)
- **Lovable:** https://lovable.dev/projects/a66d4951-9a30-4dfd-8eab-8392f40d7045
- **Documentacion interna:** `/docs/` en el repo
