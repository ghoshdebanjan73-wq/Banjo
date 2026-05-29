/**
 * Fleet Precision - Application Logic & Supabase Integration
 * Uses pure ES Modules to fetch Supabase and handle state without build tools.
 */

// Import Supabase Client from ESM CDN
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ----------------------------------------------------
// 1. STATE & CONSTANTS
// ----------------------------------------------------
const STATE = {
  // Supabase Configuration
  supabase: null,
  isDemoMode: true,

  // Auth & Session
  user: null, // Holds user profile/session info

  // Navigation
  activeTab: 'dashboard', // dashboard, fleet, customers, ledger

  // Business Data (Reactive state)
  metrics: {
    tripsCompleted: 2,
    carsActive: 2,
    nextPickup: '6:30 PM',
    earnings: 8500,
    bookingsCount: 4,
    customersCount: 145,
  },
  
  statusCounts: {
    available: 1,
    ontrip: 2,
    service: 1,
  },

  actionItems: [
    {
      id: 1,
      title: 'Service Advisory',
      description: 'Swift Dzire service due in 3 days. Pending payment ₹2,000. Airport pickup scheduled at 6:30 PM.'
    }
  ],

  recentActivity: [
    {
      id: 'act-1',
      initials: 'RS',
      avatarClass: 'rs',
      title: 'Delhi Airport Drop',
      subtitle: 'Rahul Sharma • Vikram Singh',
      time: '10:30 AM',
      status: 'done',
      statusLabel: 'DONE'
    },
    {
      id: 'act-2',
      initials: 'AK',
      avatarClass: 'ak',
      title: 'Jaipur Trip',
      subtitle: 'Amit Kumar • Rajesh Verma',
      time: '11:15 AM',
      status: 'live',
      statusLabel: 'LIVE'
    },
    {
      id: 'act-3',
      initials: 'SP',
      avatarClass: 'sp',
      title: 'Local Ride',
      subtitle: 'Suresh Patel • Assign Pending',
      time: '11:45 AM',
      status: 'wait',
      statusLabel: 'WAIT'
    }
  ]
};

// ----------------------------------------------------
// 2. SUPABASE INITIALIZATION
// ----------------------------------------------------
function initSupabase() {
  // Check if credentials exist in localStorage or global ENV
  const url = localStorage.getItem('NA_SUPABASE_URL') || window.ENV?.VITE_SUPABASE_URL;
  const key = localStorage.getItem('NA_SUPABASE_ANON_KEY') || window.ENV?.VITE_SUPABASE_ANON_KEY;

  if (url && key && url !== 'YOUR_SUPABASE_URL') {
    try {
      STATE.supabase = createClient(url, key);
      STATE.isDemoMode = false;
      console.log('Supabase initialized successfully. Live mode activated.');
      
      // Hook up live auth changes listener
      STATE.supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          STATE.user = session.user;
          showScreen('dashboard-screen');
          fetchLiveDashboardData();
        } else {
          STATE.user = null;
          showScreen('login-screen');
        }
      });
    } catch (err) {
      console.error('Failed to initialize Supabase, reverting to Demo Mode:', err);
      STATE.isDemoMode = true;
    }
  } else {
    console.log('No Supabase credentials found. Running in Offline Demo Mode.');
    STATE.isDemoMode = true;
    
    // Check if user session already exists in localStorage (Demo persistence)
    const savedDemoUser = localStorage.getItem('NA_DEMO_USER');
    if (savedDemoUser) {
      STATE.user = JSON.parse(savedDemoUser);
      setTimeout(() => {
        showScreen('dashboard-screen');
        renderDashboard();
      }, 500);
    } else {
      showScreen('login-screen');
    }
  }
}

// ----------------------------------------------------
// 3. AUTHENTICATION CONTROLLER
// ----------------------------------------------------
async function handleSignIn(phone, password) {
  showToast('Signing in...');
  
  if (STATE.isDemoMode) {
    // Simulated successful login in Demo mode
    setTimeout(() => {
      // Create fake user object
      STATE.user = {
        phone: phone || '9876543210',
        email: 'manager@fleetprecision.com',
        user_metadata: { name: 'S. Mukherjee', role: 'Fleet Director' }
      };
      
      localStorage.setItem('NA_DEMO_USER', JSON.stringify(STATE.user));
      showToast('Welcome back, Mukherjee!');
      showScreen('dashboard-screen');
      renderDashboard();
    }, 1200);
    return;
  }

  // Live Supabase Auth
  try {
    // Supabase standard signin (using email or phone)
    // For convenience of demo, if phone doesn't contain @, we try phone login, otherwise email login
    let result;
    if (phone.includes('@')) {
      result = await STATE.supabase.auth.signInWithPassword({
        email: phone,
        password: password,
      });
    } else {
      // Supabase phone authentication
      result = await STATE.supabase.auth.signInWithPassword({
        phone: phone.startsWith('+') ? phone : `+91${phone}`,
        password: password,
      });
    }

    if (result.error) throw result.error;
    
    STATE.user = result.data.user;
    showToast('Signed In Successfully!');
    showScreen('dashboard-screen');
    renderDashboard();
  } catch (error) {
    showToast(`Auth Error: ${error.message || error}`);
    console.error(error);
  }
}

async function handleSignOut() {
  showToast('Signing out...');
  
  if (STATE.isDemoMode) {
    setTimeout(() => {
      STATE.user = null;
      localStorage.removeItem('NA_DEMO_USER');
      showScreen('login-screen');
      showToast('Logged out');
    }, 800);
    return;
  }

  try {
    const { error } = await STATE.supabase.auth.signOut();
    if (error) throw error;
    
    STATE.user = null;
    showScreen('login-screen');
    showToast('Logged out');
  } catch (error) {
    showToast(`Error: ${error.message}`);
  }
}

// ----------------------------------------------------
// 4. DATA SYNCHRONIZATION (SUPABASE / LOCAL)
// ----------------------------------------------------
async function fetchLiveDashboardData() {
  if (STATE.isDemoMode) return;

  try {
    // Attempt to load live numbers from Supabase if tables exist
    // Let's check table 'bookings', 'vehicles', etc.
    const { data: bookings, error: bError } = await STATE.supabase
      .from('bookings')
      .select('*');

    const { data: vehicles, error: vError } = await STATE.supabase
      .from('vehicles')
      .select('*');

    if (!bError && bookings) {
      STATE.metrics.bookingsCount = bookings.length;
      STATE.metrics.tripsCompleted = bookings.filter(b => b.status === 'completed').length;
      // Recalculate other metrics
    }
    
    if (!vError && vehicles) {
      STATE.statusCounts.available = vehicles.filter(v => v.status === 'available').length;
      STATE.statusCounts.ontrip = vehicles.filter(v => v.status === 'ontrip').length;
      STATE.statusCounts.service = vehicles.filter(v => v.status === 'service').length;
      STATE.metrics.carsActive = STATE.statusCounts.ontrip;
    }

    renderDashboard();
  } catch (err) {
    console.log('Database tables not ready yet. Running with offline UI states.');
  }
}

// Write a new booking (Supports Live DB and Demo State)
async function addBooking(bookingData) {
  showToast('Creating Booking...');
  
  const newActivity = {
    id: `act-${Date.now()}`,
    initials: bookingData.customerName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    avatarClass: 'rs',
    title: `${bookingData.pickup} to ${bookingData.dropoff}`,
    subtitle: `${bookingData.customerName} • ${bookingData.vehicle || 'Unassigned'}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: bookingData.vehicle ? 'live' : 'wait',
    statusLabel: bookingData.vehicle ? 'LIVE' : 'WAIT'
  };

  if (STATE.isDemoMode) {
    // Add to local state
    STATE.recentActivity.unshift(newActivity);
    STATE.metrics.bookingsCount += 1;
    if (bookingData.vehicle) {
      STATE.metrics.carsActive += 1;
      STATE.statusCounts.ontrip += 1;
      if (STATE.statusCounts.available > 0) STATE.statusCounts.available -= 1;
    }
    
    setTimeout(() => {
      closeAllModals();
      renderDashboard();
      showToast('Booking Created successfully!');
    }, 800);
    return;
  }

  try {
    // Save to Supabase 'bookings' table
    const { error } = await STATE.supabase
      .from('bookings')
      .insert([
        {
          customer_name: bookingData.customerName,
          pickup_location: bookingData.pickup,
          dropoff_location: bookingData.dropoff,
          vehicle_assigned: bookingData.vehicle || null,
          status: bookingData.vehicle ? 'live' : 'pending'
        }
      ]);
      
    if (error) throw error;

    await fetchLiveDashboardData();
    closeAllModals();
    showToast('Booking Created successfully!');
  } catch (error) {
    showToast(`Failed to create booking: ${error.message}`);
  }
}

// ----------------------------------------------------
// 5. DOM RENDERING & VIEW CONTROLLER
// ----------------------------------------------------
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(scr => {
    if (scr.id === screenId) {
      scr.classList.remove('hidden');
    } else {
      scr.classList.add('hidden');
    }
  });

  // Hide or Show bottom navigation depending on login
  const bottomNav = document.getElementById('app-bottom-nav');
  const fabBtn = document.getElementById('app-fab');
  if (screenId === 'login-screen') {
    bottomNav.style.display = 'none';
    fabBtn.style.display = 'none';
  } else {
    bottomNav.style.display = 'flex';
    fabBtn.style.display = 'flex';
  }
}

function renderDashboard() {
  // Update Profile Initials & online state
  const avatar = document.getElementById('profile-avatar-text');
  if (avatar && STATE.user) {
    const name = STATE.user.user_metadata?.name || 'SM';
    avatar.textContent = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // Update Overview Metrics
  document.getElementById('m-completed').textContent = STATE.metrics.tripsCompleted;
  document.getElementById('m-active-cars').textContent = STATE.metrics.carsActive;
  document.getElementById('m-next-pickup').textContent = STATE.metrics.nextPickup;
  document.getElementById('m-earnings').textContent = `₹${STATE.metrics.earnings.toLocaleString('en-IN')}`;

  // Update Grid metrics
  document.getElementById('grid-bookings').textContent = STATE.metrics.bookingsCount;
  document.getElementById('grid-active-cars').textContent = STATE.metrics.carsActive;
  document.getElementById('grid-customers').textContent = STATE.metrics.customersCount;
  document.getElementById('grid-earnings').textContent = `₹${(STATE.metrics.earnings / 1000).toFixed(1)}k`;

  // Update Fleet Statuses
  document.getElementById('stat-available').textContent = STATE.statusCounts.available;
  document.getElementById('stat-ontrip').textContent = STATE.statusCounts.ontrip;
  document.getElementById('stat-service').textContent = STATE.statusCounts.service;

  // Render Action Items
  const actionList = document.getElementById('action-items-container');
  if (actionList) {
    actionList.innerHTML = STATE.actionItems.map(item => `
      <div class="action-items-card">
        <div class="action-icon-container">
          <span class="material-symbols-rounded">notifications_active</span>
        </div>
        <div class="action-details">
          <div class="action-title">${item.title}</div>
          <div class="action-description">${item.description}</div>
        </div>
      </div>
    `).join('');
  }

  // Render Recent Activity
  const activityContainer = document.getElementById('recent-activity-container');
  if (activityContainer) {
    activityContainer.innerHTML = STATE.recentActivity.map(act => `
      <div class="activity-row" id="${act.id}">
        <div class="activity-left">
          <div class="initials-avatar ${act.avatarClass}">${act.initials}</div>
          <div class="activity-info">
            <div class="activity-name">${act.title}</div>
            <div class="activity-meta">${act.subtitle}</div>
          </div>
        </div>
        <div class="activity-right">
          <div class="activity-time">${act.time}</div>
          <span class="status-chip ${act.status}">${act.statusLabel}</span>
        </div>
      </div>
    `).join('');
  }
}

// Toast System
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('active');
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

// Modal System
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
}

// ----------------------------------------------------
// 6. EVENT BINDINGS
// ----------------------------------------------------
function bindEvents() {
  // Login form submission
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('login-phone').value.trim();
      const pass = document.getElementById('login-password').value.trim();
      
      if (!phone || !pass) {
        showToast('Please fill all credentials!');
        return;
      }
      handleSignIn(phone, pass);
    });
  }

  // Password Visibility Toggle
  const passToggle = document.getElementById('password-toggle');
  if (passToggle) {
    passToggle.addEventListener('click', () => {
      const passField = document.getElementById('login-password');
      const icon = passToggle.querySelector('.material-symbols-rounded');
      if (passField.type === 'password') {
        passField.type = 'text';
        icon.textContent = 'visibility';
      } else {
        passField.type = 'password';
        icon.textContent = 'visibility_off';
      }
    });
  }

  // OTP Button Handler
  const otpBtn = document.getElementById('btn-otp');
  if (otpBtn) {
    otpBtn.addEventListener('click', () => {
      const phone = document.getElementById('login-phone').value.trim();
      if (!phone) {
        showToast('Please enter a phone number first!');
        return;
      }
      showToast('OTP request sent to ' + phone);
      
      // Simulated OTP Signin
      setTimeout(() => {
        STATE.user = {
          phone: phone,
          email: 'driver@fleetprecision.com',
          user_metadata: { name: 'K. Sharma', role: 'Lead Operator' }
        };
        localStorage.setItem('NA_DEMO_USER', JSON.stringify(STATE.user));
        showToast('Operator Signed In!');
        showScreen('dashboard-screen');
        renderDashboard();
      }, 1500);
    });
  }

  // Navigation Items Tab Clicking
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      
      const tabName = item.getAttribute('data-tab');
      item.classList.add('active');
      STATE.activeTab = tabName;
      
      showToast(`Switched to ${tabName.toUpperCase()}`);
    });
  });

  // FAB Button (Add Booking quick launcher)
  const fab = document.getElementById('app-fab');
  if (fab) {
    fab.addEventListener('click', () => {
      openModal('modal-add-booking');
    });
  }

  // Header quick buttons
  const addBookingQuick = document.getElementById('quick-add-booking');
  if (addBookingQuick) {
    addBookingQuick.addEventListener('click', () => {
      openModal('modal-add-booking');
    });
  }

  const assignCarQuick = document.getElementById('quick-assign-car');
  if (assignCarQuick) {
    assignCarQuick.addEventListener('click', () => {
      openModal('modal-assign-car');
    });
  }

  // Profile icon logout binder
  const avatar = document.getElementById('profile-avatar');
  if (avatar) {
    avatar.addEventListener('click', () => {
      if (confirm('Are you sure you want to sign out?')) {
        handleSignOut();
      }
    });
  }

  // Modal Closures
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  // Form Submissions - Add Booking
  const bookingForm = document.getElementById('form-add-booking');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const customerName = document.getElementById('book-name').value.trim();
      const pickup = document.getElementById('book-pickup').value.trim();
      const dropoff = document.getElementById('book-dropoff').value.trim();
      const vehicle = document.getElementById('book-vehicle').value;

      if (!customerName || !pickup || !dropoff) {
        showToast('All location and customer details required!');
        return;
      }

      addBooking({ customerName, pickup, dropoff, vehicle });
    });
  }

  // Form Submissions - Assign Car
  const assignForm = document.getElementById('form-assign-car');
  if (assignForm) {
    assignForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const driver = document.getElementById('assign-driver').value.trim();
      const vehicle = document.getElementById('assign-vehicle').value;

      if (!driver) {
        showToast('Please specify driver name!');
        return;
      }

      showToast(`Assigning vehicle to ${driver}...`);
      
      // Dynamic shift state
      setTimeout(() => {
        STATE.statusCounts.ontrip += 1;
        if (STATE.statusCounts.available > 0) STATE.statusCounts.available -= 1;
        STATE.metrics.carsActive += 1;
        
        STATE.recentActivity.unshift({
          id: `act-${Date.now()}`,
          initials: driver.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
          avatarClass: 'ak',
          title: `Local Transit Assignment`,
          subtitle: `${driver} • ${vehicle}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'live',
          statusLabel: 'LIVE'
        });

        closeAllModals();
        renderDashboard();
        showToast(`Vehicle ${vehicle} assigned to ${driver}!`);
      }, 1000);
    });
  }

  // NX Title double click developer configuration drawer
  const logoCircle = document.getElementById('nx-logo');
  if (logoCircle) {
    logoCircle.addEventListener('click', () => {
      // Secret developer console click handler to hook up Supabase keys
      const currentUrl = localStorage.getItem('NA_SUPABASE_URL') || '';
      const currentKey = localStorage.getItem('NA_SUPABASE_ANON_KEY') || '';
      
      const newUrl = prompt('Enter your Supabase URL (leave blank to clear and run in Demo Mode):', currentUrl);
      if (newUrl === null) return;
      
      if (!newUrl) {
        localStorage.removeItem('NA_SUPABASE_URL');
        localStorage.removeItem('NA_SUPABASE_ANON_KEY');
        showToast('Supabase keys cleared. Switched to offline demo mode.');
        location.reload();
        return;
      }

      const newKey = prompt('Enter your Supabase Anon Key:', currentKey);
      if (!newKey) return;

      localStorage.setItem('NA_SUPABASE_URL', newUrl);
      localStorage.setItem('NA_SUPABASE_ANON_KEY', newKey);
      showToast('Supabase configured successfully! Reloading...');
      
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }
}

// ----------------------------------------------------
// 7. INITIALIZATION CALL
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  initSupabase();
  bindEvents();
});
