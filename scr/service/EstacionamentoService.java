package service;

import model.Estacionamento;
import repository.IEstacionamento;

public class EstacionamentoService {

    private IEstacionamento repository;

    public EstacionamentoService (IEstacionamento repository){
        this.repository = repository;
    }

    public void salvar(Estacionamento estacionamento){
        
        if (repository.procurarPorEndereco(estacionamento.getEndereco()) != null){
            throw new IllegalArgumentException("Não foi possível salvar. Endereço já cadastrado");
        }

        if(repository.procurarPorId(estacionamento.getId()) != null){
            throw new IllegalArgumentException("Não foi possível salvar. Estacionamento já cadastrado");
        }

        repository.salvar(estacionamento);
    }
}
