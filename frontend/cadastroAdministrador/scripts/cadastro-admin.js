const cadastroForm = document.querySelector("#cadastro-admin-form");
const cadastroMessage = document.querySelector("#cadastro-message");

cadastroForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Captura os valores digitados nos campos
    const nome = document.querySelector("#nome").value.trim();
    const email = document.querySelector("#email").value.trim();
    const cpf = document.querySelector("#cpf").value.trim();
    const senha = document.querySelector("#senha").value;
    const confirmarSenha = document.querySelector("#confirmar-senha").value;

    // Verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
        cadastroMessage.textContent = "As senhas não coincidem.";
        return;
    }

    // Monta o objeto que será enviado ao Java
    const administrador = {
        nome: nome,
        email: email,
        cpf: cpf,
        senhaHash: senha,
    };

    try {
        const resposta = await fetch(
            "http://localhost:8080/estacioNatal/administradores",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(administrador)
            }
        );

        const resultado = await resposta.json();

        if (!resposta.ok) {
            cadastroMessage.textContent =
                typeof resultado === "string"
                    ? resultado
                    : "Não foi possível realizar o cadastro.";

            return;
        }

        cadastroMessage.textContent = "Administrador cadastrado com sucesso!";
        cadastroForm.reset();

    } catch (erro) {
        console.error("Erro:", erro);
        cadastroMessage.textContent =
            "Não foi possível conectar ao servidor.";
    }
});