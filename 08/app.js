import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import { WebSocketMiddleware } from "https://deno.land/x/oak_websocket/mod.ts";

const app = new Application();
const router = new Router();
const wsm = new WebSocketMiddleware();

let contacts = [
    { id: 0, name: 'WANG', phone: '0921-921-915' },
    { id: 1, name: 'TING', phone: '0987-523-684' }
];

router
  .get('/contacts', listContacts)
  .post('/contacts', addContact)
  .get('/public/(.*)', serveStatic);

app.use(router.routes());
app.use(router.allowedMethods());
app.use(wsm);

wsm.on("connection", (socket) => {
  console.log("WebSocket connected");
  socket.on("message", (event) => {
    console.log("WebSocket message:", event);
    // You can handle WebSocket messages here
  });
});

async function listContacts(ctx) {
  ctx.response.body = contacts;
}

async function addContact(ctx) {
  const body = await ctx.request.body();
  const { name, phone } = body.value;

  if (name && phone) {
    const newContact = { id: contacts.length, name, phone };
    contacts.push(newContact);

    // Broadcast the new contact to all connected clients
    wsm.broadcast(JSON.stringify({ action: "addContact", contact: newContact }));

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