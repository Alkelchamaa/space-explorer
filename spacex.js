// SpaceX API URL
const SPACEX_API_URL = 'https://api.spacexdata.com/v5/launches';

/**
 * Fetch and display upcoming SpaceX launches.
 * Retrieves the latest upcoming launches and displays up to 20 of them.
 */
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

/**
 * Fetch and display past SpaceX launches.
 * Retrieves the most recent past launches and displays up to 20 of them.
 */
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

/**
 * Displays a list of launch cards in the UI.
 */
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

/**
 * Creates a launch card element with details and an optional "View Launch Images" button.
 */
function createLaunchCard(launch) {
    const launchCard = document.createElement("div");
    launchCard.className = "launch-card";

    // Launch details
    launchCard.innerHTML = `
        <h4>${launch.name}</h4>
        <div class="launch-info">
            <p><strong>Date:</strong> ${new Date(launch.date_utc).toLocaleDateString()}</p>
            <p><strong>Rocket:</strong> ${launch.rocket}</p>
            <p class="details"><strong>Details:</strong> ${launch.details || "No details available."}</p>
        </div>
    `;

    // Mission patch (if available)
    if (launch.links.patch.large) {
        launchCard.innerHTML += `
            <div class="mission-patch">
                <img src="${launch.links.patch.large}" alt="${launch.name} Mission Patch">
            </div>
        `;
    }

    // Add "View Launch Images" button only if there are photos available
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

/**
 * Toggles the visibility of launch photos when the "View Launch Images" button is clicked. * 
 */
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

/**
 * Displays a loading indicator while data is being fetched.
 */
function showLoading() {
    document.getElementById("loading").style.display = "block";
}

/**
 * Hides the loading indicator once data has been loaded.
 */
function hideLoading() {
    document.getElementById("loading").style.display = "none";
}

// Load upcoming launches by default when the page loads
window.onload = getUpcomingLaunches;
