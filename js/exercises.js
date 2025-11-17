// Initialize Supabase
const supabaseUrl = window.supabaseConfig.url;
const supabaseKey = window.supabaseConfig.key;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let currentUserId = null;
let allExercises = [];
let filteredExercises = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }
    currentUserId = session.user.id;
    
    // Set today's date as default
    document.getElementById('date').valueAsDate = new Date();
    
    // Load exercises
    loadExercises();
    
    // Setup event listeners
    document.getElementById('exerciseForm').addEventListener('submit', handleAddExercise);
    document.getElementById('searchFilter').addEventListener('input', handleSearch);
});

// Show message
function showMessage(message, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = message;
    messageEl.className = 'message ' + type;
    
    if (type === 'success') {
        setTimeout(() => {
            messageEl.className = 'message';
        }, 3000);
    }
}

// Load exercises from Supabase
async function loadExercises() {
    try {
        const { data, error } = await supabase
            .from('exercises')
            .select('*')
            .eq('user_id', currentUserId)
            .order('date', { ascending: false });
        
        if (error) throw error;
        
        allExercises = data || [];
        filteredExercises = [...allExercises];
        displayExercises(filteredExercises);
    } catch (error) {
        console.error('Error loading exercises:', error.message);
        showMessage('Ошибка при загрузке упражнений', 'error');
    }
}

// Display exercises
function displayExercises(exercises) {
    const container = document.getElementById('exercisesList');
    
    if (exercises.length === 0) {
        container.innerHTML = '<div class="empty-state">Нет упражнений. Добавьте первое!</div>';
        return;
    }
    
    container.innerHTML = exercises.map(exercise => `
        <div class="exercise-item">
            <h3>${escapeHtml(exercise.name)}</h3>
            <div class="exercise-details">
                <div class="detail-field">
                    <div class="detail-label">Подходы</div>
                    <div class="detail-value">${exercise.sets}</div>
                </div>
                <div class="detail-field">
                    <div class="detail-label">Повторения</div>
                    <div class="detail-value">${exercise.reps}</div>
                </div>
                ${exercise.weight ? `
                <div class="detail-field">
                    <div class="detail-label">Вес</div>
                    <div class="detail-value">${exercise.weight} кг</div>
                </div>
                ` : ''}
                <div class="detail-field">
                    <div class="detail-label">Дата</div>
                    <div class="detail-value">${formatDate(exercise.date)}</div>
                </div>
            </div>
            ${exercise.notes ? `
            <div class="detail-field">
                <div class="detail-label">Заметки</div>
                <div class="detail-value">${escapeHtml(exercise.notes)}</div>
            </div>
            ` : ''}
            <div class="exercise-actions">
                <button class="btn-delete" onclick="deleteExercise(${exercise.id})">Удалить</button>
            </div>
        </div>
    `).join('');
}

// Add exercise
async function handleAddExercise(e) {
    e.preventDefault();
    
    const name = document.getElementById('exerciseName').value.trim();
    const sets = parseInt(document.getElementById('sets').value);
    const reps = parseInt(document.getElementById('reps').value);
    const weight = document.getElementById('weight').value ? parseFloat(document.getElementById('weight').value) : null;
    const date = document.getElementById('date').value;
    const notes = document.getElementById('notes').value.trim();
    
    if (!name || !sets || !reps || !date) {
        showMessage('Заполните все обязательные поля', 'error');
        return;
    }
    
    try {
        const { error } = await supabase
            .from('exercises')
            .insert([{
                user_id: currentUserId,
                name,
                sets,
                reps,
                weight,
                date,
                notes,
                created_at: new Date().toISOString()
            }]);
        
        if (error) throw error;
        
        showMessage('Упражнение добавлено успешно!', 'success');
        document.getElementById('exerciseForm').reset();
        document.getElementById('date').valueAsDate = new Date();
        loadExercises();
    } catch (error) {
        console.error('Error adding exercise:', error.message);
        showMessage('Ошибка при добавлении упражнения', 'error');
    }
}

// Delete exercise
async function deleteExercise(exerciseId) {
    if (!confirm('Вы уверены, что хотите удалить это упражнение?')) {
        return;
    }
    
    try {
        const { error } = await supabase
            .from('exercises')
            .delete()
            .eq('id', exerciseId)
            .eq('user_id', currentUserId);
        
        if (error) throw error;
        
        showMessage('Упражнение удалено успешно!', 'success');
        loadExercises();
    } catch (error) {
        console.error('Error deleting exercise:', error.message);
        showMessage('Ошибка при удалении упражнения', 'error');
    }
}

// Search filter
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    filteredExercises = allExercises.filter(exercise => 
        exercise.name.toLowerCase().includes(searchTerm)
    );
    
    displayExercises(filteredExercises);
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ru-RU', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Logout function
async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error signing out:', error);
    } else {
        window.location.href = 'login.html';
    }
}
