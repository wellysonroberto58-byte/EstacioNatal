const loginForm = document.querySelector("#login-admin-form");
const loginMessage = document.querySelector("#login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const senha = document.querySelector("#senha").value;

    const credenciais = {
        email: email,
        senha: senha
    };

    try {
        const resposta = await fetch(
            "http://localhost:8080/estacioNatal/login/administrador",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credenciais)
            }
        );

        const resultado = await resposta.text();

        if (!resposta.ok) {
            loginMessage.textContent =
                typeof resultado === "string"
                    ? resultado
                    : "Não foi possível realizar o login.";

            return;
        }

        loginMessage.textContent = "Login realizado com sucesso!";
        window.location.href = "../homeAdministrador/gerencia.html";

    } catch (erro) {
        console.error("Erro:", erro);
        loginMessage.textContent = "Email ou senha incorretas.";
    }
});