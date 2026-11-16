import {
  SITE_URL,
  articles,
  categories,
  tags,
} from '../data/articles.js';

export function GET(context) {
  const site = context.site ?? new URL(SITE_URL);
  const pages = [
    '/',
    '/articles/',
    '/categories/',
    '/tags/',
    '/archives/',
    '/a-propos/',
  ];

  const entrees = [
    ...pages.map(
      (chemin) =>
        `  <url><loc>${new URL(chemin, site).toString()}</loc></url>`,
    ),
    ...articles.map(
      (article) =>
        `  <url><loc>${new URL(article.url, site).toString()}</loc><lastmod>${article.date}</lastmod></url>`,
    ),
    ...categories.map(
      (categorie) =>
        `  <url><loc>${new URL(`/categories/${categorie.slug}/`, site).toString()}</loc></url>`,
    ),
    ...tags.map(
      (tag) =>
        `  <url><loc>${new URL(`/tags/${tag.slug}/`, site).toString()}</loc></url>`,
    ),
  ];

  const corps = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entrees.join('\n')}
</urlset>
`;

  return new Response(corps, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
