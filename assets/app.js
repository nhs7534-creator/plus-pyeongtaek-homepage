(() => {
  const c=window.PLUS_SITE_CONFIG;if(!c)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const attr=v=>esc(v).replace(/`/g,'&#096;');
  const textAll=(sel,val)=>document.querySelectorAll(sel).forEach(el=>el.textContent=val??'');
  const byId=id=>document.getElementById(id);

  textAll('[data-lead]',c.lead);
  textAll('[data-purpose]',c.purpose);
  textAll('[data-mission]',c.mission);
  textAll('[data-vision-title]',c.visionTitle);
  textAll('[data-chairman]',c.chairman);
  textAll('[data-address]',c.address);
  textAll('[data-tel]',c.telephone);
  textAll('[data-email]',c.email);
  textAll('[data-hours]',c.businessHours);
  textAll('[data-parking]',c.parking);
  textAll('[data-business-no]',c.businessNumber);
  textAll('[data-corp-no]',c.corporationNumber);
  textAll('[data-fax]',c.fax);

  document.querySelectorAll('[data-tel-link]').forEach(a=>a.href=`tel:${c.telephone.replace(/[^0-9+]/g,'')}`);
  document.querySelectorAll('[data-email-link]').forEach(a=>a.href=`mailto:${c.email}`);
  const faxRow=document.querySelector('[data-fax-row]');if(faxRow&&!c.fax)faxRow.hidden=true;

  const projectByKey=Object.fromEntries((c.projects||[]).map(p=>[p.key,p]));
  const services=[
    {label:'일자리·자활',title:'자활지원이 필요해요',desc:'평택지역자활센터에서 근로·취업·창업과 자립을 지원합니다.',url:projectByKey.jahwal?.url},
    {label:'어르신 돌봄',title:'주간보호 서비스를 찾고 있어요',desc:'도우누리평택노인재활주간보호센터의 돌봄 정보를 확인합니다.',url:projectByKey.care?.url},
    {label:'주거',title:'평택형 사회주택을 알아보고 싶어요',desc:`현재 ${c.housing?.managedUnits||'100세대'}를 관리하고 있습니다. 입주·공실 정보는 전용 시스템에서 확인합니다.`,url:c.housing?.url},
    {label:'사회연대경제·공공일자리',title:'평택 함께지도를 보고 싶어요',desc:'평택시민이 함께 만드는 사회연대경제 및 공공일자리 지도로 이동합니다.',url:c.togetherMap?.url},
    {label:'지역자산',title:'플러스평택협동플랫폼이 궁금해요',desc:'자활·돌봄·사회적경제 조직이 함께 사용하는 협동자산화 공간입니다.',url:'#platform'}
  ];
  const serviceList=byId('service-list');
  if(serviceList) serviceList.innerHTML=services.map(s=>`<a class="service-card" href="${attr(s.url||'#')}" ${String(s.url||'').startsWith('http')?'target="_blank" rel="noopener"':''}><span class="service-label">${esc(s.label)}</span><div><h3>${esc(s.title)}</h3><p>${esc(s.desc)}</p></div><span class="service-arrow" aria-hidden="true">→</span></a>`).join('');

  const greeting=byId('greeting-text');if(greeting)greeting.textContent=c.greeting||'';
  const history=byId('history-list');if(history)history.innerHTML=(c.history||[]).map(h=>`<li><time>${esc(h.year)}</time><span>${esc(h.text)}</span></li>`).join('');
  const pd=byId('platform-description');if(pd)pd.textContent=c.platform?.description||'';
  const floors=byId('floor-list');if(floors)floors.innerHTML=(c.platform?.floors||[]).map(f=>`<div class="floor-item"><strong>${esc(f.floor)}</strong><span>${esc(f.tenants)}</span></div>`).join('');

  function renderNotices(items){
    const el=byId('notice-list');if(!el)return;
    el.innerHTML=(items||[]).slice(0,3).map(n=>`<article class="notice"><time datetime="${attr(n.date||'')}">${esc(n.date||'')}</time><span class="notice-category">${esc(n.category||'공지')}</span><h3>${n.pinned?'[중요] ':''}${esc(n.title)}</h3><p>${esc(n.body||'')}</p></article>`).join('')||'<p>등록된 공지사항이 없습니다.</p>';
  }
  function renderGallery(items){
    const el=byId('gallery-grid');if(!el)return;
    el.innerHTML=(items||[]).slice(0,3).map(g=>`<figure class="gallery-card"><img src="${attr(g.image||g.image_url)}" alt="${esc(g.title||'활동 사진')}" loading="lazy"><figcaption><strong>${esc(g.title||'')}</strong><span>${esc(g.description||'')}</span></figcaption></figure>`).join('')||'<p>등록된 사진이 없습니다.</p>';
  }
  renderNotices(c.notices);renderGallery(c.gallery);window.PLUS_RENDER={renderNotices,renderGallery};

  const mapLink=byId('map-link');if(mapLink)mapLink.href=`https://map.naver.com/p/search/${encodeURIComponent(c.mapQuery||c.address)}`;
  const year=byId('year');if(year)year.textContent=new Date().getFullYear();

  const btn=document.querySelector('.menu-button'),nav=byId('main-nav');
  if(btn&&nav){
    btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',String(o))});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');btn.setAttribute('aria-expanded','false')}));
  }
})();