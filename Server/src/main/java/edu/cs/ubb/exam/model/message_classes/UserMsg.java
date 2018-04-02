package edu.cs.ubb.exam.model.message_classes;

import edu.cs.ubb.exam.model.User;
import lombok.Data;

import javax.persistence.Column;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 * Created by Szilu on 2017. 05. 11..
 */
@Data
public class UserMsg {
    private Long id;
    private String alvl;
    private String fullname;
    private String email;

    public UserMsg(){

    }
    public UserMsg(User user){
        this.setId(user.getId());
        this.setAlvl(user.getAlvl());
        this.setEmail(user.getEmail());
        this.setFullname(user.getFullname());
    }
    public User toEntity(){
        User user = new User();
        user.setAlvl(this.getAlvl());
        user.setFullname(this.getFullname());
        user.setEmail(this.getEmail());
        user.setId(this.getId());
        return  user;
    }
}
