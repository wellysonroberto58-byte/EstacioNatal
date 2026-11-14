package model;
import java.util.List;
public class Piso {
    private String identificador;
    private List<Setor> setores;
    public Piso(String identificador){
        this.identificador = identificador;
    }
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
