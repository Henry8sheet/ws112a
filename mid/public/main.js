import { renderPosts } from './render.js';

async function createPost(title, content) {
  const response = await fetch('http://127.0.0.1:8000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, content }),
  });

  const newPost = await response.json();
  renderPosts(); // 重新顯示文章列表
}

function editPost(id) {
  // 在實際應用中，你可能會打開一個編輯表單，並將文章的原始內容填入表單中
  // 然後使用更新文章的 API 完成編輯功能
  console.log(`編輯文章 ${id}`);
}

async function deletePost(id) {
  await fetch(`http://127.0.0.1:8000/api/posts/${id}`, {
    method: 'DELETE',
  });

  renderPosts(); // 重新顯示文章列表
}

// 監聽表單提交事件
document.getElementById('post-form').addEventListener('submit', function (event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;

  createPost(title, content);
});

// 初始化顯示文章列表
renderPosts();

  