package repository;

import java.util.List;

import model.Estacionamento;

public interface IEstacionamento {
    public void salvar (Estacionamento estacionamento);



    Estacionamento procurarPorId(int id);
    Estacionamento procurarPorNome(String nome);
    Estacionamento procurarPorEndereco(String endereco);


}
