// Zero-dependency static server for local use: `npm start` -> http://localhost:8080
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const PUBLIC = new Set(['index.html', 'styles.css']);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

createServer(async (req, res) => {
  try {
    const url = new URL(req.url ?? '/', 'http://localhost');
    let rel = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
    rel = normalize(rel);
    const allowed = PUBLIC.has(rel) || (rel.startsWith(`src${sep}`) && rel.endsWith('.js'));
    const file = join(root, rel);
    if (!allowed || !file.startsWith(root + sep)) { res.writeHead(404).end('Not found'); return; }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' }).end(body);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(8080, '127.0.0.1', () => console.log('ScamShield at http://localhost:8080'));
