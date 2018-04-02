package edu.cs.ubb.exam.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * Created by Szilu on 2017. 05. 02..
 */
@Data
@Entity
@NoArgsConstructor
public class Types {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    @Column(name = "medtype_id")
    private  Long id;

    @NotNull
    private String name;

    @OneToMany(mappedBy = "medicinetype")
    @JsonIgnore
    private Set<Medicine> meds;
}
