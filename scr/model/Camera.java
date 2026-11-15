package model;

public class Camera {
    private int id;
    public String identificador;
    private String descricao;
    private StatusCamera statusCamera;


    public Camera(int id, String identificador, String descricao) {
        this.id = id;
        this.identificador = identificador;
        this.descricao = descricao;
        this.statusCamera = StatusCamera.ONLINE;
    }


    public String lerPlaca(){
        return null;
    }
    public int getId() {
        return id;
    }
    public String getIdentificador() {
        return identificador;
    }
    public String getDescricao() {
        return descricao;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setIdentificador(String identificador) {
        this.identificador = identificador;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }


    // Altera o status de uma câmara de monitoramento
    public void isOnline() {
        statusCamera = StatusCamera.ONLINE;
    }

    public void isOffline(){
        statusCamera = StatusCamera.OFFLINE;
    }
}
