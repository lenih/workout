// Authentication functions

// Check if user is logged in
async function checkAuth() {
    const { data } = await window.supabase.auth.getSession();
    if (data.session) {
        updateUI(data.session.user);
    } else {
        // Redirect to login or show login form
        console.log('User not authenticated');
    }
}

// Update UI with user info
function updateUI(user) {
    const usernameEl = document.getElementById('username');
    if (usernameEl) {
        usernameEl.textContent = user.email || 'User';
    }
}

// Logout function
async function logout() {
    const { error } = await window.supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    } else {
        window.location.href = '/index.html';
    }
}

// Add logout button listener
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
});

export { checkAuth, logout, updateUI };
