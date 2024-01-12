export async function listContacts(contacts) {
    const contactList = contacts.map(contact => `
      <li>
        <a href="/contact/${contact.id}">
          <h2>${contact.name}</h2>
        </a>
      </li>
    `).join('');
  
    return layout('Contact List', `
      <h1>Contact List</h1>
      <ul>
        ${contactList}
      </ul>
      <p><a href="/contact/new">Add Contact</a></p>
    `);
  }
  
  export async function showContact(contact) {
    return layout(contact.name, `
      <h1>${contact.name}</h1>
      <p>Phone: ${contact.phone}</p>
    `);
  }
  
  export async function layout(title, content) {
    return `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin-bottom: 10px;
            }
            a {
              text-decoration: none;
              color: #3498db;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <section id="content">
            ${content}
          </section>
        </body>
      </html>
    `;
  }