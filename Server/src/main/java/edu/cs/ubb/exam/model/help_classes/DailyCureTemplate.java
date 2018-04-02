package edu.cs.ubb.exam.model.help_classes;

import lombok.Data;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@Data
public class DailyCureTemplate {
    private Long id;
    private Long cureId;
    private String[] time;
    private String[] medicinename;
    private String[] medicinetype;
    private Double[] quantity;
}
