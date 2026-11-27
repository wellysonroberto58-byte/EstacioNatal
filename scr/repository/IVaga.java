package repository;

import java.util.List;

import model.Vaga;

public interface IVaga {

    List<Vaga> listarVagas();

    Vaga buscarPorId(int id);
    void adicionarVaga(Vaga vaga);
    void excluirVaga(int id);
    void editarVaga(int id, Vaga vaga);
}
