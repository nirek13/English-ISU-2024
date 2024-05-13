// Function to fetch images and create gallery
function createPhotoGallery() {
    const galleryContainer = document.getElementById('gallery-images');

    // Fetch the list of files in the PhotoGallery directory
    fetch('/Users/nirekshetty/Downloads/NirekshettySite/assets/PhotoGallery')
        .then(response => response.text()) // Get the directory listing as text
        .then(text => {
            // Parse the directory listing text to extract filenames
            const filenames = text.split('\n').filter(name => name.trim() !== ''); // Remove empty lines

            // Loop through the filenames and create HTML elements for each image
            filenames.forEach(filename => {
                const imageElement = document.createElement('div');
                imageElement.classList.add('col-md-4'); // Adjust column size as needed

                const img = document.createElement('img');
                img.src = `/Users/nirekshetty/Downloads/NirekshettySite/assets/PhotoGallery/${filename}`;
                img.alt = filename; // Set alt text to image filename

                imageElement.appendChild(img);
                galleryContainer.appendChild(imageElement);
            });
        })
        .catch(error => console.error('Error fetching images:', error));
}

// Call the function to create the photo gallery when the page loads
window.addEventListener('DOMContentLoaded', createPhotoGallery);
