package repository;

import java.util.List;

import model.Camera;

public interface ICamera {

    List<Camera> listarCameras();
        
    void adicionarCamera(Camera camera);
    void editarCamera(int id, Camera camera);
    void excluirCamera(int id);
    
    Camera buscarPorId(int id);

}
