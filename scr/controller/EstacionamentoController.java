package controller;

import model.Estacionamento;
import service.EstacionamentoService;

public class EstacionamentoController {


    private EstacionamentoService service;

    public EstacionamentoController(EstacionamentoService service){
        this.service = service;
    }

    public void salvarEstacionamento(Estacionamento estacionamento){
        service.salvar(estacionamento);
    }


}
