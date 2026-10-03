import { version } from '../package.json';
export const GAME_VERSION = version;
export const ALPHA_VERSION = `Alpha ${GAME_VERSION}`;
export const devToolsEnabled = (environment: string | undefined) => environment === 'development';
