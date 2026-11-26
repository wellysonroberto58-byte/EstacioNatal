
package repository;

import java.util.ArrayList;
import java.util.List;

import model.Administrador;

public class IAdministradorMemory implements IAdministrador {

    private List<Administrador> administradores = new ArrayList<>();

    private int proximoId = 1;

    @Override
    public void salvar(Administrador administrador) {

        administrador.setId(proximoId);

        administradores.add(administrador);

        proximoId++;
    }

    @Override
    public List<Administrador> listarTodos() {
        return administradores;
    }

    @Override
    public Administrador buscarPorId(int id) {

        for (Administrador administrador : administradores) {

            if (administrador.getId() == id) {
                return administrador;
            }
        }

        return null;
    }

    @Override
    public Administrador buscarPorEmail(String email) {

        for (Administrador administrador : administradores) {

            if (administrador.getEmail().equals(email)) {
                return administrador;
            }
        }

        return null;
    }
}
