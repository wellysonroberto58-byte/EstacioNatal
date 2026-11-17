package service;

import java.util.List;

import model.Usuario;
import repository.IUsuario;
import repository.IUsuarioMemory;

public class UsuarioService {

    private IUsuario repository;

    public UsuarioService (IUsuario repository){
        this.repository = repository;
    }
    
    public void cadastrarUsuario(Usuario usuario){
        
        if (usuario == null){
            throw new IllegalArgumentException("O usuario não pode ser vazio");
        }

        else if(repository.buscarPorEmail(usuario.getEmail()) != null){
            throw new IllegalArgumentException("O email já está cadastrado");
        }

        // Verifica o nome
        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome não pode estar vazio");
        }

        // Verifica o email
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email não pode estar vazio");
        }

        // Verifica a senha
        if (usuario.getSenhaHash() == null || usuario.getSenhaHash().isBlank()) {
            throw new IllegalArgumentException("Senha não pode estar vazia");
        }

        repository.salvar(usuario);

    }

    public List<Usuario> listaUsuarios(){
        return repository.listarTodas();
    }

    public Usuario buscarPorEmail(String email){
        return repository.buscarPorEmail(email);
    }

    public Usuario buscarPorId(int id){
        return repository.buscarPorId(id);
    }

}
