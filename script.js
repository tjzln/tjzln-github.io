(() => {
  'use strict';
  const icons = [
    '<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-14-2 18"/>',
    '<path d="M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
    '<path d="M8 10h8v6a4 4 0 0 1-8 0Zm1 0V8a3 3 0 0 1 6 0v2M5 12h3m8 0h3M5 17h3m8 0h3M12 10v10M7 4l2 2m8-2-2 2"/>',
    '<path d="M5 3h10l4 4v14H5Zm10 0v5h4M8 12h8m-8 4h6"/>',
    '<path d="M3 5c4-2 6-1 9 1 3-2 5-3 9-1v14c-4-2-6-1-9 1-3-2-5-3-9-1Zm9 1v14"/>',
    '<path d="M8 3h8v6a4 4 0 0 1-8 0Zm0 2H4v3a4 4 0 0 0 4 4m8-7h4v3a4 4 0 0 1-4 4m-4 1v5m-4 3h8m-6-3h4v3"/>',
    '<path d="M5 3v18h15M8 16l4-5 4 2 5-7m-5 0h5v5"/>'
  ];
  const categories = [
    {id:'development',name:'개발',label:'DEVELOPMENT',description:'아이디어를 코드로 옮기는 과정. 프로젝트와 개발 경험을 기록합니다.'},
    {id:'ctf-wargame',name:'CTF/Wargame',label:'CTF & WARGAME',description:'문제를 풀며 넓혀가는 시야. 풀이 과정과 새롭게 배운 기법을 정리합니다.'},
    {id:'bug-bounty',name:'Bug Bounty',label:'BUG BOUNTY',description:'취약점을 찾고 원인을 이해하는 과정. 공개 가능한 분석과 인사이트를 남깁니다.'},
    {id:'technical-writing',name:'블로그/기술문서',label:'TECHNICAL WRITING',description:'이해한 것을 나만의 언어로. 학습 노트와 기술 문서를 모읍니다.'},
    {id:'research',name:'논문/컨퍼런스',label:'PAPERS & CONFERENCES',description:'연구에서 발견하는 새로운 관점. 논문 리뷰와 컨퍼런스의 배움을 기록합니다.'},
    {id:'achievements',name:'공모전/자격증',label:'CHALLENGES & CERTIFICATIONS',description:'목표를 세우고 도전하는 여정. 공모전 경험과 자격증 학습을 정리합니다.'},
    {id:'progress',name:'진행상황',label:'WORK IN PROGRESS',description:'지금까지의 경험을 돌아보고, 앞으로의 공부와 도전을 기록합니다.'}
  ];
  const $ = id => document.getElementById(id);
  const validCategory = id => categories.find(c => c.id === id);
  const posts = (Array.isArray(window.ARCHIVE_POSTS) ? window.ARCHIVE_POSTS : [])
    .filter(p => p && typeof p.id === 'string' && typeof p.title === 'string' && validCategory(p.category))
    .slice().sort((a,b) => String(b.date || '').localeCompare(String(a.date || '')));
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const count = id => posts.filter(p => p.category === id).length;
  const categoryURL = id => '#category/' + encodeURIComponent(id);
  // Render the supported Markdown subset using DOM nodes; raw HTML stays text.
  function inline(node, text) {
    const tokens = /\*\*([^*]+)\*\*|\*([^*\n]+)\*|`([^`\n]+)`|https?:\/\/[^\s<>]+/g;
    let end = 0;
    for (const match of text.matchAll(tokens)) {
      node.append(document.createTextNode(text.slice(end, match.index)));
      if (match[1]) {
        const strong = el('strong');
        inline(strong, match[1]);
        node.append(strong);
      } else if (match[2]) {
        const emphasis = el('em');
        inline(emphasis, match[2]);
        node.append(emphasis);
      } else if (match[3]) {
        node.append(el('code','',match[3]));
      } else {
        const link = el('a','',match[0]);
        link.href = match[0];
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        node.append(link);
      }
      end = match.index + match[0].length;
    }
    node.append(document.createTextNode(text.slice(end)));
  }
  function markdown(target, source) {
    target.replaceChildren();
    const lines = source.replace(/\r\n?/g,'\n').split('\n');
    const cells = line => line.trim().replace(/^\|/,'').replace(/\|$/,'').split('|').map(s => s.trim());
    const divider = line => line && /^\s*\|/.test(line) && cells(line).every(s => /^:?-{3,}:?$/.test(s));
    const block = line => /^\s*(?:#{1,6}\s|[-*]\s|\d+\.\s|---+\s*$|\|)/.test(line);
    for (let i = 0; i < lines.length;) {
      const line = lines[i].trim();
      if (!line) { i++; continue; }
      if (/^\|/.test(line) && divider(lines[i+1])) {
        const wrap = el('div','table-scroll');
        wrap.tabIndex = 0;
        wrap.setAttribute('role','region');
        wrap.setAttribute('aria-label','본문 표');
        const table = el('table');
        const alignments = cells(lines[i+1]).map(s => s.startsWith(':') && s.endsWith(':') ? 'center' : s.endsWith(':') ? 'right' : 'left');
        const head = el('thead');
        const row = el('tr');
        cells(line).forEach((text,index) => { const cell = el('th'); cell.scope = 'col'; cell.style.textAlign = alignments[index]; inline(cell,text); row.append(cell); });
        head.append(row);
        const body = el('tbody');
        i += 2;
        while (i < lines.length && /^\s*\|/.test(lines[i])) {
          const tr = el('tr');
          cells(lines[i++]).forEach((text,index) => { const td = el('td'); td.style.textAlign = alignments[index]; inline(td,text); tr.append(td); });
          body.append(tr);
        }
        table.append(head,body); wrap.append(table); target.append(wrap); continue;
      }
      const heading = line.match(/^(#{1,6})\s+(.+)$/);
      if (heading) {
        // The article title already owns h1; keep body headings subordinate.
        const node = el('h' + Math.max(2,heading[1].length));
        inline(node,heading[2]); target.append(node); i++; continue;
      }
      if (/^---+$/.test(line)) { target.append(el('hr')); i++; continue; }
      const item = line.match(/^([-*]|\d+\.)\s+(.+)$/);
      if (item) {
        const ordered = /^\d/.test(item[1]);
        const list = el(ordered ? 'ol' : 'ul');
        if (ordered) list.start = parseInt(item[1],10);
        while (i < lines.length) {
          const next = lines[i].trim().match(/^([-*]|\d+\.)\s+(.+)$/);
          if (!next || /^\d/.test(next[1]) !== ordered) break;
          const li = el('li'); inline(li,next[2]); list.append(li); i++;
        }
        target.append(list); continue;
      }
      let text = line;
      i++;
      while (i < lines.length && lines[i].trim() && !block(lines[i])) text += '\n' + lines[i++].trim();
      const paragraph = el('p'); inline(paragraph,text); target.append(paragraph);
    }
  }
  function renderList(target, items) {
    target.replaceChildren();
    if (!items.length) {
      const empty = el('div','empty');
      empty.append(el('p','','아직 등록된 기록이 없습니다.'),el('small','','새로운 배움과 발견이 이곳에 쌓일 예정입니다.'));
      target.append(empty);
      return;
    }
    items.forEach(p => {
      const link = el('a','post-row');
      link.href = '#post/' + encodeURIComponent(p.id);
      const text = el('div');
      text.append(el('span','post-tag',validCategory(p.category).name),el('h3','',p.title));
      if (p.summary) text.append(el('p','',p.summary));
      const date = el('time','',p.date || '');
      if (/^\d{4}-\d{2}-\d{2}$/.test(p.date || '')) date.dateTime = p.date;
      link.append(text,date);
      target.append(link);
    });
  }
  categories.forEach((c,i) => {
    const card = el('a','category-card');
    card.href = categoryURL(c.id);
    const top = el('div','card-top');
    const icon = el('span','category-icon');
    icon.setAttribute('aria-hidden','true');
    icon.innerHTML = '<svg viewBox="0 0 24 24">' + icons[i] + '</svg>';
    top.append(icon,el('span','card-number',String(i+1).padStart(2,'0')));
    const bottom = el('div','card-bottom');
    const arrow = el('span','card-arrow','↗');
    arrow.setAttribute('aria-hidden','true');
    bottom.append(el('span','',count(c.id) + '개의 기록'),arrow);
    card.append(top,el('h3','',c.name),el('p','',c.description),bottom);
    $('category-grid').append(card);
  });
  $('year').textContent = new Date().getFullYear();
  function route(focus) {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    const [type,...parts] = hash.split('/');
    const id = parts.join('/');
    const category = type === 'category' && validCategory(id);
    const post = type === 'post' && posts.find(p => p.id === id);
    $('home-view').hidden = !!category || !!post;
    $('category-view').hidden = !category;
    $('post-view').hidden = !post;
    document.title = 'tjzln — 개발과 보안의 기록';
    if (category) {
      $('category-label').textContent = category.label;
      $('category-title').textContent = category.name;
      $('category-description').textContent = category.description;
      $('category-count').textContent = count(category.id) + '개의 기록';
      renderList($('category-posts'),posts.filter(p => p.category === category.id));
      document.title = category.name + ' — tjzln';
    } else if (post) {
      const c = validCategory(post.category);
      $('post-back').href = categoryURL(c.id);
      $('post-back').textContent = '← ' + c.name + ' 목록으로';
      $('post-meta').textContent = c.name + (post.date ? ' · ' + post.date : '');
      $('post-title').textContent = post.title;
      $('post-summary').textContent = post.summary || '';
      $('post-body').classList.toggle('markdown-body',post.format === 'markdown');
      if (post.format === 'markdown') markdown($('post-body'),post.body || '');
      else $('post-body').textContent = post.body || '';
      $('post-source').hidden = true;
      try {
        const url = new URL(post.url);
        if (url.protocol === 'https:' || url.protocol === 'http:') {
          $('post-source').href = url.href;
          $('post-source').hidden = false;
        }
      } catch { /* External links are optional. */ }
      document.title = post.title + ' — tjzln';
    }
    if (focus && hash !== 'categories') {
      window.scrollTo({top:0,behavior:'instant'});
      $('main').focus({preventScroll:true});
    }
  }
  window.addEventListener('hashchange',() => route(true));
  route(false);
})();
