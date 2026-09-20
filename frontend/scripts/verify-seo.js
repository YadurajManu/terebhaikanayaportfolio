#!/usr/bin/env node
// Build checks by default; pass a deployed origin for real HTTP verification.
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');
const build = path.resolve(__dirname, '../build');
const canonicalOrigin = 'https://yaduraj.me';
const origin = process.argv[2]?.replace(/\/$/, '');
const errors = [];
function check(label, fn) {
  try { fn(); console.log(`PASS ${label}`); }
  catch (e) { errors.push(`${label}: ${e.message}`); console.error(`FAIL ${label}: ${e.message}`); }
}
async function response(route) {
  if (origin) {
    const r = await fetch(origin + route, {redirect:'manual', signal:AbortSignal.timeout(20000)});
    return {status:r.status, headers:r.headers, body:await r.text()};
  }
  const file = path.join(build, route === '/' ? 'index.html' : route.replace(/^\//,''));
  const target = fs.existsSync(file) && fs.statSync(file).isDirectory() ? path.join(file,'index.html') : file;
  return {status:200, headers:new Headers(), body:fs.readFileSync(target,'utf8')};
}
async function main() {
  const sitemap = await response('/sitemap.xml');
  const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]));
  check('sitemap response and finite canonical URLs', () => {
    assert.equal(sitemap.status,200);assert(urls.length > 0 && urls.length <= 30);
    assert.equal(new Set(urls.map(u=>u.href)).size,urls.length);
    urls.forEach(u=>{assert.equal(u.origin,canonicalOrigin);assert.equal(u.search,'');assert.equal(u.hash,'');});
  });
  const titles = new Set();
  for (const u of urls) {
    const r = await response(u.pathname);
    check(u.pathname+' indexable HTML', () => {
      assert.equal(r.status,200);
      assert(!/noindex/i.test(r.headers.get('x-robots-tag') || ''));
      assert(!/<meta[^>]*name="robots"[^>]*content="[^"]*noindex/i.test(r.body));
      assert.equal((r.body.match(/<h1(?:\s|>)/g)||[]).length,1);
      const canonicals=[...r.body.matchAll(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/g)];
      assert.equal(canonicals.length,1);assert.equal(canonicals[0][1],u.href);
      const title=r.body.match(/<title>([^<]+)<\/title>/)?.[1];assert(title);assert(!titles.has(title));titles.add(title);
      assert(/<meta[^>]*name="description"[^>]*content="[^"]{40,}"/.test(r.body));
      const schemas=[...r.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      assert(schemas.length);schemas.forEach(m=>assert.equal(JSON.parse(m[1])['@context'],'https://schema.org'));
      for(const m of r.body.matchAll(/href="(\/[^"#?]*)/g)) {
        const target=m[1];if(target.startsWith('/api/') || ['/cv','/resume'].includes(target)) continue;
        assert(fs.existsSync(path.join(build,target)),`Missing internal target ${target}`);
      }
    });
  }
  const robots=await response('/robots.txt');
  check('robots allow crawl and advertise canonical sitemap',()=>{assert.equal(robots.status,200);assert(robots.body.includes('Allow: /'));assert(robots.body.includes('Sitemap: '+canonicalOrigin+'/sitemap.xml'));});
  const notFound=fs.readFileSync(path.join(build,'404.html'),'utf8');
  check('404 artifact noindex without homepage canonical',()=>{assert(notFound.includes('noindex, follow'));assert(!notFound.includes('rel="canonical"'));});
  if(origin) {
    for(const route of ['/random-garbage-123','/test-does-not-exist','/projects/not-a-real-project','/undefined','/null','/api/not-real']) {
      const r=await response(route);check(route+' actual HTTP 404',()=>assert.equal(r.status,404));
    }
    for(const [route,target] of [['/?page=999','/'],['/about/','/about'],['/about/index.html','/about'],['/developers','/docs'],['/api-docs','/docs']]) {
      const r=await response(route);check(route+' permanent redirect',()=>{assert([301,308].includes(r.status));assert.equal(new URL(r.headers.get('location'),origin).pathname,target);});
    }
    if(origin===canonicalOrigin) {
      for(const host of ['http://yaduraj.me','https://www.yaduraj.me','http://www.yaduraj.me']) {
        const r=await fetch(host+'/',{redirect:'manual',signal:AbortSignal.timeout(20000)});
        check(host+' canonical redirect',()=>{assert([301,308].includes(r.status));assert.equal(new URL(r.headers.get('location')).protocol,'https:');});
        const final=await fetch(host+'/',{signal:AbortSignal.timeout(20000)});
        check(host+' final destination',()=>{assert.equal(final.status,200);assert.equal(final.url,canonicalOrigin+'/');});
      }
    }
  } else console.log('HTTP statuses, middleware and host redirects require a deployment run; not simulated here.');
  if(errors.length) process.exitCode=1;
}
main().catch(e=>{console.error(e);process.exitCode=1;});
