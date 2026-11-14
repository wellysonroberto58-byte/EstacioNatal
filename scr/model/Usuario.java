package Usuario;
private class Usuario {
    private String nome;
    private String email;
    private String cpf;
    private String senhaHash;
    public Client (String nome, String email, String cpf, String senhaHash) {
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
        this.senhaHash = senhaHash;
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
    public void exibirDados(){
          System.out.println("Nome:" + nome);
          System.out.println("Email:" + email);
          System.out.println("CPF:" + cpf);
          System.out.println("senha:" + senhaHash);

    }
}