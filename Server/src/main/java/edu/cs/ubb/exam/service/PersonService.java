package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.DoseDAO;
import edu.cs.ubb.exam.dao.PersonDAO;
import edu.cs.ubb.exam.model.Person;
import edu.cs.ubb.exam.repository.PersonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

/**
 * Created by Szilard on 2017. 02. 02..
 */
@Service
public class PersonService {
    private PersonRepository repository;
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
    private PersonDAO personDAO;

    @Autowired
    public PersonService(PersonRepository repository) {
        this.repository = repository;
        this.personDAO = context.getBean(PersonDAO.class);
    }

    public Iterable<Person> findAll() {
        return repository.findAllByOrderByName();
    }

    public Person save(@Valid  Person person) {
        return repository.save(person);
    }

    public Iterable<String> getAllPersonName(){
        return personDAO.getAllPersonName();
    }

    public void deleteById(long id){
        repository.delete(id);
    }

    public Person getPersonByEmailAndPassword(String email, String password){
         return repository.findByEmailAndPassword(email, password);
    }
}
