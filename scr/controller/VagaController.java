package controller;

import java.util.List;

import model.Vaga;
import service.VagaService;

public class VagaController {

    private VagaService service;

    public VagaController(VagaService service){
        this.service = service;
    }

    public void cadastrarVagaVaga(Vaga vaga){
        service.cadastrarVaga(vaga);
    }

    public void excluirVaga(int id){
        service.excluirVaga(id);
    }

    public void editarVaga(int id, Vaga vaga){
        service.editarVaga(id, vaga);
    }

    public List<Vaga> listarVagas(){
        return service.listarVagas();
    }
}
