// API base URL
const API_BASE = '/api';

// Utility functions
function formatCurrency(n) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(n || 0);
}

// API functions
async function fetchAPI(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

async function getMembers() {
  return fetchAPI('/members');
}

async function createMember(member) {
  return fetchAPI('/members', {
    method: 'POST',
    body: JSON.stringify(member)
  });
}

async function deleteMember(id) {
  return fetchAPI(`/members/${id}`, { method: 'DELETE' });
}

async function getContributions() {
  return fetchAPI('/contributions');
}

async function createContribution(contribution) {
  return fetchAPI('/contributions', {
    method: 'POST',
    body: JSON.stringify(contribution)
  });
}

async function getMonthlyTotal() {
  return fetchAPI('/contributions/monthly-total');
}

async function getPledges() {
  return fetchAPI('/pledges');
}

async function createPledge(pledge) {
  return fetchAPI('/pledges', {
    method: 'POST',
    body: JSON.stringify(pledge)
  });
}

async function getTotalPledged() {
  return fetchAPI('/pledges/total');
}

async function getCeremonies() {
  return fetchAPI('/ceremonies');
}

async function createCeremony(ceremony) {
  return fetchAPI('/ceremonies', {
    method: 'POST',
    body: JSON.stringify(ceremony)
  });
}

async function getMonthlyReport() {
  return fetchAPI('/reports/monthly');
}

// DOM elements
const yearEl = document.getElementById('year');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.getElementById('nav-menu');

const memberForm = document.getElementById('member-form');
const memberTableBody = document.querySelector('#member-table tbody');
const memberSelect = document.getElementById('memberSelect');
const pledgeMemberSelect = document.getElementById('pledgeMember');
const ceremonyMemberSelect = document.getElementById('ceremonyMember');

const contributionForm = document.getElementById('contribution-form');
const contribTableBody = document.querySelector('#contrib-table tbody');
const contribTotalEl = document.getElementById('contrib-total');

const pledgeForm = document.getElementById('pledge-form');
const pledgeTableBody = document.querySelector('#pledge-table tbody');
const pledgedEl = document.getElementById('pledged');
const remainingEl = document.getElementById('remaining');
const progressBar = document.getElementById('campaign-progress');

const ceremonyForm = document.getElementById('ceremony-form');
const ceremonyTableBody = document.querySelector('#ceremony-table tbody');
const ceremonyTypeSelect = document.getElementById('ceremonyType');

const btnGenerate = document.getElementById('btn-generate');
const btnPrint = document.getElementById('btn-print');
const reportOutput = document.getElementById('report-output');

const CAMPAIGN_GOAL = 250000;

// Initialization
function refreshYear() {
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
}

function toggleNav() {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!expanded));
  navMenu.classList.toggle('open');
}

// Member management
async function refreshMembersUI() {
  try {
    const members = await getMembers();
    
    // Update member table
    memberTableBody.innerHTML = members.map((m, i) => `
      <tr>
        <td>${m.fullName}</td>
        <td>${m.email}</td>
        <td>${m.householdSize}</td>
        <td>${m.sponsor || ''}</td>
        <td><button data-id="${m.id}" class="btn outline btn-del-member">Delete</button></td>
      </tr>`).join('');

    // Update selects
    const options = ['<option value="" disabled selected hidden>Select…</option>']
      .concat(members.map(m => `<option value="${m.id}">${m.fullName}</option>`)).join('');
    memberSelect.innerHTML = options;
    pledgeMemberSelect.innerHTML = options;
    ceremonyMemberSelect.innerHTML = options;

    // Wire delete buttons
    memberTableBody.querySelectorAll('.btn-del-member').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        await deleteMember(id);
        await refreshMembersUI();
      });
    });
  } catch (error) {
    console.error('Error loading members:', error);
  }
}

// Contributions
async function refreshContributionsUI() {
  try {
    const contributions = await getContributions();
    const response = await getMonthlyTotal();
    
    contribTableBody.innerHTML = contributions.slice(0, 10).map(c => {
      const d = new Date(c.date);
      return `<tr><td>${d.toLocaleDateString()}</td><td>${c.memberName || '—'}</td><td>${c.type}</td><td>${formatCurrency(c.amount)}</td></tr>`;
    }).join('');
    
    contribTotalEl.textContent = formatCurrency(response.total || 0);
  } catch (error) {
    console.error('Error loading contributions:', error);
  }
}

// Pledges
async function refreshPledgesUI() {
  try {
    const pledges = await getPledges();
    const response = await getTotalPledged();
    const pledgedTotal = response.total || 0;
    
    pledgeTableBody.innerHTML = pledges.map(p => {
      const total = Number(p.monthly) * Number(p.months);
      return `<tr><td>${p.memberName || '—'}</td><td>${formatCurrency(p.monthly)}</td><td>${p.months}</td><td>${formatCurrency(total)}</td></tr>`;
    }).join('');
    
    pledgedEl.textContent = formatCurrency(pledgedTotal);
    remainingEl.textContent = formatCurrency(Math.max(CAMPAIGN_GOAL - pledgedTotal, 0));
    const pct = Math.min(100, (pledgedTotal / CAMPAIGN_GOAL) * 100);
    progressBar.style.width = `${pct}%`;
  } catch (error) {
    console.error('Error loading pledges:', error);
  }
}

// Ceremonies
async function refreshCeremoniesUI() {
  try {
    const ceremonies = await getCeremonies();
    ceremonyTableBody.innerHTML = ceremonies.slice(0, 10).map(c => {
      const d = new Date(c.date);
      return `<tr><td>${d.toLocaleDateString()}</td><td>${c.type}</td><td>${c.memberName || '—'}</td></tr>`;
    }).join('');
  } catch (error) {
    console.error('Error loading ceremonies:', error);
  }
}

// Event bindings
function bindEvents() {
  if (navToggle) navToggle.addEventListener('click', toggleNav);

  // Member form
  memberForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = new FormData(memberForm);
    const record = {
      fullName: String(form.get('fullName') || '').trim(),
      email: String(form.get('email') || '').trim(),
      householdSize: Number(form.get('householdSize') || 1),
      sponsor: String(form.get('sponsor') || '').trim()
    };
    if (!record.fullName || !record.email) return;
    
    await createMember(record);
    memberForm.reset();
    await refreshMembersUI();
  });

  // Contribution form
  contributionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amount = Number(document.getElementById('amount').value || 0);
    const type = document.getElementById('type').value;
    const memberId = Number(memberSelect.value);
    if (Number.isNaN(memberId)) return;
    
    await createContribution({
      memberId,
      type,
      amount,
      date: new Date().toISOString()
    });
    contributionForm.reset();
    await refreshContributionsUI();
  });

  // Pledge form
  pledgeForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const memberId = Number(pledgeMemberSelect.value);
    const monthly = Number(document.getElementById('pledgeMonthly').value || 0);
    const months = Number(document.getElementById('pledgeMonths').value || 0);
    if (Number.isNaN(memberId) || monthly <= 0 || months <= 0) return;
    
    await createPledge({ memberId, monthly, months });
    pledgeForm.reset();
    await refreshPledgesUI();
  });

  // Ceremony form
  ceremonyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const type = document.getElementById('ceremonyType').value;
    const memberId = Number(ceremonyMemberSelect.value);
    const date = document.getElementById('ceremonyDate').value;
    if (!date || Number.isNaN(memberId)) return;
    
    await createCeremony({ type, memberId, date });
    ceremonyForm.reset();
    updateCeremonyTypeBackground();
    await refreshCeremoniesUI();
  });

  // Generate report
  btnGenerate.addEventListener('click', async () => {
    const report = await getMonthlyReport();
    reportOutput.innerHTML = `
      <h3>M.O.S.A (MOUNTAIN OF SOLUTION AND ANSWERS) Monthly Report — ${report.monthName} ${report.year}</h3>
      <p><strong>Total Contributions:</strong> ${formatCurrency(report.totalContributions)}</p>
      <p><strong>Ceremonies:</strong> ${report.ceremonyCount}</p>
      <ul>
        ${report.ceremonies.map(c => `<li>${new Date(c.date).toLocaleDateString()} — ${c.type} — ${c.memberName || '—'}</li>`).join('')}
      </ul>
    `;
  });

  btnPrint.addEventListener('click', () => window.print());

  // Baptism dropdown background highlight
  ceremonyTypeSelect.addEventListener('change', updateCeremonyTypeBackground);
  updateCeremonyTypeBackground();
}

function updateCeremonyTypeBackground() {
  // Use the card background color for consistency with the green theme
  if (ceremonyTypeSelect) {
    ceremonyTypeSelect.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--card');
  }
}

async function init() {
  refreshYear();
  bindEvents();
  await refreshMembersUI();
  await refreshContributionsUI();
  await refreshPledgesUI();
  await refreshCeremoniesUI();
}

document.addEventListener('DOMContentLoaded', init);

