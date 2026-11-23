package service;

import java.util.List;

import model.StatusVaga;
import model.Vaga;
import repository.IVaga;

public class VagaService {

    // definindo o atributo do tipo
    // necessário pois o VagaService precisa separar uma referência para se comunicar
    private IVaga repository; 


    // Construtor para quando instanciarmos o vagaService passando a interface como parâmetro
    public VagaService (IVaga repository){
        this.repository = repository;
    }

    // A partir daqui fica as regras de negócios: O que pode ou não fazer nos métodos

    public void excluirVaga(int id){


        //procura a vaga que deseja excluir pelo ID
        Vaga vagaAlvo = repository.buscarPorId(id);

        //verifica se é uma vaga vazia, ou seja, se ela não existe
        if (vagaAlvo == null){
            throw new IllegalArgumentException("Vaga não encontrada"); // tratamento de erro, pois a vaga nao existe
        }

        repository.excluirVaga(id); // caso a vaga existe, ele exclui normal
    }

    public void atualizarStatus(int id, StatusVaga novoStatus) {

        // Verifica se o status recebido é válido
        if (novoStatus == null) {
            throw new IllegalArgumentException("Status inválido");
        }

        // Procura a vaga pelo ID
        Vaga vagaAlvo = repository.buscarPorId(id);

        // Verifica se a vaga existe
        if (vagaAlvo == null) {
            throw new IllegalArgumentException("Vaga não encontrada");
        }

        // Atualiza o status da vaga
        vagaAlvo.setStatus(novoStatus);
    }

    public void cadastrarVaga(Vaga vaga){


        //Verifica se o objeto Vaga está vazio, se sim, ele cai no erro
        if (vaga == null){
            throw new IllegalArgumentException("Vaga inválida ou nao preenchida");
        }

        //verifica se já existe uma vaga com o mesmo ID
        //OBS: Dá para fazer a mesma coisa com identificador da vaga, mas precisa de um método para procurar a vaga pelo Identificador

        if (repository.buscarPorId(vaga.getId()) != null){
            throw new  IllegalArgumentException("Id já cadastrado");
        }

        //verifica se o identificador está vazio ou em branco
        if (vaga.getIdentificador() == null || vaga.getIdentificador().isBlank()){
            throw new IllegalArgumentException("O identificador não pode ser vazio");
        }

        //atualiza o status da vaga para disponível, seu valor padrão
        vaga.setStatus(StatusVaga.DISPONIVEL);


        //adiciona a vaga e passa para o repository IVaga
        repository.adicionarVaga(vaga);
    }

    public void editarVaga(int id, Vaga vaga){

        if (vaga == null){
            throw new IllegalArgumentException("Dados inválidos");
        }

        Vaga vagaAlvo = repository.buscarPorId(id);

        if (vagaAlvo == null){
            throw new IllegalArgumentException("Vaga não encontrada");
        }

        if (vaga.getIdentificador() == null || vagaAlvo.getIdentificador().isBlank()){
            throw new IllegalArgumentException("O identificador não pode ser vazio");
        }
        if (vaga.getStatus() == null){
            throw new IllegalArgumentException("O status da vaga não pode estar vazio");
        }
        if (vaga.getTipo() == null){
            throw new IllegalArgumentException("O tipo da vaga não pode estar vazio");
        }

        repository.editarVaga(id, vaga);
    }

    public List<Vaga> listarVagas() {
        return repository.listarVagas();
    }
    

}
