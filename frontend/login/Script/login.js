const loginForm = document.querySelector(".login-form");
const forgotPasswordLink = document.querySelector("#forgot-password");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener(
  "invalid",
  () => {
    loginMessage.dataset.state = "error";
    loginMessage.textContent = "Confira os campos destacados e corrija os dados.";
    loginMessage.hidden = false;
  },
  true,
);

loginForm.addEventListener("input", () => {
  if (
    loginMessage.dataset.state === "error" &&
    loginForm.querySelector(":invalid") === null
  ) {
    loginMessage.hidden = true;
  }
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginMessage.dataset.state = "warning";
  loginMessage.textContent =
    "O serviço de autenticação ainda não está configurado.";
  loginMessage.hidden = false;
});

forgotPasswordLink.addEventListener("click", (event) => {
  event.preventDefault();
  loginMessage.dataset.state = "warning";
  loginMessage.textContent =
    "A recuperação de senha ainda não está configurada.";
  loginMessage.hidden = false;
});
