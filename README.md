# Dice Roller

Una PWA estática de dados, palabras y pictogramas, implementada en tres lenguajes para comparar sus decisiones de diseño. La [portada](https://www.javierescalada.es/dice_roller/) enlaza a [Elm](https://www.javierescalada.es/dice_roller/elm/), [Gleam](https://www.javierescalada.es/dice_roller/gleam/) y [Go](https://www.javierescalada.es/dice_roller/go/).

| Implementación | Ejecución | Interfaz y estado | Generador |
|---|---|---|---|
| Elm | JavaScript | `Browser.element`, modelo/update/view, comandos y puertos | `elm/random` |
| Gleam | JavaScript | Lustre, tipos algebraicos, efectos y FFI | `prng` 6.0.0 |
| Go | WebAssembly | DOM directo mediante `syscall/js`, plantillas `html/template`, estado propio | `math/rand/v2`, PCG |

Las tres incluyen dados personalizados y explosivos, modos All/Max/Min/Sum, tablas Mythic 2e con búsqueda, 4.180 pictogramas, historial con repetición, temas claro/oscuro/sistema y uso sin conexión. Cada resultado, cambio de tema o borrado actualiza la URL; Share expone ese mismo enlace. El enlace contiene la semilla y las acciones necesarias para reproducirlo y continuar en otro navegador.

Los generadores son nativos de cada lenguaje: las secuencias pueden diferir entre implementaciones. Los formatos de enlace y las claves de almacenamiento son propios de cada versión; un enlace reproduce resultados en la implementación que lo generó. Hay un único estado guardado por implementación, sin copias ni identificadores de sesión. Los enlaces inválidos o incompatibles conservan los resultados previamente guardados. No se mantiene compatibilidad con los proyectos anteriores.

## Estructura común

- `assets/`: una sola copia de CSS, fuentes, imágenes y catálogo SVG, también en `dist/assets/` al publicar. Se conservan las licencias de fuentes e iconos.
- `data/tables.json`: origen único de las tablas. `scripts/generate_tables.py` genera constantes nativas para los tres compiladores; esos archivos no se mantienen ni se versionan a mano.
- `VERSION`: versión de la aplicación, compartida por las tres interfaces.
- `web/`: HTML, manifest y plantilla de service worker comunes; `browser.mjs` contiene únicamente adaptación de APIs del navegador (almacenamiento, URL, clipboard, foco, catálogo y actualización). Las reglas, el generador y la reproducción permanecen en cada lenguaje.
- `elm/`, `gleam/`, `go/`: fuentes y manifiestos específicos de sus lenguajes. Go no ejecuta un servidor.
- `site/`: portada. `scripts/`, pruebas, CI y herramientas de desarrollo se mantienen una sola vez en la raíz.

Cada aplicación conserva su propio ámbito de service worker y su propia caché para poder funcionar sin conexión de forma independiente. Las URLs de recursos apuntan a la carpeta común; no hay tres copias de los assets en la publicación.

## Desarrollo

Necesitas `make`, Python 3 y [uv](https://docs.astral.sh/uv/). No necesitas instalar globalmente Node, Elm, Gleam ni Go.

```sh
make bootstrap  # Node 24.19.0, Elm 0.19.1, esbuild, Gleam 1.19.2 y Go 1.27.4
make build      # compila las tres aplicaciones y monta dist/
make run        # http://127.0.0.1:4176/; configurable con PORT=…
```

Gleam y Go se descargan de sus distribuciones oficiales a `.tools/`, con versión y SHA-256 fijados. Node se instala en la única `.venv` mediante uv; las herramientas de JavaScript están fijadas en `package-lock.json`. Se puede indicar otro compilador con `GLEAM=/ruta/gleam` o `GO=/ruta/go`.

`make build-elm`, `make build-gleam` y `make build-go` compilan un solo lenguaje en `build/`. `make build` monta la web completa. Elm usa `--optimize` y esbuild; Gleam usa su destino JavaScript y esbuild; Go usa el destino `js/wasm` con `-trimpath -ldflags="-s -w"`. El `wasm_exec.js` procede del mismo SDK que compiló el binario.

```sh
make browsers   # instala Chromium y Firefox para las pruebas
make test       # pruebas nativas de Go y batería común de navegador
```

Las pruebas comunes cubren teclado, móvil, temas, validación, historial, URLs, almacenamiento, clipboard y uso sin conexión. Comprueban la reproducción y continuación Chromium → Firefox y Firefox → Chromium con almacenamientos y zonas horarias independientes. Los resultados de referencia por generador están en `tests/fixtures/golden.json`.

`make clean` borra compilaciones y datos generados. `make clean-all` o `make cleanall` elimina además `.tools`, `.venv`, `node_modules`, informes y cachés locales para archivar el proyecto. Se conservan fuentes, assets originales y archivos de bloqueo.

## Publicación

Haz commit y push de `main`, y ejecuta `make publish`. Publica solamente `dist/` en `gh-pages`, sin cambiar el checkout ni forzar la rama remota. GitHub Pages sirve esa rama sin Jekyll. Los enlaces son relativos y las rutas sin barra final redirigen a sus directorios.

Para comprobar las rutas públicas en Chromium y Firefox:

```sh
uv run --locked -- node scripts/check_site.mjs https://www.javierescalada.es/dice_roller/
```
