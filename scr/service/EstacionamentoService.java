
package service;

import model.Estacionamento;
import repository.IEstacionamento;

public class EstacionamentoService {

    private IEstacionamento repository;

    public EstacionamentoService(IEstacionamento repository) {
        this.repository = repository;
    }

    public Estacionamento buscarPorId(int id) {
        return repository.procurarPorId(id);
    }
    
    public void validarCadastro(Estacionamento estacionamento) {

        if (estacionamento == null) {
            throw new IllegalArgumentException("Estacionamento inválido");
        }

        if (estacionamento.getEndereco() == null ||
            estacionamento.getEndereco().isBlank()) {
            throw new IllegalArgumentException("Endereço inválido");
        }

        if (repository.procurarPorEndereco(estacionamento.getEndereco()) != null) {
            throw new IllegalArgumentException(
                "Não foi possível salvar. Endereço já cadastrado"
            );
        }
    }

    public void salvar(Estacionamento estacionamento) {
        repository.salvar(estacionamento);
    }
}
