package model;
import java.util.List;
public class Setor {
    private String identificador;
    private List<Vaga> vagas;
    private int quantidadeVaga;

    public Setor(String identificador){
        this.identificador = identificador;
    }

    public Setor(){}


    public String getIdentificador() {
        return identificador;
    }

    public int getQuantidadeVaga(){
        return quantidadeVaga;
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

    public void setQuantidadeVaga(int quantidadeVaga){
        this.quantidadeVaga = quantidadeVaga;
    }
}
