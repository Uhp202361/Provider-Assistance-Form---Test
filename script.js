// script.js
document.addEventListener("DOMContentLoaded", function () {
  const addDependentBtn = document.getElementById("addDependentBtn");
  const dependentsContainer = document.getElementById("dependentsContainer");
  const dependentTemplate = document.getElementById("dependentTemplate");

  const addPhysicianBtn = document.getElementById("addPhysicianBtn");
  const physiciansContainer = document.getElementById("physiciansContainer");
  const physicianTemplate = document.getElementById("physicianTemplate");

  const providerForm = document.getElementById("providerForm");
  const submitBtn = document.getElementById("submitBtn");
  const formMessage = document.getElementById("formMessage");

  let physicianCounter = 0;

  function addDependent(prefill = {}) {
    const clone = dependentTemplate.content.cloneNode(true);
    const entry = clone.querySelector(".dependent-entry");

    // Prefill values
    if (prefill.first) entry.querySelector('input[name="dependent_first[]"]').value = prefill.first;
    if (prefill.last) entry.querySelector('input[name="dependent_last[]"]').value = prefill.last;
    if (prefill.suffix) entry.querySelector('input[name="dependent_suffix[]"]').value = prefill.suffix;
    if (prefill.dob) entry.querySelector('input[name="dependent_dob[]"]').value = prefill.dob;
    if (prefill.relationship) entry.querySelector('select[name="dependent_relationship[]"]').value = prefill.relationship;

    setupRemoveButton(entry);
    dependentsContainer.appendChild(entry);
    entry.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function addPhysician(prefill = {}) {
    const clone = physicianTemplate.content.cloneNode(true);
    const entry = clone.firstElementChild;
    const uniqueId = ++physicianCounter;

    // Replace __ID__ in radio names
    entry.querySelectorAll('[name*="physician_appointment___ID__"]').forEach(el => {
      el.name = el.name.replace('__ID__', uniqueId);
    });

    // Prefill values
    if (prefill.first) entry.querySelector('input[name="physician_first[]"]').value = prefill.first;
    if (prefill.last) entry.querySelector('input[name="physician_last[]"]').value = prefill.last;
    if (prefill.practice) entry.querySelector('input[name="physician_practice[]"]').value = prefill.practice;
    if (prefill.title) entry.querySelector('select[name="physician_title[]"]').value = prefill.title;
    if (prefill.phone) entry.querySelector('input[name="physician_phone[]"]').value = prefill.phone;
    if (prefill.specialty) entry.querySelector('select[name="physician_specialty[]"]').value = prefill.specialty;
    if (prefill.address) entry.querySelector('input[name="physician_address[]"]').value = prefill.address;
    if (prefill.city) entry.querySelector('input[name="physician_city[]"]').value = prefill.city;
    if (prefill.state) entry.querySelector('input[name="physician_state[]"]').value = prefill.state;
    if (prefill.zip) entry.querySelector('input[name="physician_zip[]"]').value = prefill.zip;
    if (prefill.patient) entry.querySelector('select[name="physician_patient[]"]').value = prefill.patient;
    if (prefill.appointment) {
      const radio = entry.querySelector(`input[name="physician_appointment_${uniqueId}[]"][value="${prefill.appointment}"]`);
      if (radio) radio.checked = true;
    }

    setupRemoveButton(entry);
    physiciansContainer.appendChild(entry);
    entry.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function setupRemoveButton(entry) {
    const removeBtn = entry.querySelector(".remove-entry");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => entry.remove());
    }
  }

  // Event Listeners
  addDependentBtn.addEventListener("click", () => addDependent());
  addPhysicianBtn.addEventListener("click", () => addPhysician());

  // Form Submission
  providerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    formMessage.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    if (!providerForm.checkValidity()) {
      providerForm.reportValidity();
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      return;
    }

    const formData = new FormData(providerForm);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";

      if (result.success) {
        providerForm.reset();
        dependentsContainer.innerHTML = "";
        physiciansContainer.innerHTML = "";
        physicianCounter = 0;
        formMessage.style.color = "green";
        formMessage.textContent = "Thank you — your form has been sent successfully.";
      } else {
        formMessage.style.color = "crimson";
        formMessage.textContent = result.message || "There was a problem. Please try again.";
      }
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      formMessage.style.color = "crimson";
      formMessage.textContent = "Network error. Check your connection.";
      console.error("Submission error:", err);
    }
  });
});