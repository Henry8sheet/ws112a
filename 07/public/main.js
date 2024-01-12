var R = {}

window.onhashchange = async function () {
  var r
  var tokens = window.location.hash.split('/')
  console.log('tokens=', tokens)
  switch (tokens[0]) {
    case '#show':
      r = await window.fetch('/contacts/' + tokens[1]);
      let contact = await r.json();
      R.show(contact);
      break;
    case '#new':
      R.new();
      break;
    default:
      r = await window.fetch('/contacts');
      let contacts = await r.json();
      R.list(contacts);
      break;
  }
}

window.onload = function () {
  window.onhashchange();
}

R.layout = function (title, content) {
  document.querySelector('title').innerText = title;
  document.querySelector('#content').innerHTML = content;
}

R.list = function (contacts) {
  let list = [];
  for (let contact of contacts) {
    list.push(`
    <li>
      <h2>${contact.name}</h2>
      <p><a id="show${contact.id}" href="#show/${contact.id}">查看聯絡人</a></p>
    </li>
    `);
  }
  let content = `
  <h1>通訊錄</h1>
  <p>你有 <strong>${contacts.length}</strong> 個聯絡人!</p>
  <p><a id="createContact" href="#new">新增聯絡人</a></p>
  <ul id="contacts">
    ${list.join('\n')}
  </ul>
  `;
  return R.layout('通訊錄', content);
}

R.new = function () {
  return R.layout('新增聯絡人', `
  <h1>新增聯絡人</h1>
  <form>
    <p><input id="name" type="text" placeholder="姓名" name="name"></p>
    <p><input id="phone" type="text" placeholder="電話" name="phone"></p>
    <p><input id="saveContact" type="button" onclick="R.saveContact()" value="確定新增"></p>
  </form>
  `);
}

R.show = function (contact) {
  return R.layout(contact.name, `
    <h1>${contact.name}</h1>
    <p>${contact.phone}</p>
  `);
}

R.saveContact = async function () {
  let name = document.querySelector('#name').value;
  let phone = document.querySelector('#phone').value;
  let r = await window.fetch('/contacts', {
    body: JSON.stringify({name: name, phone: phone}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  window.location.hash = '#list';
  return r;
}