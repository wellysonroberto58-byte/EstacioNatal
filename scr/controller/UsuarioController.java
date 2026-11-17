package controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import model.Usuario;
import service.UsuarioService;

public class UsuarioController {

    private UsuarioService service;

    public UsuarioController (UsuarioService service){
        this.service = service;
    }

    public void cadastrarUsuario(Usuario usuario){
        service.cadastrarUsuario(usuario);
    }

    public Usuario buscarPorEmail(String email){
        return service.buscarPorEmail(email);
    }

    public Usuario buscarPorId(int id){
        return service.buscarPorId(id);
    }

    public List<Usuario> listarUsuarios(){
        return service.listaUsuarios();
    }



    //CONFIGURANDO ROTAS

    Gson gson = new Gson();

    public void registrarRotas(HttpServer servidor){

        servidor.createContext("/estacioNatal/usuarios", exchange -> {
            String metodo = exchange.getRequestMethod();

            String caminho = exchange.getRequestURI().getPath();

            if (metodo.equals("GET")){
                List<Usuario> usuarios = service.listaUsuarios();
                enviarResposta(exchange, 200, gson.toJson(usuarios));
            } 
            else if(metodo.equals ("POST")){
                String conteudo = lerCorpo(exchange);

                Usuario usuario = gson.fromJson(conteudo, Usuario.class);

                cadastrarUsuario(usuario);

                enviarResposta(exchange, 201, "VAGA CADASTRADA COM SUCESSO!");

            }
        });
    }




    //métodos para facilitar o POST
    private void enviarResposta(HttpExchange exchange, int status, String resposta) throws IOException {
        
        byte[] bytes = resposta.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set(
            "Content-Type",
            "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(status, bytes.length);

        exchange.getResponseBody().write(bytes);

        exchange.close();
    }

    private String lerCorpo(HttpExchange exchange) throws IOException{
        InputStream corpo = exchange.getRequestBody();

        ByteArrayOutputStream buffer = new ByteArrayOutputStream();

        byte[] dados = new byte[1024];

        int quantidade;

        while ((quantidade = corpo.read(dados)) != -1){
            buffer.write(dados, 0, quantidade);
        }
        return buffer.toString(StandardCharsets.UTF_8);
    }


}
