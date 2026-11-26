
package service;

import java.util.List;

import model.Administrador;
import repository.IAdministrador;

public class AdministradorService {

    private IAdministrador repository;

    public AdministradorService(IAdministrador repository) {
        this.repository = repository;
    }

    public void cadastrar(Administrador administrador) {

        // Verifica se os dados obrigatórios foram preenchidos
        if (administrador.getNome() == null || administrador.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome é obrigatório.");
        }

        if (administrador.getEmail() == null || administrador.getEmail().isBlank()) {
            throw new IllegalArgumentException("E-mail é obrigatório.");
        }

        if (administrador.getCpf() == null || administrador.getCpf().isBlank()) {
            throw new IllegalArgumentException("CPF é obrigatório.");
        }

        if (administrador.getSenhaHash() == null || administrador.getSenhaHash().isBlank()) {
            throw new IllegalArgumentException("Senha é obrigatória.");
        }

        // Verifica se já existe um administrador com o mesmo e-mail
        if (repository.buscarPorEmail(administrador.getEmail()) != null) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        // Verifica se já existe um administrador com o mesmo CPF
        for (Administrador existente : repository.listarTodos()) {

            if (existente.getCpf().equals(administrador.getCpf())) {
                throw new IllegalArgumentException("CPF já cadastrado.");
            }
        }

        // Se passou pelas validações, salva o administrador
        repository.salvar(administrador);
    }

    public Administrador autenticar(String email, String senha) {

        // Verifica se os campos foram preenchidos
        if (email == null || email.isBlank() ||
            senha == null || senha.isBlank()) {

            throw new IllegalArgumentException("Preencha e-mail e senha.");
        }

        // Procura o administrador pelo e-mail
        Administrador administrador = repository.buscarPorEmail(email);

        // Verifica se o administrador existe
        if (administrador == null) {
            throw new IllegalArgumentException("Administrador não encontrado.");
        }

        // Compara a senha informada com a cadastrada
        if (!administrador.getSenhaHash().equals(senha)) {
            throw new IllegalArgumentException("Senha incorreta.");
        }

        return administrador;
    }

    public List<Administrador> listarTodos() {
        return repository.listarTodos();
    }

    public Administrador buscarPorId(int id) {
        return repository.buscarPorId(id);
    }

    public Administrador buscarPorEmail(String email) {
        return repository.buscarPorEmail(email);
    }
}
