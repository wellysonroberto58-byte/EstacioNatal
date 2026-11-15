package model; 

import java.util.List; 

// Classe Administrador heranca de Usuário e implementa IdAdministrador
public class Administrador extends Usuario {

    // contrutor
    public Administrador(String nome, String email, String cpf, String senhaHash, int id) {
        super(nome, email, cpf, senhaHash, id);
    }
    
    public List<HistoricoOcupacao> exibirHistorico(){ // Melhor colocar no AdministradorService
        return null;
    }


}