package edu.cs.ubb.exam.model.help_classes;

import lombok.Data;

/**
 * Created by Szilu on 2017. 05. 12..
 */
@Data
public class ChangePassword {
    private Long id;
    private String alvl;
    private String password;
    private String oldPassword;
    private String fullname;
    private String email;
}
