// Get the button and the skills section from the DOM
const toggleButton = document.querySelector('.toggle');
const skillsSection = document.querySelector('#skills ul');

// Add a click event listener to the button
toggleButton.addEventListener('click', () => {
    // Toggle the visibility of the skills section
    if (skillsSection.style.display === 'none') {
        skillsSection.style.display = 'block';
        toggleButton.textContent = 'Hide Skills'; // Change button text
    } else {
        skillsSection.style.display = 'none';
        toggleButton.textContent = 'Show Skills'; // Change button text
    }
});
