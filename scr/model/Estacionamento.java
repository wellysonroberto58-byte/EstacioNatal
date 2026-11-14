package model;
import java.util.List;
public class Estacionamento {
    private String nome;
    private List<Piso> pisos;
    public Estacionamento(String nome){
        this.nome = nome;
    }
    public String getNome() {
        return nome;
    }
    public List<Piso> getPisos() {
        return pisos;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public void setPisos(List<Piso> pisos) {
        this.pisos = pisos;
    }
}
