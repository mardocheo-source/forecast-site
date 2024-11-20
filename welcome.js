// Load announcements from the text file
fetch('announcements.txt')
    .then(response => response.text())
    .then(text => {
        document.getElementById('announcement').textContent = text;
    })
    .catch(err => {
        console.error('Error loading announcements:', err);
    });

// Data structure to hold the files for each directory
const reportFiles = {
    'Japan': {
        '2024-11-12': {
            '1 day resolution': [
                'aggregated_mag_BalancedAverage.csv',
                'Japan.2024-11:14-22.01daysStep.Magnitude.pdf'
            ],
            '7 days resolution': [
                'aggregated_mag_BalancedAverage.csv',
                'Japan.2024-11-12.07daysStep.Magnitude.pdf'
            ]
        }
    },
    'Indonesia': {} // Add files for Indonesia as needed
};

// Function to generate buttons for each region
const directories = Object.keys(reportFiles);
const buttonsContainer = document.getElementById('buttons-container');

directories.forEach(dir => {
    const button = document.createElement('button');
    button.textContent = dir;
    button.onclick = () => {
        loadSubdirectories(dir);
    };
    buttonsContainer.appendChild(button);
});

// Function to load subdirectories and files for a selected region
function loadSubdirectories(region) {
    const reportContainer = document.getElementById('buttons-container');
    reportContainer.innerHTML = `<h2>Reports for ${region}</h2>`;

    const subdirectories = reportFiles[region];
    Object.keys(subdirectories).forEach(date => {
        const dateHeader = document.createElement('h3');
        dateHeader.textContent = date;
        reportContainer.appendChild(dateHeader);

        const resolutions = subdirectories[date];
        Object.keys(resolutions).forEach(resolution => {
            const resolutionHeader = document.createElement('h4');
            resolutionHeader.textContent = resolution;
            reportContainer.appendChild(resolutionHeader);

            const files = resolutions[resolution];
            files.forEach(file => {
                const link = document.createElement('a');
                link.href = `${region}/${date}/${resolution}/${file}`;
                link.textContent = file;
                link.style.display = 'block'; // Display links as block elements
                reportContainer.appendChild(link);
            });
        });
    });
}
