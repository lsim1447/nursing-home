package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Person;

/**
 * Created by Szilu on 2017. 04. 11..
 */
public interface PersonDAO {
    public Iterable<String> getAllPersonName();
    public Person getPersonByName(String name);
    public Person getUserDataFromPerson(String email, String password);
}
