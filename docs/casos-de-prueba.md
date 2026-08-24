# Casos de prueba: autenticacion Atenea

| ID | Caso | Precondicion | Resultado esperado |
| --- | --- | --- | --- |
| TC-LOGIN-001 | Mostrar formulario | URL de login disponible | Se ven los campos correo y contrasena. |
| TC-LOGIN-002 | Campos obligatorios | Formulario cargado | Ambos campos incluyen validacion `required`. |
| TC-LOGIN-003 | Inicio con credenciales validas | `ATENEA_USERNAME` y `ATENEA_PASSWORD` configurados | Se envian los datos y la URL deja de ser `/login`. |
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
