"use strict";
const form = document.getElementById("resumeForm");
const resumePage = document.getElementById("resumePage");
const resumePhoto = document.getElementById("resumePhoto");
const resumeName = document.getElementById("resumeName");
const resumeEmail = document.getElementById("resumeEmail");
const resumePhone = document.getElementById("resumePhone");
const resumeEducation = document.getElementById("resumeEducation");
const resumeWorkExperiance = document.getElementById("resumeWorkExperiance");
const resumeSkills = document.getElementById("resumeSkills");
const downloadPdfButton = document.getElementById('download-pdf');
const editButton = document.getElementById('editButton');
const resumeContent = document.getElementById('resumeContent');
const shareButton = document.getElementById("shareButton");
// Handle the share button functionality
shareButton.addEventListener("click", () => {
    console.log("Share button clicked");
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const degree = document.getElementById("degree").value;
    const institute = document.getElementById("institute").value;
    const workText = document.getElementById("workText").value;
    const experianceText = document.getElementById("experianceText").value;
    const queryParams = new URLSearchParams({
        name,
        email,
        phone: number,
        degree,
        education: institute,
        workexperiance: workText,
        skills: experianceText,
    });
    const uniqueUrl = `${window.location.origin}?${queryParams.toString()}`;
    console.log("Generated URL: ", uniqueUrl);
    navigator.clipboard.writeText(uniqueUrl).then(() => {
        alert("Link Copied Successfully");
    }).catch((err) => {
        console.error("Failed to copy text: ", err);
    });
    window.history.replaceState(null, '', `${queryParams.toString()}`);
});
// Form submission
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const degree = document.getElementById("degree").value;
    const institute = document.getElementById("institute").value;
    const workText = document.getElementById("workText").value;
    const experianceText = document.getElementById("experianceText").value;
    const photoInput = document.getElementById("photo");
    const photofile = photoInput.files ? photoInput.files[0] : null;
    
    try {
        // Save form data to localStorage
        localStorage.setItem("resumeData", JSON.stringify({
            name,
            email,
            number,
            degree,
            institute,
            workText,
            experianceText
        }));
        
        // Process and store the photo
        if (photofile) {
            // Compress and resize the image before storing
            const compressedPhoto = await compressImage(photofile, 800, 0.7);
            try {
                localStorage.setItem("resumePhoto", compressedPhoto);
            } catch (storageError) {
                console.error("Storage error:", storageError);
                alert("Your photo is too large. It will be displayed now but won't be saved for later sessions.");
                // Still set the photo for current session
                resumePhoto.src = compressedPhoto;
            }
        }
        
        // Display the resume by switching visibility
        displayResume();
    } catch (error) {
        console.error("Error saving resume data:", error);
        alert("There was an error saving your data. Please try again with a smaller photo.");
    }
});
// Compress and resize image before storing
function compressImage(file, maxWidth, quality = 0.7) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate new dimensions while maintaining aspect ratio
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get compressed image as DataURL
                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = reject;
        };
        reader.onerror = reject;
    });
}
// Convert file to Base64 (kept for backward compatibility)
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// Display the resume
function displayResume() {
    try {
        // Get saved data from localStorage
        const resumeData = JSON.parse(localStorage.getItem("resumeData") || "{}");
        resumeName.textContent = resumeData.name || '';
        document.querySelector("#resumeEmail span").textContent = resumeData.email || '';
        document.querySelector("#resumePhone span").textContent = resumeData.number || '';
        resumeEducation.textContent = `${resumeData.degree || ''} from ${resumeData.institute || ''}`;
        resumeWorkExperiance.textContent = resumeData.workText || '';
        resumeSkills.textContent = resumeData.experianceText || '';
        
        // Safely retrieve photo from localStorage
        try {
            const photoBase64 = localStorage.getItem("resumePhoto");
            if (photoBase64) {
                resumePhoto.src = photoBase64;
            }
        } catch (photoError) {
            console.error("Error loading photo from localStorage:", photoError);
            // Continue without the photo
        }
        
        // Hide the form and show the resume page
        document.getElementById("container")?.classList.add("hidden");
        resumePage.classList.remove("hidden");
    } catch (error) {
        console.error("Error displaying resume:", error);
        alert("There was an error displaying your resume. Please try again.");
    }
}
// Edit button functionality
editButton.addEventListener("click", () => {
    // Show the form again and hide the resume
    document.getElementById("container")?.classList.remove("hidden");
    resumePage.classList.add("hidden");
    // Optionally, you could load the data from resume into the form if needed
    loadFormFromResume();
});
// Load resume data into the form (for editing purposes)
function loadFormFromResume() {
    const resumeData = JSON.parse(localStorage.getItem("resumeData") || "{}");
    document.getElementById("name").value = resumeData.name || '';
    document.getElementById("email").value = resumeData.email || '';
    document.getElementById("number").value = resumeData.number || '';
    document.getElementById("degree").value = resumeData.degree || '';
    document.getElementById("institute").value = resumeData.institute || '';
    document.getElementById("workText").value = resumeData.workText || '';
    document.getElementById("experianceText").value = resumeData.experianceText || '';
}
downloadPdfButton.addEventListener("click", () => {
    if (typeof html2pdf === 'undefined') {
        alert("Error: html2pdf library is not loaded");
        return;
    }
    const resumeOptions = {
        margin: 0.5,
        filename: 'resume.pdf',
        image: { type: "jpeg", quality: 1.0 },
        html2canvas: { scale: 2 },
        jsPdf: { unit: 'in', format: 'letter', orientation: 'potrait' }
    };
    html2pdf()
        .from(resumeContent)
        .set(resumeOptions)
        .save()
        .catch((error) => {
        console.log("pdf error", error);
    });
});
window.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('name') || '';
    const email = params.get('email') || '';
    const phone = params.get('phone') || '';
    const degree = params.get('degree') || '';
    const institue = params.get('education') || '';
    const workExperience = params.get('workExperience') || '';
    const skills = params.get('skills') || '';
    if (name || email || phone || degree || institue || workExperience || skills) {
        // Populate the resume preview if query params are present
        resumeName.textContent = name;
        document.querySelector("#resumeEmail span").textContent = email;
        document.querySelector("#resumePhone span").textContent = phone;
        resumeEducation.textContent = `${degree} from ${institue}`;
        resumeWorkExperiance.textContent = workExperience;
        resumeSkills.textContent = skills;
        // Retrieve photo from localStorage (if available)
        const savedPhoto = localStorage.getItem("resumePhoto");
        if (savedPhoto) {
            resumePhoto.src = savedPhoto;
        }
        // Hide form and show resume page
        document.querySelector(".container")?.classList.add("hidden");
        resumePage.classList.remove("hidden");
    }
});
// CSS for ensuring the image is styled properly
resumePhoto.style.width = "150px"; // Adjust width as per your requirement
resumePhoto.style.height = "150px";
resumePhoto.style.objectFit = "cover";
resumePhoto.style.borderRadius = "50%"; // Circular image
resumePhoto.style.display = "block";
resumePhoto.style.margin = "0 auto";
