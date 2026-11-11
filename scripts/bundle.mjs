import { build, transform } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const language = process.argv[2];
await mkdir(`build/${language}`, { recursive: true });
if (language === 'elm') {
    const source = await readFile('build/elm/main.js', 'utf8');
    const { code } = await transform(source, { minify: true, target: 'es2022', legalComments: 'eof' });
    await writeFile('build/elm/elm.js', code);
}
await build({
    entryPoints: [`${language}/src/main.mjs`],
    outfile: `build/${language}/app.js`,
    bundle: true, minify: true, treeShaking: true, format: 'esm', platform: 'browser',
    target: 'es2022', legalComments: 'eof', logLevel: 'info',
});
