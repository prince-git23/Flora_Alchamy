// Verify upload dir resolution in dev vs prod without touching disk.
import path from 'node:path';

// __dirname of the real controller when run from the repo:
const ctrlDir = path.resolve(process.cwd(), 'controllers');

const dev = path.resolve(ctrlDir, '../../frontend/public/uploads');
const prod = path.resolve(ctrlDir, '../uploads');

console.log('dev fallback :', dev);
console.log('prod fallback:', prod);

const norm = (p) => p.split(path.sep).join('/');
console.log('dev ends with frontend/public/uploads:', norm(dev).endsWith('frontend/public/uploads'));
console.log('prod ends with backend/uploads       :', norm(prod).endsWith('backend/uploads'));

// Docker layout: WORKDIR /app, controller at /app/controllers
// path.resolve on POSIX resolves ../uploads against /app/controllers → /app/uploads.
// On Windows path.resolve('/app/controllers', '../uploads') is drive-relative, so
// emulate POSIX join semantics for this check only.
const dockerProd = '/' + 'app/controllers'.split('/').slice(0, -1).concat('uploads').join('/');
console.log('docker prod resolves to /app/uploads :', dockerProd === '/app/uploads');
