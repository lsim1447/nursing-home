package edu.cs.ubb.exam.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by Szilu on 2017. 04. 11..
 */
@Data
@NoArgsConstructor
@Entity
public class Dose {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    private Long id;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String partoftheday;

    @NotNull
    private Double price;

    @NotNull
    private Double quantity;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String date;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String stoordate;

    @ManyToOne
    @JoinColumn(name="medicine_id")
    private Medicine med;

    @ManyToOne
    @JoinColumn(name="person_id")
    private Person pers;
}
