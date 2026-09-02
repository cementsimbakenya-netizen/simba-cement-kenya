(()=>{
const WA='254780079982';
const q=[];
const esc=s=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const priceOf=c=>Number((c.querySelector('.price')?.textContent||'0').replace(/[^0-9]/g,''))||0;
const getProduct=card=>({name:card.querySelector('h3')?.textContent.trim()||'Product',price:priceOf(card)});
function ensureFab(){
 if(document.getElementById('modern-cart-fab'))return;
 const b=document.createElement('button');b.id='modern-cart-fab';b.type='button';b.setAttribute('aria-label','Open quotation');b.innerHTML='🛒<span class="cart-badge">0</span>';document.body.appendChild(b);b.onclick=openQ;
}
function updateBadge(){const b=document.querySelector('#modern-cart-fab .cart-badge');if(b)b.textContent=q.reduce((s,v)=>s+v.qty,0)}
function panel(){
 let x=document.getElementById('quote-panel');
 if(!x){x=document.createElement('div');x.id='quote-panel';document.body.appendChild(x)}
 return x;
}
function render(){
 const x=panel();
 const total=q.reduce((s,v)=>s+v.price*v.qty,0);
 x.innerHTML='<div class="quote-panel"><div class="quote-head"><b>Your quotation</b><button type="button" id="quote-x" aria-label="Close">×</button></div><div id="quote-list">'+(q.length?q.map((v,i)=>'<div class="qrow"><div><b>'+esc(v.name)+'</b><small>KSh '+v.price.toLocaleString()+' each</small></div><div class="qcontrols"><button type="button" data-q="minus" data-i="'+i+'">−</button><span>'+v.qty+'</span><button type="button" data-q="plus" data-i="'+i+'">+</button></div></div>').join(''):'<p>Your quotation is empty.<br>Add products using the buttons below.</p>')+'</div><div id="quote-total">Total: KSh '+total.toLocaleString()+'</div><button type="button" id="quote-send">GET QUOTATION ON WHATSAPP</button></div>';
 x.classList.add('show');
 x.querySelector('#quote-x').onclick=()=>x.classList.remove('show');
 x.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(b.dataset.q==='plus')q[i].qty++;else q[i].qty--;if(q[i].qty<1)q.splice(i,1);render();updateBadge()});
 x.querySelector('#quote-send').onclick=customer;
 updateBadge();
}
function openQ(){render();panel().classList.add('show')}
function customer(){
 if(!q.length){alert('Add at least one product first.');return}
 let b=document.getElementById('customer-box');
 if(!b){
  b=document.createElement('div');b.id='customer-box';b.className='customer-back';
  b.innerHTML='<div class="customer-modal"><h3>Complete your quotation</h3><p>Enter your name, phone number and location. Your quotation will open in WhatsApp.</p><input id="cn" type="text" placeholder="Full name" autocomplete="name"><input id="cp" type="tel" placeholder="Phone number" autocomplete="tel"><input id="cl" type="text" placeholder="Location" autocomplete="address-level2"><div class="ca"><button type="button" id="cc">CANCEL</button><button type="button" id="cg">CONTINUE TO WHATSAPP</button></div></div>';
  document.body.appendChild(b);
  b.querySelector('#cc').onclick=()=>b.classList.remove('show');
  b.querySelector('#cg').onclick=()=>{
   const n=b.querySelector('#cn').value.trim(),ph=b.querySelector('#cp').value.trim(),l=b.querySelector('#cl').value.trim();
   if(!n||!ph||!l){alert('Please enter your name, phone number and location.');return}
   const lines=q.map(v=>'- '+v.name+' x'+v.qty+' = KSh '+(v.price*v.qty).toLocaleString()).join('\n');
   const total=q.reduce((s,v)=>s+v.price*v.qty,0);
   const text='Hello Simba Cement Kenya, I would like a quotation.\n\nName: '+n+'\nPhone: '+ph+'\nLocation: '+l+'\n\nItems:\n'+lines+'\n\nTotal: KSh '+total.toLocaleString();
   window.open('https://wa.me/'+WA+'?text='+encodeURIComponent(text),'_blank','noopener');
   b.classList.remove('show');
  };
 }
 b.classList.add('show');
}
document.addEventListener('click',e=>{
 const btn=e.target.closest('.btn');
 if(btn&&/add to cart|add to quotation/i.test(btn.textContent)){
  e.preventDefault();const c=btn.closest('.card');if(!c)return;const p=getProduct(c);const found=q.find(v=>v.name===p.name);if(found)found.qty++;else q.push({...p,qty:1});render();return;
 }
 if(e.target.closest('.cart-btn'))openQ();
});
document.addEventListener('DOMContentLoaded',()=>{
 ensureFab();
 const form=document.querySelector('.form form')||document.querySelector('.form')?.closest('form')||document.querySelector('form');
 if(form&&!form.dataset.waReady){
  form.dataset.waReady='1';
  form.querySelectorAll('input[type=email],input[name*=email i]').forEach(x=>x.closest('label,div')?.remove());
  form.addEventListener('submit',e=>{
   e.preventDefault();
   const ins=[...form.querySelectorAll('input')];
   const name=ins.find(x=>/name/i.test(x.name+x.placeholder))?.value||ins[0]?.value||'';
   const phone=ins.find(x=>/phone|tel/i.test(x.name+x.placeholder))?.value||ins[1]?.value||'';
   const loc=ins.find(x=>/location|town|address/i.test(x.name+x.placeholder))?.value||ins[2]?.value||'';
   const msg=form.querySelector('textarea')?.value||'';
   if(!name||!phone||!loc){alert('Please enter your name, phone number and location.');return}
   window.open('https://wa.me/'+WA+'?text='+encodeURIComponent('Hello Simba Cement Kenya,\n\nName: '+name+'\nPhone: '+phone+'\nLocation: '+loc+'\nMessage: '+(msg||'General enquiry')),'_blank','noopener');
  });
 }
 const products=document.querySelector('#products');
 if(products&&!products.querySelector('.shop-hint')){const h=document.createElement('div');h.className='shop-hint';h.innerHTML='<a href="shop.html">SHOP / OUR PRODUCTS</a> — click to browse the full catalogue and build a WhatsApp quotation.';products.querySelector('.container')?.prepend(h)}
 updateBadge();
});
})();
