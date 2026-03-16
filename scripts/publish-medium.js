// scripts/publish-medium.js
// Publishes a monthly report to Medium as a draft
// Usage: MEDIUM_TOKEN=xxx node scripts/publish-medium.js docs/medium/MEDIUM_2026-02.md

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const MEDIUM_API = 'https://api.medium.com/v1';

async function getUser(token) {
  const res = await fetch(`${MEDIUM_API}/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!res.ok) throw new Error(`Failed to get user: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data;
}

async function createPost(token, userId, { title, content, tags }) {
  const res = await fetch(`${MEDIUM_API}/users/${userId}/posts`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      contentFormat: 'markdown',
      content,
      tags: tags || [],
      publishStatus: 'draft'
    })
  });
  if (!res.ok) throw new Error(`Failed to create post: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.data;
}

function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1] : 'Oeconomia Monthly';
}

function extractTags(markdown) {
  const match = markdown.match(/\*Tags:\s*(.+)\*/);
  if (!match) return [];
  return match[1]
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length <= 25)
    .slice(0, 3);
}

async function main() {
  const token = process.env.MEDIUM_TOKEN;
  if (!token) {
    console.error('Set MEDIUM_TOKEN environment variable');
    console.error('Get your token at: https://medium.com/me/settings/security');
    process.exit(1);
  }

  const filePath = process.argv[2];
  if (!filePath) {
    console.error('Usage: MEDIUM_TOKEN=xxx node scripts/publish-medium.js <path-to-medium-md>');
    process.exit(1);
  }

  const fullPath = path.resolve(ROOT, filePath);
  const content = fs.readFileSync(fullPath, 'utf8');
  const title = extractTitle(content);
  const tags = extractTags(content);

  console.log(`Title: ${title}`);
  console.log(`Tags: ${tags.join(', ')}`);
  console.log('');

  // Get user
  const user = await getUser(token);
  console.log(`Authenticated as: ${user.name} (@${user.username})`);

  // Create draft
  const post = await createPost(token, user.id, { title, content, tags });
  console.log('');
  console.log(`Draft created: ${post.url}`);
  console.log('');
  console.log('Open the link above to review and publish from Medium.');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
