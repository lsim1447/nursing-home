package edu.cs.ubb.exam.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by Szilu on 2017. 06. 14..
 */

@Data
@NoArgsConstructor
@Entity
public class UserType {
    @Id
    @SequenceGenerator(name = "seq_gen")
    @GeneratedValue(generator = "seq_gen")
    private Long id;

    @NotNull
    @Column(length = 100)
    @Size(max = 100)
    private String type_name;
}
