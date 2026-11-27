package strategy;

import java.util.List;
import model.Vaga;

public interface EstrategiaBuscaVaga {

    List<Vaga> buscar(List<Vaga> vagas);

}