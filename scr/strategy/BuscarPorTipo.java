package strategy;

import java.util.ArrayList;
import java.util.List;

import model.TipoVaga;
import model.Vaga;

public class BuscarPorTipo implements EstrategiaBuscaVaga {

    private TipoVaga tipo;

    public BuscarPorTipo(TipoVaga tipo) {
        this.tipo = tipo;
    }

    @Override
    public List<Vaga> buscar(List<Vaga> vagas) {

        List<Vaga> resultado = new ArrayList<>();

        for (Vaga vaga : vagas) {

            if (vaga.getTipo() == tipo) {
                resultado.add(vaga);
            }

        }

        return resultado;
    }
}