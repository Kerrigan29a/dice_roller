# Dice Roller

Tres implementaciones de la misma PWA estática para comparar las decisiones de diseño y el código de Elm, Gleam y Go.

| Implementación | Fuentes | Ejecución en el navegador |
|---|---|---|
| Elm | `elm/` | JavaScript |
| Gleam | `gleam/` | JavaScript |
| Go | `go/` | WebAssembly |

La publicación conjunta usa las rutas `/dice_roller/elm/`, `/dice_roller/gleam/` y `/dice_roller/go/` de `www.javierescalada.es`.

Para compilar necesitas `make`, Python 3, [uv](https://docs.astral.sh/uv/) y Go 1.24 o posterior. Las compilaciones de Elm y Gleam instalan sus herramientas y dependencias locales; la primera ejecución necesita conexión.

`make build` compila las tres aplicaciones y monta la portada y sus subdirectorios en `dist/`. `make run` sirve ese resultado en <http://127.0.0.1:4176/>; se puede cambiar con `PORT=…`. Cada aplicación conserva su propio proceso de compilación y puede compilarse con `make -C elm build`, por ejemplo.

La portada está en `site/`. Los enlaces son relativos y cada aplicación tiene su propio ámbito de service worker. GitHub Pages publica el contenido compilado de `gh-pages`, sin Jekyll; las rutas sin barra final redirigen a los directorios correspondientes.

Para publicar cambios, haz commit y push de `main`, y ejecuta `make publish`. La publicación crea un commit con el contenido de `dist/` en `gh-pages`, sin cambiar de rama ni sobrescribir el checkout. Si la rama remota cambia mientras tanto, Git rechaza la publicación en lugar de forzarla.

Para comprobar una publicación real en Chromium y Firefox, después de compilar: `gleam/.venv/bin/node scripts/check_site.mjs https://www.javierescalada.es/dice_roller/`. Comprueba la portada, las redirecciones, el arranque de las tres aplicaciones, sus service workers independientes y la recarga sin conexión.

`make clean-all` (o `make cleanall`) elimina las compilaciones, herramientas y dependencias locales para archivar el proyecto.
