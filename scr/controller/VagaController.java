package controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import model.StatusVaga;
import model.Vaga;
import service.VagaService;

public class VagaController {

    Gson gson = new Gson();

    private VagaService service;

    public VagaController(VagaService service){
        this.service = service;
    }

    public void cadastrarVaga(Vaga vaga){
        service.cadastrarVaga(vaga);
    }

    public void excluirVaga(int id){
        service.excluirVaga(id);
    }

    public void editarVaga(int id, Vaga vaga){
        service.editarVaga(id, vaga);
    }

    public void atualizarStatus(int id, StatusVaga status) {
        service.atualizarStatus(id, status);
    }

    public List<Vaga> listarVagas(){
        return service.listarVagas();
    }


    //A partir daqui deixa comigo: @Márcio
    //Configurando o controller para receber as rotas da aplicação

    public void registrarRotas(HttpServer servidor){
        
        servidor.createContext("/estacioNatal/vagas", exchange -> {
            String metodo = exchange.getRequestMethod();

            String caminho = exchange.getRequestURI().getPath();

                System.out.println("==========================");
                System.out.println("REQUISIÇÃO RECEBIDA!");
                System.out.println("Método: " + metodo);
                System.out.println("Caminho: " + caminho);
                System.out.println("==========================");

            configurarCors(exchange, metodo);

            if (metodo.equals("GET")){
                List<Vaga> vagas = service.listarVagas();

                enviarResposta(exchange, 200, gson.toJson(vagas));
            }

            else if(metodo.equals("POST")){

                String conteudo = lerCorpo(exchange);

                Vaga vaga = gson.fromJson(conteudo, Vaga.class);

                cadastrarVaga(vaga);

                enviarResposta(exchange, 201, "Vaga cadastrada com sucesso!");

                
            }

            else if (metodo.equals("PUT") && caminho.endsWith("/status")) {

                String prefixo = "/estacioNatal/vagas/";
                String sufixo = "/status";

                String idTexto = caminho.substring(
                    prefixo.length(),
                    caminho.length() - sufixo.length()
                );

                int id = Integer.parseInt(idTexto);

                String conteudo = lerCorpo(exchange);

                StatusVaga status = gson.fromJson(conteudo, StatusVaga.class);

                atualizarStatus(id, status);

                enviarResposta(
                    exchange,
                    200,
                    gson.toJson("Status atualizado com sucesso!")
                );
            }
        });
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
