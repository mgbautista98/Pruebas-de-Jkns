# Atenea Login Session

Proyecto local para guardar y validar una sesion autenticada en Atenea Conocimientos usando Playwright.

## Que hace

- Abre Chromium en la pagina de login de Atenea.
- Te permite iniciar sesion manualmente.
- Guarda la sesion autenticada en un archivo local.
- Reutiliza esa sesion para validar que el acceso siga activo.

## Instalacion

```bash
cd /Users/mari/Desktop/jira-comentario-diario
cp .env.example .env
npm install
```

Al instalar dependencias se configura Husky. Antes de cada `git commit` se
ejecuta `npm run check:syntax`, que valida la sintaxis de los archivos
JavaScript sin abrir el navegador ni crear cuentas.

## Configuracion

Edita `Desktop/jira-comentario-diario/.env` con estos valores:

```bash
ATENEA_LOGIN_URL=https://ateneaconocimientos.com/
ATENEA_EXPECTED_URL=https://ateneaconocimientos.com/
ATENEA_AUTH_FILE=.auth/atenea.json
ATENEA_HEADED=false
ATENEA_USERNAME=tu-correo@ejemplo.com
ATENEA_PASSWORD=tu-contrasena
```

- `ATENEA_LOGIN_URL`: pagina que se abrira para iniciar sesion.
- `ATENEA_EXPECTED_URL`: pagina que se usara para validar la sesion guardada.
- `ATENEA_AUTH_FILE`: archivo donde se guardara la sesion.
- `ATENEA_HEADED=true`: muestra el navegador tambien en la validacion.
- `ATENEA_USERNAME` y `ATENEA_PASSWORD`: opcionales. Si los defines, el script
  abre el formulario, escribe las credenciales y pulsa **INGRESAR**.

## Guardar sesion

```bash
npm run login
```

Flujo esperado:

- Se abrira Chromium en `ATENEA_LOGIN_URL`.
- Si configuraste `ATENEA_USERNAME` y `ATENEA_PASSWORD`, el inicio se envia
  automaticamente. Si no, inicias sesion manualmente.
- Cuando ya estes dentro de Atenea, vuelves a la terminal y presionas `Enter`.
- El script guarda la sesion en `.auth/atenea.json`.

Si Atenea solicita un segundo factor, CAPTCHA o muestra un mensaje de error,
resuelvelo en el navegador antes de presionar `Enter`.

Tambien puedes usar:

```bash
npm run auth
```

## Validar sesion

```bash
npm run verify
```

Este comando:

- carga `.auth/atenea.json`
- abre `ATENEA_EXPECTED_URL`
- reutiliza la sesion guardada
- imprime la URL actual para ayudarte a confirmar que la sesion funciona

## Jenkins

El `Jenkinsfile` actual instala dependencias y ejecuta:

```bash
npm run verify
```

Para que Jenkins pueda validar la sesion, el servidor debe tener disponible el archivo configurado en `ATENEA_AUTH_FILE`.
