(() => {
  const cfg=window.PLUS_SUPABASE;if(!cfg||!window.supabase||cfg.url.includes('YOUR-PROJECT')||cfg.anonKey.includes('YOUR-'))return;
  const sb=window.supabase.createClient(cfg.url,cfg.anonKey);
  async function load(){
    try{
      const [{data:posts,error:pe},{data:gallery,error:ge},{data:settings,error:se}]=await Promise.all([
        sb.from('posts').select('*').eq('published',true).order('pinned',{ascending:false}).order('published_at',{ascending:false}),
        sb.from('gallery').select('*').eq('published',true).order('sort_order',{ascending:true}).order('created_at',{ascending:false}),
        sb.from('site_settings').select('fax').eq('id','contact').maybeSingle()
      ]);
      if(!pe&&posts?.length&&window.PLUS_RENDER)window.PLUS_RENDER.renderNotices(posts.map(p=>({date:p.published_at,category:p.category,title:p.title,body:p.body,pinned:p.pinned})));
      if(!ge&&gallery?.length&&window.PLUS_RENDER)window.PLUS_RENDER.renderGallery(gallery.map(g=>({image:g.image_url,title:g.title,description:g.description})));
      if(!se&&settings){const row=document.querySelector('[data-fax-row]');document.querySelectorAll('[data-fax]').forEach(el=>el.textContent=settings.fax||'');if(row)row.hidden=!settings.fax;}
    }catch(e){console.warn('Supabase public load skipped',e)}
  }load();
})();