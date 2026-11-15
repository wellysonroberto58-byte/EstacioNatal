import controller.VagaController;
import repository.IVaga;
import repository.IVagaMemory;
import server.Servidor;
import service.VagaService;


public class Main {

    public static void main(String[] args) throws Exception {
        IVaga repository = new IVagaMemory();

        VagaService service = new VagaService(repository);

        VagaController controller = new VagaController(service);

        Servidor servidor = new Servidor(controller);

        servidor.iniciar();
        
    }
}