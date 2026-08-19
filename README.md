# Jira Comentario Diario

Proyecto local para publicar un comentario diario en Jira sin depender de `rehus-selenium-qa`.

## Que hace

- Reutiliza una sesion autenticada de Jira guardada localmente.
- Abre el board filtrado por tu etiqueta.
- Si defines `JIRA_ISSUE_KEY`, comenta directamente en ese ticket.
- Si no defines `JIRA_ISSUE_KEY`, toma el primer ticket visible del board y comenta ahi.
- Evita duplicar el comentario del dia si encuentra la marca `[YYYY-MM-DD]`.

## Instalacion

```bash
cd /Users/mari/Desktop/jira-comentario-diario
cp .env.example .env
npm install
```

## Primer uso

Guarda una sesion autenticada:

```bash
npm run auth
```

Se abrira Chromium. Inicia sesion en Atlassian y, cuando veas el board correcto, vuelve a la terminal y presiona `Enter`.

## Publicar comentario

```bash
npm run comment
```

## Plantilla del comentario

Edita [templates/daily-comment.md](/Users/mari/Desktop/jira-comentario-diario/templates/daily-comment.md:1).

Placeholders disponibles:

- `{date}` ejemplo `06/07/2026`
- `{iso_date}` ejemplo `2026-07-06`
- `{weekday}` ejemplo `lunes`
- `{month}` ejemplo `julio`
- `{year}` ejemplo `2026`
- `{board_url}` la URL configurada

## Variables importantes

- `JIRA_ISSUE_KEY`: si quieres comentar siempre en un ticket fijo.
- `JIRA_HEADED=true`: muestra el navegador al publicar el comentario.
- `JIRA_ALLOW_DUPLICATE=true`: permite publicar aunque ya exista la marca del dia.

## Automatizar diario

En macOS puedes programarlo con `cron` o `launchd`. Ejemplo simple con `cron`:

```bash
30 9 * * 1-5 cd /Users/mari/Desktop/jira-comentario-diario && /opt/homebrew/bin/npm run comment >> /Users/mari/Desktop/jira-comentario-diario/cron.log 2>&1
```

Antes de programarlo, valida manualmente que el flujo publica el comentario en el ticket correcto.
