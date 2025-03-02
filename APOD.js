const NASA_API_KEY = "smprpjFm9inmvsruZO88blwm1sFNTEbVNzHCOFbk"; 

/**
 * Fetches the Astronomy Picture of the Day (APOD) based on the selected date.
 */
async function getAPODByDate() {
    const date = document.getElementById("apod-date").value;
    const url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&date=${date}`;

    showLoading(); // Show loading indicator

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch APOD data");
        const data = await response.json();
        console.log("APOD Data:", data); // Debugging: Log the API response

        // DOM elements for displaying APOD data
        const apodImg = document.getElementById("apod-img");
        const apodTitle = document.getElementById("apod-title");
        const apodDesc = document.getElementById("apod-desc");

        // Check if the media type is an image
        if (data.media_type === "image") {
            apodImg.src = data.url;
            apodImg.style.display = "block"; // Ensure the image is visible
            apodTitle.innerText = data.title;
            apodDesc.innerText = data.explanation;

            // Handle potential image loading errors
            apodImg.onerror = () => {
                apodImg.style.display = "none";
                apodTitle.innerText = "No image available for this date.";
                apodDesc.innerText = "";
            };
        } else {
            // If media type is not an image (e.g., video)
            apodImg.style.display = "none";
            apodTitle.innerText = `No image available for this date (media type: ${data.media_type}).`;
            apodDesc.innerText = data.explanation || "";
        }
    } catch (error) {
        console.error("Error fetching APOD data:", error);
        document.getElementById("apod-title").innerText = "No image available. Try again later.";
        document.getElementById("apod-desc").innerText = "";
        document.getElementById("apod-img").style.display = "none"; // Hide image on error
    } finally {
        hideLoading(); // Hide loading indicator
    }
}

/**
 * Fetches images taken by a specified Mars rover.
 */
async function getMarsPhotos(rover) {
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=1000&api_key=${NASA_API_KEY}`;

    showLoading();

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch Mars Rover images");
        const data = await response.json();

        const gallery = document.getElementById("rover-gallery");
        gallery.innerHTML = ""; // Clear previous images

        // Display up to 12 images from the rover
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

/**
 * Fetches Earth images from the EPIC (Earth Polychromatic Imaging Camera) API.
 */
async function getEPICImages() {
    const url = `https://api.nasa.gov/EPIC/api/natural/images?api_key=${NASA_API_KEY}`;

    showLoading();

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch EPIC images");
        const data = await response.json();

        const gallery = document.getElementById("epic-gallery");
        gallery.innerHTML = ""; // Clear previous images

        // Display up to 12 EPIC images
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

/**
 * Shows the loading indicator.
 */
function showLoading() {
    document.getElementById("loading").style.display = "block";
}

/**
 * Hides the loading indicator.
 */
function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

/**
 * Initializes the page by setting the default date and fetching the APOD.
 */
window.onload = () => {
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("apod-date").value = today;
    getAPODByDate();
};
