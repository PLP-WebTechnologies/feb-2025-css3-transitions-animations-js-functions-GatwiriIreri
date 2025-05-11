// DOM Elements
const colorOptions = document.querySelectorAll(".color-option");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const animationSpeedSelect = document.getElementById("animation-speed");
const animationTypeSelect = document.getElementById('animation-type');
const animationElement = document.querySelector('.animation-element');
const saveBtn = document.getElementById('save-btn');
const resetBtn = document.getElementById('reset-btn');
const toast = document.getElementById('toast');

// Default Settings
const defaultSettings = {
    primaryColor: '#3498db',
    secondaryColor: '#2ecc71',
    accentColor: '#e74c3c',
    textColor: '#000000',
    bgColor: '#ffffff',
    darkMode: false,
    cardBgColor: '#f9f9f9',
    animationSpeed: '0.3s',
    animationType: 'pulse'
};

// Current Settings
let currentSettings = {...defaultSettings};

// Load settings from localStorage
function loadPreferences() {
    const savedSettings = localStorage.getItem('userPreferences');

    if (savedSettings) {
        try {
            currentSettings = JSON.parse(savedSettings);
            applySettings(currentSettings);

            // Update UI to match loaded settings
            updateUIFromSettings(currentSettings);
        }catch (error) {
            console.error('Error parsing saved settings:', error);
            // Incase of an error, use default settings
            applySettings(defaultSettings);
        }

    } else{
        // if no saved settings, apply default settings
        applySettings(defaultSettings);
    }
}

// Update UI Elements to match current settings
function updateUIFromSettings(settings) {
    // Update color options 
    colorOptions.forEach(option =>{
        if (option.dataset.color === settings.primaryColor) {
            option.classList.add('selected');
        }
        else {
            option.classList.remove('selected');
        }
    });
    // Update dark mode toggle
    darkModeToggle.selected = settings.darkMode;

    // Update animation speed
    animationSpeedSelect.value = settings.animationSpeed;

    // Update animation type
    animationTypeSelect.value = settings.animationType;

    // Update animation element
            updateAnimationClass(settings.animationType);
}

// Apply settings to the document
function applySettings(settings) {
    // Apply colors
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', settings.accentColor);
    
    // Apply dark mode
    if (settings.darkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

// Apply animation speed
document.documentElement.style.setProperty('--transition-speed', settings.animationSpeed);
}


// Save Preferences to LocalStorage
function savePreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(currentSettings));
    showToast('Preferences saved successfully!');
} 

// Show Toast Notification
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Update Animation Class
function updateAnimationClass(animationType) {
    animationElement.classList.remove('pulse', 'rotate', 'bounce');
    animationElement.classList.add(animationType);
}

// Event Listeners
//Color Options
colorOptions.forEach(option =>{
    option.addEventListener('click', () =>{
        // Remove selected class from all options
        colorOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Update settings
                currentSettings.primaryColor = option.dataset.color;
                currentSettings.secondaryColor = option.dataset.secondary;
                currentSettings.accentColor = option.dataset.accent;
                
                // Apply settings
                applySettings(currentSettings);
    });
});

// Dark Mode Toggle 
darkModeToggle.addEventListener('change', () =>{
    currentSettings.darkMode = darkModeToggle.checked;
    applySettings(currentSettings);
});

// Animation Speed
animationSpeedSelect.addEventListener('change', () => {
    currentSettings.animationSpeed = animationSpeedSelect.value;
    applySettings(currentSettings);
});

// Animation Type 
animationTypeSelect.addEventListener('change', () =>{
  const animationType = animationTypeSelect.value;
  currentSettings.animationType = animationType;
  updateAnimationClass(animationType);
});

// Save button
saveBtn.addEventListener('click', () => {
    saveBtn.style.transform = 'scale(1.1)';
    setTimeout(() =>{
        saveBtn.style.transform = '';
    }, 200);
    savePreferences();
});

// Reset button 
resetBtn.addEventListener('click', () => {
    resetBtn.classList.add('shake');
    setTimeout(() => {
        resetBtn.classList.remove('shake');
    }, 500)

    currentSettings = {...defaultSettings};
    applySettings(currentSettings);
    updateUIFromSettings(currentSettings);
    savePreferences();
    showToast('Settings reset to default');
});

// Initialize 
loadPreferences();