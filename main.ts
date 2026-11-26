// makefun-x-reposts-02 entry (Node 22, standard library only).
// Copies POSTS.json from the repository root to /output/POSTS.json.
// The posts themselves are the entry: five posts of our own on X, each
// quoting or replying directly to a different one of make.fun's newest
// posts on x.com/makefunai, all from @Bensol1904, with make.fun or
// @makefunai and our play code in each one's own words. The house reads
// their reposts, quotes and likes from X; nothing this program writes
// about the posts is scored.
//
// Outside the grader, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in
// for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'POSTS.json'), join(OUTPUT_DIR, 'POSTS.json'));
} catch (err) {
  console.error(`could not copy POSTS.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
