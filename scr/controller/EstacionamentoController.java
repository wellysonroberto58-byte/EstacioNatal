package controller;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import model.Estacionamento;
import service.EstacionamentoService;

public class EstacionamentoController {


    private EstacionamentoService service;

    public EstacionamentoController(EstacionamentoService service){
        this.service = service;
    }

    public void salvarEstacionamento(Estacionamento estacionamento){
        service.salvar(estacionamento);
    }

    public Estacionamento buscarPorId(int id) {
        return service.buscarPorId(id);
    }

    Gson gson = new Gson();




    public void registrarRotas(HttpServer server){
        server.createContext("/estacioNatal/estacionamentos", exchange -> {
            exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");

            exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "POST, OPTIONS");

            exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");

            if (exchange.getRequestMethod().equals("OPTIONS")){
                exchange.sendResponseHeaders(204, -1);
                exchange.close();
                return;
            }

            String metodo = exchange.getRequestMethod();

            if (metodo.equals("POST")){
                String conteudo = lerCorpo(exchange);

                Estacionamento novoEtaEstacionamento = gson.fromJson(conteudo, Estacionamento.class);

                salvarEstacionamento(novoEtaEstacionamento);
                System.out.println(novoEtaEstacionamento);

                enviarResposta(exchange, 200, "Estacionamento Cadastrado com sucesso!");
            }
            if (metodo.equals("GET")){
                String caminho = exchange.getRequestURI().getPath();

                String idTexto = caminho.substring("/estacioNatal/estacionamentos/".length());

                int id = Integer.parseInt(idTexto);

                Estacionamento estacionamento = buscarPorId(id);

                if (estacionamento == null){
                    enviarResposta(exchange, 404, "estacionamento não encontrado");

                    return ;
                }

                String json = gson.toJson(estacionamento);

                enviarResposta(exchange, 200, json);
            }
            else {
                enviarResposta(exchange, 405, "Método não permitido");
            }
        });
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
