const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const toast = $('#toast');
let toastTimer;

function notify(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

const pageCopy = {
  'Overview': ['Campus overview', "Here's what's happening across CUSTECH Campus Transit today."],
  'Track rides': ['Track rides', 'Monitor active trips and view the latest ride locations. Connect a GPS feed to enable real-time tracking.'],
  'Order a ride': ['Order a ride', 'Create a ride request for a student, staff member, or campus visitor.'],
  'Ride requests': ['Ride requests', 'Review incoming requests and assign an available driver.'],
  'All rides': ['All rides', 'Search and manage ride activity across campus.'],
  'Past rides': ['Past rides', 'Review completed, cancelled, and historical campus trips.'],
  'Drivers': ['Drivers', 'Manage driver profiles, availability, and assigned journeys.'],
  'Students & clients': ['Students & clients', 'Manage passenger accounts and client information.'],
  'Admins & staff': ['Admins & staff', 'Manage administrative users, roles, and permissions.'],
  'Routes & stops': ['Routes & stops', 'Configure campus routes, pickup points, and destinations.'],
  'Fleet & vehicles': ['Fleet & vehicles', 'View vehicle availability, details, and maintenance status.'],
  'Schedules': ['Schedules', 'Plan driver shifts, departure times, and vehicle schedules.'],
  'Payments': ['Payments', 'Review fare payments, transactions, and receipts.'],
  'Reports': ['Reports & analytics', 'Review ride volume, revenue, usage, and operational performance.'],
  'Support': ['Support tickets', 'Review passenger questions, complaints, and transport incidents.'],
  'Settings': ['Settings', 'Configure system preferences, notifications, and access controls.']
};

$$('[data-page]').forEach(button => {
  button.addEventListener('click', () => {
    const page = button.dataset.page;
    const copy = pageCopy[page];
    if (!copy) return;
    $$('.nav-link').forEach(link => link.classList.toggle('active', link.dataset.page === page));
    $('#breadcrumbCurrent').textContent = page;
    $('#pageTitle').innerHTML = `${copy[0]} <span class="wave">✦</span>`;
    $('#pageSubtitle').textContent = copy[1];
    if (page !== 'Overview') notify(`${copy[0]} selected. Connect this menu to your PHP page to load live records.`);
    $('#sidebar').classList.remove('open');
    if (page === 'Order a ride') showRideForm();
    else if (page !== 'Overview') showModuleNotice(page, copy[1]);
    else restoreDashboard();
  });
});

const dashboardMarkup = $('.page-content').innerHTML;
function restoreDashboard() {
  $('.page-content').innerHTML = dashboardMarkup;
  bindDashboardActions();
  if (window.lucide) lucide.createIcons();
}

function showModuleNotice(page, description) {
  // Keep the overview components visible as a design preview; update the title and show a module notice.
  let module = $('#moduleNotice');
  if (!module) {
    module = document.createElement('div');
    module.id = 'moduleNotice';
    module.className = 'notice-bar';
    $('.page-heading').insertAdjacentElement('afterend', module);
  }
  module.innerHTML = `<div class="notice-symbol"><i data-lucide="info"></i></div><div><strong>${page} module selected</strong><p>${description} This front-end demo uses sample data; connect your PHP/MySQL endpoints to make this module functional.</p></div>`;
  if (window.lucide) lucide.createIcons();
}

function showRideForm() {
  let module = $('#moduleNotice');
  if (!module) {
    module = document.createElement('div');
    module.id = 'moduleNotice';
    module.className = 'panel';
    module.style.padding = '20px';
    $('.page-heading').insertAdjacentElement('afterend', module);
  }
  module.innerHTML = `
    <h2 style="font-size:16px;margin-bottom:6px">Create a ride request</h2>
    <p style="color:#8791A0;margin-bottom:18px">Demo form only — connect it to your PHP handler to save rides.</p>
    <form id="rideForm" class="ride-form">
      <div class="form-grid">
        <label>Passenger name<input name="passenger" required placeholder="e.g. Ada Okafor"></label>
        <label>Pickup location<input name="pickup" required placeholder="e.g. Main Gate"></label>
        <label>Destination<input name="destination" required placeholder="e.g. Library"></label>
        <label>Estimated fare (₦)<input name="fare" type="number" min="0" required placeholder="800"></label>
      </div>
      <div style="display:flex;gap:9px;margin-top:14px"><button class="btn btn-primary" type="submit">Create demo request</button><button class="btn btn-light" type="button" id="cancelRideForm">Cancel</button></div>
    </form>`;
  if (window.lucide) lucide.createIcons();
  $('#rideForm').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    notify(`Demo ride created for ${data.get('passenger')}. Connect PHP/MySQL to save it permanently.`);
    e.currentTarget.reset();
  });
  $('#cancelRideForm').addEventListener('click', () => module.remove());
}

function bindDashboardActions() {
  const search = $('#rideSearch');
  if (search) search.addEventListener('input', () => {
    const term = search.value.toLowerCase().trim();
    let count = 0;
    $$('#ridesTable tbody tr').forEach(row => {
      const visible = row.textContent.toLowerCase().includes(term);
      row.hidden = !visible;
      if (visible) count++;
    });
    const shown = $('#shownCount');
    if (shown) shown.textContent = count;
  });

  $$('.request-action').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.request-item');
    const name = $('.person-cell strong', card)?.textContent || 'Ride';
    const action = button.dataset.action;
    card.innerHTML = `<div class="request-top"><strong>${name}</strong><span class="status ${action === 'accept' ? 'status-complete' : 'status-cancelled'}">${action === 'accept' ? 'Accepted (demo)' : 'Declined (demo)'}</span></div><p style="margin:9px 0 0;color:#8791A0;font-size:10px">Sample action only. Save this change through your PHP backend in production.</p>`;
    notify(`${name}'s request ${action}ed in this demo.`);
  }));

  const filter = $('#filterBtn');
  if (filter) filter.addEventListener('click', () => {
    const statuses = ['All statuses', 'Pending', 'In progress', 'Completed', 'Cancelled'];
    const next = (statuses.indexOf(filter.dataset.filter || 'All statuses') + 1) % statuses.length;
    filter.dataset.filter = statuses[next];
    filter.innerHTML = `<i data-lucide="list-filter"></i> ${statuses[next]}`;
    $$('#ridesTable tbody tr').forEach(row => {
      const status = $('.status', row)?.textContent.trim().toLowerCase();
      row.hidden = statuses[next] !== 'All statuses' && status !== statuses[next].toLowerCase();
    });
    if (window.lucide) lucide.createIcons();
  });

  const dismiss = $('.notice-close');
  if (dismiss) dismiss.addEventListener('click', () => $('.notice-bar')?.remove());
  $$('.row-action').forEach(button => button.addEventListener('click', () => notify('Ride details preview: connect this action to your ride details page.')));
  const exportBtn = $('#exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportRides);
}

function exportRides() {
  const rows = [['Ride ID', 'Passenger', 'Driver', 'Route', 'Fare', 'Status']];
  $$('#ridesTable tbody tr').forEach(row => {
    if (row.hidden) return;
    const cells = row.querySelectorAll('td');
    rows.push([
      cells[0]?.innerText.trim(),
      $('.person-cell strong', cells[1])?.innerText.trim(),
      $('.person-cell small', cells[1])?.innerText.replace('Driver: ', '').trim(),
      $('.route-name', cells[2])?.innerText.trim(),
      cells[3]?.innerText.trim(),
      $('.status', cells[4])?.innerText.trim()
    ]);
  });
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
  const link = document.createElement('a');
  link.href = url; link.download = 'custech-transit-rides.csv'; link.click();
  URL.revokeObjectURL(url);
  notify('Ride report exported as CSV.');
}

$('#menuToggle')?.addEventListener('click', () => $('#sidebar').classList.toggle('open'));
document.addEventListener('click', e => {
  if (window.innerWidth <= 980 && !e.target.closest('#sidebar') && !e.target.closest('#menuToggle')) $('#sidebar').classList.remove('open');
});
bindDashboardActions();
if (window.lucide) lucide.createIcons();
