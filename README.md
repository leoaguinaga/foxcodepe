# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

### Leads del panel de cliente

Los endpoints de servidor `/api/leads` (cotización) y `/api/contact` (contacto)
registran directamente en la tabla `Lead` del panel actual. Ambos ingresan con
estado `NEW`, prioridad `MEDIUM` y sin producto, visibles en el espacio FoxCode.
Las cotizaciones conservan servicio, plan, adicionales, presupuesto y página
como texto en el mensaje; la fecha solicitada queda como próxima acción para
confirmar la reunión. Contacto conserva `contactMessageId` como alias de `leadId`.

Configura `PANEL_DATABASE_URL` con la conexión PostgreSQL del panel, solo en el
servidor de la landing. Por compatibilidad se usa `DATABASE_URL` si no está
configurada, pero debe apuntar al esquema actual del panel. No se requieren
migraciones. En producción hay que configurar esta variable y desplegar la
landing. Los registros históricos de la base anterior no se migran con este cambio.

Verificación local con la landing iniciada en el puerto 4397:

```sh
npm run dev -- --host 127.0.0.1 --port 4397
node scripts/test-lead-integration.mjs
```

La prueba usa únicamente PostgreSQL local, comprueba cotización/contacto y
validación, y elimina sus registros de prueba. `TEST_LANDING_URL` permite
seleccionar otro puerto local.
