const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
function demoNotice(msg){
    const t=$('#toast');
    if(!t){
        alert(msg);
        return
    }
    t.textContent=msg;
    t.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer=setTimeout(()=>t.classList.remove('show'),2800)
}
function demoSubmit(e,thing){
    e.preventDefault();
    demoNotice(thing+' submitted in demo only. Connect PHP/MySQL to save it.');
    e.currentTarget.reset()
}
function demoAction(btn,action){
    const row=btn.closest('tr');
    if(row){
        const statusCell=row.querySelector('td:nth-last-child(2)');
        if(statusCell)statusCell.innerHTML='<span class="status '+(action==='Accepted'?'status-complete':'status-cancelled')+'">'+action+' (demo)</span>';
        btn.parentElement.innerHTML='—'
    }
    demoNotice('Request '+action.toLowerCase()+' in demo only.')
}
function filterTable(input){
    const table=input.closest('.panel').querySelector('table');
    if(!table) return;
    const term=input.value.toLowerCase();
    table.querySelectorAll('tbody tr').forEach(r=>r.hidden=!r.textContent.toLowerCase().includes(term))
}
$('#menuToggle')?.addEventListener('click',()=>$('#sidebar')?.classList.toggle('open'));
document.addEventListener('click',e=>{
    if(innerWidth<=980&&!e.target.closest('#sidebar')&&!e.target.closest('#menuToggle'))$('#sidebar')?.classList.remove('open')
    });
if(window.lucide)lucide.createIcons();

// Navbar toggle
let openNav = document.querySelector('#open');
let closeNav = document.querySelector('#close');
let bottomLinks = document.querySelector('.bottom_links');

// Open navbar
openNav.addEventListener('click', function () {
    bottomLinks.classList.add('active');
    openNav.style.display = 'none';
    closeNav.style.display = 'block';
});

// Close navbar
closeNav.addEventListener('click', function () {
    bottomLinks.classList.remove('active');
    openNav.style.display = 'block';
    closeNav.style.display = 'none';
});
