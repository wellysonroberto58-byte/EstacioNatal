package model;

public class Vaga {
    private int id;
    private String identificador;
    private TipoVaga tipo;
    private StatusVaga status;

    public Vaga(int id, String identificador, TipoVaga tipo) {
        this.id = id;
        this.identificador = identificador;
        this.tipo = tipo;
        this.status = StatusVaga.DISPONIVEL;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getIdentificador() {
        return identificador;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public TipoVaga getTipo() {
        return tipo;
    }

    public void setTipo(TipoVaga tipo) {
        this.tipo = tipo;
    }

    public StatusVaga getStatus() {
        return status;
    }

    public void setStatus(StatusVaga status) {
        this.status = status;
    }

    public boolean isDisponivel() {
        return status == StatusVaga.DISPONIVEL;
    }

    public void ocupar() {
        status = StatusVaga.OCUPADO;
    }

    public void liberar() {
        status = StatusVaga.DISPONIVEL;
    }
}
