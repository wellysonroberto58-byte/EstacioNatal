
package facade;

import model.Estacionamento;
import model.Piso;
import model.Setor;
import model.Vaga;

import java.util.List;

import service.EstacionamentoService;
import service.VagaService;

public class EstacionamentoFacade {

    private EstacionamentoService estacionamentoService;
    private VagaService vagaService;

    public EstacionamentoFacade(
        EstacionamentoService estacionamentoService,
        VagaService vagaService
    ) {
        this.estacionamentoService = estacionamentoService;
        this.vagaService = vagaService;
    }

    public Estacionamento buscarPorId(int id) {
        return estacionamentoService.buscarPorId(id);
    }

    public void configurarEstacionamento(Estacionamento estacionamento) {

        estacionamentoService.validarCadastro(estacionamento);
        
        // Percorre os pisos do estacionamento
        for (Piso piso : estacionamento.getPisos()) {

            // Percorre os setores de cada piso
            for (Setor setor : piso.getSetores()) {

                // Gera e registra as vagas do setor
                List<Vaga> vagas = vagaService.gerarVagasParaSetor(setor);

                // Associa as vagas ao setor
                setor.setVagas(vagas);
            }
        }

        // Salva o estacionamento após configurar sua estrutura
        estacionamentoService.salvar(estacionamento);
    }
}
