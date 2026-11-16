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

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent =
    "Dados validados. A integração com o serviço de cadastro ainda não está configurada.";
  formMessage.hidden = false;
});

form.addEventListener("reset", () => {
  confirmPassword.setCustomValidity("");
  formMessage.textContent = "";
  formMessage.hidden = true;
});