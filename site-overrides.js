(()=>{
'use strict';
const WA='254780079982';
const KEY='simba-cement-cart-v4';
let cart=[];
try{cart=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(cart))cart=[];}catch(e){cart=[];}
const money=n=>'KSh '+Number(n||0).toLocaleString('en-KE');
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const productCards=()=>[...document.querySelectorAll('#products .reference-product-card,#products .card')].filter(c=>c.querySelector('h3,h2'));
const productFromCard=card=>{
  const title=card.querySelector('h3,h2')?.textContent.trim()||'Product';
  const priceText=card.querySelector('.reference-product-footer strong,.price')?.textContent||'';
  const price=Number(priceText.replace(/[^0-9]/g,''))||0;
  const id=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  return {id,name:title,price};
};
function ensureUi(){
  if(document.getElementById('sc-cart-launch'))return;
  document.body.insertAdjacentHTML('beforeend',`
    <button id="sc-cart-launch" type="button" aria-label="Open quotation">
      <span aria-hidden="true">🛒</span><b id="sc-cart-count">0</b>
    </button>
    <div id="sc-cart-overlay" aria-hidden="true">
      <aside id="sc-cart" role="dialog" aria-modal="true" aria-labelledby="sc-cart-title">
        <div class="sc-cart-head"><div><small>ORDER BUILDER</small><h2 id="sc-cart-title">Your quotation</h2></div><button id="sc-cart-close" type="button" aria-label="Close">×</button></div>
        <div id="sc-cart-items"></div>
        <div class="sc-cart-summary"><span>Estimated total</span><strong id="sc-cart-total">KSh 0</strong></div>
        <div class="sc-customer"><input id="sc-name" type="text" placeholder="Full name" autocomplete="name"><input id="sc-phone" type="tel" placeholder="Phone number" autocomplete="tel"><input id="sc-location" type="text" placeholder="Location" autocomplete="address-level2"></div>
        <button id="sc-send" type="button">SEND QUOTATION TO WHATSAPP</button>
        <p class="sc-note">Your quotation is prepared first. WhatsApp opens only after your details are complete.</p>
      </aside>
    </div>`);
  document.getElementById('sc-cart-launch').addEventListener('click',openCart);
  document.getElementById('sc-cart-close').addEventListener('click',closeCart);
  document.getElementById('sc-cart-overlay').addEventListener('click',e=>{if(e.target.id==='sc-cart-overlay')closeCart();});
  document.getElementById('sc-send').addEventListener('click',sendQuotation);
}
function save(){localStorage.setItem(KEY,JSON.stringify(cart));renderCart();decorateProducts();}
function addProduct(p){const item=cart.find(x=>x.id===p.id);if(item)item.qty+=1;else cart.push({...p,qty:1});save();openCart();}
function setQty(id,delta){const i=cart.findIndex(x=>x.id===id);if(i<0)return;cart[i].qty+=delta;if(cart[i].qty<=0)cart.splice(i,1);save();}
function renderCart(){
  ensureUi();
  const count=cart.reduce((s,x)=>s+x.qty,0), total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  document.getElementById('sc-cart-count').textContent=count;
  document.getElementById('sc-cart-total').textContent=money(total);
  const list=document.getElementById('sc-cart-items');
  list.innerHTML=cart.length?cart.map(x=>`<div class="sc-cart-row"><div><strong>${esc(x.name)}</strong><small>${money(x.price)} each</small></div><div class="sc-qty"><button type="button" data-qty="-1" data-id="${esc(x.id)}">−</button><span>${x.qty}</span><button type="button" data-qty="1" data-id="${esc(x.id)}">+</button></div></div>`).join(''):`<div class="sc-empty">Your quotation is empty.<br><span>Select products below to start your order.</span></div>`;
  list.querySelectorAll('[data-qty]').forEach(b=>b.addEventListener('click',()=>setQty(b.dataset.id,Number(b.dataset.qty))));
}
function decorateProducts(){
  productCards().forEach(card=>{
    const p=productFromCard(card);
    let controls=card.querySelector('.sc-product-controls');
    if(!controls){
      controls=document.createElement('div');
      controls.className='sc-product-controls';
      controls.innerHTML='<button type="button" class="sc-minus">−</button><span class="sc-product-count">0</span><button type="button" class="sc-plus">+</button><button type="button" class="sc-add">ADD TO QUOTATION</button>';
      const target=card.querySelector('.reference-product-footer,.product-body')||card;
      target.appendChild(controls);
      controls.querySelector('.sc-minus').addEventListener('click',()=>setQty(p.id,-1));
      controls.querySelector('.sc-plus').addEventListener('click',()=>addProduct(p));
      controls.querySelector('.sc-add').addEventListener('click',()=>addProduct(p));
    }
    const item=cart.find(x=>x.id===p.id);
    controls.querySelector('.sc-product-count').textContent=item?item.qty:0;
  });
}
function openCart(){ensureUi();renderCart();document.getElementById('sc-cart-overlay').classList.add('open');document.getElementById('sc-cart-overlay').setAttribute('aria-hidden','false');}
function closeCart(){document.getElementById('sc-cart-overlay')?.classList.remove('open');document.getElementById('sc-cart-overlay')?.setAttribute('aria-hidden','true');}
function sendQuotation(){
  if(!cart.length){alert('Please add at least one product to your quotation.');return;}
  const name=document.getElementById('sc-name').value.trim();
  const phone=document.getElementById('sc-phone').value.trim();
  const location=document.getElementById('sc-location').value.trim();
  if(!name||!phone||!location){alert('Please enter your name, phone number and location.');return;}
  const lines=cart.map(x=>`- ${x.name} × ${x.qty} = ${money(x.price*x.qty)}`).join('\n');
  const total=cart.reduce((s,x)=>s+x.price*x.qty,0);
  const text=`Hello Simba Cement Kenya, I would like a quotation.\n\nName: ${name}\nPhone: ${phone}\nLocation: ${location}\n\nItems:\n${lines}\n\nEstimated total: ${money(total)}`;
  window.open(`https://wa.me/${WA}?text=${encodeURIComponent(text)}`,'_blank','noopener');
}
function boot(){ensureUi();decorateProducts();renderCart();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();