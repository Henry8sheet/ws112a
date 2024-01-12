import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

let contacts = [
  { id: 0, name: 'WANG', phone: '0921-921-915' },
  { id: 1, name: 'TING', phone: '0987-523-684' }
];

const router = new Router();

router
  .get('/contacts', listContacts)
  .post('/contacts', addContact)
  .get('/public/(.*)', serveStatic);

app.use(router.routes());
app.use(router.allowedMethods());

async function listContacts(ctx) {
  ctx.response.body = contacts;
}

async function addContact(ctx) {
  const body = await ctx.request.body();
  const { name, phone } = body.value;

  if (name && phone) {
    const newContact = { id: contacts.length, name, phone };
    contacts.push(newContact);
    ctx.response.status = 201; // Created
  } else {
    ctx.response.status = 400; // Bad Request
  }
}

async function serveStatic(ctx) {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/`,
    index: "index.html",
  });
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });