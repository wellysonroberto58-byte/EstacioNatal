package server;

import java.io.IOException;
import java.net.InetSocketAddress;

import com.sun.net.httpserver.HttpServer;

import controller.MotoristaController;
import controller.VagaController;
import controller.EstacionamentoController;

public class Servidor {

    private HttpServer servidor;

    public Servidor(VagaController vagaController, MotoristaController motoristaController, EstacionamentoController estacionamentoController) throws IOException {

        servidor = HttpServer.create(
            new InetSocketAddress(8080), 0
        );


        vagaController.registrarRotas(servidor);
        motoristaController.registrarRotas(servidor);
        estacionamentoController.registrarRotas(servidor);

        System.out.println("--------------------------------");
        System.out.println("       ESTACIONATAL API");
        System.out.println("--------------------------------");
        System.out.println("Servidor: http://localhost:8080");
        System.out.println("Vagas:    http://localhost:8080/estacioNatal/vagas");
        System.out.println("Motoristas: http://localhost:8080/estacioNatal/motoristas");
        System.out.println("Administrador: http://localhost:8080/estacioNatal/estacionametos");
        System.out.println("--------------------------------");
    }

    public void iniciar() {
        servidor.start();
    }
}