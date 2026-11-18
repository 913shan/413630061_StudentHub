const form = document.querySelector('form');
const status = document.querySelector('#status');
const button = form.querySelector('button');

async function request(action, options) {
  const response = await fetch('/api/v1/user/' + action, options);
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.body;
}

async function refresh() {
  const students = await request('findAll');
  const rows = students.map(student => {
    const row = document.createElement('tr');
    for (const key of ['sid', 'userName', 'name', 'department', 'grade', 'class', 'Email']) {
      row.insertCell().textContent = student[key];
    }
    return row;
  });
  document.querySelector('tbody').replaceChildren(...rows);
  document.querySelector('#count').textContent = students.length + ' 筆';
}

form.addEventListener('submit', async event => {
  event.preventDefault();
  button.disabled = true;
  status.textContent = '';
  try {
    await request('insertOne', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    form.reset();
    status.textContent = '已新增學生';
    await refresh().catch(() => { status.textContent = '已新增學生，重新載入名單失敗'; });
  } catch (error) {
    status.textContent = '新增失敗：' + error.message;
  } finally {
    button.disabled = false;
  }
});

refresh().catch(() => { status.textContent = '無法載入學生名單'; });
