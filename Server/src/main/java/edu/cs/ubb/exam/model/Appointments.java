package edu.cs.ubb.exam.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@Data
@NoArgsConstructor
@Entity
public class Appointments {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    private Long id;

    @NotNull
    private double quantity;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String time;

    @ManyToOne
    @JoinColumn(name="cure_id")
    private Cure cure;

    @ManyToOne
    @JoinColumn(name="medicine_id")
    private Medicine med;
}
