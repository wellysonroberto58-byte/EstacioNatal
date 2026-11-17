package repository;

import java.util.ArrayList;
import java.util.List;

import model.Usuario;

public class IUsuarioMemory implements IUsuario {


    List<Usuario> usuarios = new ArrayList<>();
    int proximoId = 1;

    @Override
    public void salvar(Usuario usuario){
        usuario.setId(proximoId);
        usuarios.add(usuario);
        proximoId++;
    }

    @Override 
    public Usuario buscarPorId(int id){
        for (Usuario usuario : usuarios) {
            if(usuario.getId() == id){
                return usuario;
            }
        }
        return null;

    }

    @Override 
    public List<Usuario> listarTodas(){
        return usuarios;
    }
    @Override
    public Usuario buscarPorEmail(String email){
        for (Usuario usuario : usuarios) {
            if (usuario.getEmail() == email){
                return usuario;
            }
        }
        return null;
    }


}
