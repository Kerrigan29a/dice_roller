import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

await build({
    absWorkingDir: fileURLToPath(new URL('..', import.meta.url)),
    entryPoints: ['assets/app.js'],
    outfile: 'dist/app.js',
    bundle: true,
    minify: true,
    treeShaking: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    legalComments: 'eof',
    logLevel: 'info',
});
