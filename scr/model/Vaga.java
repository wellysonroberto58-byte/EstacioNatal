package model;

public class vaga {
     
    private int id;
    private String identificador;
    private String TipoVaga;
    private boolean StatusVaga;
    
    public vaga(int id, String identificador, String TipoVaga, boolean StatusVaga) {
        this.id = id;
        this.identificador = identificador;
        this.TipoVaga = TipoVaga;
        this.StatusVaga = StatusVaga;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}
