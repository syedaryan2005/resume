
declare const html2pdf : any

const form = document.getElementById("resumeForm") as HTMLFormElement;
const resumePage = document.getElementById("resumePage") as HTMLElement;
const resumePhoto = document.getElementById("resumePhoto") as HTMLImageElement;
const resumeName = document.getElementById("resumeName") as HTMLHeadingElement;
const resumeEmail = document.getElementById("resumeEmail") as HTMLParagraphElement;
const resumePhone = document.getElementById("resumePhone") as HTMLParagraphElement;
const resumeEducation = document.getElementById("resumeEducation") as HTMLParagraphElement;
const resumeWorkExperiance = document.getElementById("resumeWorkExperiance") as HTMLParagraphElement;
const resumeSkills = document.getElementById("resumeSkills") as HTMLParagraphElement;
const downloadPdfButton = document.getElementById('download-pdf') as HTMLButtonElement;
const editButton = document.getElementById('editButton') as HTMLButtonElement;
const resumeContent = document.getElementById('resumeContent') as HTMLDivElement;
const shareButton = document.getElementById("shareButton") as HTMLButtonElement;

// Handle the share button functionality
shareButton.addEventListener("click", () => {
  console.log("Share button clicked");

  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const number = (document.getElementById("number") as HTMLInputElement).value;
  const degree = (document.getElementById("degree") as HTMLInputElement).value;
  const institute = (document.getElementById("institute") as HTMLInputElement).value;
  const workText = (document.getElementById("workText") as HTMLTextAreaElement).value;
  const experianceText = (document.getElementById("experianceText") as HTMLTextAreaElement).value;

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
form.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const number = (document.getElementById("number") as HTMLInputElement).value;
  const degree = (document.getElementById("degree") as HTMLInputElement).value;
  const institute = (document.getElementById("institute") as HTMLInputElement).value;
  const workText = (document.getElementById("workText") as HTMLTextAreaElement).value;
  const experianceText = (document.getElementById("experianceText") as HTMLTextAreaElement).value;
  const photoInput = document.getElementById("photo") as HTMLInputElement;

  const photofile = photoInput.files ? photoInput.files[0] : null;

  let photoBase64 = "";

  if (photofile) {
    photoBase64 = await fileToBase64(photofile);
    localStorage.setItem("resumePhoto", photoBase64);
  }

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

  // Display the resume by switching visibility
  displayResume();
});

// Convert file to Base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Display the resume
function displayResume() {
  // Get saved data from localStorage
  const resumeData = JSON.parse(localStorage.getItem("resumeData") || "{}");

  resumeName.textContent = resumeData.name || '';
  resumeEmail.textContent = `Email: ${resumeData.email || ''}`;
  resumePhone.textContent = `Phone: ${resumeData.number || ''}`;
  resumeEducation.textContent = `${resumeData.degree || ''} from ${resumeData.institute || ''}`;
  resumeWorkExperiance.textContent = resumeData.workText || '';
  resumeSkills.textContent = resumeData.experianceText || '';

  const photoBase64 = localStorage.getItem("resumePhoto");
  if (photoBase64) {
    resumePhoto.src = photoBase64;
  }

  // Hide the form and show the resume page
  document.getElementById("container")?.classList.add("hidden");
  resumePage.classList.remove("hidden");
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
  (document.getElementById("name") as HTMLInputElement).value = resumeData.name || '';
  (document.getElementById("email") as HTMLInputElement).value = resumeData.email || '';
  (document.getElementById("number") as HTMLInputElement).value = resumeData.number || '';
  (document.getElementById("degree") as HTMLInputElement).value = resumeData.degree || '';
  (document.getElementById("institute") as HTMLInputElement).value = resumeData.institute || '';
  (document.getElementById("workText") as HTMLTextAreaElement).value = resumeData.workText || '';
  (document.getElementById("experianceText") as HTMLTextAreaElement).value = resumeData.experianceText || '';
}


downloadPdfButton.addEventListener("click" , ()=>{

    if(typeof html2pdf === 'undefined'){
        alert ("Error: html2pdf library is not loaded")
        return;
    }


const resumeOptions = {
    margin: 0.5,
    filename: 'resume.pdf',
    image: {type : "jpeg", quality:1.0},
    html2canvas: {scale:2},
    jsPdf:{unit : 'in', format:'letter', orientation: 'potrait'}

}

html2pdf()
 .from(resumeContent)
 .set(resumeOptions)
 .save()
 .catch ((error:Error)=> {
    console.log("pdf error", error)
 })
 
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
        resumeEmail.textContent = `Email: ${email}`;
        resumePhone.textContent = `Phone: ${phone}`;
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
resumePhoto.style.width = "150px";  // Adjust width as per your requirement
resumePhoto.style.height = "150px";
resumePhoto.style.objectFit = "cover";
resumePhoto.style.borderRadius = "50%";  // Circular image
resumePhoto.style.display = "block";
resumePhoto.style.margin = "0 auto";
