import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBbjwB8BGzzGeg3hYkNDMTIWY5kQ6xaTZQ",
    authDomain: "inceptor-7c036.firebaseapp.com",
    projectId: "inceptor-7c036",
    storageBucket: "inceptor-7c036.appspot.com",
    messagingSenderId: "251784547484",
    appId: "1:251784547484:web:46ce4a6da235ac75723159",
    measurementId: "G-10BE1RRDC2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Google Sign-In
const googleButton = document.querySelector(".google-button");
if (googleButton) {
    googleButton.addEventListener("click", async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            alert("Sign-in successful with Google!");
            window.location.href = "index.html";
        } catch (error) {
            alert(`Google Sign-In Error: ${error.message}`);
        }
    });
}

// Fetch Images
const imageElement = document.getElementById("dynamicImage");

async function fetchImages() {
    try {
        const response = await fetch("http://localhost:5000/api/home-thumbnails");
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const images = await response.json();
        return images.map((img) => img.imageUrl);
    } catch (error) {
        console.error("Error fetching images:", error);
        return [];
    }
}

let currentImageIndex = 0;
let images = [];

async function changeImage() {
    if (images.length === 0) {
        images = await fetchImages();
    }
    if (images.length > 0 && imageElement) {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        imageElement.src = images[currentImageIndex];
    }
}

if (imageElement) {
    setInterval(changeImage, 5000);
}

// Toggle Password Visibility
document.addEventListener("DOMContentLoaded", function () {
    const togglePassword = document.querySelector("#togglePassword");
    const password = document.querySelector("#password");

    togglePassword.addEventListener("click", function () {
        const type = password.getAttribute("type") === "password" ? "text" : "password";
        password.setAttribute("type", type);
        this.classList.toggle("fa-eye");
        this.classList.toggle("fa-eye-slash");
    });
});

// Email Sign-In
const signinButton = document.getElementById("signinButton");
if (signinButton) {
    signinButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        try {
            const response = await fetch("http://localhost:5000/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || "Sign-in failed");
                } else {
                    const errorText = await response.text();
                    throw new Error(`Server returned an error: ${errorText}`);
                }
            }

            const data = await response.json();
            alert("Sign-in successful!");
            window.location.href = "index.html";
        } catch (error) {
            console.error("Sign-In Error:", error);
            alert(`Sign-In Error: ${error.message}`);
        }
    });
}