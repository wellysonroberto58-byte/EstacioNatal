const loginForm = document.querySelector(".login-form");
const forgotPasswordLink = document.querySelector("#forgot-password");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener(
  "invalid",
  () => {
    loginMessage.dataset.state = "error";
    loginMessage.textContent =
      "Confira os campos destacados e corrija os dados.";
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

//autenticação

const formulario = document.querySelector(".login-form");
const textoMensagem = document.querySelector("#texto-mensagem");
const overlay = document.querySelector("#overlay-login");

//função para mostrar mensagme de erro
function mostrarMensagem(texto) {
  textoMensagem.textContent = texto;

  overlay.classList.add("ativa");

  setTimeout(() => {
    overlay.classList.remove("ativa");
  }, 3000);
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = document.querySelector("#identifier").value;
  const senha = document.querySelector("#password").value;

  const dadosLogin = { email: email, senhaHash: senha };

  fetch("http://localhost:8080/estacioNatal/login/motorista", {
    //conexão com o backend
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(dadosLogin),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.text();
      }

      if (response.status === 401) {
        throw new Error("Email ou senha incorretos.");
      }

      throw new Error("Erro ao realizar login.");
    })
    .then((dados) => {
      console.log("Login realizado: ", dados);
    })

    .catch((erro) => {
      console.error("ERRO", erro);

      mostrarMensagem(erro.message);
    });
});
