const loginForm = document.querySelector(".login-form");
const forgotPasswordLink = document.querySelector("#forgot-password");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  loginMessage.textContent =
    "O serviço de autenticação ainda não está configurado.";
  loginMessage.hidden = false;
});

forgotPasswordLink.addEventListener("click", (event) => {
  event.preventDefault();
  loginMessage.textContent =
    "A recuperação de senha ainda não está configurada.";
  loginMessage.hidden = false;
});
