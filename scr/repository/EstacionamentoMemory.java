package repository;

import java.util.ArrayList;
import java.util.List;

import model.Estacionamento;

public class EstacionamentoMemory implements IEstacionamento{

    List<Estacionamento> estacionamentos = new ArrayList<>();
    int proximoId = 1;

    @Override 
    public void salvar(Estacionamento estacionamento){
        estacionamento.setId(proximoId);
        estacionamentos.add(estacionamento);
        proximoId ++;
    }

    @Override 
    public Estacionamento procurarPorNome(String nome){
        for (Estacionamento estacionamento : estacionamentos) {
            if (estacionamento.getNome().equals(nome)){
                return estacionamento;
            } 
        }
        return null;
    }
    @Override 
    public Estacionamento procurarPorEndereco(String endereco){
        for (Estacionamento estacionamento : estacionamentos) {
            if (estacionamento.getNome().equals(endereco)){
                return estacionamento;
            } 
        }
        return null;
    }
    @Override 
    public Estacionamento procurarPorId(int id){
        for (Estacionamento estacionamento : estacionamentos) {
            if (estacionamento.getId() == (id)){
                return estacionamento;
            } 
        }
        return null;
    }

}
