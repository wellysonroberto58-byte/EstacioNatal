import controller.AdministradorController;
import controller.EstacionamentoController;
import controller.MotoristaController;
import controller.VagaController;
import facade.EstacionamentoFacade;
import model.Administrador;
import repository.EstacionamentoMemory;
import repository.IAdministrador;
import repository.IAdministradorMemory;
import repository.IEstacionamento;
import repository.IMotorista;
import repository.IMotoristaMemory;
import repository.IVaga;
import repository.IVagaMemory;
import server.Servidor;
import service.AdministradorService;
import service.EstacionamentoService;
import service.MotoristaService;
import service.VagaService;


public class Main {

    public static void main(String[] args) throws Exception {

        
        //VAGAS
        IVaga repoVaga = new IVagaMemory();
        VagaService vagaService = new VagaService(repoVaga);
        VagaController vagaController = new VagaController(vagaService);
        
        //MOTORISTAS
        IMotorista repoMotorista = new IMotoristaMemory();
        MotoristaService motoristaService = new MotoristaService(repoMotorista);
        MotoristaController motoristaController = new MotoristaController(motoristaService);
        
        //Estacionamentos
        IEstacionamento repoEstacionamento = new EstacionamentoMemory();
        EstacionamentoService estacionamentoService = new EstacionamentoService(repoEstacionamento);
        //Facade
        EstacionamentoFacade estacionamentoFacade = new EstacionamentoFacade(estacionamentoService, vagaService);
        EstacionamentoController estacionamentoController = new EstacionamentoController(estacionamentoFacade);

        //Administradores
        IAdministrador repoAdministrador = new IAdministradorMemory();
        AdministradorService administradorService = new AdministradorService(repoAdministrador);
        AdministradorController administradorController = new AdministradorController(administradorService);

        Servidor servidor = new Servidor(vagaController, motoristaController, estacionamentoController, administradorController);

        servidor.iniciar();
        
    }
}