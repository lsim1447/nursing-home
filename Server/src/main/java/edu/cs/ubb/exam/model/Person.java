package edu.cs.ubb.exam.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.Set;

/**
 * Created by Szilard on 2017. 02. 02..
 */
@Data
@NoArgsConstructor
@Entity
public class Person {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    @Column(name = "person_id")
    private Long id;

    @NotNull
    @Column(length = 50)
    @Size(max = 50)
    private String name;

    @NotNull
    @Column(length = 50, name = "identity_number", unique = true)
    @Size(max = 50)
    private String identityNumber;

    @NotNull
    @Size(max = 50)
    @Column(name = "sociated_phone_number")
    private String associatedPhoneNumber;

    @NotNull
    @Size(max = 70)
    private String email;

    @NotNull
    @Size(max = 120)
    private String password;

    @OneToMany(mappedBy = "pers")
    @JsonIgnore
    private Set<Cure> cure;
}
