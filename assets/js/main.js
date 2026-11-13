(() => {
  // Footer year + privacy last updated
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  const today = document.getElementById("today");
  if (today) {
    const d = new Date();
    today.textContent = d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  }

  // Mobile nav
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    // close on outside click
    document.addEventListener("click", (e) => {
      const t = e.target;
      const clickedInside = menu.contains(t) || toggle.contains(t);
      if (!clickedInside && menu.classList.contains("open")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Header elevation on scroll
  const header = document.querySelector("[data-elevate]");
  const setHeader = () => {
    if (!header) return;
    if (window.scrollY > 8) header.classList.add("elevated");
    else header.classList.remove("elevated");
  };
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });

  // Contact "sent" banner support after the form's _next redirect.
  const params = new URLSearchParams(location.search);
  if (params.get("sent") === "1") {
    const main = document.getElementById("main");
    if (main) {
      const banner = document.createElement("div");
      banner.className = "container";
      banner.innerHTML = `
        <div class="card" style="margin-top:16px;">
          <strong>Message sent.</strong>
          <div class="muted">Thanks! We’ll get back to you shortly.</div>
        </div>
      `;
      main.prepend(banner);
    }
  }
  // Contact form: support multiple services, query-string preselection, and custom needs.
  const consultationForm = document.querySelector("form.form");
  const serviceFieldset = document.getElementById("serviceOptions");
  const serviceOptions = Array.from(document.querySelectorAll('#serviceOptions input[name="service"]'));
  const serviceError = document.getElementById("serviceError");
  const otherServiceLabel = document.getElementById("otherServiceLabel");
  const otherServiceInput = document.getElementById("otherService");

  if (
    consultationForm &&
    serviceFieldset &&
    serviceOptions.length &&
    serviceError &&
    otherServiceLabel &&
    otherServiceInput
  ) {
    const notSureOption = serviceOptions.find((option) => option.hasAttribute("data-exclusive"));
    const otherOption = serviceOptions.find((option) => option.value === "Other / custom need");
    let serviceValidationAttempted = false;

    const selectedServices = () => serviceOptions
      .filter((option) => option.checked)
      .map((option) => option.value);

    const syncOtherField = () => {
      const isOther = Boolean(otherOption && otherOption.checked);
      otherServiceLabel.hidden = !isOther;
      otherServiceInput.disabled = !isOther;
      otherServiceInput.required = isOther;
      if (!isOther) otherServiceInput.value = "";
    };

    const syncServiceValidation = () => {
      const hasSelection = selectedServices().length > 0;
      serviceOptions[0].setCustomValidity(
        hasSelection ? "" : "Select at least one service, or choose Not sure yet."
      );
      serviceError.hidden = hasSelection || !serviceValidationAttempted;

      if (!hasSelection && serviceValidationAttempted) {
        serviceFieldset.setAttribute("aria-invalid", "true");
      } else {
        serviceFieldset.removeAttribute("aria-invalid");
      }
    };

    const syncServiceFields = () => {
      syncOtherField();
      syncServiceValidation();
    };

    const requestedServices = params.getAll("service");
    requestedServices.forEach((requestedService) => {
      const normalizedService = requestedService === "Other"
        ? "Other / custom need"
        : requestedService;
      const matchingOption = serviceOptions.find((option) => option.value === normalizedService);
      if (matchingOption) matchingOption.checked = true;
    });

    if (notSureOption && notSureOption.checked && selectedServices().length > 1) {
      notSureOption.checked = false;
    }

    serviceOptions.forEach((option) => {
      option.addEventListener("change", () => {
        if (option.checked && option === notSureOption) {
          serviceOptions.forEach((candidate) => {
            if (candidate !== notSureOption) candidate.checked = false;
          });
        } else if (option.checked && notSureOption) {
          notSureOption.checked = false;
        }

        syncServiceFields();
      });
    });

    serviceOptions[0].addEventListener("invalid", () => {
      serviceValidationAttempted = true;
      syncServiceValidation();
    });

    consultationForm.addEventListener("formdata", (event) => {
      event.formData.delete("service");
      event.formData.append("services", selectedServices().join(", "));
    });

    syncServiceFields();
  }
})();
