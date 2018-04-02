package edu.cs.ubb.exam.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * Created by Szilu on 2017. 03. 24..
 */

@Data
@Entity
@NoArgsConstructor
public class Medicine {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    @Column(name = "medicine_id")
    private Long id;

    @NotNull
    @Column(length = 100)
    @Size(max = 100)
    private String name;

    @NotNull
    @Column(length = 100)
    @Size(max = 100)
    private String unit;

    @NotNull
    private double quantity;

    @NotNull
    private double price;

    @OneToMany(mappedBy = "med")
    @JsonIgnore
    private Set<StorageMed> storageMeds;

    @OneToMany(mappedBy = "med")
    @JsonIgnore
    private Set<Dose> doses;

    @OneToMany(mappedBy = "med")
    @JsonIgnore
    private Set<Appointments> app;

    @ManyToOne
    @JoinColumn(name = "medtype_id")
    private Types medicinetype;
}
