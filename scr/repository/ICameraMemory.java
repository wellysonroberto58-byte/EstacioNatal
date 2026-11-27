package repository;

import java.util.ArrayList;
import java.util.List;

import model.Camera;

public class ICameraMemory implements ICamera{

    List<Camera> cameras = new ArrayList<>();
    int proximoId = 1;

    @Override
    public void adicionarCamera(Camera camera){
        camera.setId(proximoId);
        cameras.add(camera);
        proximoId++;
    }

    @Override 
    public Camera buscarPorId(int id){
        for (Camera camera : cameras) {
            if (camera.getId() == id){
                return camera;
            }
        }
        return null;
    }

    @Override
    public  void excluirCamera(int id){
        Camera cameraAlvo = buscarPorId(id);

        cameras.remove(cameraAlvo);
    }

    @Override
    public void editarCamera(int id, Camera camera){
        Camera existente = buscarPorId(id);
        
        if (existente != null){
            existente.setIdentificador(camera.getIdentificador());
            existente.setDescricao(camera.getDescricao());
            existente.setId(camera.getId());
        }
    }
    @Override
    public List<Camera> listarCameras(){
        return cameras;
    }
}
