package service;

import java.util.ArrayList;
import java.util.List;

import model.Estacionamento;
import model.Piso;
import model.Setor;
import model.StatusVaga;
import model.Vaga;
import repository.IEstacionamento;
import repository.IVaga;

public class EstacionamentoService {

    private IEstacionamento repository;
    private IVaga vagaRepository;

    public EstacionamentoService (IEstacionamento repository){
        this.repository = repository;
    }

    private List<Vaga> gerarVagas(String setor, int quantidade){

        List<Vaga> vagasGeradas = new ArrayList<>();

        for (int i = 1; i <= quantidade; i++ ){
            Vaga vaga = new Vaga();

            vaga.setIdentificador(String.format("%s%02d", setor, i));

            vaga.setStatus(StatusVaga.DISPONIVEL);

            vagasGeradas.add(vaga);
        }

        return vagasGeradas;
    }

    public void salvar(Estacionamento estacionamento){
        
        if (repository.procurarPorEndereco(estacionamento.getEndereco()) != null){
            throw new IllegalArgumentException("Não foi possível salvar. Endereço já cadastrado");
        }

        if(repository.procurarPorId(estacionamento.getId()) != null){
            throw new IllegalArgumentException("Não foi possível salvar. Estacionamento já cadastrado");
        }

        for (Piso piso : estacionamento.getPisos()) {
            for (Setor setor : piso.getSetores()){

                List<Vaga> vagasGeradas = gerarVagas(
                    setor.getIdentificador(),
                    setor.getQuantidadeVaga()
                );
                for (Vaga vaga : vagasGeradas) {
                    vagaRepository.adicionarVaga(vaga);
                }
                setor.setVagas(vagasGeradas);
            }
        }

        repository.salvar(estacionamento);
    }
}
