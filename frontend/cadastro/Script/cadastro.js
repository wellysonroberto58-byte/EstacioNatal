const form = document.querySelector(".signup-form");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");
const formMessage = document.querySelector(".form-message");

function validatePasswordMatch() {
  if (confirmPassword.value === password.value) {
    confirmPassword.setCustomValidity("");
  } else {
    confirmPassword.setCustomValidity("As senhas não coincidem.");
  }
}

password.addEventListener("input", validatePasswordMatch);
confirmPassword.addEventListener("input", validatePasswordMatch);

form.addEventListener(
  "invalid",
  () => {
    formMessage.dataset.state = "error";
    formMessage.textContent =
      "Confira os campos destacados e corrija os dados.";
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

form.addEventListener("reset", () => {
  confirmPassword.setCustomValidity("");
  delete formMessage.dataset.state;
  formMessage.textContent = "";
  formMessage.hidden = true;
});

//URL + FETCH
const formulario = document.querySelector(".signup-form");

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const nome = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const placa = document.querySelector("#placa").value;
  const cpf = document.querySelector("#cpf").value;

  const senha = document.querySelector("#password").value;

  const novoMotorista = {
    nome: nome,
    email: email,
    cpf: cpf,
    senhaHash: senha,
    placa: placa,
  };

  fetch("http://localhost:8080/estacioNatal/motoristas", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(novoMotorista),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Não foi possível cadastrar o motorista");
      }

      return response.text();
    })
    .then((dados) => {
      console.log("MOTORISTA CADASTRADO COM SUCESSO!");

      const mensagem = document.createElement("div");

      mensagem.textContent = "Cadastro realizado com sucesso!";

      mensagem.classList.add("mensagem-sucesso");

      document.body.appendChild(mensagem);

      setTimeout(() => {
        mensagem.remove();
      }, 3000);

      formulario.reset();
    })
    .catch((erro) => {
      console.error("Erro ao cadastrar:", erro);
      alert(erro.message);
    });
});
