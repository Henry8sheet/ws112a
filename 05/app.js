import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import * as render from './render.js';

const db = new DB("contacts.db");
db.query(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT
  )
`);

const router = new Router();

router
  .get('/', listContacts)
  .get('/contact/:id', showContact)
  .post('/contact', addContact);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function listContacts(ctx) {
  const contacts = await db.query("SELECT * FROM contacts");
  ctx.response.body = await render.listContacts(contacts);
}

async function showContact(ctx) {
  const id = ctx.params.id;
  const contact = await db.query(
    "SELECT * FROM contacts WHERE id = ?",
    id
  );
  if (!contact.length) ctx.throw(404, 'Invalid contact id');
  ctx.response.body = await render.showContact(contact[0]);
}

async function addContact(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const name = pairs.get("name");
    const phone = pairs.get("phone");

    if (name && phone) {
      await db.query(
        "INSERT INTO contacts (name, phone) VALUES (?, ?)",
        name,
        phone
      );
      ctx.response.redirect('/');
    } else {
      ctx.throw(400, 'Name and phone are required');
    }
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });