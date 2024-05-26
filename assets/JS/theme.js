document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');

    logo.addEventListener('click', () => {
        console.log('Button clicked!');

        // Add your theme switching logic here
        // For example, you can toggle a data attribute on the <html> element
        const currentTheme = document.documentElement.getAttribute('data-theme');
        console.log(`current theme ${currentTheme}`)
        let newTheme;
        if (currentTheme === 'theme1') {
            newTheme = 'light';
        } else if (currentTheme === 'light') {
            newTheme = 'theme2';
        }
        else if (currentTheme === 'theme2') {
            newTheme = 'theme3';
        } else if (currentTheme === 'theme3') {
            newTheme = 'theme4';
        } else if (currentTheme === 'theme4') {
            newTheme = 'theme5';
        } else {
            newTheme = 'theme1';
        }
        document.documentElement.setAttribute('data-theme', newTheme);
    });
});
