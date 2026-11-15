import server.Api;
import server.UsuarioTeste;
import server.UsuarioTesteRepository;

public class Main {

    public static void main(String[] args) throws Exception {


        UsuarioTesteRepository usuarioMetodos = new UsuarioTesteRepository();

        UsuarioTeste usuario = new UsuarioTeste("Márcio", 14, 1);
        UsuarioTeste usuario2 = new UsuarioTeste("Leoncio", 64, 2);
        UsuarioTeste usuario3 = new UsuarioTeste("Clarice", 28, 3);


        usuarioMetodos.cadastrarUsuario(usuario);
        usuarioMetodos.cadastrarUsuario(usuario2);
        usuarioMetodos.cadastrarUsuario(usuario3);

        Api serverApi = new Api(usuarioMetodos);

        serverApi.iniciar();

    }
}