// makefun-x-reposts-02 entry (Node 22, standard library only).
// Copies POSTS.json from the repository root to /output/POSTS.json.
// The posts themselves are the entry: five posts of our own on X, each
// quoting or replying directly to a different one of make.fun's newest
// posts on x.com/makefunai, all from @Bensol1904, with make.fun or
// @makefunai and our play code in each one's own words. The house reads
// their reposts, quotes and likes from X; nothing this program writes
// about the posts is scored.
//
// Before copying, the file is validated: it must parse as JSON and hold
// a "posts" array of 1-15 distinct, valid
// https://x.com/<handle>/status/<digits> addresses, all from one
// account. A bad file fails loudly instead of shipping a list the
// house would refuse.
//
// Outside the grader, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in
// for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const POST_URL = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/;

function fail(message: string): never {
  console.error(`POSTS.json is not a valid entry list: ${message}`);
  process.exit(1);
}

const source = join(BOT_DIR, 'POSTS.json');
let parsed: unknown;
try {
  parsed = JSON.parse(readFileSync(source, 'utf8'));
} catch (err) {
  fail(`could not read or parse it: ${(err as Error).message}`);
}

if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  fail('the top level must be an object with a "posts" array');
}
const posts = (parsed as { posts?: unknown }).posts;
if (!Array.isArray(posts)) {
  fail('missing "posts" array');
}
if (posts.length < 1 || posts.length > 15) {
  fail(`"posts" must hold 1-15 addresses, found ${posts.length}`);
}
if (new Set(posts).size !== posts.length) {
  fail('the list holds a duplicate address');
}
const handles = new Set<string>();
for (const post of posts) {
  if (typeof post !== 'string' || !POST_URL.test(post)) {
    fail(`not a valid X post address: ${JSON.stringify(post)}`);
  }
  handles.add(post.split('/')[3]);
}
if (handles.size !== 1) {
  fail(`all posts must be from one X account, found ${handles.size}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, join(OUTPUT_DIR, 'POSTS.json'));
} catch (err) {
  console.error(`could not copy POSTS.json from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
