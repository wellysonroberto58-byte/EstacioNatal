package server;

import java.util.ArrayList;
import java.util.List;

public class UsuarioTesteRepository {


    
    List<UsuarioTeste> usuarios = new ArrayList<>();

    public List<UsuarioTeste> listarUsuarios(){
        return usuarios;
    };

    public void cadastrarUsuario (UsuarioTeste usuarioTeste){
        usuarios.add(usuarioTeste);
    }

    public void atualizarVaga(int id, UsuarioTeste novosDados){
        
        for (UsuarioTeste usuarioTeste : usuarios) {
            if (usuarioTeste.getId() == id){
                usuarioTeste.setNome(novosDados.getNome());
                usuarioTeste.setIdade(novosDados.getIdade());
            }
        }
    };

    public void deletarUsuario(int id){
        int indice;

        for (UsuarioTeste usuarioTeste : usuarios) {
            if (usuarioTeste.getId() == id){
                indice = usuarios.indexOf(usuarioTeste);                
                usuarios.remove(indice);
            }
        }
    }

    
}
