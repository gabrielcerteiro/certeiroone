// nav.js - Navegacao compartilhada Certeiro One
// REGRA: ASCII puro. Sem acentos no JS.
// Uso: CertNav.init('exclusividades')
// Apos auth: CertNav.setUser(nome, role)
(function(){
'use strict';

var _page='',_role='padrao',_nome='';

var IC={
  home:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  chart:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
  clip:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>',
  user:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  out:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
  menu:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="6" y2="6"/><line x1="3" x2="21" y1="12" y2="12"/><line x1="3" x2="21" y1="18" y2="18"/></svg>',
  coin:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  brush:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/></svg>'
};

var PAGES=[
  {id:'pipeline',label:'Pipeline',url:'pipeline.html',ic:'chart',role:null},
  {id:'exclusividades',label:'Exclusividades',url:'exclusividades.html',ic:'home',role:null},
  {id:'vendas',label:'Vendas',url:'vendas.html',ic:'coin',role:'operacional'},
  {id:'repaginacao',label:'Repaginacao',url:'repaginacao.html',ic:'brush',role:'operacional'},
  {id:'registro',label:'Registro',url:'registro.html',ic:'clip',role:null},
  {id:'usuarios',label:'Usuarios',url:'usuarios.html',ic:'user',role:'master'}
];

function canSee(p){
  if(!p.role)return true;
  if(p.role==='operacional')return _role==='operacional'||_role==='master';
  if(p.role==='master')return _role==='master';
  return false;
}

function navCSS(){
  return [
    ':root{--cn-w:210px;--cn-bg:#191949;--cn-border:rgba(255,255,255,0.08)}',
    '.cn-wrap{display:block}',
    '.cn-sidebar{display:none;width:var(--cn-w);min-width:var(--cn-w);flex-shrink:0;background:var(--cn-bg);',
    'position:sticky;top:0;height:100vh;flex-direction:column;overflow-y:auto;z-index:100}',
    '.cn-brand{padding:20px 16px 14px;border-bottom:1px solid var(--cn-border)}',
    '.cn-brand-name{color:#fff;font-size:13px;font-weight:900;letter-spacing:2px;text-transform:uppercase;font-family:"Nunito Sans",sans-serif}',
    '.cn-brand-sub{color:rgba(255,255,255,0.3);font-size:8px;letter-spacing:1.4px;text-transform:uppercase;margin-top:2px;font-family:"Nunito Sans",sans-serif}',
    '.cn-items{flex:1;padding:8px 0}',
    '.cn-link{display:flex;align-items:center;gap:10px;padding:10px 14px;text-decoration:none;',
    'border-left:3px solid transparent;transition:background .15s,border-color .15s;cursor:pointer}',
    '.cn-link .cn-ic,.cn-link .cn-lbl{color:rgba(255,255,255,0.5);transition:color .15s}',
    '.cn-link .cn-ic{display:flex;align-items:center;flex-shrink:0}',
    '.cn-link .cn-ic svg{width:17px;height:17px;display:block}',
    '.cn-link .cn-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;',
    'white-space:nowrap;font-family:"Nunito Sans",sans-serif}',
    '.cn-link:hover{background:rgba(255,255,255,0.05)}',
    '.cn-link:hover .cn-ic,.cn-link:hover .cn-lbl{color:rgba(255,255,255,0.85)}',
    '.cn-link.active{background:rgba(255,255,255,0.1);border-left-color:#fff}',
    '.cn-link.active .cn-ic,.cn-link.active .cn-lbl{color:#fff}',
    '.cn-soon{font-size:8px;font-weight:700;padding:2px 6px;border-radius:6px;',
    'background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.35);margin-left:auto;',
    'font-family:"Nunito Sans",sans-serif;white-space:nowrap}',
    '.cn-sep{height:1px;background:var(--cn-border);margin:6px 10px}',
    '.cn-footer{padding:12px 14px;border-top:1px solid var(--cn-border);margin-top:auto}',
    '.cn-username{display:block;color:rgba(255,255,255,0.35);font-size:10px;font-weight:700;',
    'margin-bottom:8px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
    'font-family:"Nunito Sans",sans-serif}',
    '.cn-logout{display:flex;align-items:center;gap:8px;background:none;border:none;',
    'color:rgba(255,255,255,0.45);font-size:11px;font-weight:700;font-family:"Nunito Sans",sans-serif;',
    'cursor:pointer;padding:6px 0;width:100%;text-align:left;transition:color .15s}',
    '.cn-logout:hover{color:#fff}',
    '.cn-logout svg{width:15px;height:15px;flex-shrink:0}',
    '.cn-page{flex:1;min-width:0}',
    '.cn-hamburger{display:flex;align-items:center;justify-content:center;',
    'background:none;border:none;cursor:pointer;color:#fff;padding:4px;margin-right:6px;',
    'flex-shrink:0}',
    '.cn-hamburger svg{width:22px;height:22px;display:block}',
    '.cn-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:490}',
    '.cn-overlay.open{display:block}',
    '@media(min-width:900px){',
    '.cn-wrap{display:flex!important;align-items:flex-start;max-width:1440px;margin:0 auto;padding:0}',
    '.cn-sidebar{display:flex!important;flex-direction:column;top:0}',
    '.cn-page{padding:20px 0 40px 28px}',
    '.cn-hamburger{display:none!important}',
    '}',
    '@media(max-width:899px){',
    '.cn-sidebar{position:fixed!important;left:-230px;top:0;height:100%;width:220px;',
    'flex-direction:column;display:flex!important;z-index:500;',
    'transition:left .25s ease;box-shadow:4px 0 24px rgba(0,0,0,0.3)}',
    '.cn-sidebar.open{left:0}',
    '.cn-page{padding:14px 16px 80px}',
    '}',
    '.cn-topbar{display:flex;align-items:center;gap:8px;background:var(--cn-bg);padding:12px 16px;position:sticky;top:0;z-index:200}',
    '.cn-topbar-brand{color:#fff;font-size:13px;font-weight:900;letter-spacing:2px;text-transform:uppercase;font-family:"Nunito Sans",sans-serif}',
    '@media(min-width:900px){.cn-topbar{display:none!important}}',
    '.cn-form{max-width:760px;margin:0 auto}',
    '.cn-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:12px}',
    '.cn-grid-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px}',
    '.cn-grid-4{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}',
    '.cn-full{grid-column:1/-1}',
    '@media(max-width:899px){.cn-grid-3,.cn-grid-4{grid-template-columns:1fr 1fr}}',
    '@media(max-width:479px){.cn-grid-2,.cn-grid-3,.cn-grid-4{grid-template-columns:1fr}}',
    '.cn-grid-2>.edit-row,.cn-grid-3>.edit-row,.cn-grid-4>.edit-row{border-bottom:none}'
  ].join('');
}

function buildHTML(){
  var items=PAGES.map(function(p){
    var active=(p.id===_page)?' active':'';
    var vis=canSee(p)?'':'display:none';
    var soon=p.soon?'<span class="cn-soon">Em breve</span>':'';
    return '<a href="'+p.url+'" class="cn-link'+active+'" data-page="'+p.id+'" style="'+vis+'">'
      +'<span class="cn-ic">'+IC[p.ic]+'</span>'
      +'<span class="cn-lbl">'+p.label+'</span>'
      +soon+'</a>';
  }).join('');
  return '<nav class="cn-sidebar" id="cn-sidebar">'
    +'<div class="cn-brand">'
    +'<div class="cn-brand-name">Certeiro One</div>'
    +''
    +'</div>'
    +'<div class="cn-items">'+items+'</div>'
    +'<div class="cn-sep"></div>'
    +'<div class="cn-footer">'
    +'<span class="cn-username" id="cn-username">&nbsp;</span>'
    +'<button class="cn-logout" onclick="if(window.logoutUser)window.logoutUser()">'
    +IC.out+'<span>Sair</span>'
    +'</button>'
    +'</div>'
    +'</nav>';
}

function injectStyles(){
  if(document.getElementById('cn-styles'))return;
  var st=document.createElement('style');
  st.id='cn-styles';
  st.textContent=navCSS();
  document.head.appendChild(st);
}

function addHamburger(){
  if(document.getElementById('cn-topbar'))return;
  var bar=document.createElement('div');
  bar.id='cn-topbar';
  bar.className='cn-topbar';
  var btn=document.createElement('button');
  btn.id='cn-hamburger';
  btn.className='cn-hamburger';
  btn.setAttribute('aria-label','Menu');
  btn.innerHTML=IC.menu;
  btn.onclick=toggleNav;
  bar.appendChild(btn);
  var brand=document.createElement('span');
  brand.className='cn-topbar-brand';
  brand.textContent='Certeiro One';
  bar.appendChild(brand);
  var wrap=document.querySelector('.app-wrap');
  if(wrap)wrap.parentNode.insertBefore(bar,wrap);
  else document.body.insertBefore(bar,document.body.firstChild);
}

function addOverlay(){
  if(document.getElementById('cn-overlay'))return;
  var el=document.createElement('div');
  el.id='cn-overlay';
  el.className='cn-overlay';
  el.onclick=closeNav;
  document.body.appendChild(el);
}

function toggleNav(){
  var s=document.getElementById('cn-sidebar');
  var o=document.getElementById('cn-overlay');
  if(!s||!o)return;
  var open=s.classList.contains('open');
  s.classList.toggle('open',!open);
  o.classList.toggle('open',!open);
}

function closeNav(){
  var s=document.getElementById('cn-sidebar');
  var o=document.getElementById('cn-overlay');
  if(s)s.classList.remove('open');
  if(o)o.classList.remove('open');
}

function init(activePage){
  _page=activePage;
  injectStyles();
  var wrap=document.querySelector('.app-wrap');
  if(!wrap)return;
  if(!wrap.classList.contains('cn-wrap'))wrap.classList.add('cn-wrap');
  var page=wrap.querySelector('.page');
  if(page&&!page.classList.contains('cn-page'))page.classList.add('cn-page');
  var existing=document.getElementById('cn-sidebar');
  if(existing)existing.remove();
  wrap.insertAdjacentHTML('afterbegin',buildHTML());
  addHamburger();
  addOverlay();
}

function setUser(nome,role){
  _nome=nome;
  _role=role;
  var el=document.getElementById('cn-username');
  if(el)el.textContent=nome||'';
  PAGES.forEach(function(p){
    var link=document.querySelector('.cn-link[data-page="'+p.id+'"]');
    if(link)link.style.display=canSee(p)?'':'none';
  });
}

window.CertNav={init:init,setUser:setUser};
})();

// Helpers de codigo amigavel — v1.5.4
// fmtCodigo("VS", 17) => "VS0017"
window.fmtCodigo = function(prefix, num) {
  if (num === null || num === undefined || num === '') return '\u2014';
  return prefix + String(num).padStart(4, '0');
};

// parseCodigoBusca("VS0017") => 17  |  parseCodigoBusca("vs17") => 17  |  parseCodigoBusca("joao") => null
window.parseCodigoBusca = function(termo) {
  if (!termo) return null;
  var m = String(termo).match(/(\d+)/);
  return m ? parseInt(m[1], 10) : null;
};
