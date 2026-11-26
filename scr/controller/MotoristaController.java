package controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import model.Login;
import model.Motorista;
import service.MotoristaService;

public class MotoristaController {

    private MotoristaService service;

    public MotoristaController (MotoristaService service){
        this.service = service;
    }

    public void cadastrarMotorista(Motorista motorista){
        service.cadastrarMotorista(motorista);
    }

    public Motorista buscarPorEmail(String email){
        return service.buscarPorEmail(email);
    }

    public Motorista buscarPorId(int id){
        return service.buscarPorId(id);
    }

    public List<Motorista> listarMotoristas(){
        return service.listaMotoristas();
    }

    public Motorista autenticar(String email, String senha) {
        return service.autenticar(email, senha);
    }



    //CONFIGURANDO ROTAS

    Gson gson = new Gson();

    public void registrarRotas(HttpServer servidor){

        servidor.createContext("/estacioNatal/login/motorista", exchange -> {

            
            String metodo = exchange.getRequestMethod();
            configurarCors(exchange, metodo);

            if (metodo.equals("POST")){
                String conteudo = lerCorpo(exchange);

                Login loginMotorista = gson.fromJson(conteudo, Login.class);

                Motorista motorista = service.autenticar(loginMotorista.getEmail(), loginMotorista.getSenha());

                if (motorista != null){
                    enviarResposta(exchange, 200, "Login realizado com sucesso!");
                } else {
                    enviarResposta(exchange, 401, "Email ou senha incorretos");
                }
            }
        });

        servidor.createContext("/estacioNatal/motoristas", exchange -> {
            String metodo = exchange.getRequestMethod();

            String caminho = exchange.getRequestURI().getPath();

            configurarCors(exchange, metodo);

            if (metodo.equals("GET")){
                List<Motorista> motoristas = service.listaMotoristas();
                enviarResposta(exchange, 200, gson.toJson(motoristas));
            } 
            else if(metodo.equals ("POST")){
                String conteudo = lerCorpo(exchange);

                Motorista motorista = gson.fromJson(conteudo, Motorista.class);

                cadastrarMotorista(motorista);

                enviarResposta(exchange, 201, "Motorista cadastrado com sucesso!");

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

       
}
