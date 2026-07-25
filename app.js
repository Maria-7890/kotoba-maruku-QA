let currentCat = "all";
let expandAll = false;

function highlight(text, keyword) {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(escaped, 'gi'), m => `<mark>${m}</mark>`);
}

function render() {
  const keyword = document.getElementById('search').value.trim();
  const list = document.getElementById('qa-list');
  const noResult = document.getElementById('no-result');
  document.getElementById('no-result-word').textContent = keyword;
  document.getElementById('clear-btn').style.display = keyword ? 'block' : 'none';

  list.innerHTML = '';
  let total = 0;

  DATA.forEach(section => {
    if (currentCat !== 'all' && section.cat !== currentCat) return;

    const filtered = section.items.filter(item => {
      if (!keyword) return true;
      return item.q.includes(keyword) || item.a.includes(keyword);
    });

    if (filtered.length === 0) return;
    total += filtered.length;

    const label = section.catLabel || section.cat;
    const div = document.createElement('div');
    div.className = 'category';
    div.innerHTML = `<div class="category-title">${label}</div>`;

    filtered.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'qa-card' + (expandAll ? ' open' : '');
      card.innerHTML = `
        <div class="qa-q">${highlight(item.q, keyword)}</div>
        <div class="qa-a">${highlight(item.a, keyword)}</div>
      `;
      card.addEventListener('click', () => card.classList.toggle('open'));
      div.appendChild(card);
    });

    list.appendChild(div);
  });

  const countEl = document.getElementById('result-count');
  countEl.innerHTML = keyword
    ? `「${keyword}」の検索結果：<span>${total}件</span>`
    : `全 <span>${total}件</span>`;

  noResult.style.display = (total === 0) ? 'block' : 'none';
}

// 検索
document.getElementById('search').addEventListener('input', render);

// クリア
document.getElementById('clear-btn').addEventListener('click', () => {
  document.getElementById('search').value = '';
  render();
  document.getElementById('search').focus();
});

// フィルター
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCat = btn.dataset.cat;
    render();
  });
});

// すべて展開/折りたたみ
document.getElementById('expand-all').addEventListener('click', () => {
  expandAll = !expandAll;
  document.getElementById('expand-all').textContent = expandAll ? 'すべて折りたたむ' : 'すべて展開';
  document.querySelectorAll('.qa-card').forEach(card => {
    card.classList.toggle('open', expandAll);
  });
});

// Enterキーで最初の結果を開く
document.getElementById('search').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const first = document.querySelector('.qa-card');
    if (first) { first.classList.add('open'); first.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }
});

render();
