package server;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;
import com.sun.net.httpserver.*;


public class Api { 

    UsuarioTesteRepository usuarioMetodos;

    public Api (UsuarioTesteRepository usuarioMetodos){
        this.usuarioMetodos = usuarioMetodos;
    }


    
    
    public void iniciar() throws IOException{
        HttpServer servidor = HttpServer.create(
            new InetSocketAddress(8080), 0
        );


        System.out.println("--------------------------------");
        System.out.println("       ESTACIONATAL API");
        System.out.println("--------------------------------");
        System.out.println("Servidor: http://localhost:8080");
        System.out.println("Vagas:    http://localhost:8080/estacioNatal/getTeste");
        System.out.println("--------------------------------");

        servidor.createContext("/estacioNatal/getTeste", exchange -> {

            String metodo = exchange.getRequestMethod();

            if (metodo.equals("GET")){

                Gson gson = new Gson();
                
                List<UsuarioTeste> usuarios = usuarioMetodos.listarUsuarios();
                
                String resposta = gson.toJson(usuarios);

                exchange.getResponseHeaders().set(
                    "content-Type", "application/json; charset=UTF-8"  
                );

                byte[] bytes = resposta.getBytes(StandardCharsets.UTF_8);

                exchange.sendResponseHeaders(200, bytes.length);

                exchange.getResponseBody().write(bytes);

                exchange.close();

            }

            else if(metodo.equals("POST")){

                InputStream corpo = exchange.getRequestBody();

                ByteArrayOutputStream buffer = new ByteArrayOutputStream();

                byte[] dados = new byte[1024];

                int quantidade;

                while ((quantidade = corpo.read(dados)) != -1){

                    buffer.write(dados, 0, quantidade);
                }

                String conteudo = buffer.toString(StandardCharsets.UTF_8);

                Gson gson = new Gson();

                UsuarioTeste usuario = gson.fromJson(conteudo, UsuarioTeste.class);

                usuarioMetodos.cadastrarUsuario(usuario);

                String resposta = "Dados recebidos com sucesso!";

                byte[] bytes = resposta.getBytes(StandardCharsets.UTF_8);

                exchange.sendResponseHeaders(200, bytes.length);

                exchange.getResponseBody().write(bytes);

                exchange.close();


            }

            else if(metodo.equals("PUT")){

                String caminho = exchange.getRequestURI().getPath();

                String[] partes = caminho.split("/");

                int id = Integer.parseInt(partes[3]);

                InputStream corpo = exchange.getRequestBody();

                ByteArrayOutputStream buffer = new ByteArrayOutputStream();

                byte[] dados = new byte[1024];

                int quantidade;

                while ((quantidade = corpo.read(dados)) != -1){
                    buffer.write(dados, 0, quantidade);
                }

                String conteudo = buffer.toString(StandardCharsets.UTF_8);

                Gson gson = new Gson();

                UsuarioTeste novosDados = gson.fromJson(conteudo, UsuarioTeste.class);

                usuarioMetodos.atualizarVaga(id, novosDados);

                String resposta = "Dados atualizados com sucesso!";

                byte[] bytes = resposta.getBytes(StandardCharsets.UTF_8);

                exchange.sendResponseHeaders(200, bytes.length);
                exchange.getResponseBody().write(bytes);

                exchange.close();

            }

            else if (metodo.equals("DELETE")){

                String caminho = exchange.getRequestURI().getPath();

                String[] partes = caminho.split("/");

                int id = Integer.parseInt(partes[3]);

                usuarioMetodos.deletarUsuario(id);

                String resposta = "Usuário deletado com sucesso!";

                byte[] bytes = resposta.getBytes(StandardCharsets.UTF_8);

                exchange.sendResponseHeaders(200, bytes.length);
                exchange.getResponseBody().write(bytes);
                exchange.close();
            
            }
            
        });

        servidor.start();
    }

}   
