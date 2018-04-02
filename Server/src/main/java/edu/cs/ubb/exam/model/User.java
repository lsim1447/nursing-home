package edu.cs.ubb.exam.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by Szilard on 2017. 02. 05..
 */

@Data
@NoArgsConstructor
@Entity
public class User {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    private Long id;

    @NotNull
    @Column(length = 100)
    @Size(max = 100)
    private String alvl;

    @NotNull
    @Column(length = 200)
    @Size(max = 200)
    private String password;

    @NotNull
    @Column(length = 70)
    @Size(max = 70)
    private String fullname;

    @NotNull
    @Column(length = 100, unique = true)
    @Size(max = 100)
    private String email;
}
