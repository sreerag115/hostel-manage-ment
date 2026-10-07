// ============================================================
//  HOSTEL MANAGEMENT SYSTEM - app.js
// ============================================================

// ---- DATA STORE (localStorage) ----
const DB = {
  get(key) {
    try { return JSON.parse(localStorage.getItem('hms_' + key)) || null; } catch { return null; }
  },
  set(key, val) {
    localStorage.setItem('hms_' + key, JSON.stringify(val));
  }
};

// ---- SEED DATA ----
function seedData() {
  if (DB.get('seeded')) return;

  DB.set('users', [
    { id: 'admin', name: 'Admin Warden', role: 'admin', password: 'admin123', department: 'Administration' },
    { id: 'S001', name: 'Arjun Krishnan', role: 'student', password: 'student123', department: 'Computer Science', phone: '9876543210', roomId: '101' },
    { id: 'S002', name: 'Priya Menon', role: 'student', password: 'student123', department: 'Electronics', phone: '9876500001', roomId: '101' },
    { id: 'S003', name: 'Rahul Nair', role: 'student', password: 'student123', department: 'Mechanical', phone: '9876500002', roomId: '102' },
    { id: 'S004', name: 'Anjali Das', role: 'student', password: 'student123', department: 'Civil', phone: '9876500003', roomId: '103' },
    { id: 'S005', name: 'Vikram Singh', role: 'student', password: 'student123', department: 'Computer Science', phone: '9876500004', roomId: '103' },
    { id: 'S006', name: 'Meera Pillai', role: 'student', password: 'student123', department: 'Electronics', phone: '9876500005', roomId: '201' },
  ]);

  DB.set('rooms', [
    { id: '101', number: '101', type: 'Double', capacity: 2, floor: '1st', facilities: ['AC', 'Attached Bath'] },
    { id: '102', number: '102', type: 'Single', capacity: 1, floor: '1st', facilities: ['Fan', 'Common Bath'] },
    { id: '103', number: '103', type: 'Triple', capacity: 3, floor: '1st', facilities: ['Fan', 'Common Bath'] },
    { id: '104', number: '104', type: 'Double', capacity: 2, floor: '1st', facilities: ['AC', 'Attached Bath'] },
    { id: '201', number: '201', type: 'Single', capacity: 1, floor: '2nd', facilities: ['Fan', 'Common Bath'] },
    { id: '202', number: '202', type: 'Double', capacity: 2, floor: '2nd', facilities: ['AC', 'Attached Bath'] },
    { id: '203', number: '203', type: 'Triple', capacity: 3, floor: '2nd', facilities: ['Fan', 'Attached Bath'] },
    { id: '204', number: '204', type: 'Single', capacity: 1, floor: '2nd', facilities: ['AC', 'Attached Bath'] },
    { id: '301', number: '301', type: 'Double', capacity: 2, floor: '3rd', facilities: ['Fan', 'Common Bath'] },
    { id: '302', number: '302', type: 'Triple', capacity: 3, floor: '3rd', facilities: ['AC', 'Attached Bath'] },
    { id: '303', number: '303', type: 'Double', capacity: 2, floor: '3rd', facilities: ['Fan', 'Common Bath'] },
    { id: '304', number: '304', type: 'Single', capacity: 1, floor: '3rd', facilities: ['Fan', 'Common Bath'] },
  ]);

  DB.set('fees', [
    { id: 'F001', studentId: 'S001', amount: 8000, date: '2026-09-01', status: 'paid', month: 'September 2026' },
    { id: 'F002', studentId: 'S002', amount: 8000, date: '2026-09-01', status: 'paid', month: 'September 2026' },
    { id: 'F003', studentId: 'S003', amount: 5000, date: '2026-09-01', status: 'pending', month: 'September 2026' },
    { id: 'F004', studentId: 'S004', amount: 6000, date: '2026-09-01', status: 'paid', month: 'September 2026' },
    { id: 'F005', studentId: 'S005', amount: 6000, date: '2026-09-05', status: 'pending', month: 'September 2026' },
    { id: 'F006', studentId: 'S006', amount: 5000, date: '2026-09-01', status: 'paid', month: 'September 2026' },
    { id: 'F007', studentId: 'S001', amount: 8000, date: '2026-10-01', status: 'pending', month: 'October 2026' },
  ]);

  DB.set('complaints', [
    { id: 'C001', category: 'Maintenance', text: 'The bathroom tap in room 101 is leaking since last week.', date: '2026-10-01', status: 'pending', anonymous: true },
    { id: 'C002', category: 'Food', text: 'Mess food quality has degraded a lot. Rice is always undercooked.', date: '2026-10-03', status: 'resolved', anonymous: true },
    { id: 'C003', category: 'Security', text: 'Outsiders are frequently entering the hostel without proper checking.', date: '2026-10-05', status: 'in-progress', anonymous: true },
    { id: 'C004', category: 'Electricity', text: 'Room 203 has power fluctuation issues affecting our studies.', date: '2026-10-06', status: 'pending', anonymous: true },
  ]);

  DB.set('seeded', true);
}

// ---- HELPERS ----
function getStudents() { return DB.get('users').filter(u => u.role === 'student'); }
function getRooms() { return DB.get('rooms') || []; }
function getStudentsInRoom(roomId) { return getStudents().filter(s => s.roomId === roomId); }
function getVacancy(room) { return room.capacity - getStudentsInRoom(room.id).length; }

function roomStatus(room) {
  const v = getVacancy(room);
  if (v === 0) return 'full';
  if (v === room.capacity) return 'available';
  return 'partial';
}

function nextId(prefix, list) {
  const nums = list.map(i => parseInt(i.id.replace(prefix, '')) || 0);
  const max = nums.length ? Math.max(...nums) : 0;
  return prefix + String(max + 1).padStart(3, '0');
}

function toast(msg, type = 'success') {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', warning: 'fa-exclamation-triangle' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas ${icons[type] || icons.success}"></i> ${msg}`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

function formatDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN');
}

// ---- AUTH ----
let currentUser = null;
let activeRole = 'admin';

function loginAsGuest() {
  currentUser = { id: 'guest', name: 'Guest Viewer', role: 'guest' };
  launchApp();
}

function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const errEl = document.getElementById('loginError');
  errEl.style.display = 'none';

  if (!username || !password) {
    errEl.style.display = 'block';
    errEl.textContent = 'Please enter both username and password.';
    return;
  }

  const users = DB.get('users') || [];
  const user = users.find(u => u.id === username && u.password === password);
  if (!user) {
    errEl.style.display = 'block';
    errEl.textContent = 'Invalid credentials. Try: admin/admin123 or S001/student123';
    return;
  }
  currentUser = user;
  launchApp();
}

function switchRole(role, el) {
  activeRole = role;
  document.querySelectorAll('.role-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

function logout() {
  currentUser = null;
  document.getElementById('mainApp').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginForm').style.opacity = '1';
  document.getElementById('loginForm').style.pointerEvents = 'auto';
  document.querySelectorAll('.role-tab').forEach((t,i) => t.classList.toggle('active', i===0));
}

function launchApp() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('mainApp').style.display = 'block';
  document.getElementById('sidebarName').textContent = currentUser.name;
  document.getElementById('sidebarRole').textContent =
    currentUser.role === 'admin' ? 'Warden / Admin' :
    currentUser.role === 'student' ? 'Student' : 'Guest Viewer';
  document.getElementById('sidebarAvatar').textContent = currentUser.name[0].toUpperCase();
  buildNav();
  navigate('dashboard');
}

// ---- NAVIGATION ----
const NAV = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge' },
    { id: 'rooms', label: 'Room Management', icon: 'fa-door-open' },
    { id: 'students', label: 'Students', icon: 'fa-users' },
    { id: 'allocate', label: 'Room Allocation', icon: 'fa-bed' },
    { id: 'fees', label: 'Fee Management', icon: 'fa-indian-rupee-sign' },
    { id: 'complaints', label: 'Complaints', icon: 'fa-comment-dots' },
    { id: 'reports', label: 'Reports', icon: 'fa-chart-bar' },
  ],
  student: [
    { id: 'dashboard', label: 'My Dashboard', icon: 'fa-gauge' },
    { id: 'rooms', label: 'View Rooms', icon: 'fa-door-open' },
    { id: 'my-fees', label: 'My Fees', icon: 'fa-indian-rupee-sign' },
    { id: 'complaint-box', label: 'Complaint Box', icon: 'fa-comment-dots' },
  ],
  guest: [
    { id: 'rooms', label: 'Room Availability', icon: 'fa-door-open' },
    { id: 'complaint-box', label: 'Submit Complaint', icon: 'fa-comment-dots' },
  ]
};

function buildNav() {
  const nav = document.getElementById('sidebarNav');
  const items = NAV[currentUser.role] || NAV.guest;
  nav.innerHTML = items.map(item =>
    `<div class="nav-item" id="nav-${item.id}" onclick="navigate('${item.id}')">
      <i class="fas ${item.icon}"></i> ${item.label}
    </div>`
  ).join('');
}

function navigate(page) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const activeNav = document.getElementById('nav-' + page);
  if (activeNav) activeNav.classList.add('active');

  const titles = {
    dashboard: 'Dashboard', rooms: 'Room Management', students: 'Student Management',
    allocate: 'Room Allocation', fees: 'Fee Management', complaints: 'Complaints',
    reports: 'Reports', 'my-fees': 'My Fees', 'complaint-box': 'Complaint Box'
  };
  document.getElementById('pageTitle').textContent = titles[page] || page;

  const pages = {
    dashboard: renderDashboard,
    rooms: renderRooms,
    students: renderStudents,
    allocate: renderAllocate,
    fees: renderFees,
    complaints: renderComplaints,
    reports: renderReports,
    'my-fees': renderMyFees,
    'complaint-box': renderComplaintBox,
  };

  const fn = pages[page];
  if (fn) document.getElementById('pageBody').innerHTML = fn();
  else document.getElementById('pageBody').innerHTML = '<p>Page not found.</p>';

  // Close sidebar on mobile after nav
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('open');
  }
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ---- CLOCK ----
function updateClock() {
  const now = new Date();
  document.getElementById('currentTime').textContent =
    now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
    ' | ' + now.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
}

// ============================================================
//  PAGES
// ============================================================

// ---- DASHBOARD ----
function renderDashboard() {
  const rooms = getRooms();
  const students = getStudents();
  const fees = DB.get('fees') || [];
  const complaints = DB.get('complaints') || [];

  const totalRooms = rooms.length;
  const fullRooms = rooms.filter(r => roomStatus(r) === 'full').length;
  const availableRooms = rooms.filter(r => getVacancy(r) > 0).length;
  const totalVacancies = rooms.reduce((sum, r) => sum + getVacancy(r), 0);
  const pendingFees = fees.filter(f => f.status === 'pending').length;
  const pendingComplaints = complaints.filter(c => c.status === 'pending').length;

  if (currentUser.role === 'student') {
    const myRoom = rooms.find(r => r.id === currentUser.roomId);
    const myFees = fees.filter(f => f.studentId === currentUser.id);
    const pendingAmt = myFees.filter(f => f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0);

    return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue"><i class="fas fa-door-open"></i></div>
        <div class="stat-info">
          <div class="stat-value">${myRoom ? myRoom.number : 'N/A'}</div>
          <div class="stat-label">My Room</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green"><i class="fas fa-users"></i></div>
        <div class="stat-info">
          <div class="stat-value">${myRoom ? getStudentsInRoom(myRoom.id).length : 0}/${myRoom ? myRoom.capacity : 0}</div>
          <div class="stat-label">Occupancy</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon yellow"><i class="fas fa-indian-rupee-sign"></i></div>
        <div class="stat-info">
          <div class="stat-value">${fmtCurrency(pendingAmt)}</div>
          <div class="stat-label">Pending Fees</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red"><i class="fas fa-comment-dots"></i></div>
        <div class="stat-info">
          <div class="stat-value">${pendingComplaints}</div>
          <div class="stat-label">Open Complaints</div>
        </div>
      </div>
    </div>

    ${myRoom ? `
    <div class="card mb-6">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-bed"></i> My Room Details</div>
      </div>
      <div class="grid-2">
        <div>
          <p class="text-muted">Room Number</p>
          <p><b>Room ${myRoom.number}</b></p>
        </div>
        <div>
          <p class="text-muted">Room Type</p>
          <p><b>${myRoom.type}</b></p>
        </div>
        <div>
          <p class="text-muted">Floor</p>
          <p><b>${myRoom.floor} Floor</b></p>
        </div>
        <div>
          <p class="text-muted">Facilities</p>
          <p><b>${(myRoom.facilities || []).join(', ')}</b></p>
        </div>
      </div>
      <div class="divider"></div>
      <p class="text-muted mb-4">Roommates</p>
      <div class="gap-2">
        ${getStudentsInRoom(myRoom.id).map(s =>
          `<span class="badge blue"><i class="fas fa-user"></i> ${s.name}${s.id === currentUser.id ? ' (You)' : ''}</span>`
        ).join('')}
      </div>
    </div>` : ''}

    <div class="card">
      <div class="card-title mb-4"><i class="fas fa-bell"></i> Recent Activity</div>
      <div class="table-wrapper">
        <table>
          <thead><tr><th>Month</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            ${myFees.slice(-5).reverse().map(f => `
              <tr>
                <td>${f.month}</td>
                <td>${fmtCurrency(f.amount)}</td>
                <td>${formatDate(f.date)}</td>
                <td><span class="badge ${f.status === 'paid' ? 'green' : 'yellow'}">${f.status}</span></td>
              </tr>`).join('') || '<tr><td colspan="4" style="text-align:center;color:#94a3b8">No fees found</td></tr>'}
          </tbody>
        </table>
      </div>
    </div>`;
  }

  // Admin dashboard
  return `
  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-door-open"></i></div>
      <div class="stat-info">
        <div class="stat-value">${totalRooms}</div>
        <div class="stat-label">Total Rooms</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-door-closed"></i></div>
      <div class="stat-info">
        <div class="stat-value">${availableRooms}</div>
        <div class="stat-label">Rooms with Vacancy</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon yellow"><i class="fas fa-bed"></i></div>
      <div class="stat-info">
        <div class="stat-value">${totalVacancies}</div>
        <div class="stat-label">Total Vacancies</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon cyan"><i class="fas fa-users"></i></div>
      <div class="stat-info">
        <div class="stat-value">${students.length}</div>
        <div class="stat-label">Total Students</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon red"><i class="fas fa-indian-rupee-sign"></i></div>
      <div class="stat-info">
        <div class="stat-value">${pendingFees}</div>
        <div class="stat-label">Pending Fee Records</div>
      </div>
    </div>
    <div class="stat-card">
      <div class="stat-icon yellow"><i class="fas fa-comment-dots"></i></div>
      <div class="stat-info">
        <div class="stat-value">${pendingComplaints}</div>
        <div class="stat-label">Open Complaints</div>
      </div>
    </div>
  </div>

  <div class="grid-2 mb-6">
    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-chart-pie"></i> Room Status</div>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px">
        ${[
          { label: 'Available (Empty)', count: rooms.filter(r => roomStatus(r) === 'available').length, color: 'green' },
          { label: 'Partially Occupied', count: rooms.filter(r => roomStatus(r) === 'partial').length, color: 'yellow' },
          { label: 'Fully Occupied', count: rooms.filter(r => roomStatus(r) === 'full').length, color: 'red' },
        ].map(item => `
          <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span class="text-muted" style="font-size:13px">${item.label}</span>
              <span style="font-weight:700;font-size:13px">${item.count}</span>
            </div>
            <div class="occupancy-bar">
              <div class="occupancy-fill ${item.color}" style="width:${totalRooms ? (item.count/totalRooms*100) : 0}%"></div>
            </div>
          </div>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="card-title"><i class="fas fa-comment-dots"></i> Recent Complaints</div>
      </div>
      ${complaints.slice(-4).reverse().map(c => `
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
          <div class="stat-icon ${c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}" style="width:32px;height:32px;font-size:13px">
            <i class="fas fa-comment"></i>
          </div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600">${c.category}</div>
            <div class="text-muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px">${c.text}</div>
          </div>
          <span class="badge ${c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}">${c.status}</span>
        </div>`).join('') || '<div class="empty-state"><p>No complaints</p></div>'}
    </div>
  </div>

  <div class="card">
    <div class="card-header">
      <div class="card-title"><i class="fas fa-door-open"></i> Room Overview</div>
      <button class="btn-primary" onclick="navigate('rooms')"><i class="fas fa-arrow-right"></i> View All</button>
    </div>
    <div class="rooms-grid">
      ${rooms.slice(0, 8).map(r => buildRoomCard(r)).join('')}
    </div>
  </div>`;
}

// ---- ROOMS ----
function buildRoomCard(room) {
  const occupied = getStudentsInRoom(room.id).length;
  const status = roomStatus(room);
  const pct = (occupied / room.capacity) * 100;
  const fillColor = pct === 0 ? 'green' : pct < 100 ? 'yellow' : 'red';
  const badgeClass = status === 'available' ? 'badge-available' : status === 'partial' ? 'badge-partial' : 'badge-full';
  const badgeLabel = status === 'available' ? 'Available' : status === 'partial' ? 'Partial' : 'Full';

  return `<div class="room-card ${status}" onclick="showRoomDetail('${room.id}')">
    <div class="room-number">Room ${room.number}</div>
    <div class="room-type">${room.type} · ${room.floor} Floor</div>
    <div class="room-occupancy">
      <div class="occupancy-bar">
        <div class="occupancy-fill ${fillColor}" style="width:${pct}%"></div>
      </div>
      <span class="room-occupancy-text">${occupied}/${room.capacity}</span>
    </div>
    <div class="bed-dots">
      ${Array.from({length: room.capacity}, (_, i) => {
        const s = getStudentsInRoom(room.id)[i];
        return `<div class="bed-dot ${s ? 'occupied' : 'empty'}" title="${s ? s.name : 'Vacant'}">${s ? s.name[0] : '+'}</div>`;
      }).join('')}
    </div>
    <div style="margin-top:10px">
      <span class="room-badge ${badgeClass}">${badgeLabel}</span>
      ${getVacancy(room) > 0 ? `<span class="room-badge" style="background:#f0f9ff;color:#0284c7;margin-left:4px">${getVacancy(room)} vacancy</span>` : ''}
    </div>
  </div>`;
}

function renderRooms() {
  const rooms = getRooms();
  const isAdmin = currentUser.role === 'admin';

  return `
  <div class="page-header">
    <h2><i class="fas fa-door-open"></i> Rooms</h2>
    ${isAdmin ? `<button class="btn-primary" onclick="openAddRoomModal()"><i class="fas fa-plus"></i> Add Room</button>` : ''}
  </div>

  <div class="search-bar">
    <input class="search-input" id="roomSearch" placeholder="Search room number..." oninput="filterRooms()"/>
    <select class="filter-select" id="floorFilter" onchange="filterRooms()">
      <option value="">All Floors</option>
      <option>1st</option><option>2nd</option><option>3rd</option>
    </select>
    <select class="filter-select" id="statusFilter" onchange="filterRooms()">
      <option value="">All Status</option>
      <option value="available">Available</option>
      <option value="partial">Partial</option>
      <option value="full">Full</option>
    </select>
    <select class="filter-select" id="typeFilter" onchange="filterRooms()">
      <option value="">All Types</option>
      <option>Single</option><option>Double</option><option>Triple</option>
    </select>
  </div>

  <div id="roomsGrid" class="rooms-grid">
    ${rooms.map(r => buildRoomCard(r)).join('')}
  </div>`;
}

function filterRooms() {
  const query = document.getElementById('roomSearch').value.toLowerCase();
  const floor = document.getElementById('floorFilter').value;
  const status = document.getElementById('statusFilter').value;
  const type = document.getElementById('typeFilter').value;
  const rooms = getRooms().filter(r => {
    if (query && !r.number.toLowerCase().includes(query)) return false;
    if (floor && r.floor !== floor) return false;
    if (status && roomStatus(r) !== status) return false;
    if (type && r.type !== type) return false;
    return true;
  });
  document.getElementById('roomsGrid').innerHTML =
    rooms.length ? rooms.map(r => buildRoomCard(r)).join('') :
    `<div class="empty-state" style="grid-column:1/-1"><i class="fas fa-search"></i><h3>No rooms found</h3></div>`;
}

function showRoomDetail(roomId) {
  const rooms = getRooms();
  const room = rooms.find(r => r.id === roomId);
  if (!room) return;
  const students = getStudentsInRoom(roomId);
  const isAdmin = currentUser.role === 'admin';
  const vacancy = getVacancy(room);

  const html = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal modal-lg">
      <div class="modal-header">
        <div class="modal-title">Room ${room.number} Details</div>
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>

      <div class="grid-2" style="margin-bottom:16px">
        <div><span class="text-muted">Room Number</span><br/><b>${room.number}</b></div>
        <div><span class="text-muted">Type</span><br/><b>${room.type}</b></div>
        <div><span class="text-muted">Floor</span><br/><b>${room.floor} Floor</b></div>
        <div><span class="text-muted">Capacity</span><br/><b>${room.capacity} persons</b></div>
        <div><span class="text-muted">Occupied</span><br/><b>${students.length}</b></div>
        <div><span class="text-muted">Vacancy</span><br/><b style="color:${vacancy>0?'var(--success)':'var(--danger)'}">${vacancy} slot(s)</b></div>
      </div>

      <div class="divider"></div>
      <p class="text-muted" style="margin-bottom:10px;font-size:13px">Facilities</p>
      <div class="gap-2" style="margin-bottom:16px">
        ${(room.facilities||[]).map(f => `<span class="badge blue"><i class="fas fa-check"></i> ${f}</span>`).join('')}
      </div>

      <div class="divider"></div>
      <p class="text-muted" style="margin-bottom:10px;font-size:13px">Bed Allocation (${students.length}/${room.capacity})</p>
      <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px">
        ${Array.from({length: room.capacity}, (_, i) => {
          const s = students[i];
          return `<div style="display:flex;align-items:center;gap:10px;padding:10px;background:${s?'var(--primary-light)':'var(--success-light)'};border-radius:8px">
            <div class="bed-dot ${s ? 'occupied' : 'empty'}" style="width:36px;height:36px">${s ? s.name[0] : '+'}</div>
            <div style="flex:1">
              ${s ? `<b>${s.name}</b><br/><span class="text-muted" style="font-size:12px">${s.id} · ${s.department}</span>` :
              `<b style="color:var(--success)">Vacant Bed ${i+1}</b>`}
            </div>
            ${isAdmin && s ? `<button class="btn-danger" onclick="vacateStudent('${s.id}','${room.id}')"><i class="fas fa-sign-out-alt"></i> Vacate</button>` : ''}
          </div>`;
        }).join('')}
      </div>

      ${isAdmin ? `
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Close</button>
        <button class="btn-danger" onclick="deleteRoom('${room.id}')"><i class="fas fa-trash"></i> Delete Room</button>
      </div>` : `<div class="modal-footer"><button class="btn-secondary" onclick="closeModal()">Close</button></div>`}
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function openAddRoomModal() {
  const html = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title"><i class="fas fa-plus"></i> Add New Room</div>
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="form-group"><label>Room Number</label><input id="rNum" placeholder="e.g. 305"/></div>
      <div class="form-group"><label>Type</label>
        <select id="rType"><option>Single</option><option>Double</option><option>Triple</option></select>
      </div>
      <div class="form-group"><label>Capacity</label><input id="rCap" type="number" min="1" max="4" value="2"/></div>
      <div class="form-group"><label>Floor</label>
        <select id="rFloor"><option>1st</option><option>2nd</option><option>3rd</option></select>
      </div>
      <div class="form-group"><label>Facilities (comma separated)</label>
        <input id="rFacilities" placeholder="AC, Attached Bath"/>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="addRoom()"><i class="fas fa-plus"></i> Add Room</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function addRoom() {
  const num = document.getElementById('rNum').value.trim();
  const type = document.getElementById('rType').value;
  const cap = parseInt(document.getElementById('rCap').value);
  const floor = document.getElementById('rFloor').value;
  const facilities = document.getElementById('rFacilities').value.split(',').map(s => s.trim()).filter(Boolean);

  if (!num) { toast('Room number required', 'error'); return; }
  const rooms = getRooms();
  if (rooms.find(r => r.number === num)) { toast('Room already exists', 'error'); return; }

  rooms.push({ id: num, number: num, type, capacity: cap, floor, facilities });
  DB.set('rooms', rooms);
  closeModal();
  toast('Room added successfully!');
  navigate('rooms');
}

function deleteRoom(roomId) {
  if (!confirm('Delete this room? All student assignments will be removed.')) return;
  let rooms = getRooms().filter(r => r.id !== roomId);
  DB.set('rooms', rooms);
  let users = DB.get('users');
  users = users.map(u => u.roomId === roomId ? { ...u, roomId: null } : u);
  DB.set('users', users);
  closeModal();
  toast('Room deleted.');
  navigate('rooms');
}

function vacateStudent(studentId, roomId) {
  if (!confirm('Vacate this student from the room?')) return;
  let users = DB.get('users');
  users = users.map(u => u.id === studentId ? { ...u, roomId: null } : u);
  DB.set('users', users);
  closeModal();
  toast('Student vacated successfully.');
  navigate('rooms');
}

// ---- STUDENTS ----
function renderStudents() {
  const students = getStudents();
  return `
  <div class="page-header">
    <h2><i class="fas fa-users"></i> Students</h2>
    <button class="btn-primary" onclick="openAddStudentModal()"><i class="fas fa-plus"></i> Add Student</button>
  </div>
  <div class="search-bar">
    <input class="search-input" id="stuSearch" placeholder="Search by name or ID..." oninput="filterStudents()"/>
    <select class="filter-select" id="deptFilter" onchange="filterStudents()">
      <option value="">All Departments</option>
      ${[...new Set(students.map(s=>s.department))].map(d => `<option>${d}</option>`).join('')}
    </select>
    <select class="filter-select" id="stuRoomFilter" onchange="filterStudents()">
      <option value="">All Room Status</option>
      <option value="assigned">Has Room</option>
      <option value="unassigned">No Room</option>
    </select>
  </div>
  <div class="card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Department</th><th>Room</th><th>Phone</th><th>Actions</th></tr>
        </thead>
        <tbody id="studentsTable">
          ${buildStudentRows(students)}
        </tbody>
      </table>
    </div>
  </div>`;
}

function buildStudentRows(students) {
  const rooms = getRooms();
  if (!students.length) return `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-users"></i><h3>No students</h3></div></td></tr>`;
  return students.map(s => {
    const room = rooms.find(r => r.id === s.roomId);
    return `<tr>
      <td><span class="badge gray">${s.id}</span></td>
      <td><b>${s.name}</b></td>
      <td>${s.department}</td>
      <td>${room ? `<span class="badge blue">Room ${room.number}</span>` : `<span class="badge gray">Unassigned</span>`}</td>
      <td>${s.phone || '—'}</td>
      <td>
        <div class="gap-2">
          <button class="btn-info" onclick="openEditStudentModal('${s.id}')"><i class="fas fa-edit"></i></button>
          <button class="btn-danger" onclick="deleteStudent('${s.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');
}

function filterStudents() {
  const q = document.getElementById('stuSearch').value.toLowerCase();
  const dept = document.getElementById('deptFilter').value;
  const roomF = document.getElementById('stuRoomFilter').value;
  const students = getStudents().filter(s => {
    if (q && !s.name.toLowerCase().includes(q) && !s.id.toLowerCase().includes(q)) return false;
    if (dept && s.department !== dept) return false;
    if (roomF === 'assigned' && !s.roomId) return false;
    if (roomF === 'unassigned' && s.roomId) return false;
    return true;
  });
  document.getElementById('studentsTable').innerHTML = buildStudentRows(students);
}

function openAddStudentModal() {
  const rooms = getRooms();
  const html = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title"><i class="fas fa-user-plus"></i> Add Student</div>
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="form-group"><label>Student ID</label><input id="sId" placeholder="e.g. S007"/></div>
      <div class="form-group"><label>Full Name</label><input id="sName" placeholder="Full name"/></div>
      <div class="form-group"><label>Department</label><input id="sDept" placeholder="e.g. Computer Science"/></div>
      <div class="form-group"><label>Phone</label><input id="sPhone" placeholder="Phone number"/></div>
      <div class="form-group"><label>Password</label><input type="password" id="sPass" value="student123"/></div>
      <div class="form-group"><label>Assign Room (optional)</label>
        <select id="sRoom">
          <option value="">— Not Assigned —</option>
          ${rooms.filter(r => getVacancy(r) > 0).map(r => `<option value="${r.id}">Room ${r.number} (${r.type}, ${getVacancy(r)} vacancy)</option>`).join('')}
        </select>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="addStudent()"><i class="fas fa-save"></i> Add</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function addStudent() {
  const id = document.getElementById('sId').value.trim();
  const name = document.getElementById('sName').value.trim();
  const dept = document.getElementById('sDept').value.trim();
  const phone = document.getElementById('sPhone').value.trim();
  const pass = document.getElementById('sPass').value;
  const roomId = document.getElementById('sRoom').value || null;

  if (!id || !name) { toast('ID and Name required', 'error'); return; }
  let users = DB.get('users');
  if (users.find(u => u.id === id)) { toast('Student ID already exists', 'error'); return; }

  users.push({ id, name, role: 'student', password: pass, department: dept, phone, roomId });
  DB.set('users', users);
  closeModal();
  toast('Student added!');
  navigate('students');
}

function openEditStudentModal(studentId) {
  const users = DB.get('users');
  const s = users.find(u => u.id === studentId);
  const rooms = getRooms();
  const html = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title"><i class="fas fa-edit"></i> Edit Student</div>
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="form-group"><label>Full Name</label><input id="esName" value="${s.name}"/></div>
      <div class="form-group"><label>Department</label><input id="esDept" value="${s.department||''}"/></div>
      <div class="form-group"><label>Phone</label><input id="esPhone" value="${s.phone||''}"/></div>
      <div class="form-group"><label>Room</label>
        <select id="esRoom">
          <option value="">— Not Assigned —</option>
          ${rooms.map(r => `<option value="${r.id}" ${r.id===s.roomId?'selected':''}>Room ${r.number} (${r.type})</option>`).join('')}
        </select>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="saveStudent('${studentId}')"><i class="fas fa-save"></i> Save</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function saveStudent(id) {
  let users = DB.get('users');
  users = users.map(u => u.id === id ? {
    ...u,
    name: document.getElementById('esName').value.trim(),
    department: document.getElementById('esDept').value.trim(),
    phone: document.getElementById('esPhone').value.trim(),
    roomId: document.getElementById('esRoom').value || null,
  } : u);
  DB.set('users', users);
  closeModal();
  toast('Student updated!');
  navigate('students');
}

function deleteStudent(id) {
  if (!confirm('Delete this student?')) return;
  let users = DB.get('users').filter(u => u.id !== id);
  DB.set('users', users);
  toast('Student deleted.');
  navigate('students');
}

// ---- ROOM ALLOCATION ----
function renderAllocate() {
  const students = getStudents().filter(s => !s.roomId);
  const rooms = getRooms().filter(r => getVacancy(r) > 0);

  return `
  <div class="page-header">
    <h2><i class="fas fa-bed"></i> Room Allocation</h2>
  </div>
  <div class="grid-2">
    <div class="card">
      <div class="card-title mb-4"><i class="fas fa-user-clock"></i> Unassigned Students (${students.length})</div>
      ${students.length ? students.map(s => `
        <div style="display:flex;align-items:center;gap:10px;padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
          <div class="user-avatar" style="width:36px;height:36px;font-size:14px">${s.name[0]}</div>
          <div style="flex:1">
            <b>${s.name}</b><br/>
            <span class="text-muted" style="font-size:12px">${s.id} · ${s.department}</span>
          </div>
          <button class="btn-primary" onclick="openAllocateModal('${s.id}')">
            <i class="fas fa-bed"></i> Assign
          </button>
        </div>`).join('') :
        `<div class="empty-state"><i class="fas fa-check-circle" style="color:var(--success)"></i><h3>All students assigned!</h3></div>`}
    </div>

    <div class="card">
      <div class="card-title mb-4"><i class="fas fa-door-open"></i> Available Rooms (${rooms.length})</div>
      ${rooms.map(r => `
        <div style="padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <b>Room ${r.number}</b>
            <span class="badge blue">${getVacancy(r)} vacancy</span>
          </div>
          <div class="text-muted" style="font-size:12px;margin-top:4px">${r.type} · ${r.floor} Floor · Capacity: ${r.capacity}</div>
          <div class="occupancy-bar" style="margin-top:8px">
            <div class="occupancy-fill yellow" style="width:${(getStudentsInRoom(r.id).length/r.capacity*100)}%"></div>
          </div>
        </div>`).join('') ||
        `<div class="empty-state"><i class="fas fa-ban"></i><h3>No available rooms</h3></div>`}
    </div>
  </div>`;
}

function openAllocateModal(studentId) {
  const rooms = getRooms().filter(r => getVacancy(r) > 0);
  const users = DB.get('users');
  const s = users.find(u => u.id === studentId);
  const html = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title"><i class="fas fa-bed"></i> Assign Room — ${s.name}</div>
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="form-group"><label>Select Room</label>
        <select id="allocRoom">
          ${rooms.map(r => `<option value="${r.id}">Room ${r.number} (${r.type}, ${getVacancy(r)} vacancy)</option>`).join('')}
        </select>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="allocateRoom('${studentId}')"><i class="fas fa-check"></i> Assign</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function allocateRoom(studentId) {
  const roomId = document.getElementById('allocRoom').value;
  let users = DB.get('users');
  users = users.map(u => u.id === studentId ? { ...u, roomId } : u);
  DB.set('users', users);
  closeModal();
  toast('Room allocated successfully!');
  navigate('allocate');
}

// ---- FEES ----
function renderFees() {
  const fees = DB.get('fees') || [];
  const students = getStudents();

  const totalCollected = fees.filter(f => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0);
  const totalPending = fees.filter(f => f.status === 'pending').reduce((s, f) => s + Number(f.amount), 0);

  return `
  <div class="page-header">
    <h2><i class="fas fa-indian-rupee-sign"></i> Fee Management</h2>
    <button class="btn-primary" onclick="openAddFeeModal()"><i class="fas fa-plus"></i> Add Fee Record</button>
  </div>
  <div class="stats-grid" style="margin-bottom:20px">
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
      <div class="stat-info"><div class="stat-value">${fmtCurrency(totalCollected)}</div><div class="stat-label">Total Collected</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon yellow"><i class="fas fa-clock"></i></div>
      <div class="stat-info"><div class="stat-value">${fmtCurrency(totalPending)}</div><div class="stat-label">Total Pending</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-file-invoice"></i></div>
      <div class="stat-info"><div class="stat-value">${fees.length}</div><div class="stat-label">Total Records</div></div>
    </div>
  </div>
  <div class="card">
    <div class="search-bar">
      <input class="search-input" id="feeSearch" placeholder="Search student..." oninput="filterFees()"/>
      <select class="filter-select" id="feeStatus" onchange="filterFees()">
        <option value="">All Status</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
      </select>
    </div>
    <div class="table-wrapper">
      <table>
        <thead><tr><th>Fee ID</th><th>Student</th><th>Month</th><th>Amount</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody id="feesTable">
          ${buildFeeRows(fees, students)}
        </tbody>
      </table>
    </div>
  </div>`;
}

function buildFeeRows(fees, students) {
  if (!fees.length) return `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-file-invoice"></i><h3>No fee records</h3></div></td></tr>`;
  return fees.map(f => {
    const s = students.find(u => u.id === f.studentId);
    return `<tr>
      <td><span class="badge gray">${f.id}</span></td>
      <td><b>${s ? s.name : f.studentId}</b><br/><span class="text-muted" style="font-size:11px">${f.studentId}</span></td>
      <td>${f.month}</td>
      <td><b>${fmtCurrency(f.amount)}</b></td>
      <td>${formatDate(f.date)}</td>
      <td><span class="badge ${f.status === 'paid' ? 'green' : 'yellow'}">${f.status}</span></td>
      <td>
        ${f.status === 'pending' ? `<button class="btn-success" onclick="markFeePaid('${f.id}')"><i class="fas fa-check"></i> Mark Paid</button>` : '<span class="text-muted">—</span>'}
      </td>
    </tr>`;
  }).join('');
}

function filterFees() {
  const q = document.getElementById('feeSearch').value.toLowerCase();
  const status = document.getElementById('feeStatus').value;
  const students = getStudents();
  let fees = DB.get('fees') || [];
  fees = fees.filter(f => {
    const s = students.find(u => u.id === f.studentId);
    if (q && s && !s.name.toLowerCase().includes(q) && !f.studentId.toLowerCase().includes(q)) return false;
    if (status && f.status !== status) return false;
    return true;
  });
  document.getElementById('feesTable').innerHTML = buildFeeRows(fees, students);
}

function openAddFeeModal() {
  const students = getStudents();
  const html = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title"><i class="fas fa-plus"></i> Add Fee Record</div>
        <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
      </div>
      <div class="form-group"><label>Student</label>
        <select id="fStudent">
          ${students.map(s => `<option value="${s.id}">${s.name} (${s.id})</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label>Month</label><input id="fMonth" placeholder="e.g. October 2026"/></div>
      <div class="form-group"><label>Amount (₹)</label><input id="fAmount" type="number" value="5000"/></div>
      <div class="form-group"><label>Date</label><input id="fDate" type="date" value="${new Date().toISOString().split('T')[0]}"/></div>
      <div class="form-group"><label>Status</label>
        <select id="fStat"><option value="pending">Pending</option><option value="paid">Paid</option></select>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn-primary" onclick="addFee()"><i class="fas fa-save"></i> Save</button>
      </div>
    </div>
  </div>`;
  document.body.insertAdjacentHTML('beforeend', html);
}

function addFee() {
  const fees = DB.get('fees') || [];
  fees.push({
    id: nextId('F', fees),
    studentId: document.getElementById('fStudent').value,
    month: document.getElementById('fMonth').value,
    amount: document.getElementById('fAmount').value,
    date: document.getElementById('fDate').value,
    status: document.getElementById('fStat').value,
  });
  DB.set('fees', fees);
  closeModal();
  toast('Fee record added!');
  navigate('fees');
}

function markFeePaid(feeId) {
  let fees = DB.get('fees') || [];
  fees = fees.map(f => f.id === feeId ? { ...f, status: 'paid' } : f);
  DB.set('fees', fees);
  toast('Marked as paid!');
  navigate('fees');
}

// ---- MY FEES (Student View) ----
function renderMyFees() {
  const fees = (DB.get('fees') || []).filter(f => f.studentId === currentUser.id);
  const total = fees.reduce((s, f) => s + Number(f.amount), 0);
  const paid = fees.filter(f => f.status === 'paid').reduce((s, f) => s + Number(f.amount), 0);
  const pending = total - paid;

  return `
  <div class="page-header">
    <h2><i class="fas fa-indian-rupee-sign"></i> My Fees</h2>
  </div>
  <div class="stats-grid mb-6">
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-receipt"></i></div>
      <div class="stat-info"><div class="stat-value">${fmtCurrency(total)}</div><div class="stat-label">Total Amount</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
      <div class="stat-info"><div class="stat-value">${fmtCurrency(paid)}</div><div class="stat-label">Paid</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon yellow"><i class="fas fa-clock"></i></div>
      <div class="stat-info"><div class="stat-value">${fmtCurrency(pending)}</div><div class="stat-label">Pending</div></div>
    </div>
  </div>
  <div class="card">
    <div class="table-wrapper">
      <table>
        <thead><tr><th>Fee ID</th><th>Month</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>
          ${fees.length ? fees.map(f => `
            <tr>
              <td><span class="badge gray">${f.id}</span></td>
              <td>${f.month}</td>
              <td><b>${fmtCurrency(f.amount)}</b></td>
              <td>${formatDate(f.date)}</td>
              <td><span class="badge ${f.status==='paid'?'green':'yellow'}">${f.status}</span></td>
            </tr>`).join('') :
            `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-file-invoice"></i><h3>No fee records found</h3></div></td></tr>`}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ---- COMPLAINTS (Admin view) ----
function renderComplaints() {
  const complaints = DB.get('complaints') || [];
  return `
  <div class="page-header">
    <h2><i class="fas fa-comment-dots"></i> Complaints</h2>
  </div>
  <div class="stats-grid mb-6">
    ${[
      { label: 'Total', count: complaints.length, color: 'blue', icon: 'fa-list' },
      { label: 'Pending', count: complaints.filter(c=>c.status==='pending').length, color: 'red', icon: 'fa-clock' },
      { label: 'In Progress', count: complaints.filter(c=>c.status==='in-progress').length, color: 'yellow', icon: 'fa-spinner' },
      { label: 'Resolved', count: complaints.filter(c=>c.status==='resolved').length, color: 'green', icon: 'fa-check-circle' },
    ].map(s => `
      <div class="stat-card">
        <div class="stat-icon ${s.color}"><i class="fas ${s.icon}"></i></div>
        <div class="stat-info"><div class="stat-value">${s.count}</div><div class="stat-label">${s.label}</div></div>
      </div>`).join('')}
  </div>
  <div class="search-bar">
    <select class="filter-select" id="complaintStatusFilter" onchange="filterComplaintsAdmin()">
      <option value="">All Status</option>
      <option value="pending">Pending</option>
      <option value="in-progress">In Progress</option>
      <option value="resolved">Resolved</option>
    </select>
    <select class="filter-select" id="complaintCatFilter" onchange="filterComplaintsAdmin()">
      <option value="">All Categories</option>
      ${[...new Set(complaints.map(c=>c.category))].map(c => `<option>${c}</option>`).join('')}
    </select>
  </div>
  <div id="complaintsList">
    ${renderComplaintCards(complaints)}
  </div>`;
}

function renderComplaintCards(complaints) {
  if (!complaints.length) return `<div class="empty-state"><i class="fas fa-comment-slash"></i><h3>No complaints found</h3></div>`;
  return [...complaints].reverse().map(c => `
    <div class="complaint-card">
      <div class="complaint-header">
        <div>
          <div style="font-weight:700;font-size:15px">${c.category}</div>
          <div class="complaint-meta">
            <span class="badge ${c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}">${c.status}</span>
            <span class="badge gray"><i class="fas fa-mask"></i> Anonymous</span>
            <span class="complaint-id">${c.id} · ${formatDate(c.date)}</span>
          </div>
        </div>
        <div class="gap-2">
          ${c.status !== 'resolved' ? `<button class="btn-success" onclick="updateComplaintStatus('${c.id}','resolved')"><i class="fas fa-check"></i> Resolve</button>` : ''}
          ${c.status === 'pending' ? `<button class="btn-warning" onclick="updateComplaintStatus('${c.id}','in-progress')"><i class="fas fa-wrench"></i> In Progress</button>` : ''}
        </div>
      </div>
      <p class="complaint-text">${c.text}</p>
    </div>`).join('');
}

function filterComplaintsAdmin() {
  const status = document.getElementById('complaintStatusFilter').value;
  const cat = document.getElementById('complaintCatFilter').value;
  let complaints = DB.get('complaints') || [];
  if (status) complaints = complaints.filter(c => c.status === status);
  if (cat) complaints = complaints.filter(c => c.category === cat);
  document.getElementById('complaintsList').innerHTML = renderComplaintCards(complaints);
}

function updateComplaintStatus(id, status) {
  let complaints = DB.get('complaints') || [];
  complaints = complaints.map(c => c.id === id ? { ...c, status } : c);
  DB.set('complaints', complaints);
  toast(`Complaint marked as ${status}!`);
  navigate('complaints');
}

// ---- COMPLAINT BOX (Student/Guest view) ----
function renderComplaintBox() {
  const complaints = DB.get('complaints') || [];
  const resolved = complaints.filter(c => c.status === 'resolved').length;

  return `
  <div class="anon-box">
    <i class="fas fa-mask"></i>
    <h3>Anonymous Complaint Box</h3>
    <p>Your identity will never be revealed. Submit your complaint safely and anonymously.</p>
    <select id="complaintCategory">
      <option value="">— Select Category —</option>
      <option>Maintenance</option>
      <option>Food</option>
      <option>Electricity</option>
      <option>Security</option>
      <option>Water Supply</option>
      <option>Internet</option>
      <option>Hygiene</option>
      <option>Noise</option>
      <option>Other</option>
    </select>
    <textarea id="complaintText" placeholder="Describe your complaint in detail..."></textarea>
    <br/>
    <button class="anon-submit" onclick="submitComplaint()">
      <i class="fas fa-paper-plane"></i> Submit Anonymously
    </button>
  </div>

  <div class="stats-grid mb-6">
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-list"></i></div>
      <div class="stat-info"><div class="stat-value">${complaints.length}</div><div class="stat-label">Total Complaints</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon red"><i class="fas fa-clock"></i></div>
      <div class="stat-info"><div class="stat-value">${complaints.filter(c=>c.status==='pending').length}</div><div class="stat-label">Pending</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
      <div class="stat-info"><div class="stat-value">${resolved}</div><div class="stat-label">Resolved</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title mb-4"><i class="fas fa-history"></i> Complaint Status Board (Public)</div>
    ${[...complaints].reverse().map(c => `
      <div style="display:flex;align-items:flex-start;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)">
        <div class="stat-icon ${c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}" style="width:36px;height:36px;font-size:14px;flex-shrink:0">
          <i class="fas ${c.status==='resolved'?'fa-check':'c.status==='in-progress'?'fa-wrench':'fa-clock'}"></i>
        </div>
        <div style="flex:1">
          <div style="font-weight:600">${c.category} <span class="badge ${c.status==='resolved'?'green':c.status==='in-progress'?'yellow':'red'}" style="font-size:11px">${c.status}</span></div>
          <div class="text-muted" style="font-size:13px;margin-top:2px">${c.text}</div>
          <div class="text-muted" style="font-size:11px;margin-top:4px">${formatDate(c.date)}</div>
        </div>
      </div>`).join('') || '<div class="empty-state"><i class="fas fa-comment-slash"></i><h3>No complaints yet</h3></div>'}
  </div>`;
}

function submitComplaint() {
  const category = document.getElementById('complaintCategory').value;
  const text = document.getElementById('complaintText').value.trim();

  if (!category) { toast('Please select a category', 'warning'); return; }
  if (!text || text.length < 10) { toast('Please describe your complaint (min 10 chars)', 'warning'); return; }

  let complaints = DB.get('complaints') || [];
  complaints.push({
    id: nextId('C', complaints),
    category,
    text,
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    anonymous: true,
  });
  DB.set('complaints', complaints);
  document.getElementById('complaintCategory').value = '';
  document.getElementById('complaintText').value = '';
  toast('Complaint submitted anonymously! ✅');
  navigate('complaint-box');
}

// ---- REPORTS ----
function renderReports() {
  const rooms = getRooms();
  const students = getStudents();
  const fees = DB.get('fees') || [];

  const totalCap = rooms.reduce((s, r) => s + r.capacity, 0);
  const occupied = students.filter(s => s.roomId).length;
  const occupancyRate = totalCap ? Math.round((occupied / totalCap) * 100) : 0;

  return `
  <div class="page-header">
    <h2><i class="fas fa-chart-bar"></i> Reports & Analytics</h2>
  </div>
  <div class="stats-grid mb-6">
    <div class="stat-card">
      <div class="stat-icon blue"><i class="fas fa-percent"></i></div>
      <div class="stat-info"><div class="stat-value">${occupancyRate}%</div><div class="stat-label">Occupancy Rate</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon green"><i class="fas fa-indian-rupee-sign"></i></div>
      <div class="stat-info"><div class="stat-value">${fmtCurrency(fees.filter(f=>f.status==='paid').reduce((s,f)=>s+Number(f.amount),0))}</div><div class="stat-label">Revenue Collected</div></div>
    </div>
    <div class="stat-card">
      <div class="stat-icon yellow"><i class="fas fa-hourglass-half"></i></div>
      <div class="stat-info"><div class="stat-value">${fmtCurrency(fees.filter(f=>f.status==='pending').reduce((s,f)=>s+Number(f.amount),0))}</div><div class="stat-label">Revenue Pending</div></div>
    </div>
  </div>

  <div class="grid-2 mb-6">
    <div class="card">
      <div class="card-title mb-4"><i class="fas fa-chart-bar"></i> Room Type Distribution</div>
      ${['Single','Double','Triple'].map(type => {
        const count = rooms.filter(r => r.type === type).length;
        const pct = rooms.length ? (count/rooms.length*100).toFixed(0) : 0;
        return `<div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span>${type} Rooms</span><span><b>${count}</b></span>
          </div>
          <div class="occupancy-bar"><div class="occupancy-fill blue" style="width:${pct}%;background:var(--primary)"></div></div>
        </div>`;
      }).join('')}
    </div>

    <div class="card">
      <div class="card-title mb-4"><i class="fas fa-users"></i> Department Distribution</div>
      ${[...new Set(students.map(s=>s.department))].map(dept => {
        const count = students.filter(s => s.department === dept).length;
        const pct = students.length ? (count/students.length*100).toFixed(0) : 0;
        return `<div style="margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;font-size:13px;margin-bottom:4px">
            <span>${dept}</span><span><b>${count}</b></span>
          </div>
          <div class="occupancy-bar"><div class="occupancy-fill blue" style="width:${pct}%;background:var(--primary)"></div></div>
        </div>`;
      }).join('')}
    </div>
  </div>

  <div class="card">
    <div class="card-title mb-4"><i class="fas fa-list"></i> Floor-wise Room Summary</div>
    <div class="table-wrapper">
      <table>
        <thead><tr><th>Floor</th><th>Total Rooms</th><th>Available</th><th>Partial</th><th>Full</th><th>Students</th></tr></thead>
        <tbody>
          ${['1st','2nd','3rd'].map(floor => {
            const fr = rooms.filter(r => r.floor === floor);
            return `<tr>
              <td><b>${floor} Floor</b></td>
              <td>${fr.length}</td>
              <td><span class="badge green">${fr.filter(r=>roomStatus(r)==='available').length}</span></td>
              <td><span class="badge yellow">${fr.filter(r=>roomStatus(r)==='partial').length}</span></td>
              <td><span class="badge red">${fr.filter(r=>roomStatus(r)==='full').length}</span></td>
              <td>${fr.reduce((s,r)=>s+getStudentsInRoom(r.id).length,0)}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

// ---- MODAL CLOSE ----
function closeModal() {
  const overlay = document.querySelector('.modal-overlay');
  if (overlay) overlay.remove();
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ---- INIT ----
seedData();
setInterval(updateClock, 1000);
updateClock();
