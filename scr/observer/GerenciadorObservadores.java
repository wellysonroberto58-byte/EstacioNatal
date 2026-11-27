
package observer;

import java.util.ArrayList;
import java.util.List;

import model.StatusVaga;
import model.Vaga;

public class GerenciadorObservadores {

    private List<ObservadorVaga> observadores = new ArrayList<>();

    // Registra um observador
    public void adicionarObservador(ObservadorVaga observador) {
        observadores.add(observador);
    }

    // Remove um observador
    public void removerObservador(ObservadorVaga observador) {
        observadores.remove(observador);
    }

    // Notifica todos os observadores registrados
    public void notificar(Vaga vaga, StatusVaga statusAnterior, StatusVaga novoStatus) {

        for (ObservadorVaga observador : observadores) {
            observador.atualizar(vaga, statusAnterior, novoStatus);
        }
    }
}
