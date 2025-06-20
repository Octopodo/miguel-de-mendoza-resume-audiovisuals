// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    site: 'https://Octopodo.github.io',
    base: '/cv-2025',
    output: 'static',
    outDir: 'docs',
    build: {
        inlineStylesheets: 'always',
    },
    i18n: {
        defaultLocale: 'es',
        locales: ['es', 'en'],
        routing: {
            prefixDefaultLocale: false,
        },
    },
});
