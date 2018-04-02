package edu.cs.ubb.exam.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@Data
@NoArgsConstructor
@Entity
public class Cure {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    @Column(name = "cure_id")
    private Long id;

    @NotNull
    private Boolean active;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String firstdate;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String lastdate;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String description;

    @ManyToOne
    @JoinColumn(name="person_id")
    private Person pers;

    @OneToMany(mappedBy = "cure")
    @JsonIgnore
    private Set<Appointments> dailyCures;
}
