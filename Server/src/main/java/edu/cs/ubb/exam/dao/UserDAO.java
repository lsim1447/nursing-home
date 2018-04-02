package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.User;

import javax.jws.soap.SOAPBinding;
import java.util.List;

/**
 * Created by Szilu on 2017. 03. 30..
 */
public interface UserDAO {
    public void save(User user);

    public boolean checkUser(String email, String password);

    public List<User> list();
}
