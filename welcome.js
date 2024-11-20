
// Load announcements from the text file
fetch('announcements.txt')
    .then(response => response.text())
    .then(text => {
        // Replace new lines with <br> to properly format the announcement in HTML
        const formattedText = text.replace(/\n/g, '<br>');
        document.getElementById('announcement').innerHTML = formattedText;
    })
    .catch(err => {
        console.error('Error loading announcements:', err);
    });

// Automatically generated links based on directory structure
const directoryStructure = {
    "Indonesia": {},
    "Japan": {
        "2024-11-12": {
            "1 day resolution": {
                "Magnitude-Forecast.pdf": null
            },
            "7 days resolution": {
                "Magnitude-Forecast.pdf": null
            }
        }
    }
};

function generateLinks() {
    const container = document.getElementById('buttons-container');

    // Track the current path for Back button functionality
    let currentPath = [];
    let currentStructure = directoryStructure;

    function createLinks(structure, parentPath = '') {
        container.innerHTML = ''; // Clear the container

        // Display current path centered above the buttons
        const pathDisplay = document.createElement('div');
        pathDisplay.textContent = parentPath || 'Root';
        pathDisplay.style.textAlign = 'center';
        pathDisplay.style.marginBottom = '10px';
        pathDisplay.style.fontWeight = 'bold';
        pathDisplay.style.fontSize = '24px';
        container.appendChild(pathDisplay);

        // Add buttons container
        const buttonsDiv = document.createElement('div');
        buttonsDiv.style.display = 'flex';
        buttonsDiv.style.flexWrap = 'wrap';
        buttonsDiv.style.justifyContent = 'center';
        buttonsDiv.style.gap = '10px';
        container.appendChild(buttonsDiv);

        // Add a Back button if not at the root level
        if (currentPath.length > 0) {
            const backButton = document.createElement('button');
            backButton.textContent = 'Back';
            backButton.onclick = () => {
                currentPath.pop(); // Go back one level
                currentStructure = navigateToPath(directoryStructure, currentPath);
                createLinks(currentStructure, currentPath.join('/'));
            };
            buttonsDiv.appendChild(backButton);
        }

        // Add links/buttons for the current structure
        for (const [key, value] of Object.entries(structure)) {
            const fullPath = parentPath ? `${parentPath}/${key}` : key;

            if (value === null) {
                // Create link for file
                const linkButton = document.createElement('button');
                const link = document.createElement('a');
                link.href = fullPath;
                link.textContent = key;
                link.style.textDecoration = 'none';
                link.style.color = 'inherit';
                linkButton.appendChild(link);
                linkButton.onclick = () => {
                    window.open(fullPath, '_blank');
                };
                buttonsDiv.appendChild(linkButton);
            } else {
                // Create button for directory
                const button = document.createElement('button');
                button.textContent = key;
                button.onclick = () => {
                    currentPath.push(key);
                    currentStructure = value;
                    createLinks(value, fullPath);
                };
                buttonsDiv.appendChild(button);
            }
        }
    }

    // Helper function to navigate to a specific path in the structure
    function navigateToPath(root, path) {
        let current = root;
        for (const segment of path) {
            current = current[segment];
        }
        return current;
    }

    // Initialize the root level
    createLinks(currentStructure);
}

// Call the function to generate links when the page loads
document.addEventListener('DOMContentLoaded', () => {
    generateLinks();
});
