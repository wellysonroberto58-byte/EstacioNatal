package model;
import java.util.List;
public class Estacionamento {
    private String nome;
    private String endereco;
    private List<Piso> pisos;
    public Estacionamento(String nome, String endereco){
        this.nome = nome;
        this.endereco = endereco;
    }
    public String getNome() {
        return nome;
    }
    public String getEndereco() {
        return endereco;
    }
    public List<Piso> getPisos() {
        return pisos;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public void setEndereco(String endereco) {
        this.endereco = endereco;
    }
    public void setPisos(List<Piso> pisos) {
        this.pisos = pisos;
    }
}
