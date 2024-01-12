import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
 
const peoples = new Map();
peoples.set("WANG", {
  name: "WANG",
  password: "0921921915",
});
peoples.set("TING", {
  name: "TING",
  password: "9999999999",
});

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.redirect('http://127.0.0.1:8000/public/index.html')

  })
  .get("/people", (ctx) => {
    ctx.response.body = Array.from(peoples.values());
  })
  .post("/people/add", async (ctx) => {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      console.log('pairs=', pairs)
      const params = {}
      for (const [key, value] of pairs) {
        params[key] = value
      }
      console.log('params=', params)
      let name = params['name']
      let tel = params['password']
      console.log(`name=${name} password=${password}`)
      if (peoples.get(name)) {
        ctx.response.type = 'text/html'
        ctx.response.body = {'error':`name=${name} 已經存在！`}
      } else {
        peoples.set(name, {name, tel})
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>新增 (${name}, ${password}) 成功</p><p><a href="/people/">列出所有人員</a></p>`
      }
  
    }

  })
  .post("/account/login", async (ctx) => {
    const body = ctx.request.body()
    if (body.type === "form") {
      const pairs = await body.value
      console.log('pairs=', pairs)
      const params = {}
      for (const [key, value] of pairs) {
        params[key] = value
      }
      console.log('params=', params)
      let name = params['name']
      let password = params['password']
      console.log(`name=${name} password=${password}`)
      if (account.get(name)&&password==account.get(name).password) {
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>登入成功</p><p><a href="/public/index.html">進入系統</a></p>`
      } else {
        ctx.response.type = 'text/html'
        ctx.response.body = `<p>登入失敗，請檢查帳號密碼是否有錯！</p><p><a href="/public/login.html">請重新登入</a></p>`
      }
    }
  })
  .get("/public/(.*)", async (ctx) => {
    let wpath = ctx.params[0]
    console.log('wpath=', wpath)
    await send(ctx, wpath, {
      root: Deno.cwd()+"/public/",
      index: "index.html",
    })
  })

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')

await app.listen({ port: 8000 });