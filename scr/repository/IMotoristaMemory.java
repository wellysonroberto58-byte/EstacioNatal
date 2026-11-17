package repository;

import java.util.ArrayList;
import java.util.List;

import model.Motorista;

public class IMotoristaMemory implements IMotorista {


    List<Motorista> motoristas = new ArrayList<>();
    int proximoId = 1;

    @Override
    public void salvar(Motorista motorista){
        motorista.setId(proximoId);
        motoristas.add(motorista);
        proximoId++;
    }

    @Override 
    public Motorista buscarPorId(int id){
        for (Motorista motorista : motoristas) {
            if(motorista.getId() == id){
                return motorista;
            }
        }
        return null;

    }

    @Override 
    public List<Motorista> listarTodas(){
        return motoristas;
    }
    @Override
    public Motorista buscarPorEmail(String email){
        for (Motorista motorista : motoristas) {
            if (motorista.getEmail().equalsIgnoreCase(email)){
                return motorista;
            }
        }
        return null;
    }


}
