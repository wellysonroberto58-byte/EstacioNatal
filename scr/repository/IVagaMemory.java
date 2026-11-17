package repository;

import java.util.ArrayList;
import java.util.List;

import model.Vaga;

public class IVagaMemory implements IVaga{

    List<Vaga> vagas = new ArrayList<>();
    int proximoId = 1;

    @Override
    public List<Vaga> listarVagas(){
        return vagas;
    }

    @Override
    public void adicionarVaga(Vaga vaga){
        vaga.setId(proximoId);
        vagas.add(vaga);
        proximoId++;
    }

    @Override
    public Vaga buscarPorId(int id){
        for (Vaga vaga : vagas) {
            if (vaga.getId() == id){
                return vaga;
            }
        }
        return null;
    }

    @Override
    public void excluirVaga(int id){
        Vaga vagaAlvo = buscarPorId(id);

        if (vagaAlvo != null){
            vagas.remove(vagaAlvo);
        }
    }

    @Override
    public void editarVaga(int id, Vaga vaga){
        Vaga vagaAlvo = buscarPorId(id);

        if (vagaAlvo != null){
            vagaAlvo.setId(vaga.getId());
            vagaAlvo.setIdentificador(vaga.getIdentificador());
            vagaAlvo.setStatus(vaga.getStatus());
            vagaAlvo.setTipo(vaga.getTipo());
        }
    }
}
