(function () {
  const allowedExtensions = ["pdf", "doc", "docx"];
  const allowedMimeTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];
  const maxCvSizeBytes = 5 * 1024 * 1024;
  const allowedIntakeOptions = ["Sept 2026", "Jan-Feb 2027", "Exploring"];
  const allowedBudgetOptions = ["Under $30,000", "$30,000-$50,000", "$50,000-$80,000"];
  const allowedSupportTypes = [
    "Core Placement Program",
    "Complete Package",
    "Visa Advisory",
    "Bespoke SOP Writing",
    "Not sure yet - need recommendation"
  ];
  const allowedDestinations = ["UK", "USA", "Canada", "Australia", "Italy", "Other"];

  const stepSchema = {
    0: [
      "fullName",
      "whatsappNumber",
      "cityResidence",
      "educationLevel",
      "currentCgpa",
      "currentUniversity"
    ],
    1: ["graduationYear", "englishProficiency", "intake"],
    2: ["budget"],
    3: ["destinations", "supportType", "careerGoals", "cvFile"]
  };

  window.EDVERSITY_FORM_SCHEMA = stepSchema;

  function normalizeText(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  const validators = {
    fullName: function (value) {
      const normalized = normalizeText(value);
      if (normalized.length < 2) {
        return "Please enter your full name.";
      }
      if (normalized.length > 80) {
        return "Full name must be 80 characters or fewer.";
      }
      return /^[A-Za-z][A-Za-z\s.'-]*$/.test(normalized) || "Name should contain letters only.";
    },
    whatsappNumber: function (value) {
      const normalized = normalizeText(value);
      return /^\+[1-9]\d{7,14}$/.test(normalized) || "Use format +923001234567 with country code.";
    },
    cityResidence: function (value) {
      const normalized = normalizeText(value);
      if (normalized.length < 2) {
        return "Please enter your city of residence.";
      }
      if (normalized.length > 60) {
        return "City must be 60 characters or fewer.";
      }
      return /^[A-Za-z][A-Za-z\s.'-]*$/.test(normalized) || "Please enter a valid city name.";
    },
    educationLevel: function (value) {
      return value !== "" || "Please select your education level.";
    },
    currentCgpa: function (value) {
      const normalized = normalizeText(value).toLowerCase();
      if (!normalized) {
        return "Please provide your CGPA or percentage.";
      }

      const numbers = normalized.match(/\d+(\.\d+)?/g) || [];
      if (!numbers.length) {
        return "Enter CGPA (e.g. 3.6/4.0) or percentage (e.g. 82%).";
      }

      if (normalized.includes("%") || normalized.includes("percent")) {
        const percent = Number(numbers[0]);
        return (percent >= 0 && percent <= 100) || "Percentage must be between 0 and 100.";
      }

      if (normalized.includes("/")) {
        const scaleMatch = normalized.match(/(\d+(\.\d+)?)\s*\/\s*(\d+(\.\d+)?)/);
        if (!scaleMatch) {
          return "Use a valid format like 3.6/4.0.";
        }

        const obtained = Number(scaleMatch[1]);
        const scale = Number(scaleMatch[3]);
        if (!(scale > 0 && scale <= 100)) {
          return "Please enter a valid CGPA scale.";
        }
        return (obtained >= 0 && obtained <= scale) || "Score cannot be higher than its scale.";
      }

      const score = Number(numbers[0]);
      if (score >= 0 && score <= 4.3) {
        return true;
      }
      if (score > 4.3 && score <= 100) {
        return true;
      }
      return "Enter a valid CGPA or percentage.";
    },
    currentUniversity: function (value) {
      const normalized = normalizeText(value);
      if (normalized.length < 2) {
        return "Please enter your current university.";
      }
      if (normalized.length > 120) {
        return "University name must be 120 characters or fewer.";
      }
      return /[A-Za-z]/.test(normalized) || "Please enter a valid university name.";
    },
    graduationYear: function (value) {
      const year = Number(value);
      return (
        (Number.isInteger(year) && year >= 2020 && year <= 2035) ||
        "Enter a valid graduation year between 2020 and 2035."
      );
    },
    englishProficiency: function (value) {
      const normalized = normalizeText(value).toLowerCase();
      if (normalized.length < 3) {
        return "Please share IELTS/PTE details or your test plan.";
      }

      const ieltsMatch = normalized.match(/ielts\s*[:\-]?\s*(\d(?:\.\d)?)/);
      if (ieltsMatch) {
        const score = Number(ieltsMatch[1]);
        return (score >= 0 && score <= 9) || "IELTS score must be between 0 and 9.";
      }

      const pteMatch = normalized.match(/pte\s*[:\-]?\s*(\d{1,2})/);
      if (pteMatch) {
        const score = Number(pteMatch[1]);
        return (score >= 10 && score <= 90) || "PTE score must be between 10 and 90.";
      }

      if (/\b(plan|planning|booked|scheduled|preparing|attempt|pending|soon|will take|test plan)\b/.test(normalized)) {
        return true;
      }

      return "Please include IELTS/PTE score or mention your test plan.";
    },
    intake: function (value) {
      return allowedIntakeOptions.includes(value) || "Please choose your intended intake.";
    },
    budget: function (value) {
      return allowedBudgetOptions.includes(value) || "Please select your annual tuition budget range.";
    },
    destinations: function (value) {
      if (!Array.isArray(value) || value.length === 0) {
        return "Select at least one preferred destination.";
      }
      return value.every(function (item) {
        return allowedDestinations.includes(item);
      }) || "Please select valid destination options.";
    },
    supportType: function (value) {
      return allowedSupportTypes.includes(value) || "Please select the type of support needed.";
    },
    careerGoals: function (value) {
      const normalized = normalizeText(value);
      if (normalized.length < 40) {
        return "Please provide at least 40 characters about your career goals.";
      }
      if (normalized.length > 1200) {
        return "Career goals must be 1200 characters or fewer.";
      }
      return /[A-Za-z]/.test(normalized) || "Please describe your goals in text.";
    },
    cvFile: function (file) {
      if (!file) {
        return "Please upload your CV.";
      }

      if (file.size <= 0) {
        return "Uploaded file appears to be empty.";
      }

      const name = file.name || "";
      const extension = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
      if (!allowedExtensions.includes(extension)) {
        return "Upload a PDF, DOC, or DOCX file only.";
      }

      const mimeType = (file.type || "").toLowerCase();
      if (mimeType && !allowedMimeTypes.includes(mimeType)) {
        return "Uploaded file format is not supported.";
      }

      if (file.size > maxCvSizeBytes) {
        return "File must be 5MB or smaller.";
      }

      return true;
    }
  };

  function getInputValue(fieldId) {
    if (fieldId === "budget") {
      const checked = document.querySelector('input[name="budget"]:checked');
      return checked ? checked.value : "";
    }

    if (fieldId === "destinations") {
      return Array.from(document.querySelectorAll('input[name="destinations"]:checked')).map(function (item) {
        return item.value;
      });
    }

    if (fieldId === "cvFile") {
      const fileInput = document.getElementById("cvFile");
      return fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
    }

    const field = document.getElementById(fieldId);
    return field ? normalizeText(field.value) : "";
  }

  function fieldContainer(fieldId) {
    const direct = document.getElementById(fieldId);
    if (direct) {
      return direct.closest(".field");
    }

    return document.querySelector('[data-group-field="' + fieldId + '"]');
  }

  function setFieldError(fieldId, message) {
    const errorTargets = document.querySelectorAll('[data-error-for="' + fieldId + '"]');
    errorTargets.forEach(function (target) {
      target.textContent = message || "";
    });

    const container = fieldContainer(fieldId);
    if (container) {
      container.classList.toggle("invalid", Boolean(message));
    }
  }

  function validateField(fieldId) {
    const value = getInputValue(fieldId);
    const validator = validators[fieldId];

    if (!validator) {
      return true;
    }

    const result = validator(value);
    if (result === true) {
      setFieldError(fieldId, "");
      return true;
    }

    setFieldError(fieldId, result);
    return false;
  }

  function validateStep(stepIndex) {
    const fields = stepSchema[stepIndex] || [];
    let valid = true;
    let firstInvalidField = "";

    fields.forEach(function (fieldId) {
      const fieldValid = validateField(fieldId);
      if (!fieldValid) {
        valid = false;
        if (!firstInvalidField) {
          firstInvalidField = fieldId;
        }
      }
    });

    if (!valid && firstInvalidField) {
      focusField(firstInvalidField);
    }

    return valid;
  }

  function buildSubmissionFormData(payload, cvFile) {
    const formData = new FormData();

    formData.append("_subject", "New Apply Now Submission - Edversity Consulting");
    formData.append("_template", "table");
    formData.append("_captcha", "false");
    formData.append("Full Name", payload.fullName);
    formData.append("WhatsApp Number", payload.whatsappNumber);
    formData.append("City of Residence", payload.cityResidence);
    formData.append("Education Level", payload.educationLevel);
    formData.append("Current CGPA / Percentage", payload.currentCgpa);
    formData.append("Current University", payload.currentUniversity);
    formData.append("Year of Graduation", payload.graduationYear);
    formData.append("English Proficiency", payload.englishProficiency);
    formData.append("Intake", payload.intake);
    formData.append("Annual Tuition Budget", payload.budget);
    formData.append("Preferred Destinations", payload.destinations.join(", "));
    formData.append("Type of Support Needed", payload.supportType);
    formData.append("Career Goals", payload.careerGoals);
    formData.append("Submitted From", window.location.href);
    formData.append("Submitted At", new Date().toISOString());

    if (cvFile) {
      // FormSubmit expects files under the `attachment` field name.
      formData.append("attachment", cvFile, cvFile.name);
    }

    return formData;
  }

  function focusField(fieldId) {
    if (fieldId === "budget" || fieldId === "destinations") {
      const selector = fieldId === "budget" ? 'input[name="budget"]' : 'input[name="destinations"]';
      const option = document.querySelector(selector);
      if (option) {
        option.focus();
      }
      return;
    }

    const input = document.getElementById(fieldId);
    if (input) {
      input.focus();
    }
  }

  function collectPayload() {
    const cvFile = getInputValue("cvFile");

    return {
      fullName: getInputValue("fullName"),
      whatsappNumber: getInputValue("whatsappNumber"),
      cityResidence: getInputValue("cityResidence"),
      educationLevel: getInputValue("educationLevel"),
      currentCgpa: getInputValue("currentCgpa"),
      currentUniversity: getInputValue("currentUniversity"),
      graduationYear: getInputValue("graduationYear"),
      englishProficiency: getInputValue("englishProficiency"),
      intake: getInputValue("intake"),
      budget: getInputValue("budget"),
      destinations: getInputValue("destinations"),
      supportType: getInputValue("supportType"),
      careerGoals: getInputValue("careerGoals"),
      cvFileName: (cvFile && cvFile.name) || ""
    };
  }

  function populateReview(payload) {
    document.querySelectorAll("[data-review]").forEach(function (el) {
      const key = el.getAttribute("data-review");
      if (!key) {
        return;
      }

      if (key === "destinations") {
        el.textContent = payload.destinations.length ? payload.destinations.join(", ") : "-";
        return;
      }

      el.textContent = payload[key] || "-";
    });
  }

  function bindLiveValidation() {
    Object.keys(validators).forEach(function (fieldId) {
      if (fieldId === "budget" || fieldId === "destinations") {
        const selector = fieldId === "budget" ? 'input[name="budget"]' : 'input[name="destinations"]';
        document.querySelectorAll(selector).forEach(function (input) {
          input.addEventListener("change", function () {
            validateField(fieldId);
          });
        });
        return;
      }

      const input = document.getElementById(fieldId);
      if (!input) {
        return;
      }

      const eventName = input.type === "file" || input.tagName === "SELECT" ? "change" : "input";
      input.addEventListener(eventName, function () {
        if (input.type === "file") {
          const fileName = document.getElementById("cv-file-name");
          if (fileName) {
            fileName.textContent = input.files && input.files[0] ? input.files[0].name : "No file selected";
          }
        }
        validateField(fieldId);
      });
    });
  }

  function initApplyForm() {
    const form = document.getElementById("apply-form");
    if (!form) {
      return;
    }

    const config = window.EDVERSITY_CONFIG || {};
    const submitEndpoint =
      config.formSubmitEndpoint || "https://formsubmit.co/ajax/consulting@edversity.com.pk";
    const steps = Array.from(form.querySelectorAll(".form-step"));
    const progressSteps = Array.from(form.querySelectorAll(".progress-step"));
    const nextButton = form.querySelector('[data-action="next"]');
    const backButton = form.querySelector('[data-action="back"]');
    const statusMessage = form.querySelector("[data-submit-status]");
    const confirmation = document.getElementById("form-confirmation");

    let currentStep = 0;
    let isSubmitting = false;

    function setStatus(state, text) {
      if (!statusMessage) {
        return;
      }

      const hasText = Boolean(text);
      statusMessage.hidden = !hasText;
      statusMessage.textContent = text || "";
      statusMessage.dataset.state = hasText ? state : "";
    }

    function refreshButtons() {
      if (!nextButton || !backButton) {
        return;
      }

      backButton.disabled = currentStep === 0 || isSubmitting;
      nextButton.disabled = isSubmitting;
      if (isSubmitting) {
        nextButton.textContent = "Submitting...";
        return;
      }
      nextButton.textContent = currentStep === steps.length - 1 ? "Submit Now" : "Continue";
    }

    function refreshProgress() {
      progressSteps.forEach(function (step, index) {
        step.classList.toggle("is-active", index === currentStep);
        step.classList.toggle("is-complete", index < currentStep);
      });
    }

    function renderStep() {
      steps.forEach(function (step, index) {
        step.classList.toggle("is-active", index === currentStep);
      });
      if (!isSubmitting && currentStep < steps.length - 1) {
        setStatus("", "");
      }
      refreshButtons();
      refreshProgress();
    }

    function goNext() {
      if (currentStep === steps.length - 1) {
        form.requestSubmit();
        return;
      }

      if (currentStep <= 3 && !validateStep(currentStep)) {
        return;
      }

      if (currentStep === 3) {
        const payload = collectPayload();
        populateReview(payload);
      }

      if (currentStep < steps.length - 1) {
        currentStep += 1;
        renderStep();
      }
    }

    function goBack() {
      if (currentStep > 0) {
        currentStep -= 1;
        renderStep();
      }
    }

    if (nextButton) {
      nextButton.addEventListener("click", goNext);
    }

    if (backButton) {
      backButton.addEventListener("click", goBack);
    }

    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      if (isSubmitting) {
        return;
      }

      if (window.location.protocol === "file:") {
        setStatus(
          "error",
          "Please open the website using Live Server (http://127.0.0.1:5500), then submit again."
        );
        return;
      }

      let invalidStep = -1;
      for (let step = 0; step <= 3; step += 1) {
        const valid = validateStep(step);
        if (!valid && invalidStep === -1) {
          invalidStep = step;
          break;
        }
      }

      if (invalidStep !== -1) {
        currentStep = invalidStep;
        renderStep();
        return;
      }

      const payload = collectPayload();
      const cvFile = getInputValue("cvFile");
      const formData = buildSubmissionFormData(payload, cvFile);

      isSubmitting = true;
      refreshButtons();
      setStatus("info", "Submitting your application...");

      try {
        const response = await fetch(submitEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json"
          },
          body: formData
        });

        const result = await response.json().catch(function () {
          return {};
        });

        const isSuccess = response.ok && String(result.success).toLowerCase() === "true";
        if (!isSuccess) {
          const message =
            result.message ||
            "Submission could not be completed. Please try again in a moment.";
          throw new Error(message);
        }
      } catch (error) {
        const errorText = (error && error.message) || "";
        const normalizedError = errorText.toLowerCase();

        if (normalizedError.includes("open this page through a web server")) {
          setStatus(
            "error",
            "Please run this site through Live Server (127.0.0.1:5500) and try again."
          );
        } else if (normalizedError.includes("activate")) {
          setStatus(
            "error",
            "Activation pending. Open consulting@edversity.com.pk inbox (and Spam), click the FormSubmit activation link, then submit again."
          );
        } else if (normalizedError.includes("failed to fetch") || normalizedError.includes("networkerror")) {
          setStatus(
            "error",
            "Network blocked the submission. Please disable VPN/ad-blocker for this page and allow formsubmit.co, then try again."
          );
        } else {
          setStatus(
            "error",
            "Could not submit right now. Details: " +
              (errorText || "Unknown error") +
              " | If first setup, activate FormSubmit from consulting@edversity.com.pk inbox."
          );
        }
        console.error("Apply form submission error:", error);
        isSubmitting = false;
        refreshButtons();
        return;
      }

      form.hidden = true;
      if (confirmation) {
        confirmation.hidden = false;
        const confirmName = confirmation.querySelector("[data-confirm-name]");
        const confirmIntake = confirmation.querySelector("[data-confirm-intake]");
        const confirmBudget = confirmation.querySelector("[data-confirm-budget]");

        if (confirmName) {
          confirmName.textContent = payload.fullName;
        }
        if (confirmIntake) {
          confirmIntake.textContent = payload.intake;
        }
        if (confirmBudget) {
          confirmBudget.textContent = payload.budget;
        }
      }
      isSubmitting = false;
    });

    bindLiveValidation();
    renderStep();
  }

  document.addEventListener("DOMContentLoaded", initApplyForm);
})();
