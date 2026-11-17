import controller.MotoristaController;
import controller.VagaController;
import repository.IMotorista;
import repository.IMotoristaMemory;
import repository.IVaga;
import repository.IVagaMemory;
import server.Servidor;
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

        Servidor servidor = new Servidor(vagaController, motoristaController);

        servidor.iniciar();
        
    }
}