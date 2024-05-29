

function typeText(elementId, texts, speed) {
    const element = document.getElementById(elementId);
    if (!element || !Array.isArray(texts) || texts.length === 0) return;

    let index = 0;

    function type() {
        if (index < texts.length) {
            const text = texts[index];
            let charIndex = 0;
            const typeInterval = setInterval(() => {
                if (charIndex < text.length) {
                    element.textContent += text.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    setTimeout(erase, speed);
                }
            }, speed);
            index++;
        } else {
            index = 0; // Reset index to loop through texts again
        }
    }

    function erase() {
        const text = element.textContent;
        if (text.length > 0) {
            const eraseInterval = setInterval(() => {
                if (element.textContent.length > 0) {
                    element.textContent = text.substring(0, element.textContent.length - 1);
                } else {
                    clearInterval(eraseInterval);
                    setTimeout(type, speed);
                }
            }, speed / 2); // Erase speed is half of typing speed
        } else {
            setTimeout(type, speed);
        }
    }

    type(); // Start typing initially
}

// Example usage


// Example usage
document.addEventListener('DOMContentLoaded', () => {
    // Start typing animation after a delay
    setTimeout(() => {
        typeText('Ninja', 'Real Life Ninja Turtle', 100); // Adjust the speed (in milliseconds) as needed
    }, 1000); // Adjust the initial delay as needed
});
