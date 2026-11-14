package model;// Define o pacote onde a classe está armazenada

public class Usuario {
//Encapsulamento: protegidos contra acesso direto externo
    private String nome;
    private String email;
    private String cpf;
    private String senhaHash;
    private int id;

    //Construtor da classe Usuario
    public Usuario (String nome, String email, String cpf, String senhaHash, int id) {

        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.senhaHash = senhaHash;
        this.id = id;

        //GET
    }
    public String getNome(){
        return nome;
    }
    public String getEmail(){
        return email;
    }
    public String getCpf(){
        return cpf;
    }
    public String getSenhaHash(){
        return senhaHash;
    }
    public int getId(){
        return id;
    }
    //SET
    public void setNome( String nome){
        this.nome = nome;
    }
    public void setEmail(String email){
        this.email = email;
    }
    public void setCpf(String cpf){
        this.cpf = cpf;
    }
    public void setSenhaHash(String senhaHash){
        this.senhaHash = senhaHash;
    }
    public void setId(int id){
        this.id = id;
    }
    

    //Método para exibir os dados do usuário
    public void exibirDados(){
          System.out.println("Nome:" + nome);
          System.out.println("Email:" + email);
          System.out.println("CPF:" + cpf);
          System.out.println("senha:" + senhaHash);

    }
}
