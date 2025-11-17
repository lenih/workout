// Main application file

// Weight tracking functions
async function addWeight() {
    const weightInput = document.getElementById('weight-input');
    const weightDate = document.getElementById('weight-date');
    const weight = parseFloat(weightInput.value);
    const date = weightDate.value;
    
    if (!weight || !date) {
        alert('Please fill in all fields');
        return;
    }
    
    // Save to Supabase
    const { data, error } = await window.supabase
        .from('weights')
        .insert([{ weight, date, user_id: 'user_id_placeholder' }]);
    
    if (error) {
        console.error('Error adding weight:', error);
    } else {
        weightInput.value = '';
        weightDate.value = '';
        loadWeights();
    }
}

async function loadWeights() {
    const { data, error } = await window.supabase
        .from('weights')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);
    
    if (error) {
        console.error('Error loading weights:', error);
        return;
    }
    
    const weightList = document.getElementById('weight-list');
    weightList.innerHTML = '';
    
    data.forEach(item => {
        const weightItem = document.createElement('div');
        weightItem.className = 'weight-item';
        weightItem.textContent = `${item.date}: ${item.weight} kg`;
        weightList.appendChild(weightItem);
    });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadWeights();
    
    const addWeightBtn = document.getElementById('add-weight-btn');
    if (addWeightBtn) {
        addWeightBtn.addEventListener('click', addWeight);
    }
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const weightDateInput = document.getElementById('weight-date');
    if (weightDateInput) {
        weightDateInput.value = today;
    }
});

export { addWeight, loadWeights };
