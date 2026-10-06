import { getData, saveData, createCapsule } from '../utils/storage.js';
import { getCurrentWindowTabs, collectSupportedTabs, openWebsites, sameUrl } from '../utils/tabs.js';
import { DEFAULT_SETTINGS, domainFromUrl, formatDate, getTheme, makeId, normalizeUrl } from '../utils/helpers.js';

const $ = (id) => document.getElementById(id);
let data = null;
let editingCapsuleId = null;
let draggedId = null;
let toastTimer = null;

function showToast(message, error = false) {
  const el = $('toast'); el.textContent = `${error ? '⚠' : '✓'} ${message}`; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
}

function closeDialogs() { document.querySelectorAll('dialog[open]').forEach(d => d.close()); }
function findCapsule(id) { return data.capsules.find(c => c.id === id); }
function applyTheme() { document.documentElement.dataset.theme = getTheme(data?.settings || DEFAULT_SETTINGS); }

function render() {
  applyTheme();
  const query = $('searchInput').value.trim().toLowerCase();
  const capsules = data.capsules.filter(c => `${c.name} ${c.description}`.toLowerCase().includes(query));
  $('capsuleCount').textContent = `${capsules.length}/${data.capsules.length}`;
  const root = $('capsules'); root.replaceChildren();
  if (!capsules.length) {
    const empty = document.createElement('div'); empty.className = 'empty';
    const emoji = document.createElement('div'); emoji.className = 'emoji'; emoji.textContent = '💊';
    const strong = document.createElement('strong'); strong.textContent = data.capsules.length ? 'No matching capsules' : 'No capsules yet';
    const p = document.createElement('div'); p.textContent = data.capsules.length ? 'Try another search.' : 'Save your current browser tabs into your first capsule.';
    empty.append(emoji, strong, p);
    if (!data.capsules.length) { const b = document.createElement('button'); b.className='primary'; b.textContent='Create Your First Capsule'; b.style.marginTop='12px'; b.onclick=()=>openCreate(); empty.append(b); }
    root.append(empty); return;
  }
  const sorted = [...capsules].sort((a,b) => Number(b.favorite)-Number(a.favorite) || (b.updatedAt-a.updatedAt));
  for (const c of sorted) root.append(createCard(c));
}

function createCard(c) {
  const card = document.createElement('article'); card.className='card'; card.dataset.id=c.id;
  const top=document.createElement('div'); top.className='card-top';
  const icon=document.createElement('div'); icon.className='capsule-icon'; icon.style.background=c.color+'22'; icon.textContent=c.icon||'💊';
  const main=document.createElement('div'); main.className='card-main';
  const name=document.createElement('div'); name.className='card-name'; name.title=c.name; name.textContent=c.name;
  const desc=document.createElement('div'); desc.className='card-desc'; desc.textContent=c.description||'No description';
  main.append(name,desc);
  const menu=document.createElement('div'); menu.className='menu';
  const mb=document.createElement('button'); mb.className='icon-btn more'; mb.title='More options'; mb.textContent='⋮';
  const panel=document.createElement('div'); panel.className='menu-panel'; panel.hidden=true;
  const items=[['Rename',()=>renameCapsule(c.id)],['Edit websites',()=>openWebsiteEditor(c.id)],['Add current tab',()=>openAddTab(c.id)],['Duplicate',()=>duplicateCapsule(c.id)],['Open in new window',()=>openCapsule(c.id,true)],['Export',()=>exportSingle(c.id)],['Toggle favorite',()=>toggleFavorite(c.id)],['Delete',()=>deleteCapsule(c.id,true)]];
  items.forEach(([label,fn])=>{const b=document.createElement('button');b.textContent=label;b.onclick=()=>{panel.hidden=true;fn()};if(label==='Delete')b.className='danger-item';panel.append(b)});
  mb.onclick=(e)=>{e.stopPropagation();document.querySelectorAll('.menu-panel').forEach(x=>x!==panel&&(x.hidden=true));panel.hidden=!panel.hidden}; menu.append(mb,panel);
  top.append(icon,main,menu);
  const meta=document.createElement('div');meta.className='meta';
  if(data.settings.showWebsiteCount){const s=document.createElement('span');s.textContent=`${c.websites.length} website${c.websites.length===1?'':'s'}`;meta.append(s)}
  if(data.settings.showLastOpened){const s=document.createElement('span');s.textContent=`Last opened: ${formatDate(c.lastOpenedAt)}`;meta.append(s)}
  const actions=document.createElement('div');actions.className='card-actions';
  const open=document.createElement('button');open.className='primary';open.textContent='Open Capsule';open.onclick=()=>openCapsule(c.id,false);
  const edit=document.createElement('button');edit.className='secondary';edit.textContent='Edit';edit.onclick=()=>openWebsiteEditor(c.id);
  actions.append(open,edit); card.append(top,meta,actions); return card;
}

function openCreate() {
  editingCapsuleId=null; $('dialogTitle').textContent='Create Capsule'; $('capsuleForm').querySelector('.primary').textContent='Create Capsule';
  $('capsuleName').value='';$('capsuleDescription').value='';$('capsuleIcon').value='💊';$('capsuleColor').value='#6366f1';$('capsuleDialog').showModal();setTimeout(()=>$('capsuleName').focus(),0);
}

$('capsuleForm').addEventListener('submit', async e => {
  e.preventDefault();
  const name=$('capsuleName').value.trim(); if(!name){showToast('Capsule name is required',true);return}
  if(data.capsules.some(c=>c.id!==editingCapsuleId&&c.name.toLowerCase()===name.toLowerCase())){showToast('A capsule with this name already exists',true);return}
  try {
    if(editingCapsuleId){const c=findCapsule(editingCapsuleId);Object.assign(c,{name,description:$('capsuleDescription').value.trim(),icon:$('capsuleIcon').value.trim()||'💊',color:$('capsuleColor').value,updatedAt:Date.now()});await saveData(data);showToast('Capsule updated')}
    else {data.capsules.push(createCapsule({name,description:$('capsuleDescription').value,icon:$('capsuleIcon').value.trim()||'💊',color:$('capsuleColor').value}));await saveData(data);showToast('Capsule created')}
    $('capsuleDialog').close();render();
  } catch(err){console.error(err);showToast(err.message,true)}
});

async function saveCurrentTabs(closeAfter=false){
  try {
    const tabs=await getCurrentWindowTabs(); const {supported,skipped}=collectSupportedTabs(tabs);
    if(!supported.length){showToast('No supported web tabs found',true);return}
    const capsule=await chooseCapsule('Save Current Tabs',true); if(!capsule)return;
    const prevent=data.settings.preventDuplicateUrls;
    const additions=supported.filter(s=>!prevent||!capsule.websites.some(w=>sameUrl(w.url,s.url)));
    if(!additions.length){showToast('All current websites are already in this capsule',true);return}
    const existingCount=capsule.websites.length; additions.forEach((s,i)=>s.order=existingCount+i); capsule.websites.push(...additions); capsule.updatedAt=Date.now(); await saveData(data);
    if(closeAfter){const ids=tabs.filter(t=>supported.some(s=>s.url===t.url)).map(t=>t.id).filter(Number.isInteger);try{if(ids.length) await chrome.tabs.remove(ids)}catch(error){console.error(error)}}
    showToast(`${additions.length} tabs saved${skipped.length?`; ${skipped.length} unsupported skipped`:''}`);render();
  }catch(err){console.error(err);showToast(err.message||'Unable to save tabs',true)}
}

function chooseCapsule(title, allowCreate=false){
  return new Promise(resolve=>{
    if(!data.capsules.length){if(allowCreate){openCreate()}resolve(null);return}
    const dlg=document.createElement('dialog');dlg.className='dialog';const form=document.createElement('form');form.method='dialog';const h=document.createElement('h2');h.textContent=title;const list=document.createElement('div');list.className='radio-list';data.capsules.forEach(c=>{const label=document.createElement('label');label.className='radio-option';const input=document.createElement('input');input.type='radio';input.name='capsule';input.value=c.id;label.append(input,document.createTextNode(`${c.icon} ${c.name}`));list.append(label)});const actions=document.createElement('div');actions.className='dialog-actions';const cancel=document.createElement('button');cancel.type='button';cancel.className='secondary';cancel.textContent='Cancel';cancel.onclick=()=>{dlg.close();dlg.remove();resolve(null)};const ok=document.createElement('button');ok.className='primary';ok.textContent='Continue';actions.append(cancel,ok);form.append(h,list,actions);form.addEventListener('submit',()=>{const id=form.querySelector('input[name="capsule"]:checked')?.value;dlg.close();dlg.remove();resolve(id?findCapsule(id):null)});dlg.append(form);document.body.append(dlg);dlg.showModal();
  });
}

async function openCapsule(id,newWindow=false){
  const c=findCapsule(id);if(!c)return;
  if(!c.websites.length){showToast('This capsule has no websites',true);return}
  const result=await openWebsites(c.websites,{newWindow:newWindow||data.settings.openInNewWindowByDefault});c.lastOpenedAt=Date.now();c.openCount=(c.openCount||0)+1;c.updatedAt=Date.now();await saveData(data);showToast(`${result.created.length} website${result.created.length===1?'':'s'} opened${result.failed.length?`; ${result.failed.length} failed`:''}`,result.created.length===0);render();
}

function openWebsiteEditor(id){editingCapsuleId=id;renderWebsiteList();$('websiteDialog').showModal()}
function renderWebsiteList(){const c=findCapsule(editingCapsuleId);$('websiteDialogTitle').textContent=`Edit Websites · ${c.name}`;const root=$('websiteList');root.replaceChildren();c.websites.sort((a,b)=>a.order-b.order).forEach(site=>{const row=document.createElement('div');row.className='website-row';row.draggable=true;row.dataset.id=site.id;const handle=document.createElement('span');handle.className='drag-handle';handle.textContent='⠿';const img=document.createElement('img');img.className='favicon';img.src=site.favicon||'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';img.onerror=()=>{img.style.display='none'};const info=document.createElement('div');info.className='site-info';const t=document.createElement('div');t.className='site-title';t.textContent=site.title;const d=document.createElement('div');d.className='site-domain';d.textContent=domainFromUrl(site.url);info.append(t,d);const rm=document.createElement('button');rm.className='remove-site';rm.title='Remove website';rm.textContent='×';rm.onclick=()=>removeWebsite(site.id);row.append(handle,img,info,rm);row.addEventListener('dragstart',()=>{draggedId=site.id;row.classList.add('dragging')});row.addEventListener('dragend',()=>{draggedId=null;row.classList.remove('dragging')});row.addEventListener('dragover',e=>e.preventDefault());row.addEventListener('drop',e=>{e.preventDefault();reorderWebsite(draggedId,site.id)});root.append(row)})}
async function removeWebsite(siteId){const c=findCapsule(editingCapsuleId);c.websites=c.websites.filter(w=>w.id!==siteId);c.websites.forEach((w,i)=>w.order=i);c.updatedAt=Date.now();await saveData(data);renderWebsiteList();render();showToast('Website removed')}
async function reorderWebsite(fromId,toId){if(!fromId||fromId===toId)return;const c=findCapsule(editingCapsuleId);const arr=[...c.websites].sort((a,b)=>a.order-b.order);const from=arr.findIndex(x=>x.id===fromId),to=arr.findIndex(x=>x.id===toId);if(from<0||to<0)return;const [item]=arr.splice(from,1);arr.splice(to,0,item);arr.forEach((w,i)=>w.order=i);c.websites=arr;c.updatedAt=Date.now();await saveData(data);renderWebsiteList();render();}

function renameCapsule(id){const c=findCapsule(id);editingCapsuleId=id;$('dialogTitle').textContent='Rename Capsule';$('capsuleForm').querySelector('.primary').textContent='Save Changes';$('capsuleName').value=c.name;$('capsuleDescription').value=c.description;$('capsuleIcon').value=c.icon;$('capsuleColor').value=c.color;$('capsuleDialog').showModal();}

async function duplicateCapsule(id){const source=findCapsule(id);let name=`${source.name} Copy`,n=2;while(data.capsules.some(c=>c.name.toLowerCase()===name.toLowerCase()))name=`${source.name} Copy ${n++}`;const copy=structuredClone(source);copy.id=makeId('capsule');copy.name=name;copy.createdAt=Date.now();copy.updatedAt=Date.now();copy.lastOpenedAt=null;copy.openCount=0;copy.favorite=false;copy.websites=copy.websites.map(w=>({...w,id:makeId('site')}));data.capsules.push(copy);await saveData(data);render();showToast('Capsule duplicated')}
async function toggleFavorite(id){const c=findCapsule(id);c.favorite=!c.favorite;c.updatedAt=Date.now();await saveData(data);render();showToast(c.favorite?'Capsule pinned':'Capsule unpinned')}
async function deleteCapsule(id,ask){const c=findCapsule(id);if(!c)return;if(ask&&data.settings.askBeforeDelete){$('confirmTitle').textContent=`Delete “${c.name}”?`;$('confirmText').textContent='This removes the saved capsule and its websites. Open browser tabs are not affected.';$('confirmAction').textContent='Delete';$('confirmAction').onclick=async()=>{await performDelete(id);$('confirmDialog').close()};$('confirmDialog').showModal();}else await performDelete(id)}
async function performDelete(id){data.capsules=data.capsules.filter(c=>c.id!==id);await saveData(data);render();showToast('Capsule deleted')}

function openAddTab(id){editingCapsuleId=id;const root=$('addTabOptions');root.replaceChildren();data.capsules.forEach(c=>{const label=document.createElement('label');label.className='radio-option';const input=document.createElement('input');input.type='radio';input.name='targetCapsule';input.value=c.id;input.checked=c.id===id;label.append(input,document.createTextNode(`${c.icon} ${c.name}`));root.append(label)});$('addTabDialog').showModal()}
$('addTabForm').addEventListener('submit',async e=>{e.preventDefault();const id=$('addTabOptions').querySelector('input:checked')?.value;const c=findCapsule(id);if(!c)return;const tabs=await chrome.tabs.query({active:true,currentWindow:true});const tab=tabs[0];if(!tab?.url){showToast('Active tab cannot be saved',true);return}if(!['http:','https:','ftp:'].includes(new URL(tab.url).protocol)){showToast('This Chrome page cannot be saved',true);return}if(data.settings.preventDuplicateUrls&&c.websites.some(w=>sameUrl(w.url,tab.url))){$('addTabDialog').close();showToast('This website is already in the capsule',true);return}c.websites.push({id:makeId('site'),title:tab.title||tab.url,url:tab.url,favicon:tab.favIconUrl||'',pinned:!!tab.pinned,order:c.websites.length});c.updatedAt=Date.now();await saveData(data);$('addTabDialog').close();render();showToast('Current tab added')});

function exportPayload(capsules){return {version:1,exportedAt:Date.now(),capsules:structuredClone(capsules)}}
function downloadJson(name,payload){const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function exportSingle(id){const c=findCapsule(id);downloadJson(`chrome-capsule-${c.name.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.json`,exportPayload([c]));showToast('Capsule exported')}

$('newCapsuleBtn').onclick=openCreate;$('saveTabsBtn').onclick=()=>saveCurrentTabs(false);$('saveCloseBtn').onclick=()=>saveCurrentTabs(true);$('searchInput').addEventListener('input',render);$('settingsBtn').onclick=()=>chrome.runtime.openOptionsPage();
document.querySelectorAll('[data-close-dialog]').forEach(b=>b.addEventListener('click',e=>e.target.closest('dialog').close()));
document.addEventListener('click',()=>document.querySelectorAll('.menu-panel').forEach(x=>x.hidden=true));
window.addEventListener('unhandledrejection',e=>{console.error(e.reason);showToast('Something went wrong',true)});

(async()=>{try{data=await getData();render()}catch(err){console.error(err);showToast(err.message,true)}})();
