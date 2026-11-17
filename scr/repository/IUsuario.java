package repository;

import java.util.List;

import model.Usuario;

public interface IUsuario {
    
    void salvar(Usuario usuario);

    List<Usuario> listarTodas();

    Usuario buscarPorId(int id);

    Usuario buscarPorEmail(String email);
    
}
