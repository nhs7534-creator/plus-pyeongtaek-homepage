(() => {
  const c = window.PLUS_SITE_CONFIG;if(!c)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const attr=v=>esc(v).replace(/`/g,'&#096;');
  const textAll=(sel,val)=>document.querySelectorAll(sel).forEach(el=>el.textContent=val??'');
  textAll('[data-tagline]',c.tagline);textAll('[data-lead]',c.lead);textAll('[data-purpose]',c.purpose);textAll('[data-mission]',c.mission);textAll('[data-vision-title]',c.visionTitle);textAll('[data-chairman]',c.chairman);textAll('[data-address]',c.address);textAll('[data-tel]',c.telephone);textAll('[data-email]',c.email);textAll('[data-hours]',c.businessHours);textAll('[data-parking]',c.parking);textAll('[data-established]',c.establishedDate);textAll('[data-business-no]',c.businessNumber);textAll('[data-corp-no]',c.corporationNumber);textAll('[data-fax]',c.fax);textAll('[data-housing-units]',c.housing.managedUnits);
  document.querySelectorAll('[data-tel-link]').forEach(a=>a.href=`tel:${c.telephone.replace(/[^0-9+]/g,'')}`);document.querySelectorAll('[data-email-link]').forEach(a=>a.href=`mailto:${c.email}`);const faxRow=document.querySelector('[data-fax-row]');if(faxRow&&!c.fax)faxRow.hidden=true;
  document.getElementById('value-list').innerHTML=c.coreValues.map(v=>`<div class="value-item"><strong>${esc(v.title)}</strong><span>${esc(v.text)}</span></div>`).join('');
  document.getElementById('greeting-text').textContent=c.greeting;
  const projectHTML = items => items.map(p=>`<article id="project-${attr(p.key||'item')}" class="project-card ${p.image?'':'no-image'}"><div><span class="category">${esc(p.category)}</span><span class="status">${esc(p.status)}</span><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p>${p.phone?`<div class="meta">대표전화 ${esc(p.phone)}</div>`:''}${p.url?`<a class="more" href="${attr(p.url)}" target="_blank" rel="noopener">${esc(p.linkLabel||'자세히 보기')} →</a>`:''}</div>${p.image?`<img src="${attr(p.image)}" alt="${esc(p.title)} 대표 이미지" loading="lazy">`:''}</article>`).join('');
  document.getElementById('project-grid').innerHTML=projectHTML(c.projects);
  document.getElementById('housing-description').textContent=c.housing.description;document.getElementById('housing-link').href=c.housing.url;document.getElementById('housing-poster-link').href=c.housing.url;
  if(c.togetherMap){
    textAll('[data-together-map-subtitle]',c.togetherMap.subtitle);textAll('[data-together-map-description]',c.togetherMap.description);
    const ml=document.getElementById('together-map-link'),mf=document.getElementById('together-map-frame'),mc=document.getElementById('together-map-card'),mb=document.getElementById('together-map-activate');
    if(ml)ml.href=c.togetherMap.url;
    const isTouch=window.matchMedia('(pointer: coarse)').matches;
    if(mf){
      if(isTouch&&mb){
        mb.addEventListener('click',()=>{mf.src=c.togetherMap.url;mc.classList.add('map-active')},{once:true});
      }else{
        mf.src=c.togetherMap.url;
        if(mb)mb.hidden=true;
      }
    }
  }
  document.getElementById('platform-description').textContent=c.platform.description;
  document.getElementById('floor-list').innerHTML=c.platform.floors.map(f=>{
    const tenants=(f.tenants||[]).map(t=>{
      const links=(t.links||[]).map(l=>`<a class="tenant-link" href="${attr(l.url)}" target="_blank" rel="noopener">${esc(l.label)} →<span class="sr-only"> (새 창 열림)</span></a>`).join('');
      const note=t.note?`<span class="tenant-note">${esc(t.note)}</span>`:'';
      return `<div class="tenant"><span class="tenant-name">${esc(t.name)}</span>${note}${links}</div>`;
    }).join('');
    return `<div class="floor-item"><strong>${esc(f.floor)}</strong><div class="floor-tenants">${tenants}</div></div>`;
  }).join('');
  document.getElementById('history-list').innerHTML=c.history.map(h=>`<li><time>${esc(h.year)}</time><span>${esc(h.text)}</span></li>`).join('');
  function renderNotices(items){document.getElementById('notice-list').innerHTML=(items||[]).map(n=>`<article class="notice"><time datetime="${attr(n.date||'')}">${esc(n.date||'')}</time><span class="notice-category">${esc(n.category||'공지')}</span><div><h3>${n.pinned?'[중요] ':''}${esc(n.title)}</h3><p>${esc(n.body||'')}</p></div></article>`).join('')||'<p>등록된 공지사항이 없습니다.</p>'}
  function renderGallery(items){document.getElementById('gallery-grid').innerHTML=(items||[]).map(g=>`<figure class="gallery-card"><img src="${attr(g.image||g.image_url)}" alt="${esc(g.title||'활동 사진')}" loading="lazy"><figcaption><strong>${esc(g.title||'')}</strong><span>${esc(g.description||'')}</span></figcaption></figure>`).join('')||'<p>등록된 사진이 없습니다.</p>'}
  renderNotices(c.notices);renderGallery(c.gallery);window.PLUS_RENDER={renderNotices,renderGallery};
  const partnersTrack=document.getElementById('partners-track');
  if(partnersTrack&&partnersTrack.children.length&&!partnersTrack.dataset.doubled){
    partnersTrack.innerHTML+=partnersTrack.innerHTML;
    partnersTrack.dataset.doubled='1';
  }
  document.getElementById('map-link').href=`https://map.naver.com/p/search/${encodeURIComponent(c.mapQuery||c.address)}`;document.getElementById('year').textContent=new Date().getFullYear();
  const btn=document.querySelector('.menu-button'),nav=document.getElementById('main-nav');
  const closeNav=()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')};
  const openNav=()=>{nav.classList.add('open');btn.setAttribute('aria-expanded','true')};
  btn.addEventListener('click',()=>{nav.classList.contains('open')?closeNav():openNav()});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
  document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!btn.contains(e.target))closeNav()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeNav();btn.focus()}});
})();