package repository;

import java.util.List;

import model.Motorista;

public interface IMotorista {
    
    void salvar(Motorista motorista);

    List<Motorista> listarTodas();

    Motorista buscarPorId(int id);

    Motorista buscarPorEmail(String email);
    
}
