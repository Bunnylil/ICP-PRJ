let images = [];
let currentIndex = 0;

// Fetch images from the backend
function fetchImages() {
    fetch("http://localhost:5000/api/home-thumbnails")
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                images = data.map(item => item.imageUrl);
                updateImage(); // Set first image
                setInterval(updateImage, 5000); // Change every 5 seconds
            }
        })
        .catch(error => console.error("Error fetching thumbnails:", error));
}

// Function to update the displayed image
function updateImage() {
    if (images.length > 0) {
        document.getElementById("thumbnail-image").src = images[currentIndex];
        currentIndex = (currentIndex + 1) % images.length; // Loop through images
    }
}

fetchImages();