package edu.cs.ubb.exam.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * Created by Szilu on 2017. 04. 03..
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "STORAGE_MED")
public class StorageMed {

    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    private Long id;

    @NotNull
    private Double price;

    @NotNull
    private double quantity;

    @NotNull
    private Double unitprice;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String date;

    @ManyToOne
    @JoinColumn(name="medicine_id")
    private Medicine med;
}
