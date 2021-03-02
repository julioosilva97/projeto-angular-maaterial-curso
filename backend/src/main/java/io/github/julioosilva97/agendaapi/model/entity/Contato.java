package io.github.julioosilva97.agendaapi.model.entity;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Contato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column
    private String nome;

    @Column
    private String email;

    @Column
    private Boolean favorito;

    @Column
    @Lob
    private byte[] foto;
}
