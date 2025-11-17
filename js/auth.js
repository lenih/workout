// Authentication functions
const supabaseUrl = window.supabaseConfig?.url || '';
const supabaseKey = window.supabaseConfig?.key || '';
const supabase = window.supabase?.createClient(supabaseUrl, supabaseKey);

// Check if user is logged in
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        updateUI(session.user);
    } else {
        // Redirect to login if not authenticated
        console.log('User not authenticated');
    }
}

// Update UI with user info
function updateUI(user) {
    const userNameEl = document.getElementById('username');
    if (userNameEl) {
        userNameEl.textContent = user.email || 'User';
    }
}

// Logout function
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error', error);
    } else {
        window.location.href = 'login.html';
    }
}

// Add logout button listener
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Listen for auth changes
if (supabase) {
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
            window.location.href = 'login.html';
        }
        if (event === 'SIGNED_IN') {
            // User signed in
            console.log('User signed in');
        }
    });
}

export { checkAuth, handleLogout, updateUI };
