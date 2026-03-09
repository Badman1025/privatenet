const STORAGE_KEY = 'pw_manager_entries_v1';
const DISPLAY_STEP = 30;
let currentLimit = DISPLAY_STEP;

function $(sel){return document.querySelector(sel)}

function loadEntries(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){return []}
}

function saveEntries(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}

function highlight(text, q){
  if(!q) return escapeHtml(text);
  const terms = String(q).trim().split(/\s+/).filter(Boolean);
  if(terms.length===0) return escapeHtml(text);
  const escaped = terms.map(t=>t.replace(/[.*+?^${}()|[\\]\\]/g,'\\\\$&')).join('|');
  const re = new RegExp(escaped,'ig');
  return escapeHtml(text).replace(re, m=>`<mark>${m}</mark>`);
}

function debounce(fn, wait=200){
  let t;
  return (...args)=>{ clearTimeout(t); t=setTimeout(()=>fn(...args), wait); };
}

function renderEntries(filter=''){
  const list = loadEntries();
  const ul = $('#entries');
  ul.innerHTML = '';
  const q = String(filter||'').trim();
  const terms = q ? q.split(/\s+/).filter(Boolean) : [];
  const regex = terms.length? new RegExp(terms.map(t=>t.replace(/[.*+?^${}()|[\\]\\]/g,'\\\\$&')).join('|'),'i') : null;
  const items = list.slice().reverse();
  const showCount = Math.min(currentLimit, items.length);
  for(let i=0;i<showCount;i++){
    const entry = items[i];
    const li = document.createElement('li');
    li.className='entry';
    const acc = highlight(entry.account, q);
    const note = highlight(entry.note||'', q);
    let pwHtml = '••••••';
    // if query matches password, reveal & highlight it
    if(regex && regex.test(entry.password)){
      pwHtml = highlight(entry.password, q);
    }
    li.innerHTML = `
      <div class="line"><div><strong>${acc}</strong><div class="meta">${new Date(entry.created).toLocaleString()}</div></div></div>
      <div class="line"><div class="meta">密码: <span class="pw masked" data-id="${entry.id}">${pwHtml}</span></div></div>
      <div class="note">${note}</div>
      <div class="entry-actions">
        <button class="btn ghost" data-action="copy" data-id="${entry.id}">复制</button>
        <button class="btn ghost" data-action="reveal" data-id="${entry.id}">显示</button>
        <button class="btn ghost" data-action="edit" data-id="${entry.id}">编辑</button>
        <button class="btn danger" data-action="delete" data-id="${entry.id}">删除</button>
      </div>`;
    ul.appendChild(li);
  }
  // show or hide load more
  const loadMore = $('#loadMore');
  if(loadMore){
    loadMore.style.display = items.length>showCount ? 'inline-block' : 'none';
  }
}

function addOrUpdateEntry(e){
  e.preventDefault();
  const id = $('#entryId').value;
  const account = $('#account').value.trim();
  const password = $('#password').value;
  const note = $('#note').value.trim();
  if(!account || !password) return alert('账号和密码为必填项');
  const list = loadEntries();
  if(id){
    const idx = list.findIndex(x=>x.id==id);
    if(idx>-1){list[idx].account=account;list[idx].password=password;list[idx].note=note;}
  }else{
    list.push({id:Date.now().toString(),account,password,note,created:Date.now()});
  }
  saveEntries(list);
  resetForm();
  // ensure newest item visible: reset limit and scroll first item into view inside the list panel
  currentLimit = Math.max(currentLimit, DISPLAY_STEP);
  renderEntries($('#search').value);
  const first = document.querySelector('#entries li');
  if(first){ first.scrollIntoView({behavior:'smooth', block:'start'}); }
}

function resetForm(){
  $('#entryId').value='';
  $('#account').value='';
  $('#password').value='';
  $('#note').value='';
}

function delegateClick(e){
  const btn = e.target.closest('button');
  if(!btn) return;
  const action = btn.dataset.action;
  const id = btn.dataset.id;
  if(action==='copy') return copyPassword(id);
  if(action==='reveal') return toggleReveal(id, btn);
  if(action==='edit') return startEdit(id);
  if(action==='delete') return removeEntry(id);
}

function toggleReveal(id, btn){
  const list = loadEntries();
  const it = list.find(x=>x.id==id); if(!it) return;
  // find pw span
  const span = document.querySelector(`.pw[data-id="${id}"]`);
  if(!span) return;
  if(span.classList.contains('masked')){
    span.classList.remove('masked');
    span.innerHTML = escapeHtml(it.password);
    btn.textContent = '隐藏';
  }else{
    span.classList.add('masked');
    span.textContent = '••••••';
    btn.textContent = '显示';
  }
}

function copyPassword(id){
  const list = loadEntries();
  const it = list.find(x=>x.id==id); if(!it) return;
  navigator.clipboard?.writeText(it.password).then(()=>alert('密码已复制到剪贴板')).catch(()=>alert('复制失败'));
}

function startEdit(id){
  const list = loadEntries();
  const it = list.find(x=>x.id==id); if(!it) return;
  $('#entryId').value = it.id;
  $('#account').value = it.account;
  $('#password').value = it.password;
  $('#note').value = it.note||'';
  window.scrollTo({top:0,behavior:'smooth'});
}

function removeEntry(id){
  if(!confirm('确认删除该条目？')) return;
  let list = loadEntries();
  list = list.filter(x=>x.id!=id);
  saveEntries(list);
  renderEntries($('#search').value);
}

function exportJSON(){
  const data = JSON.stringify(loadEntries(),null,2);
  const blob = new Blob([data],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='pw-entries.json'; a.click(); URL.revokeObjectURL(url);
}

function importJSON(){
  if(!confirm('确认从本地服务器的 pw-entries.json 导入并覆盖本地数据吗？此操作将替换当前本地数据。')) return;
  fetch('pw-entries.json', {cache: 'no-store'})
    .then(r=>{ if(!r.ok) throw new Error('无法读取 pw-entries.json (HTTP ' + r.status + ')'); return r.json(); })
    .then(data=>{ handleImportedData(data); })
    .catch(err=>{
      alert('通过网络读取失败，改为使用文件选择器导入或将项目通过本地服务器提供：\n' + (err && err.message? err.message : err));
      const f = $('#importFile'); if(f) f.click();
    });
}

function handleImportedData(data){
  try{
    if(!Array.isArray(data)) throw new Error('文件内容不是数组格式');
    const bad = data.find(x=>!x || typeof x.account==='undefined' || typeof x.password==='undefined' || typeof x.id==='undefined');
    if(bad) throw new Error('部分条目缺少必需字段 (id/account/password)');
    saveEntries(data);
    currentLimit = Math.max(DISPLAY_STEP, currentLimit);
    renderEntries($('#search').value);
    alert('导入完成，共导入 ' + data.length + ' 条记录');
  }catch(err){ alert('导入失败：' + (err && err.message ? err.message : err)); }
}

document.addEventListener('DOMContentLoaded',()=>{
  renderEntries();
  $('#entryForm').addEventListener('submit', addOrUpdateEntry);
  $('#clearBtn').addEventListener('click', resetForm);
  $('#commonBtn').addEventListener('click', showCommonModal);
  $('#entries').addEventListener('click', delegateClick);
  $('#search').addEventListener('input', debounce(e=>renderEntries(e.target.value), 160));
  $('#exportBtn').addEventListener('click', exportJSON);
  const importBtn = $('#importBtn');
  if(importBtn) importBtn.addEventListener('click', ()=>{ const f = $('#importFile'); if(f) f.click(); else importJSON(); });
  const importFile = $('#importFile');
  if(importFile) importFile.addEventListener('change', e=>{
    const file = e.target.files && e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      try{
        const data = JSON.parse(reader.result);
        handleImportedData(data);
      }catch(err){ alert('读取并解析文件失败：' + (err && err.message ? err.message : err)); }
      importFile.value = '';
    };
    reader.onerror = ()=>{ alert('读取文件失败'); importFile.value = ''; };
    reader.readAsText(file, 'utf-8');
  });
  $('#loadMore').addEventListener('click', ()=>{ currentLimit += DISPLAY_STEP; renderEntries($('#search').value); });
  $('#toggleReveal').addEventListener('click', ()=>{
    const p = $('#password'); p.type = p.type==='password'?'text':'password';
    $('#toggleReveal').textContent = p.type==='password'?'显示':'隐藏';
  });

  // modal controls
  const modal = document.getElementById('commonInfoModal');
  const backdrop = document.getElementById('commonBackdrop');
  const closeBtn = document.getElementById('commonClose');
  if(backdrop) backdrop.addEventListener('click', hideCommonModal);
  if(closeBtn) closeBtn.addEventListener('click', hideCommonModal);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') hideCommonModal(); });
  // copy buttons inside modal
  document.querySelector('#commonInfoModal').addEventListener('click', e=>{
    const b = e.target.closest('button[data-copy]');
    if(!b) return;
    const id = b.dataset.copy; copyCommonSection(id);
  });
});

function showCommonModal(){
  const m = document.getElementById('commonInfoModal');
  if(!m) return; m.classList.add('open'); m.setAttribute('aria-hidden','false');
}

function hideCommonModal(){
  const m = document.getElementById('commonInfoModal');
  if(!m) return; m.classList.remove('open'); m.setAttribute('aria-hidden','true');
}

function copyCommonSection(id){
  const pre = document.getElementById('common-'+id);
  if(!pre) return;
  const text = pre.innerText || pre.textContent;
  navigator.clipboard?.writeText(text).then(()=>alert('已复制')).catch(()=>alert('复制失败'));
}
