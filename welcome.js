
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

    function createLinks(structure, parentPath = '') {
        for (const [key, value] of Object.entries(structure)) {
            const fullPath = parentPath ? `${parentPath}/${key}` : key;

            if (value === null) {
                // Create link for file
                const link = document.createElement('a');
                link.href = fullPath;
                link.textContent = key;
                link.style.display = 'block';
                container.appendChild(link);
            } else {
                // Create button for directory
                const button = document.createElement('button');
                button.textContent = key;
                button.onclick = () => {
                    container.innerHTML = `<h2>${fullPath}</h2>`;
                    createLinks(value, fullPath);
                };
                container.appendChild(button);
            }
        }
    }

    createLinks(directoryStructure);
}

// Call the function to generate links when the page loads
document.addEventListener('DOMContentLoaded', () => {
    generateLinks();
});
