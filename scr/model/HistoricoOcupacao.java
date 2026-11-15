package model;
import java.util.Date;// Importa a biblioteca para manipulação de data e hora
public class HistoricoOcupacao {
    
    private Date horaEntrada;// Armazena a data e hora em que o veículo entrou na vaga
    private Date horaSaida;
    private String idPlaca;

    public HistoricoOcupacao(Date horaEntrada, Date horaSaida, String idPlaca) {
        this.horaEntrada = horaEntrada;
        this.horaSaida = horaSaida;
        this.idPlaca = idPlaca;
    }

    public Date getHoraEntrada() {
        return horaEntrada;
    }

    public Date getHoraSaida() {
        return horaSaida;
    }

    public String getIdPlaca() {
        return idPlaca;
    }
    
    public void setHoraEntrada(Date horaEntrada) {
        this.horaEntrada = horaEntrada;
    }

    public void setHoraSaida(Date horaSaida) {
        this.horaSaida = horaSaida;
    }

    public void setIdPlaca(String idPlaca) {
        this.idPlaca = idPlaca;
    }
}
