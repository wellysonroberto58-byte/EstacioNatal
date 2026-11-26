
package repository;

import java.util.List;
import model.Administrador;

public interface IAdministrador {

    void salvar(Administrador administrador);

    List<Administrador> listarTodos();

    Administrador buscarPorId(int id);

    Administrador buscarPorEmail(String email);

}
