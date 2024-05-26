document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');
    let currentTheme;

    // Retrieve the stored theme preference from localStorage
    const storedTheme = localStorage.getItem('theme');

    // Set the currentTheme variable based on the stored theme preference or default to 'theme1'
    if (storedTheme) {
        currentTheme = storedTheme;
    } else {
        currentTheme = 'theme1';
    }

    // Apply the current theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    logo.addEventListener('click', () => {
        console.log('Button clicked!');

        // Toggle theme logic
        let newTheme;
        if (currentTheme === 'theme1') {
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            newTheme = 'theme2';
        } else if (currentTheme === 'theme2') {
            newTheme = 'theme3';
        } else if (currentTheme === 'theme3') {
            newTheme = 'theme4';
        } else if (currentTheme === 'theme4') {
            newTheme = 'theme5';
        } else {
            newTheme = 'theme1';
        }

        // Update the currentTheme variable and store the new theme preference in localStorage
        currentTheme = newTheme;
        localStorage.setItem('theme', currentTheme);

        console.log(`Current theme: ${currentTheme}`);
        // Apply the new theme
        document.documentElement.setAttribute('data-theme', newTheme);
    });
});

