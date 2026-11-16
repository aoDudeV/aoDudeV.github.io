// Les articles du blog.
// Les 3 premiers sont des articles de démonstration (fil rouge Next.js).
// Les autres sont importés depuis l'ancien blog Hexo via scripts/import-hexo.py.
import hexoArticles from './hexo-articles.json';

const articlesDemo = [
  {
    slug: 'pourquoi-le-ssr',
    titre: 'Pourquoi le rendu serveur (SSR) ?',
    resume:
      "Comprendre la différence entre un site statique et une page rendue à chaque requête.",
    date: '2026-11-12',
    auteur: 'Yves',
    categorie: 'Bases',
    tags: ['SSR', 'bases'],
    contenu: [
      {
        type: 'p',
        texte:
          "Jusqu'ici, notre site Astro est statique : les pages HTML sont fabriquées une fois pour toutes au moment du build, puis servies telles quelles par nginx. C'est rapide, mais le contenu ne peut pas dépendre de la personne qui visite le site.",
      },
      {
        type: 'h2',
        texte: 'Statique ou dynamique ?',
      },
      {
        type: 'p',
        texte:
          "Avec le rendu serveur (SSR, Server-Side Rendering), le serveur fabrique le HTML au moment de chaque requête. Il peut donc utiliser des informations propres à la requête : l'heure, les en-têtes HTTP, un cookie de session, ou des données fraîches venues d'une base.",
      },
      {
        type: 'p',
        texte:
          "Sur cette page, la date de rendu affichée plus bas est calculée par le serveur à chaque visite. Recharge la page : elle change. C'est la preuve visible que le rendu a lieu côté serveur, à la demande.",
      },
      {
        type: 'h2',
        texte: 'Et le navigateur dans tout ça ?',
      },
      {
        type: 'p',
        texte:
          "Le navigateur reçoit du HTML déjà rempli : il n'a pas besoin d'exécuter du JavaScript pour afficher le contenu. C'est excellent pour le référencement et pour les connexions lentes. Ensuite, React « hydrate » la page pour la rendre interactive.",
      },
    ],
  },
  {
    slug: 'app-router-nextjs',
    titre: "Découvrir l'App Router de Next.js",
    resume:
      "Comment Next.js 16 organise les pages, les layouts et les composants serveur.",
    date: '2026-11-12',
    auteur: 'Yves',
    categorie: 'Next.js',
    tags: ['Next.js', 'App Router'],
    contenu: [
      {
        type: 'p',
        texte:
          "Next.js utilise le dossier app/ pour définir les routes. Un fichier page.js correspond à une URL, et un fichier layout.js englobe les pages d'un dossier. C'est ce qu'on appelle l'App Router.",
      },
      {
        type: 'h2',
        texte: 'Les routes en quelques exemples',
      },
      {
        type: 'p',
        texte:
          "app/page.js correspond à /. app/blog/page.js correspond à /blog. Et app/blog/[slug]/page.js correspond à /blog/nimporte-quel-slug : les crochets indiquent un segment dynamique.",
      },
      {
        type: 'h2',
        texte: 'Composants serveur par défaut',
      },
      {
        type: 'p',
        texte:
          "Dans l'App Router, les composants sont des composants serveur par défaut : ils s'exécutent sur le serveur et n'envoient pas leur code au navigateur. Pour ajouter de l'interactivité, on crée un composant client avec la directive 'use client' en haut du fichier.",
      },
      {
        type: 'p',
        texte:
          "C'est exactement le mélange utilisé ici : les articles sont rendus côté serveur, et le bouton « Actualiser » est un petit composant client qui interroge la route API.",
      },
    ],
  },
  {
    slug: 'routes-api-nextjs',
    titre: 'Créer une route API avec Next.js',
    resume:
      "Exposer des données en JSON depuis le même projet, sans serveur séparé.",
    date: '2026-11-12',
    auteur: 'Yves',
    categorie: 'API',
    tags: ['API', 'Next.js'],
    contenu: [
      {
        type: 'p',
        texte:
          "En plus des pages, Next.js permet de créer des routes API. Un fichier route.js dans app/api/... exporte des fonctions GET, POST, PUT, DELETE. Ces fonctions reçoivent une requête HTTP et renvoient une réponse.",
      },
      {
        type: 'h2',
        texte: 'Une route, une méthode',
      },
      {
        type: 'p',
        texte:
          "Ici, app/api/articles/route.js exporte une fonction GET qui renvoie la liste des articles en JSON, accompagnée de l'heure de rendu et de l'en-tête User-Agent du visiteur. Ouvre /blog/api/articles dans un onglet pour voir la réponse brute.",
      },
      {
        type: 'p',
        texte:
          "À l'étape 5, ces routes seront remplacées par de vraies API écrites en Go, Python et Rust. Le front-end, lui, continuera d'appeler des URL en JSON : c'est l'intérêt de séparer l'interface et les données.",
      },
    ],
  },
];

export const articlesBase = [...articlesDemo, ...hexoArticles].sort(
  (a, b) => b.date.localeCompare(a.date) || a.titre.localeCompare(b.titre),
);

export function getArticleBase(slug) {
  return articlesBase.find((article) => article.slug === slug) ?? null;
}

// Convertit les blocs historiques (démo + import Hexo) en Markdown.
// C'est cette forme qui est stockée dans SQLite au premier démarrage : les
// articles restent ainsi éditables comme de vrais articles Markdown.
export function blocsVersMarkdown(blocs = []) {
  return blocs
    .map((bloc) => {
      switch (bloc.type) {
        case 'h2':
          return `## ${bloc.texte ?? ''}`;
        case 'h3':
          return `### ${bloc.texte ?? ''}`;
        case 'h4':
          return `#### ${bloc.texte ?? ''}`;
        case 'code': {
          const langage = bloc.lang ? String(bloc.lang) : '';
          return `\`\`\`${langage}\n${bloc.texte ?? ''}\n\`\`\``;
        }
        case 'html':
          return bloc.html ?? '';
        default:
          return bloc.texte ?? '';
      }
    })
    .filter((bloc) => bloc !== '')
    .join('\n\n');
}
