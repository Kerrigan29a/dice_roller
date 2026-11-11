# Dice Roller en Gleam

PWA estática portada desde `elm_pwa`. Gleam compila a JavaScript y Lustre renderiza la interfaz en el navegador. esbuild empaqueta los módulos, elimina código sin usar y minifica el resultado. `dist/` se puede servir desde un alojamiento estático, también bajo un subdirectorio.

```sh
make bootstrap  # Gleam 1.19.2 en .tools/gleam
make run        # http://127.0.0.1:4174
```

El instalador usa el binario oficial y comprueba su SHA-256. Si ya tienes el archivo descargado, ejecuta `sh scripts/install-gleam.sh /ruta/al/archivo.tar.gz`. Se necesitan `make`, Python 3.11 o posterior y `uv`. El primer build instala Node en `.venv/` y las dependencias npm en `node_modules/`. Node se usa para construir y probar; la aplicación publicada solo necesita archivos estáticos.

`make build` genera `dist/`; `make run PORT=8000` permite elegir otro puerto. `make check` comprueba los tipos de Gleam sin empaquetar la aplicación.

Para archivar el proyecto, `make clean-all` (alias `make cleanall`) elimina builds, herramientas locales, el entorno virtual, dependencias npm, informes de pruebas, cachés de Python y archivos `.DS_Store`. Conserva las fuentes, los recursos, Git y los archivos de bloqueo necesarios para reconstruirlo con `make run`.

```sh
make check
uv run --locked -- npm ci
uv run --locked -- npm exec -- playwright install chromium firefox
make test
```

La suite de comportamiento se ejecuta en Chromium y Firefox: teclado, móvil, temas, modos de resultado, guardado, conflictos entre pestañas, enlaces sin almacenamiento local y funcionamiento offline. Incluye una instantánea con resultados fijos para detectar cambios accidentales en el contrato de reproducción.

Las pruebas de enlaces usan procesos de ambos navegadores con almacenamiento independiente y zonas horarias distintas. Generan enlaces mediante la interfaz, comparan dados, palabras, pictogramas y fechas, continúan la secuencia directamente y vuelven a abrir la dirección resultante en el otro navegador.

## Lenguaje visual

La interfaz usa CSS propio y la dirección azul grisácea elegida a partir de las muestras de `design-previews/`. Las áreas se distinguen mediante superficies y separadores: controles sobre una superficie neutra y resultado sobre un tono azul grisáceo. Los fondos son claros en el tema claro y oscuros en el oscuro.

DM Sans se usa para el texto general, IBM Plex Mono para controles y metadatos, e Inter para los resultados protagonistas. Las fuentes y sus licencias se sirven desde `assets/` y se incluyen en la caché offline. Los botones tienen esquinas suavizadas de cuatro píxeles. En escritorio, controles y resultado comparten una zona y el historial ocupa el ancho inferior; en móvil se apilan, con una escala más compacta para mantener el resultado cerca de la acción.

La versión acompaña al nombre de la aplicación. En escritorio, compartir y cambiar el tema forman un grupo de acciones discretas; el borrado del historial se separa con espacio y un divisor. «Theme: System» es un único selector nativo: la etiqueta, el valor y la flecha quedan dentro de su zona de interacción, con foco visible al usar el teclado. En móvil, tema y borrado se agrupan en «More ⋯», y la versión queda bajo el nombre. Las pestañas mantienen ocho píxeles de espacio vertical en ambos tamaños.

El dado de la cabecera es una copia del original transparente de `assets_extra/`, reducida a 144 píxeles de ancho para mostrarla a 36 píxeles (28 en móvil) con resolución suficiente en pantallas de alta densidad. Conserva sus proporciones y está disponible offline.

Los pictogramas del historial se muestran completos y se distribuyen en varias líneas cuando hace falta.

Las muestras de `design-previews/` son exploraciones independientes y no se publican en `dist/`.

## Enlaces y almacenamiento

Un enlace generado por Gleam contiene un archivo JSON con `format: "gleam-dice-roller"`, `version: 2`, semilla inicial, acciones con sus fechas y tema. La semilla y las acciones reconstruyen el historial; los resultados no se obtienen de `Math.random` ni del estado previo del navegador receptor.

El formato 2 usa `prng` 6.0.0 y los 4.180 pictogramas del catálogo de Game-icons.net actualizado el 23 de abril de 2026, ordenados por ruta. `manifest.toml` conserva la versión resuelta y `gleam.toml` restringe `prng` a 6.0.0. Se mantiene un único catálogo y solo se acepta el formato actual; los enlaces del formato 1 ya no se abren. Durante la etapa 0.x no se mantiene retrocompatibilidad: la reproducibilidad se verifica entre instancias de la versión actual.

La aplicación mantiene un único estado de trabajo. Al abrir un enlace válido, su contenido pasa a ser el estado actual y sustituye el guardado local. Se puede continuar directamente: cada resultado nuevo, cambio de tema o borrado actualiza `?state=…` en la dirección sin añadir entradas al historial del navegador. «Share» ofrece ese mismo enlace completo. Abrir un enlace inválido o de un formato más reciente conserva el guardado anterior y ofrece volver a los resultados guardados.

El guardado local permite reanudar el trabajo al entrar sin un enlace. La reproducción y la continuación también funcionan sin almacenamiento local, porque la dirección contiene el estado completo. Si otra pestaña ha guardado resultados más recientes, se conserva su guardado y se avisa de que los resultados de la pestaña actual pueden conservarse mediante su enlace.

Los enlaces de Elm no se interpretan como enlaces de Gleam. Las claves locales usan el prefijo `gleam-dice-roller` para que ambas implementaciones puedan compararse en el mismo origen sin compartir guardados ni preferencias. Se han retirado las copias locales con identificadores `?session=…` y el paso «Continue as a copy» que existían en Elm.

## Comparar con Elm

- `session.gleam` concentra el dominio en un tipo opaco. Grabar una acción y reconstruir un historial pasan por la misma función. `archive.gleam` define un formato propio para esa reproducción.
- En `gleam_pwa.gleam`, Lustre ejecuta los efectos del navegador mediante funciones tipadas. Foco, portapapeles y diálogos se pueden llamar directamente a través de la FFI. Esa integración es más directa que los puertos del original, aunque el compilador de Gleam confía en las firmas declaradas para JavaScript.
- Elm proporciona `elm/random`; Gleam utiliza la biblioteca de su ecosistema [prng](https://prng.hexdocs.pm/prng/random.html). Los dados explosivos y las selecciones se componen con `then`, `map` y `fixed_size_list`; el dominio avanza la semilla con `step`. `prng` se inspira en `elm/random`, pero aquí se usa su API directamente: se ha eliminado el generador y la FFI propios que intentaban reproducir los enlaces de Elm.
- Lustre también usa modelo, actualización, vista y efectos. Esa organización pertenece al framework elegido para Gleam. La interoperabilidad con el navegador se hace mediante FFI tipada y efectos de Lustre; no requiere recrear el sistema de puertos de Elm.
- Elm integra `--optimize` en su compilador. Aquí [esbuild](https://esbuild.github.io/api/) optimiza la distribución del JavaScript generado. Añade una herramienta al build y elimina los módulos sin usar; no equivale a todas las optimizaciones específicas de Elm ni demuestra por sí solo una ventaja de rendimiento.

Medición del 11 de noviembre de 2026, con Gleam 1.19.2 y esbuild 0.28.2. Se suman todos los archivos `.js`/`.mjs` publicados, incluido el service worker; las imágenes y las fuentes quedan fuera. «gzip» suma la compresión de cada archivo por separado con nivel 9.

| Variante | Archivos JS | Sin comprimir | gzip |
|---|---:|---:|---:|
| Elm, `dist/` existente construido con `--optimize` | 3 | 355 058 B | 71 412 B |
| Gleam, bundle minificado | 2 | 151 366 B | 45 519 B |
| Elm anterior pasado también por el minificador de esbuild | 3 | 141 233 B | 44 316 B |

La última fila es un cálculo de tamaño sobre el JavaScript de Elm, sin modificar su proyecto ni validar esa variante en el navegador. Permite ver que la reducción frente al build original se debe en buena parte al empaquetado y la minificación: con minificación adicional, Elm resulta algo menor en esta medición. No se han medido tiempos de ejecución ni memoria.
