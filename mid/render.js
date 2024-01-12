async function fetchPosts() {
    const response = await fetch('http://127.0.0.1:8000/api/posts');
    const posts = await response.json();
    return posts;
  }
  
  function createPostElement(post, onEdit, onDelete) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
  
    const titleElement = document.createElement('h2');
    titleElement.textContent = post.title;
  
    const contentElement = document.createElement('p');
    contentElement.textContent = post.content;
  
    const editButton = document.createElement('button');
    editButton.textContent = '編輯';
    editButton.addEventListener('click', () => onEdit(post.id));
  
    const deleteButton = document.createElement('button');
    deleteButton.textContent = '刪除';
    deleteButton.addEventListener('click', () => onDelete(post.id));
  
    postElement.appendChild(titleElement);
    postElement.appendChild(contentElement);
    postElement.appendChild(editButton);
    postElement.appendChild(deleteButton);
  
    return postElement;
  }
  
  export async function renderPosts() {
    const postsContainer = document.getElementById('posts');
    const posts = await fetchPosts();
  
    postsContainer.innerHTML = ''; // 清空原有文章列表
  
    posts.forEach(post => {
      const postElement = createPostElement(post, editPost, deletePost);
      postsContainer.appendChild(postElement);
    });
  }
  