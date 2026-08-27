# Casos de prueba: autenticacion Atenea

| ID | Caso | Precondicion | Resultado esperado |
| --- | --- | --- | --- |
| TC-LOGIN-001 | Mostrar formulario | URL de login disponible | Se ven los campos correo y contrasena. |
| TC-LOGIN-002 | Campos obligatorios | Formulario cargado | Ambos campos incluyen validacion `required`. |
| TC-LOGIN-003 | Inicio con credenciales validas | `ATENEA_USERNAME` y `ATENEA_PASSWORD` configurados | Se envian los datos y la URL deja de ser `/login`. |
| TC-SIGNUP-001 | Abrir registro | Sitio publico disponible | El enlace Crear cuenta lleva al formulario `/signup`. |
| TC-SIGNUP-002 | Mostrar campos de registro | Formulario cargado | Nombre, apellido, correo y ambas contrasenas son visibles y obligatorios. |
| TC-SIGNUP-003 | Capturar datos de registro | Formulario cargado | Se pueden llenar los datos y aceptar los terminos, sin enviar el alta. |
| TC-SIGNUP-004 | Crear cuenta | `ATENEA_RUN_SIGNUP=true` y datos `ATENEA_SIGNUP_*` unicos | Al enviar el formulario se muestra “Verifica tu email”. |
| TC-SESSION-001 | Reutilizar sesion | Archivo `.auth/atenea.json` vigente | El sitio no redirige a `/login` ni muestra el enlace publico “Ingresar”. |
| TC-HEADER-001 | Navegar a En Vivo | Usuario autenticado y header visible | La opcion En Vivo esta disponible y responde al clic. |
| TC-HEADER-002 | Navegar a Hermes | Usuario autenticado y header visible | La opcion Hermes esta disponible y responde al clic. |
| TC-ACCOUNT-001 | Abrir Mi Perfil | Usuario autenticado y menu de cuenta abierto | Se muestra la seccion Mi Perfil. |
| TC-ACCOUNT-002 | Cerrar sesion | Usuario autenticado y menu de cuenta abierto | La sesion se cierra y se muestra el acceso publico. |

## Ejecucion

```bash
npm run test:e2e
```

Los casos que requieren credenciales o una sesion se omiten de forma segura si
no estan configurados.

Para ejecutar el alta real, usa un correo que no haya sido registrado y agrega
los valores `ATENEA_SIGNUP_NAME`, `ATENEA_SIGNUP_LASTNAME`,
`ATENEA_SIGNUP_EMAIL` y `ATENEA_SIGNUP_PASSWORD` a `.env`. Finalmente define
`ATENEA_RUN_SIGNUP=true`. El caso queda deshabilitado de forma predeterminada
porque crea una cuenta real.
