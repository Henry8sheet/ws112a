import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const app = new Application();
const router = new Router();

let postsData = [
  { id: 1, title: '第一篇文章', content: '這是第一篇文章的內容。' },
  { id: 2, title: '第二篇文章', content: '這是第二篇文章的內容。' },
  { id: 3, title: '第三篇文章', content: '這是第三篇文章的內容。' },
];

router
  .get("/api/posts", (context) => {
    context.response.body = postsData;
  })
  .get("/api/posts/:id", (context) => {
    const postId = parseInt(context.params.id);
    const post = postsData.find((post) => post.id === postId);

    if (post) {
      context.response.body = post;
    } else {
      context.response.status = 404;
      context.response.body = { message: "文章不存在" };
    }
  })
  .post("/api/posts", async (context) => {
    const body = await context.request.body();
    const newPost = body.value;

    // 簡單的 id 遞增邏輯，實際使用中可能需要使用資料庫生成唯一 ID
    newPost.id = postsData.length + 1;
    
    postsData.push(newPost);
    context.response.body = newPost;
  })
  .put("/api/posts/:id", async (context) => {
    const postId = parseInt(context.params.id);
    const body = await context.request.body();
    const updatedPost = body.value;

    const index = postsData.findIndex((post) => post.id === postId);
    if (index !== -1) {
      postsData[index] = { ...postsData[index], ...updatedPost };
      context.response.body = postsData[index];
    } else {
      context.response.status = 404;
      context.response.body = { message: "文章不存在" };
    }
  })
  .delete("/api/posts/:id", (context) => {
    const postId = parseInt(context.params.id);
    postsData = postsData.filter((post) => post.id !== postId);
    context.response.body = { message: "文章已刪除" };
  });

app.use(router.routes());
app.use(router.allowedMethods());

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
