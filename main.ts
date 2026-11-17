import { cpSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Every delivered byte comes from the authored static tree; there is no build.
const sourceRoot = fileURLToPath(new URL('.', import.meta.url));
const targetRoot = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
if (targetRoot === resolve(sourceRoot)) throw new Error('Output must differ from source');
mkdirSync(targetRoot, { recursive: true });
for (const name of ['game', 'screenshots']) cpSync(join(sourceRoot, name), join(targetRoot, name), { recursive: true });
const bytes = buildDossier(targetRoot, {
  text_max_bytes: 163840,
  game_max_files: 993,
  game_max_bytes: 48 * 1024 * 1024,
  game_path_max_bytes: 1000,
  screenshots: { max: 4, max_bytes: 256 * 1024 },
});
writeFileSync(join(targetRoot, 'dossier.json'), bytes);
