package strategy;

import java.util.ArrayList;
import java.util.List;

import model.StatusVaga;
import model.Vaga;

public class BuscarPorStatus implements EstrategiaBuscaVaga {

    private StatusVaga status;

    public BuscarPorStatus(StatusVaga status) {
        this.status = status;
    }

    @Override
    public List<Vaga> buscar(List<Vaga> vagas) {

        List<Vaga> resultado = new ArrayList<>();

        for (Vaga vaga : vagas) {

            if (vaga.getStatus() == status) {
                resultado.add(vaga);
            }

        }

        return resultado;
    }
}