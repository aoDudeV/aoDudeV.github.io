import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  articles,
} from '../data/articles.js';

function echapperXml(valeur) {
  return String(valeur ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

export function GET(context) {
  const site = context.site ?? new URL(SITE_URL);
  const dateDernierArticle = articles[0]?.date
    ? new Date(`${articles[0].date}T00:00:00Z`).toUTCString()
    : new Date().toUTCString();

  const items = articles
    .map((article) => {
      const lien = new URL(article.url, site).toString();
      return `    <item>
      <title>${echapperXml(article.titre)}</title>
      <link>${echapperXml(lien)}</link>
      <guid isPermaLink="true">${echapperXml(lien)}</guid>
      <pubDate>${new Date(`${article.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${echapperXml(article.resume)}</description>
      <category>${echapperXml(article.categorie)}</category>
    </item>`;
    })
    .join('\n');

  const corps = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xml:lang="fr">
  <channel>
    <title>${echapperXml(SITE_NAME)}</title>
    <link>${echapperXml(site.toString())}</link>
    <description>${echapperXml(SITE_DESCRIPTION)}</description>
    <language>fr</language>
    <lastBuildDate>${dateDernierArticle}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(corps, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
}
