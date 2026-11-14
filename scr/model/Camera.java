package model;

public class Camera {
    private int id;
    public String nome;
    private String descricao;
    private boolean statusCamera;
    public Camera(int id, String nome, String descricao, boolean statusCamera) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.statusCamera = statusCamera;
    }
    public String lerPlaca(){
        return null;
    }
    public int getId() {
        return id;
    }
    public String getNome() {
        return nome;
    }
    public String getDescricao() {
        return descricao;
    }
    public boolean isStatusCamera() {
        return statusCamera;
    }
    public void setId(int id) {
        this.id = id;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }
    public void setStatusCamera(boolean statusCamera) {
        this.statusCamera = statusCamera;
    }
}
