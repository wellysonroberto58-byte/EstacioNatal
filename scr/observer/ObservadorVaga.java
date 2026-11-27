
package observer;

import model.StatusVaga;
import model.Vaga;

public interface ObservadorVaga {

    void atualizar(
        Vaga vaga,
        StatusVaga statusAnterior,
        StatusVaga novoStatus
    );

}
