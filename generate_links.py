import os
import json

# Root directory where your site content is stored
root_dir = './'  # Adjust this to your actual root directory

# Output file for the generated welcome.js
output_js_file = 'welcome.js'

# Function to recursively gather directory and file structure
def generate_structure(root):
    structure = {}

    for item in sorted(os.listdir(root)):
        # Skip hidden files and directories
        if item.startswith('.'):
            continue

        item_path = os.path.join(root, item)
        if os.path.isdir(item_path):
            # Recursively process subdirectories
            structure[item] = generate_structure(item_path)
        elif os.path.isfile(item_path) and item.endswith('.pdf'):
            # Add .pdf files
            structure[item] = None  # Files have no children
    return structure

# Generate the directory and file structure
directory_structure = generate_structure(root_dir)

# Convert the structure to JavaScript for welcome.js
def generate_welcome_js(structure):
    # Escape JSON for use in JavaScript
    structure_json = json.dumps(structure, indent=4)

    js_code = f"""
// Load announcements from the text file
fetch('announcements.txt')
    .then(response => response.text())
    .then(text => {{
        // Replace new lines with <br> to properly format the announcement in HTML
        const formattedText = text.replace(/\\n/g, '<br>');
        const announcementDiv = document.createElement('div');
        announcementDiv.id = 'announcement';
        announcementDiv.innerHTML = formattedText;
        announcementDiv.style.textAlign = 'center';
        announcementDiv.style.marginBottom = '20px';
        document.body.insertBefore(announcementDiv, document.body.firstChild);
    }})
    .catch(err => {{
        console.error('Error loading announcements:', err);
    }})
    .finally(() => {{
        // Load zones.csv and display it as a table, if it exists
        fetch('zones.csv')
            .then(response => {{
                if (!response.ok) {{
                    throw new Error('Failed to load zones.csv');
                }}
                return response.text();
            }})
            .then(csv => {{
                const rows = csv.split('\\n').filter(row => row.trim() !== '');
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
                rows.forEach(row => {{
                    const tr = document.createElement('tr');
                    row.split(',').forEach(cell => {{
                        const td = document.createElement('td');
                        td.textContent = cell.trim();
                        td.style.border = '1px solid #ddd';
                        td.style.padding = '8px';
                        tr.appendChild(td);
                    }});
                    table.appendChild(tr);
                }});

                // Insert the table after the headers
                const announcementDiv = document.getElementById('announcement');
                if (announcementDiv) {{
                    announcementDiv.parentNode.insertBefore(headerEnglish, announcementDiv.nextSibling);
                    announcementDiv.parentNode.insertBefore(headerJapanese, headerEnglish.nextSibling);
                    announcementDiv.parentNode.insertBefore(table, headerJapanese.nextSibling);
                }} else {{
                    document.body.appendChild(headerEnglish);
                    document.body.appendChild(headerJapanese);
                    document.body.appendChild(table);
                }}
            }})
            .catch(err => {{
                console.error('Error loading zones.csv:', err);
            }});
    }});

// Automatically generated links based on directory structure
const directoryStructure = {structure_json};

function generateLinks() {{
    const container = document.getElementById('buttons-container');

    // Track the current path for Back button functionality
    let currentPath = [];
    let currentStructure = directoryStructure;

    function createLinks(structure, parentPath = '') {{
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
        if (currentPath.length > 0) {{
            const backButton = document.createElement('button');
            backButton.textContent = 'Back';
            backButton.onclick = () => {{
                currentPath.pop(); // Go back one level
                currentStructure = navigateToPath(directoryStructure, currentPath);
                createLinks(currentStructure, currentPath.join('/'));
            }};
            buttonsDiv.appendChild(backButton);
        }}

        // Add links/buttons for the current structure
        for (const [key, value] of Object.entries(structure)) {{
            const fullPath = parentPath ? `${{parentPath}}/${{key}}` : key;

            if (value === null) {{
                // Create link for file
                const linkButton = document.createElement('button');
                const link = document.createElement('a');
                link.href = fullPath;
                link.textContent = key;
                link.style.textDecoration = 'none';
                link.style.color = 'inherit';
                linkButton.appendChild(link);
                linkButton.onclick = () => {{
                    window.open(fullPath, '_blank');
                }};
                buttonsDiv.appendChild(linkButton);
            }} else {{
                // Create button for directory
                const button = document.createElement('button');
                button.textContent = key;
                button.onclick = () => {{
                    currentPath.push(key);
                    currentStructure = value;
                    createLinks(value, fullPath);
                }};
                buttonsDiv.appendChild(button);
            }}
        }}
    }}

    // Helper function to navigate to a specific path in the structure
    function navigateToPath(root, path) {{
        let current = root;
        for (const segment of path) {{
            current = current[segment];
        }}
        return current;
    }}

    // Initialize the root level
    createLinks(currentStructure);
}}

// Call the function to generate links when the page loads
document.addEventListener('DOMContentLoaded', () => {{
    generateLinks();
}});
"""
    return js_code

# Generate JavaScript content
welcome_js_content = generate_welcome_js(directory_structure)

# Write the JavaScript content to welcome.js
with open(output_js_file, 'w') as js_file:
    js_file.write(welcome_js_content)

print(f"'welcome.js' has been generated with announcements support, zones.csv table, and directory structure, including back button functionality.")