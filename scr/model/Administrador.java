package model; 

import java.util.List; 

// Classe Administrador heranca de Usuário e implementa IdAdministrador
public class Administrador extends Usuario implements IdAdministrador {
    // contrutor
    public Administrador(String nome, String email, String cpf, String senhaHash, int id) {
        super(nome, email, cpf, senhaHash, id);
    }
    public List<HistoricoOcupacao> exibirHistorico(){
        return null;
    }

    // Altera o status de uma câmara de monitoramento
    public void alterarStatusCamera(StatusCamera status) {
    }

    // Altera o status geral das vagas
    public void alterarStatusVagas(StatusVaga status) {
    }
    // coisas de IdAdministrador
    @Override
    public void adicionarVaga(Vaga vaga) {
    }
    @Override
    public void excluirVaga(int id) {
    }
    @Override
    public void editarVaga(int id, Vaga vaga) {
   
    }
    @Override
    public void adicionarCamera(Camera camera) {
    }

    @Override
    public void editarCamera(int id, Camera camera) {
    }

    @Override
    public void excluirCamera(int id) {
    }
}