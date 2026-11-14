package model;
import java.util.List;
public class Setor {
    private String identificador;
    private List<Vaga> vagas;
    public Setor(String identificador){
        this.identificador = identificador;
    }
    public String getIdentificador() {
        return identificador;
    }
    public List<Vaga> getVagas() {
        return vagas;
    }
    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }
    public void setVagas(List<Vaga> vagas) {
        this.vagas = vagas;
    }
}
