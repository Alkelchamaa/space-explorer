const NASA_API_KEY = "smprpjFm9inmvsruZO88blwm1sFNTEbVNzHCOFbk"; // Replace with your NASA API key



async function getAPODByDate() {
    const date = document.getElementById("apod-date").value;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;
    
    showLoading();
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch APOD data");
        const data = await response.json();
        console.log("APOD Data:", data); // Debugging: Log the API response

        const apodImg = document.getElementById("apod-img");
        const apodTitle = document.getElementById("apod-title");
        const apodDesc = document.getElementById("apod-desc");

        // Check if the media type is an image
        if (data.media_type === "image") {
            apodImg.src = data.url;
            apodImg.style.display = "block"; // Ensure the image is visible
            apodImg.onerror = () => {
                // If the image fails to load, display a message and hide the image
                apodImg.style.display = "none";
                apodTitle.innerText = "No image available for this date.";
                apodDesc.innerText = "";
            };
            apodTitle.innerText = data.title;
            apodDesc.innerText = data.explanation;
        } else {
            // If the media type is not an image (e.g., video), display a message
            apodImg.style.display = "none";
            apodTitle.innerText = "No image available for this date (media type: " + data.media_type + ").";
            apodDesc.innerText = data.explanation || "";
        }
    } catch (error) {
        console.error("Error fetching APOD data:", error);
        document.getElementById("apod-title").innerText = "No image available for today. Come back later.";
        document.getElementById("apod-desc").innerText = "";
        document.getElementById("apod-img").style.display = "none"; // Hide the image
    } finally {
        hideLoading();
    }
}

// Fetch Mars Rover images
async function getMarsPhotos(rover) {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${NASA_API_KEY}`;
    
    showLoading();
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Mars Rover images");
        const data = await response.json();
        
        const gallery = document.getElementById("rover-gallery");
        gallery.innerHTML = ""; // Clear previous images
        data.photos.slice(0, 12).forEach(photo => {
            const img = document.createElement("img");
            img.src = photo.img_src;
            img.alt = "Mars Rover Image";
            gallery.appendChild(img);
        });
    } catch (error) {
        console.error("Error fetching Mars Rover images:", error);
    } finally {
        hideLoading();
    }
}

// Fetch EPIC images
async function getEPICImages() {
    const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`;
    
    showLoading();
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch EPIC images");
        const data = await response.json();
        
        const gallery = document.getElementById("epic-gallery");
        gallery.innerHTML = ""; // Clear previous images
        data.slice(0, 12).forEach(image => {
            const img = document.createElement("img");
            img.src = `https://epic.gsfc.nasa.gov/archive/natural/${image.date.slice(0, 10).replace(/-/g, '/')}/png/${image.image}.png`;
            img.alt = "EPIC Earth Image";
            gallery.appendChild(img);
        });
    } catch (error) {
        console.error("Error fetching EPIC images:", error);
    } finally {
        hideLoading();
    }
}

// Show loading state
function showLoading() {
    document.getElementById("loading").style.display = "block";
}

// Hide loading state
function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

// Set Earth background and load APOD on page load
window.onload = () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("apod-date").value = today;
    getAPODByDate();
};