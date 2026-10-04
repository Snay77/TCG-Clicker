import { GAME_VERSION } from '../../lib/release';
import { workerSource } from '../../lib/pwa-worker';
export const dynamic = 'force-dynamic';
export function GET() {
  return new Response(workerSource(`${GAME_VERSION}-${process.env.VERCEL_GIT_COMMIT_SHA || 'local'}`), { headers: {
    'Content-Type': 'application/javascript; charset=utf-8',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Service-Worker-Allowed': '/',
  } });
}
