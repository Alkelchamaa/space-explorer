// SpaceX API URL
const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches';

// Fetch upcoming launches
async function getUpcomingLaunches() {
    showLoading();
    try {
        const response = await fetch(`${SPACEX_API_URL}/upcoming`);
        if (!response.ok) throw new Error("Failed to fetch upcoming launches");
        const data = await response.json();
        displayLaunches(data.slice(0, 20), "Upcoming Launches"); // Display only 20 launches
    } catch (error) {
        console.error("Error fetching upcoming launches:", error);
    } finally {
        hideLoading();
    }
}

// Fetch past launches
async function getPastLaunches() {
    showLoading();
    try {
        const response = await fetch(`${SPACEX_API_URL}/past`);
        if (!response.ok) throw new Error("Failed to fetch past launches");
        const data = await response.json();
        displayLaunches(data.slice(0, 20), "Past Launches"); // Display only 20 launches
    } catch (error) {
        console.error("Error fetching past launches:", error);
    } finally {
        hideLoading();
    }
}

// Display launches with images and toggle button
function displayLaunches(launches, title) {
    const launchList = document.getElementById("launch-list");
    launchList.innerHTML = `<h3>${title}</h3>`; // Add a title for the section

    if (launches.length === 0) {
        launchList.innerHTML += "<p>No launches found.</p>";
        return;
    }

    // Display only the first 20 launches
    launches.forEach(launch => {
        const launchCard = createLaunchCard(launch);
        launchList.appendChild(launchCard);
    });
}

// Create a launch card with conditional "View Launch Images" button
function createLaunchCard(launch) {
    const launchCard = document.createElement("div");
    launchCard.className = "launch-card";

    // Format details to 13 words per line
    const details = launch.details || "No details available.";
    const formattedDetails = formatDetails(details);

    // Launch details
    launchCard.innerHTML = `
        <h4>${launch.name}</h4>
        <div class="launch-info">
            <p><strong>Date:</strong> ${new Date(launch.date_utc).toLocaleDateString()}</p>
            <p><strong>Rocket:</strong> ${launch.rocket}</p>
            <p><strong>Details:</strong> ${formattedDetails}</p>
        </div>
    `;

    // Mission patch
    if (launch.links.patch.large) {
        launchCard.innerHTML += `
            <div class="mission-patch">
                <img src="${launch.links.patch.large}" alt="${launch.name} Mission Patch">
            </div>
        `;
    }

    // Add "View Launch Images" button only if there are photos
    if (launch.links.flickr?.original?.length > 0) {
        launchCard.innerHTML += `
            <button class="toggle-button" onclick="togglePhotos(this)">View Launch Images</button>
            <div class="launch-photos" style="display: none;">
                ${launch.links.flickr.original.map(photo => `
                    <img src="${photo}" alt="${launch.name} Launch Photo">
                `).join("")}
            </div>
        `;
    }

    return launchCard;
}

// Format details to 13 words per line
function formatDetails(details) {
    const words = details.split(" ");
    let formattedDetails = "";
    for (let i = 0; i < words.length; i++) {
        formattedDetails += words[i] + " ";
        if ((i + 1) % 13 === 0) { // Change 10 to 13 for 13 words per line
            formattedDetails += "<br>"; // Add a line break after every 13 words
        }
    }
    return formattedDetails.trim(); // Remove trailing space
}

// Toggle launch photos visibility
function togglePhotos(button) {
    const photosContainer = button.nextElementSibling;
    if (photosContainer.style.display === "none") {
        photosContainer.style.display = "flex";
        button.innerText = "Hide Launch Images";
    } else {
        photosContainer.style.display = "none";
        button.innerText = "View Launch Images";
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

// Load upcoming launches by default
window.onload = getUpcomingLaunches;