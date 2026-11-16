import { articlesBase } from './articles-base.js';

export const SITE_URL = 'https://aodudev.github.io';
export const SITE_NAME = 'Le blog du fil rouge';
export const SITE_DESCRIPTION =
  'Articles, notes et archives du blog : ancien blog Hexo et fil rouge Next.js.';

// Les contenus importés de l'ancien blog utilisent encore les chemins du blog
// Next.js (basePath /blog). On les réécrit vers la racine du site statique.
const RELECTURES = [
  ['/blog/images/hexo/images/', '/images/hexo/'],
  ['/blog/images/hexo/', '/images/hexo/'],
  ['/blog/articles/', '/articles/'],
  ['href="/blog"', 'href="/"'],
  ["href='/blog'", "href='/'"],
];

export function slugifier(valeur) {
  const texte = String(valeur ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return texte || 'article';
}

export function normaliserTexte(valeur) {
  return String(valeur ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function formaterDate(date, options = { dateStyle: 'long' }) {
  const valeur = String(date ?? '');
  const dateObj = new Date(`${valeur}T00:00:00Z`);

  if (Number.isNaN(dateObj.getTime())) {
    return valeur;
  }

  return new Intl.DateTimeFormat('fr-FR', {
    ...options,
    timeZone: 'UTC',
  }).format(dateObj);
}

function reecrireTexte(valeur) {
  if (typeof valeur !== 'string') {
    return valeur;
  }

  return RELECTURES.reduce(
    (texte, [ancien, nouveau]) => texte.replaceAll(ancien, nouveau),
    valeur,
  );
}

function reecrireBloc(bloc) {
  const copie = { ...bloc };

  for (const cle of ['texte', 'html', 'lang']) {
    if (typeof copie[cle] === 'string') {
      copie[cle] = reecrireTexte(copie[cle]);
    }
  }

  return copie;
}

function normaliserArticle(article) {
  const tags = [
    ...new Set(
      (article.tags ?? [])
        .map((tag) => String(tag).trim())
        .filter(Boolean),
    ),
  ];

  const titre = article.titre?.trim() || 'Sans titre';
  const resume = article.resume?.trim() || 'Article du blog.';
  const auteur = article.auteur?.trim() || 'Yves';
  const categorie = article.categorie?.trim() || 'Divers';
  const date = article.date || '2018-01-01';

  return {
    ...article,
    titre,
    resume,
    auteur,
    categorie,
    date,
    tags,
    blocs: (article.contenu ?? []).map(reecrireBloc),
    url: `/articles/${article.slug}/`,
    categorieSlug: slugifier(categorie),
    tagsSlugs: tags.map((tag) => ({ nom: tag, slug: slugifier(tag) })),
    dateLongue: formaterDate(date),
    dateCourte: formaterDate(date, { dateStyle: 'medium' }),
    recherche: normaliserTexte(
      [titre, resume, auteur, categorie, ...tags].join(' '),
    ),
  };
}

export const articles = articlesBase
  .map(normaliserArticle)
  .sort(
    (a, b) =>
      b.date.localeCompare(a.date) || a.titre.localeCompare(b.titre, 'fr'),
  );

export const nombreArticles = articles.length;

export const articlesParSlug = new Map(
  articles.map((article) => [article.slug, article]),
);

export function trouverArticle(slug) {
  return articlesParSlug.get(slug) ?? null;
}

// Catégories : une entrée par slug, avec les articles déjà triés.
const categoriesMap = new Map();

for (const article of articles) {
  const slug = article.categorieSlug;
  if (!categoriesMap.has(slug)) {
    categoriesMap.set(slug, {
      nom: article.categorie,
      slug,
      articles: [],
    });
  }
  categoriesMap.get(slug).articles.push(article);
}

export const categories = [...categoriesMap.values()].sort(
  (a, b) =>
    b.articles.length - a.articles.length || a.nom.localeCompare(b.nom, 'fr'),
);

export const categoriesParSlug = new Map(
  categories.map((categorie) => [categorie.slug, categorie]),
);

// Tags : même logique, avec fusion des tags qui produisent le même slug.
const tagsMap = new Map();

for (const article of articles) {
  for (const tag of article.tags) {
    const slug = slugifier(tag);
    if (!tagsMap.has(slug)) {
      tagsMap.set(slug, {
        nom: tag,
        slug,
        articles: [],
      });
    }
    const entree = tagsMap.get(slug);
    if (!entree.articles.some((item) => item.slug === article.slug)) {
      entree.articles.push(article);
    }
  }
}

export const tags = [...tagsMap.values()].sort(
  (a, b) =>
    b.articles.length - a.articles.length || a.nom.localeCompare(b.nom, 'fr'),
);

export const tagsParSlug = new Map(tags.map((tag) => [tag.slug, tag]));

export const tagsTries = [...tags].sort((a, b) =>
  a.nom.localeCompare(b.nom, 'fr'),
);

export const annees = [...new Set(articles.map((article) => article.date.slice(0, 4)))]
  .sort((a, b) => b.localeCompare(a))
  .map((annee) => ({
    annee,
    articles: articles.filter((article) => article.date.startsWith(annee)),
  }));

export const articlesRecents = articles.slice(0, 6);
export const categoriesPopulaires = categories.slice(0, 12);
export const tagsPopulaires = tags.slice(0, 30);
