
package controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import model.Administrador;
import model.Login;
import service.AdministradorService;

public class AdministradorController {

    private Gson gson = new Gson();
    private AdministradorService service;

    public AdministradorController(AdministradorService service) {
        this.service = service;
    }

    public void registrarRotas(HttpServer servidor) {
        servidor.createContext("/estacioNatal/administradores", exchange -> {
            String metodo = exchange.getRequestMethod();

            configurarCors(exchange, metodo);

            if (metodo.equals("POST")) {

                try {
                    String corpo = new String(
                        exchange.getRequestBody().readAllBytes(),
                        StandardCharsets.UTF_8
                    );

                    Administrador administrador = gson.fromJson(corpo, Administrador.class);

                    service.cadastrar(administrador);

                    String resposta = gson.toJson(administrador);

                    enviarResposta(exchange, 201, resposta);

                } catch (IllegalArgumentException e) {
                    enviarResposta(exchange, 400, gson.toJson(e.getMessage()));
                }

            } else if (metodo.equals("GET")) {

                String resposta = gson.toJson(service.listarTodos());

                enviarResposta(exchange, 200, resposta);

            } else {
                enviarResposta(exchange, 405, "Método não permitido.");
            }
        });

        servidor.createContext("/estacioNatal/login/administrador", exchange -> {

            String metodo = exchange.getRequestMethod();

            configurarCors(exchange, metodo);

            if (!metodo.equals("POST")){
                enviarResposta(exchange, 405, gson.toJson("Método não permitido."));
                return;
            }

            String conteudo = lerCorpo(exchange);
            
            Login login = gson.fromJson(conteudo, Login.class);

            Administrador administrador = service.autenticar(login.getEmail(), login.getSenha());

            enviarResposta(exchange, 200, "LOGIN AUTENTICADO COM SUCESSO!");
        });
    }
        

    public void configurarCors(HttpExchange exchange, String metodo) throws IOException{
        // Configuração CORS
            exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin", "*"
            );

            exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
            );

            exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
            );


            if (metodo.equals("OPTIONS")) {
                exchange.sendResponseHeaders(204, -1);
                exchange.close();
                return;
            }
    }

    private void enviarResposta(HttpExchange exchange, int status, String resposta) throws IOException {

        byte[] bytes = resposta.getBytes(StandardCharsets.UTF_8);

        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");

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
