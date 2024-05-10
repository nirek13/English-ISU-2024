document.addEventListener('DOMContentLoaded', function() {
    const logo = document.getElementById('logo');

    logo.addEventListener('click', () => {
        console.log('Button clicked!');
        // Add your theme switching logic here
        // For example, you can toggle a data attribute on the <html> element
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'theme1' ? 'theme2' : (currentTheme === 'theme2' ? 'light' : 'theme1');
        document.documentElement.setAttribute('data-theme', newTheme);
    });
});
