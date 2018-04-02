package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.PersonDAO;
import edu.cs.ubb.exam.dao.UserDAO;
import edu.cs.ubb.exam.dao.UserDAOImpl;
import edu.cs.ubb.exam.model.Person;
import edu.cs.ubb.exam.model.User;
import edu.cs.ubb.exam.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

import javax.validation.Valid;

/**
 * Created by Szilard on 2017. 02. 05..
 */

@Service
public class UserService {
    private UserRepository repository;
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
    private UserDAO userDAO;
    private PersonDAO personDAO;

    @Autowired
    public UserService(UserRepository repository){
        this.repository = repository;
        this.userDAO = context.getBean(UserDAO.class);
        this.personDAO = context.getBean(PersonDAO.class);
    }

    public Iterable<User> findAllUser(){
        return repository.findAllByOrderByFullname();
    }

    public void save(@Valid User user) {
        repository.save(user);
    }

    public boolean checkUser(String email, String password){
        return userDAO.checkUser(email, password);
    }

    public User loginMyUser(String email, String password){
        return repository.findByEmailAndPassword(email, password);
    }
    public User findUserById(long id){
        return  repository.findOne(id);
    }

    public void deleteById(long id){
        repository.delete(id);
    }

    public User getUserDataFromPerson(String email, String password){
        User user = null;
        try {
            Person person = personDAO.getUserDataFromPerson(email, password);
            user = new User();
            user.setPassword(person.getPassword());
            user.setEmail(person.getEmail());
            user.setFullname(person.getName());
            user.setId(person.getId() * 10000);
            user.setAlvl("inhabitant");
        } catch (NullPointerException e){
            System.out.println("Invalid email or password!");
            user = null;
        }
        return  user;
    }
}
