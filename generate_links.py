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
        document.getElementById('announcement').textContent = text;
    }})
    .catch(err => {{
        console.error('Error loading announcements:', err);
    }});

// Automatically generated links based on directory structure
const directoryStructure = {structure_json};

function generateLinks() {{
    const container = document.getElementById('buttons-container');

    function createLinks(structure, parentPath = '') {{
        for (const [key, value] of Object.entries(structure)) {{
            const fullPath = parentPath ? `${{parentPath}}/${{key}}` : key;

            if (value === null) {{
                // Create link for file
                const link = document.createElement('a');
                link.href = fullPath;
                link.textContent = key;
                link.style.display = 'block';
                container.appendChild(link);
            }} else {{
                // Create button for directory
                const button = document.createElement('button');
                button.textContent = key;
                button.onclick = () => {{
                    container.innerHTML = `<h2>${{fullPath}}</h2>`;
                    createLinks(value, fullPath);
                }};
                container.appendChild(button);
            }}
        }}
    }}

    createLinks(directoryStructure);
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

print(f"'welcome.js' has been generated with announcements support and directory structure.")
