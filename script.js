const updateButton = document.getElementById("updateContact");
const contactDisplay = document.getElementById("contactDisplay");
const contactInput = document.getElementById("contactInput");

updateButton.addEventListener("click", () => {
  const newContact = contactInput.value;
  if (newContact) {
    contactDisplay.textContent = newContact;
    contactInput.value = "";
  }
});

const toggleSkillBtn = document.getElementById("toggle");
const skillList = document.getElementById("skillList");

toggleSkillBtn.addEventListener("click", () => {
  if (skillList.style.display === "none") {
    skillList.style.display = "block";
    toggleSkillBtn.textContent = "Hide Skills";
  } else {
    skillList.style.display = "none";
    toggleSkillBtn.textContent = "Show Skills";
  }
});

const saveBtn = document.getElementById("saveResume");

saveBtn.addEventListener("click", () => {
  const resumedata = {
    contact: contactDisplay.textContent,
  };

  localStorage.setItem("resumeData", JSON.stringify(resumedata));
  alert("Resume Data Saved!");
});
