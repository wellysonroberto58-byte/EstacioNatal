package model;
import java.util.List; // Importa a biblioteca para manipulação de listas
public class Piso {
    private String identificador;
    private List<Setor> setores; // Armazena uma lista contendo vários setores que pertencem a este piso
    public Piso(String identificador){
        this.identificador = identificador;
    }
    public Piso(){}
    
    public String getIdentificador() {
        return identificador;
    }
    public List<Setor> getSetores() {
        return setores;
    }
    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }
    public void setSetores(List<Setor> setores) {
        this.setores = setores;
    }

}
//nao sei o que deu errado