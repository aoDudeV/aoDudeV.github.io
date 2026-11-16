# Le blog du fil rouge — version statique

Ce dépôt contient la version statique du blog, construite avec **Astro** et
publiée sur **GitHub Pages** à l’adresse <https://aodudev.github.io/>.

Il remplace l’ancien site généré par Hexo. Le laboratoire dynamique
Docker/K3s (`mon-blog`) reste séparé : ce site ne contient ni serveur Node, ni
base SQLite, ni interface d’administration.

## Contenu

- `src/data/articles-base.js` et `src/data/hexo-articles.json` : les 105
  articles (102 archives Hexo + 3 notes du fil rouge Next.js), avec leurs blocs
  de contenu.
- `src/data/articles.js` : normalisation des articles, catégories, tags,
  années et réécriture des anciens chemins `/blog/...`.
- `src/data/redirects.json` : 292 redirections statiques pour les anciennes URL
  Hexo (articles, catégories, tags, archives et pagination).
- `src/pages/` : accueil, liste des articles, pages d’article, catégories,
  tags, archives, à propos, 404, RSS et sitemap.
- `src/pages/[...chemin].astro` : génère les pages de redirection à partir de
  `src/data/redirects.json`.
- `public/images/hexo/` : les 56 médias utilisés par les articles (environ
  22 Mo).
- `public/.nojekyll` : évite tout traitement Jekyll des fichiers générés.
- `.github/workflows/deploy.yml` : construction et déploiement automatiques sur
  GitHub Pages.

## Thème clair / sombre

Le bouton dans l’en-tête bascule entre le thème clair et le thème sombre. Au
premier passage, le site suit la préférence du système ; le choix est ensuite
mémorisé dans le navigateur (`localStorage`, clé `fil-rouge-theme`). Le thème
est appliqué avant l’affichage de la page pour éviter tout flash de couleur.

## Développement local

Prérequis : **Node.js 22.23.4 ou plus récent** (Astro 7.4.12 l’exige).

```bash
npm install
npm run dev
```

Le site est alors disponible sur <http://localhost:4321/>.

Pour vérifier la version de production :

```bash
npm run build
npm run preview
```

Le résultat est écrit dans `dist/`.

## Déploiement

Le workflow GitHub Actions se déclenche à chaque push sur `master`, ou
manuellement depuis l’onglet **Actions** (bouton « Run workflow »).

Dans **Settings → Pages**, la source doit être réglée sur
**GitHub Actions** (et non « Deploy from a branch »). Le workflow utilise le
`GITHUB_TOKEN` fourni automatiquement par GitHub : aucune clé personnelle n’est
nécessaire.

Le site est servi à la racine du domaine, sans sous-dossier `/blog/` et sans
`CNAME` (aucun domaine personnalisé n’est configuré).

## Mettre à jour les articles

Les données viennent de `mon-blog`. Pour les resynchroniser :

```bash
./scripts/sync-from-mon-blog.sh ../mon-blog
```

Le script copie `articles-base.js`, `hexo-articles.json` et les images. Les
redirections historiques de `src/data/redirects.json` sont conservées : elles
correspondent à la migration initiale du site Hexo.

## Redirections

Les anciennes URL Hexo du type :

```text
/2018/05/25/Recherche-1-mai-vuejs/
```

sont générées comme de petites pages HTML avec une balise
`<meta http-equiv="refresh">` vers la nouvelle adresse :

```text
/articles/recherche-1-mai-vuejs/
```

C’est la solution disponible sur un hébergement purement statique comme GitHub
Pages, qui ne permet pas de configurer des redirections HTTP 301. Les pages de
redirection sont en `noindex` et ne figurent pas dans le sitemap.

## Sécurité

- Aucun fichier `.env` ni secret ne doit être commité.
- Le déploiement utilise uniquement `GITHUB_TOKEN`.
- Les contenus importés sont considérés comme fiables ; ils proviennent de
  l’ancien blog et du dépôt `mon-blog`.
- Le fichier `.gitignore` exclut `node_modules/`, `dist/`, `.astro/` et les
  fichiers d’environnement.

## Historique

La branche `master` contenait l’ancien site Hexo généré. La migration a été
préparée sur la branche `astro-pages`, puis fusionnée dans `master`. L’historique
Git est conservé : les anciens fichiers restent consultables dans les commits
précédents.
