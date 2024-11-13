const form = document.getElementById("resumeForm");
const resumePage = document.getElementById("resumePage");
const resumePhoto = document.getElementById("resumePhoto");
const resumeName = document.getElementById("resumeName");
const resumeEmail = document.getElementById("resumeEmail");
const resumePhone = document.getElementById("resumePhone");
const resumeEducation = document.getElementById("resumeEducation");
const resumeWorkExperiance = document.getElementById("resumeWorkExperiance");
const resumeSkills = document.getElementById("resumeSkills");
const downloadPdfButton = document.getElementById("download-pdf");
const backButton = document.getElementById("backButton");
const editButton = document.getElementById("editButton");
const resumeContent = document.getElementById("resumeContent");
const shareButton = document.getElementById("shareButton");
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const number = document.getElementById("number").value;
    const degree = document.getElementById("degree").value;
    const institute = document.getElementById("institute")
        .value;
    const workText = document.getElementById("workText")
        .value;
    const experianceText = document.getElementById("experianceText").value;
    const photoInput = document.getElementById("photo");
    const photofile = photoInput.files ? photoInput.files[0] : null;
    let photoBase64 = "";
    if (photofile) {
        photoBase64 = await fileToBase64(photofile);
        localStorage.setItem("resumePhoto", photoBase64);
        resumePhoto.src = photoBase64;
        document.querySelector("#container")?.classList.add("hidden");
        resumePage.classList.remove("hidden");
        resumeName.textContent = name;
        resumeEmail.textContent = `Email : ${email}`;
        resumePhone.textContent = `Contact : ${number}`;
        resumeEducation.textContent = `${degree} from ${institute}`;
        resumeWorkExperiance.textContent = experianceText;
        resumeSkills.textContent = workText;
    }
});
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
export {};
