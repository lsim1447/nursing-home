package edu.cs.ubb.exam.model.help_classes;

import edu.cs.ubb.exam.model.Person;
import lombok.Data;

/**
 * Created by Szilu on 2017. 04. 23..
 */
@Data
public class TotalMedPrice {
    private Person person;
    private double price;
}
