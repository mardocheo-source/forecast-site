
// Load announcements from the text file
fetch('announcements.txt')
    .then(response => response.text())
    .then(text => {
        // Replace new lines with <br> to properly format the announcement in HTML
        const formattedText = text.replace(/\n/g, '<br>');
        const announcementDiv = document.createElement('div');
        announcementDiv.id = 'announcement';
        announcementDiv.innerHTML = formattedText;
        announcementDiv.style.textAlign = 'center';
        announcementDiv.style.marginBottom = '20px';
        document.body.insertBefore(announcementDiv, document.body.firstChild);
    })
    .catch(err => {
        console.error('Error loading announcements:', err);
    })
    .finally(() => {
        // Load zones.csv and display it as a table, if it exists
        fetch('zones.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load zones.csv');
                }
                return response.text();
            })
            .then(csv => {
                const rows = csv.split('\n').filter(row => row.trim() !== '');
                const table = document.createElement('table');
                table.style.width = '100%';
                table.style.borderCollapse = 'collapse';
                table.style.margin = '20px 0';

                // Add header row with "List of possible affected zones" in English and Japanese
                const headerEnglish = document.createElement('div');
                headerEnglish.textContent = 'List of possible affected zones';
                headerEnglish.style.textAlign = 'center';
                headerEnglish.style.marginBottom = '10px';
                headerEnglish.style.fontWeight = 'bold';
                headerEnglish.style.fontSize = '24px';
                document.body.appendChild(headerEnglish);

                const headerJapanese = document.createElement('div');
                headerJapanese.textContent = '影響を受ける可能性のあるエリアのリスト';
                headerJapanese.style.textAlign = 'center';
                headerJapanese.style.marginBottom = '10px';
                headerJapanese.style.fontWeight = 'bold';
                headerJapanese.style.fontSize = '24px';
                document.body.appendChild(headerJapanese);

                // Add data rows
                rows.forEach(row => {
                    const tr = document.createElement('tr');
                    row.split(',').forEach(cell => {
                        const td = document.createElement('td');
                        td.textContent = cell.trim();
                        td.style.border = '1px solid #ddd';
                        td.style.padding = '8px';
                        tr.appendChild(td);
                    });
                    table.appendChild(tr);
                });

                // Insert the table after the headers
                const announcementDiv = document.getElementById('announcement');
                if (announcementDiv) {
                    announcementDiv.parentNode.insertBefore(headerEnglish, announcementDiv.nextSibling);
                    announcementDiv.parentNode.insertBefore(headerJapanese, headerEnglish.nextSibling);
                    announcementDiv.parentNode.insertBefore(table, headerJapanese.nextSibling);
                } else {
                    document.body.appendChild(headerEnglish);
                    document.body.appendChild(headerJapanese);
                    document.body.appendChild(table);
                }
            })
            .catch(err => {
                console.error('Error loading zones.csv:', err);
            });
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
        },
        "2025-01": {
            "7 days resolution": {
                "aggregated_mag_BalancedAverage.pdf": null
            }
        },
        "2025-Feb-2025-Dec": {
            "1 day resolution": {
                "Japan-2025-03-11-30.pdf": null
            },
            "30 days resolution": {
                "2025-02-27.Report.pdf": null
            }
        }
    },
    "afghanistan": {
        "world.2025-02-27.pdf": null
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
