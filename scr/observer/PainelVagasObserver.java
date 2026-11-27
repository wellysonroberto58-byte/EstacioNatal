
package observer;

import model.StatusVaga;
import model.Vaga;

public class PainelVagasObserver implements ObservadorVaga {

    @Override
    public void atualizar(
        Vaga vaga,
        StatusVaga statusAnterior,
        StatusVaga novoStatus
    ) {
        System.out.println("=== PAINEL ESTACIONATAL ===");

        System.out.println(
            "Vaga: " + vaga.getIdentificador()
        );

        System.out.println(
            "Status anterior: " + statusAnterior
        );

        System.out.println(
            "Novo status: " + novoStatus
        );

        System.out.println("===========================");
    }
}
