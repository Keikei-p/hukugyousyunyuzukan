import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const base = '/hukugyousyunyuzukan';
const githubSite = 'https://keikei-p.github.io/hukugyousyunyuzukan';
const primarySite = 'https://hukugyousyunyuzukan.jyhokei0124.workers.dev';

if (!fs.existsSync(dist)) {
  throw new Error('dist directory not found. Run Astro build first.');
}

const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});

for (const file of walk(dist)) {
  const ext = path.extname(file).toLowerCase();
  if (!['.html', '.xml', '.txt', '.js', '.css'].includes(ext)) continue;

  let content = fs.readFileSync(file, 'utf8');

  // Canonical, OGP, sitemap and robots URLs must point to the GitHub Pages copy.
  content = content.replaceAll(primarySite, githubSite);

  if (ext === '.html' || ext === '.js' || ext === '.css') {
    // Prefix root-relative links and inline-script routes with the project-site base path.
    content = content.replace(/(["'`])\/(?!\/|hukugyousyunyuzukan(?:\/|["'`]))/g, `$1${base}/`);
  }

  fs.writeFileSync(file, content);
}

// Disable Jekyll processing for the uploaded static artifact.
fs.writeFileSync(path.join(dist, '.nojekyll'), '');

const htmlFiles = walk(dist).filter(file => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = fs.readFileSync(file, 'utf8');
  const badRootLink = html.match(/(?:href|src|action)="\/(?!\/|hukugyousyunyuzukan\/)/);
  if (badRootLink) {
    throw new Error('Unprefixed root link remains in ' + path.relative(dist, file) + ': ' + badRootLink[0]);
  }
}
const home = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
if (!home.includes(githubSite)) throw new Error('GitHub Pages canonical URL was not generated.');
if (!home.includes(base + '/')) throw new Error('GitHub Pages base path was not applied.');

console.log('Prepared and validated GitHub Pages output at ' + githubSite);
