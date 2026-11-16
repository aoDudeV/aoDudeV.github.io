import { defineConfig } from 'astro/config';

// Site utilisateur GitHub Pages : il est servi à la racine du domaine.
// Toutes les URL canoniques utilisent donc le domaine sans sous-dossier.
export default defineConfig({
  site: 'https://aodudev.github.io',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
});
