package model;
import java.util.List;
public class Motorista extends Usuario {
    private String placa;
 public Motorista(String nome , String email, String cpf, String senhaHash, String placa, int id){
    super(nome, email, cpf, senhaHash, id);
    this.placa = placa;
 } 
    public List<Vaga> exibirVgas(){
        return null;
    }
   public Estacionamento procurarEstacionamento(String nome){
    return null;
   }
   public String getIdPlaca() {
    return placa;
   }        
   public void setIdPlaca(String idPlaca) {
    this.placa = idPlaca;
   }
}
