package edu.cs.ubb.exam.model.help_classes;

import lombok.Data;

/**
 * Created by Szilu on 2017. 06. 18..
 */
@Data
public class AddNewAppointment {
    private long cureid;
    private String time;
    private String medicinename;
    private String medicinetype;
    private Double quantity;
}
