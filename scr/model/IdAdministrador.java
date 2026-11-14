package model;

public interface IdAdministrador {
    void adicionarVaga(Vaga vaga);
    void excluirVaga(int id);
    void adicionarCamera(Camera camera);
    void editarCamera(int id, Camera camera);
    void excluirCamera(int id);
}
