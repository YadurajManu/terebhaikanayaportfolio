const fs = require('fs');
const path = require('path');
const {default: middleware, pageRedirect} = require('../../middleware');
const {buildNotFound} = require('../../scripts/prerender');
const config = require('../../vercel.json');
const PUBLIC = path.resolve(__dirname, '../../public');
const read = p => fs.readFileSync(path.join(PUBLIC, p), 'utf8');
const urls = [...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => new URL(m[1]));

test('finite canonical sitemap and deploy routing', () => {
  expect(urls.length).toBe(15);
  expect(new Set(urls.map(u => u.href)).size).toBe(urls.length);
  expect(config.framework).toBe(null);
  expect(config.rewrites).toBeUndefined();
  expect(config.trailingSlash).toBe(false);
  expect(config.redirects.find(r => r.has?.[0]?.value === 'www.yaduraj.me').destination).toBe('https://yaduraj.me/:path*');
});

test.each(urls.map(u => [u.pathname,u.href]))('%s has complete static metadata and working internal links', (pathname, canonical) => {
  const html = read(pathname === '/' ? 'index.html' : pathname.slice(1)+'/index.html');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  expect(doc.title.length).toBeGreaterThan(10);
  expect(doc.querySelector('meta[name="description"]').content.length).toBeGreaterThan(40);
  expect(doc.querySelectorAll('link[rel="canonical"]').length).toBe(1);
  expect(doc.querySelector('link[rel="canonical"]').href).toBe(canonical);
  expect(doc.querySelector('meta[name="robots"]').content).not.toContain('noindex');
  if (pathname !== '/') expect(doc.querySelectorAll('h1').length).toBe(1);
  for (const key of ['title','description','image']) {
    expect(doc.querySelector(`meta[property="og:${key}"]`).content).toBeTruthy();
    expect(doc.querySelector(`meta[name="twitter:${key}"]`).content).toBeTruthy();
  }
  const schemas = [...doc.querySelectorAll('script[type="application/ld+json"]')];
  expect(schemas.length).toBeGreaterThan(0);
  schemas.forEach(s => expect(JSON.parse(s.textContent)['@context']).toBe('https://schema.org'));
  expect(new URL(canonical).origin).toBe('https://yaduraj.me');
  for (const a of doc.querySelectorAll('a[href^="/"]')) {
    const target = new URL(a.getAttribute('href'), canonical).pathname;
    if (target.startsWith('/api/')) continue;
    expect(target === '/' || fs.existsSync(path.join(PUBLIC,target)) || fs.existsSync(path.join(PUBLIC,target,'index.html'))).toBe(true);
  }
});

test.each(['/?page=999','/about?utm_source=search','/projects/tollgate/?tag=ai','/about/index.html','/index.html'])('normalizes %s', p => {
  const next = new URL(pageRedirect('https://yaduraj.me'+p));
  expect(next.search).toBe('');
  expect(next.pathname).not.toMatch(/\.html|\/index/);
  expect(pageRedirect(next.href)).toBeNull();
});

test('does not redirect nonexistent pages or API filters', () => {
  expect(pageRedirect('https://yaduraj.me/random?page=1')).toBeNull();
  expect(pageRedirect('https://yaduraj.me/api/projects?featured=true')).toBeNull();
});

describe('unknown path status even with a 200 fallback upstream', () => {
  const originalFetch = global.fetch;
  const originalResponse = global.Response;
  beforeAll(() => {
    global.Response = class { constructor(body, options) {this.body=body; Object.assign(this,options);} };
    global.fetch = jest.fn(async () => ({ok:true,text:async () => '<h1>404 — page not found</h1>'}));
  });
  afterAll(() => {global.fetch=originalFetch;global.Response=originalResponse;});
  test.each(['/random-garbage-123','/test-does-not-exist','/projects/not-a-real-project','/undefined','/null','/search/x','/tag/x','/constructor','/random.html'])('%s returns 404', async p => {
    const r = await middleware({url:'https://yaduraj.me'+p,method:'GET',headers:{get:()=> 'text/html'}});
    expect(r.status).toBe(404);
    expect(r.headers['X-Robots-Tag']).toContain('noindex');
  });
  test('HEAD returns no body', async () => {
    const r = await middleware({url:'https://yaduraj.me/nope',method:'HEAD',headers:{get:()=>null}});
    expect(r.status).toBe(404);expect(r.body).toBeNull();
  });
  test('page query gets a permanent redirect', async () => {
    const r = await middleware({url:'https://yaduraj.me/?page=9',method:'GET',headers:{get:()=>null}});
    expect(r.status).toBe(308);expect(r.headers.Location).toBe('https://yaduraj.me/');
  });
});

test('404 removes homepage canonical and identity markup', () => {
  const html=buildNotFound(read('index.html'));
  expect(html).not.toContain('rel="canonical"');
  expect(html).not.toContain('application/ld+json');
  expect(html).toContain('noindex, follow');
});

test('MuhDikhai case study includes readable signaling diagram and revision-specific evidence', () => {
  const html = read('projects/muhdikhai/index.html');
  const doc = new DOMParser().parseFromString(html, 'text/html');
  expect(doc.title).toContain('WebRTC signaling server with Node.js');
  expect(doc.querySelector('pre code').textContent).toContain('SDP offer');
  expect(doc.querySelector('pre code').textContent).toContain('WebRTC media');
  expect(html).toContain('8ae5018cfd9c2216d6ed596fa18214d3c515ae01');
  for (const route of ['index.html', 'projects/muhdikhai/index.html', 'projects/tollgate/index.html', 'projects/fleet-os/index.html']) {
    const page = new DOMParser().parseFromString(read(route), 'text/html');
    expect(page.querySelector('meta[name="description"]').content.length).toBeLessThanOrEqual(160);
  }
});

test('legacy indexed resume reaches the current PDF rather than the unknown-path handler', async () => {
  expect(config.redirects[0]).toEqual({source:'/Resume.pdf', destination:'https://yaduraj.me/Resume_Web.pdf', permanent:true});
  expect(fs.existsSync(path.join(PUBLIC, 'Resume_Web.pdf'))).toBe(true);
  expect(fs.existsSync(path.join(PUBLIC, 'Resume.pdf'))).toBe(false);
  expect(await middleware({url:'https://yaduraj.me/Resume.pdf', method:'GET', headers:{get:()=>null}})).toBeUndefined();
});

test('markdown code fences preserve newlines and escape markup', () => {
  const {render} = require('../../scripts/lib/md');
  expect(render('```text\nA <-> B\nsecond line\n```')).toBe('<pre><code>A &lt;-&gt; B\nsecond line</code></pre>');
  expect(() => render('```\nunclosed')).toThrow('Unclosed markdown code fence');
});

test.each([
  'jetbrains-mono-latin.1e06740a.woff2',
  'outfit-latin.92684e4a.woff2',
])('lets the static server serve %s', async font => {
  expect(fs.statSync(path.join(PUBLIC, 'fonts', font)).size).toBeGreaterThan(0);
  for (const method of ['GET', 'HEAD']) {
    expect(await middleware({
      url: 'https://yaduraj.me/fonts/' + font, method, headers: {get: () => null},
    })).toBeUndefined();
  }
});

test('Fleet OS serves one canonical interactive page with local media', async () => {
  const doc = new DOMParser().parseFromString(read('projects/fleet-os/index.html'), 'text/html');
  expect(doc.querySelector('#trade-offs').textContent).toBe('Engineering decisions and trade-offs');
  expect(doc.querySelectorAll('video track[kind="captions"]')).toHaveLength(1);
  expect(doc.querySelectorAll('.study-gallery img')).toHaveLength(2);
  for (const asset of doc.querySelectorAll('[src^="/fleet-study/"], [href^="/fleet-study/"], video[poster]')) {
    const url = asset.getAttribute('src') || asset.getAttribute('href') || asset.getAttribute('poster');
    expect(fs.statSync(path.join(PUBLIC, url)).size).toBeGreaterThan(0);
    const result = await middleware({url: 'https://yaduraj.me' + url, method: 'GET', headers: {get: () => null}});
    expect(result).toBeUndefined();
  }
  expect(config.redirects).toContainEqual({
    source: '/projects/fleetos', destination: '/projects/fleet-os', permanent: true,
  });
  expect(await middleware({
    url: 'https://yaduraj.me/projects/fleetos', method: 'GET', headers: {get: () => null},
  })).toBeUndefined();
});

test('Fleet OS switches flows and explains changes in placement', async () => {
  const doc = new DOMParser().parseFromString(read('projects/fleet-os/index.html'), 'text/html');
  document.body.innerHTML = doc.body.innerHTML;
  try {
    jest.isolateModules(() => require('../../public/fleet-study/interactive.js'));
    const flow = document.querySelector('[data-pane="arch-2"]');
    flow.click();
    expect(flow.getAttribute('aria-pressed')).toBe('true');
    expect(document.getElementById('arch-0').hidden).toBe(true);
    expect(document.getElementById('arch-2').hidden).toBe(false);

    const form = document.getElementById('placement-form');
    const { platform, policy, offline } = form.elements;
    const readOutcome = () => document.getElementById('placement-outcome').textContent;
    expect(readOutcome()).toMatch(/^x86 VPS selected/);
    platform.value = 'linux/arm64';
    platform.dispatchEvent(new Event('change', {bubbles: true}));
    expect(readOutcome()).toMatch(/^Apple Silicon Mac selected/);
    expect(document.querySelector('[data-status="rejected"]').textContent).toContain('Image does not support');

    policy.value = 'pinned';
    offline.click();
    expect(readOutcome()).toMatch(/^No eligible node/);
    expect(document.getElementById('placement-results').textContent).toContain('holds its local volume');
    form.reset();
    await new Promise(resolve => queueMicrotask(resolve));
    expect(readOutcome()).toMatch(/^x86 VPS selected/);
  } finally {
    document.body.replaceChildren();
  }
});
