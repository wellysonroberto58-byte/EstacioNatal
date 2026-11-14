package server;

import java.util.ArrayList;
import java.util.List;

public class UsuarioTeste {
    String nome;
    int idade;
    int id;

    public UsuarioTeste (String nome, int idade, int id){
        this.nome = nome;
        this.idade = idade;
        this.id = id;
    };

    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public int getIdade() {
        return idade;
    }
    public void setIdade(int idade) {
        this.idade = idade;
    }
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

}
