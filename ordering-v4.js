(()=>{
'use strict';
const WA='254780079982',KEY='simba-ordering-v4';
let cart=JSON.parse(localStorage.getItem(KEY)||'[]');
const money=n=>'KSh '+Number(n||0).toLocaleString('en-KE');
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function productCards(){return [...document.querySelectorAll('#products .reference-product-card,#products .card')].filter(c=>c.querySelector('h3,h2'))}
function productFrom(card){
 const name=(card.querySelector('h3,h2')?.textContent||'Product').trim();
 const priceText=card.querySelector('.reference-product-footer strong,.price')?.textContent||'';
 const price=Number(priceText.replace(/[^0-9]/g,''))||0;
 return {id:name.toLowerCase().replace(/[^a-z0-9]+/g,'-'),name,price};
}
function save(){localStorage.setItem(KEY,JSON.stringify(cart));render();decorate();}
function qtyTotal(){return cart.reduce((s,x)=>s+x.qty,0)}
function total(){return cart.reduce((s,x)=>s+x.price*x.qty,0)}
function add(p){const x=cart.find(v=>v.id===p.id);if(x)x.qty++;else cart.push({...p,qty:1});save();openCart()}
function change(i,d){if(!cart[i])return;cart[i].qty+=d;if(cart[i].qty<=0)cart.splice(i,1);save()}
function shell(){if(document.getElementById('ordering-v4-overlay'))return;document.body.insertAdjacentHTML('beforeend',`
<button id="ordering-v4-fab" type="button" aria-label="Open quotation">🛒<span id="ordering-v4-count">0</span></button>
<div id="ordering-v4-overlay" aria-hidden="true"><aside id="ordering-v4-panel">
<div class="ordering-v4-head"><h3>Your quotation</h3><button class="ordering-v4-close" type="button" aria-label="Close">×</button></div>
<div id="ordering-v4-items"></div>
<div class="ordering-v4-bottom"><div class="ordering-v4-total">Total: KSh 0</div>
<div class="ordering-v4-fields"><input id="ordering-v4-name" placeholder="Full name" autocomplete="name"><input id="ordering-v4-phone" placeholder="Phone number" autocomplete="tel"><input id="ordering-v4-location" placeholder="Location" autocomplete="address-level2"></div>
<button id="ordering-v4-send" type="button">SEND QUOTATION TO WHATSAPP</button></div></aside></div>`);
 document.getElementById('ordering-v4-fab').onclick=openCart;
 document.querySelector('.ordering-v4-close').onclick=closeCart;
 document.getElementById('ordering-v4-send').onclick=send;
}
function render(){shell();document.getElementById('ordering-v4-count').textContent=qtyTotal();document.querySelector('.ordering-v4-total').textContent='Total: '+money(total());const box=document.getElementById('ordering-v4-items');box.innerHTML=cart.length?cart.map((x,i)=>`<div class="ordering-v4-row"><div><strong>${esc(x.name)}</strong><small>${money(x.price)} each</small></div><div class="ordering-v4-row-actions"><button type="button" data-o4="minus" data-i="${i}">−</button><span>${x.qty}</span><button type="button" data-o4="plus" data-i="${i}">+</button></div></div>`).join(''):'<div class="ordering-v4-empty">Your quotation is empty.<br>Add products below.</div>'}
function decorate(){
 productCards().forEach(card=>{
  let old=card.querySelector('.reference-add,.reference-add-wide,.add,.btn'); if(old)old.classList.add('ordering-v4-old-action');
  const p=productFrom(card);let w=card.querySelector('.ordering-v4-controls');if(!w){w=document.createElement('div');w.className='ordering-v4-controls';w.innerHTML='<button type="button" class="ordering-v4-minus">−</button><span class="ordering-v4-qty">0</span><button type="button" class="ordering-v4-plus">+</button><button type="button" class="ordering-v4-add">ADD TO QUOTATION</button>';const target=card.querySelector('.reference-product-footer,.product-body')||card;target.appendChild(w);w.querySelector('.ordering-v4-minus').onclick=()=>{const x=cart.find(v=>v.id===p.id);if(x)change(cart.indexOf(x),-1)};w.querySelector('.ordering-v4-plus').onclick=()=>add(p);w.querySelector('.ordering-v4-add').onclick=()=>add(p)}const x=cart.find(v=>v.id===p.id);w.querySelector('.ordering-v4-qty').textContent=x?x.qty:0;
 });
}
function openCart(){shell();render();const o=document.getElementById('ordering-v4-overlay');o.classList.add('open');o.setAttribute('aria-hidden','false')}
function closeCart(){const o=document.getElementById('ordering-v4-overlay');if(o){o.classList.remove('open');o.setAttribute('aria-hidden','true')}}
function send(){if(!cart.length){alert('Please add at least one product.');return}const n=document.getElementById('ordering-v4-name').value.trim(),p=document.getElementById('ordering-v4-phone').value.trim(),l=document.getElementById('ordering-v4-location').value.trim();if(!n||!p||!l){alert('Please enter your name, phone number and location.');return}const lines=cart.map(x=>`- ${x.name} x${x.qty} = ${money(x.price*x.qty)}`).join('\n');const text=`Hello Simba Cement Kenya, I would like a quotation.\n\nName: ${n}\nPhone: ${p}\nLocation: ${l}\n\nItems:\n${lines}\n\nEstimated total: ${money(total())}`;window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text),'_blank','noopener')}
document.addEventListener('click',e=>{const b=e.target.closest('[data-o4]');if(!b)return;change(Number(b.dataset.i),b.dataset.o4==='plus'?1:-1)});
function boot(){shell();decorate();render();setTimeout(()=>{decorate();render()},300);setTimeout(()=>{decorate();render()},1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
