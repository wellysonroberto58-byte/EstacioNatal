package repository;

import java.util.ArrayList;
import java.util.List;

import model.Usuario;

public class IUsuarioMemory implements IUsuario {

    List<Usuario> usuarios = new ArrayList<>();

    public void salvar(Usuario usuario){
        usuarios.add(usuario);
    }

    public Usuario buscarPorId(int id){
        for (Usuario usuario : usuarios) {
            if(usuario.getId() == id){
                return usuario;
            }
        }
        return null;

    }

    public List<Usuario> listarTodas(){
        return usuarios;
    }
}
