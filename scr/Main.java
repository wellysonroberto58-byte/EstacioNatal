import controller.UsuarioController;
import controller.VagaController;
import repository.IUsuario;
import repository.IUsuarioMemory;
import repository.IVaga;
import repository.IVagaMemory;
import server.Servidor;
import service.UsuarioService;
import service.VagaService;


public class Main {

    public static void main(String[] args) throws Exception {

        //VAGAS
        IVaga repoVaga = new IVagaMemory();
        VagaService vagaService = new VagaService(repoVaga);
        VagaController vagaController = new VagaController(vagaService);

        //USUARIOS
        IUsuario repoUsuario = new IUsuarioMemory();
        UsuarioService usuarioService = new UsuarioService(repoUsuario);
        UsuarioController usuarioController = new UsuarioController(usuarioService);

        Servidor servidor = new Servidor(vagaController, usuarioController);

        servidor.iniciar();
        
    }
}