package model;
import java.util.List;
public class Motorista extends Usuario {
    private String idPlaca;
 public Motorista(String nome , String email, String cpf, String senhaHash, String idPlaca, int id){
    super(nome, email, cpf, senhaHash, id);
    this.idPlaca = idPlaca;
 } 
    public List<Vaga> exibirVgas(){
        return null;
    }
   public Estacionamento procurarEstacionamento(String nome){
    return null;
   }
   public String getIdPlaca() {
    return idPlaca;
   }        
   public void setIdPlaca(String idPlaca) {
    this.idPlaca = idPlaca;
   }
}
