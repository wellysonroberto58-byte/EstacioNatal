const form = document.querySelector(".signup-form");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const formMessage = document.querySelector(".form-message");

function validatePasswordMatch() {
  confirmPassword.setCustomValidity(
    confirmPassword.value === password.value ? "" : "As senhas não coincidem.",
  );
}

password.addEventListener("input", validatePasswordMatch);
confirmPassword.addEventListener("input", validatePasswordMatch);

form.addEventListener(
  "invalid",
  () => {
    formMessage.dataset.state = "error";
    formMessage.textContent = "Confira os campos destacados e corrija os dados.";
    formMessage.hidden = false;
  },
  true,
);

form.addEventListener("input", () => {
  if (
    formMessage.dataset.state === "error" &&
    form.querySelector(":invalid") === null
  ) {
    formMessage.hidden = true;
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.dataset.state = "warning";
  formMessage.textContent =
    "Dados validados. A integração com o serviço de cadastro ainda não está configurada.";
  formMessage.hidden = false;
});

form.addEventListener("reset", () => {
  confirmPassword.setCustomValidity("");
  delete formMessage.dataset.state;
  formMessage.textContent = "";
  formMessage.hidden = true;
});