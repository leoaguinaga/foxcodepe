import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseEnv } from 'node:util';
import postgres from 'postgres';

const env = { ...parseEnv(readFileSync('.env', 'utf8')), ...process.env };
const databaseUrl = env.PANEL_DATABASE_URL || env.DATABASE_URL;
assert(['localhost', '127.0.0.1'].includes(new URL(databaseUrl).hostname), 'Solo se permite una base local');
const sql = postgres(databaseUrl, { max: 1 });
const base = process.env.TEST_LANDING_URL || 'http://127.0.0.1:4397';
const email = `integration-${crypto.randomUUID()}@example.com`;
async function send(path, body) {
  return fetch(`${base}/api/${path}`, {
    method: 'POST', headers: { 'content-type': 'application/json', origin: base },
    body: JSON.stringify(body),
  });
}
try {
  const quote = {
    contact: { name: 'Prueba integración', company: 'Empresa prueba', email, phone: '999123456' },
    quote: { serviceId: 'web', serviceTitle: 'Sitio web', planLevel: 'Profesional', planPrice: 1200,
      selectedAddOns: [{ name: 'SEO', price: 200 }], estimatedTotal: 1400 },
    project: { description: 'Proyecto de prueba', meetingDate: '2026-11-02' },
    metadata: { pagePath: '/servicios' },
  };
  const response = await send('leads', quote);
  assert.equal(response.status, 201, await response.clone().text());
  const { leadId } = await response.json();
  const [lead] = await sql`select * from "Lead" where "id" = ${leadId}`;
  assert.equal(lead.email, email);
  assert.equal(lead.companyName, 'Empresa prueba');
  assert.equal(lead.status, 'NEW');
  assert.equal(lead.type, 'QUOTATION');
  assert.equal(lead.source, 'landing');
  assert.equal(lead.productId, null);
  assert.match(lead.message, /SEO — S\/ 200/);
  assert.match(lead.message, /1400/);
  assert.equal(lead.nextActionAt.toISOString(), '2026-11-02T00:00:00.000Z');
  const contact = await send('contact', { name: 'Contacto prueba', email, message: 'Quiero información' });
  assert.equal(contact.status, 201, await contact.clone().text());
  const contactBody = await contact.json();
  assert.equal(contactBody.leadId, contactBody.contactMessageId);
  const [saved] = await sql`select * from "Lead" where "id" = ${contactBody.leadId}`;
  assert.equal(saved.type, 'GENERAL');
  assert.equal(saved.status, 'NEW');
  assert.equal(saved.message, 'Quiero información');
  assert.equal((await send('leads', { ...quote, website: 'spam' })).status, 400);
  assert.equal((await send('contact', { name: '', email: 'invalid' })).status, 400);
  const count = await sql`select count(*)::int as total from "Lead" where "email" = ${email}`;
  assert.equal(count[0].total, 2);
  console.log('OK: cotización, contacto, persistencia en panel y rechazo de datos inválidos.');
} finally {
  await sql`delete from "Lead" where "email" = ${email}`;
  await sql.end();
}
