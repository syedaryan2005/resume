import { rejects } from "assert";
import { resolve } from "path";

const form = document.getElementById("resumeForm") as HTMLFormElement;
const resumePage = document.getElementById("resumePage") as HTMLElement;
const resumePhoto = document.getElementById("resumePhoto") as HTMLImageElement;
const resumeName = document.getElementById("resumeName") as HTMLHeadingElement;
const resumeEmail = document.getElementById(
  "resumeEmail"
) as HTMLParagraphElement;
const resumePhone = document.getElementById(
  "resumePhone"
) as HTMLParagraphElement;
const resumeEducation = document.getElementById(
  "resumeEducation"
) as HTMLParagraphElement;
const resumeWorkExperiance = document.getElementById(
  "resumeWorkExperiance"
) as HTMLParagraphElement;
const resumeSkills = document.getElementById(
  "resumeSkills"
) as HTMLParagraphElement;
const downloadPdfButton = document.getElementById(
  "download-pdf"
) as HTMLButtonElement;
const backButton = document.getElementById("backButton") as HTMLButtonElement;
const editButton = document.getElementById("editButton") as HTMLButtonElement;
const resumeContent = document.getElementById(
  "resumeContent"
) as HTMLDivElement;
const shareButton = document.getElementById("shareButton") as HTMLButtonElement;

form.addEventListener("submit", async (event: Event) => {
  event.preventDefault();

  const name = (document.getElementById("name") as HTMLInputElement).value;
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const number = (document.getElementById("number") as HTMLInputElement).value;
  const degree = (document.getElementById("degree") as HTMLInputElement).value;
  const institute = (document.getElementById("institute") as HTMLInputElement)
    .value;
  const workText = (document.getElementById("workText") as HTMLTextAreaElement)
    .value;
  const experianceText = (
    document.getElementById("experianceText") as HTMLTextAreaElement
  ).value;
  const photoInput = document.getElementById("photo") as HTMLInputElement;

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

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result as string);

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

