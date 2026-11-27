package service;

import java.util.List;

import model.Motorista;
import repository.IMotorista;

public class MotoristaService {

    private IMotorista repository;

    public MotoristaService (IMotorista repository){
        this.repository = repository;
    }

    public Motorista autenticar(String email, String senha){
      
        Motorista motorista = repository.buscarPorEmail(email);

        if (motorista == null){
            return null;
        }

        if (!motorista.getSenhaHash().equals(senha)){
            return null;
        }

        return motorista;

   }
    
    public void cadastrarMotorista(Motorista motorista){
        
        if (motorista == null){
            throw new IllegalArgumentException("O motorista não pode ser vazio");
        }

        else if(repository.buscarPorEmail(motorista.getEmail()) != null){
            System.out.println("EMAIL JA CADASTRADO!");
            throw new IllegalArgumentException("O email já está cadastrado");
        }

        // Verifica o nome
        if (motorista.getNome() == null || motorista.getNome().isBlank()) {
            throw new IllegalArgumentException("Nome não pode estar vazio");
        }

        // Verifica o email
        if (motorista.getEmail() == null || motorista.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email não pode estar vazio");
        }

        // Verifica a senha
        if (motorista.getSenhaHash() == null || motorista.getSenhaHash().isBlank()) {
            throw new IllegalArgumentException("Senha não pode estar vazia");
        }

        repository.salvar(motorista);

    }

    public List<Motorista> listaMotoristas(){
        return repository.listarTodas();
    }

    public Motorista buscarPorEmail(String email){
        return repository.buscarPorEmail(email);
    }

    public Motorista buscarPorId(int id){
        return repository.buscarPorId(id);
    }

}
