package edu.cs.ubb.exam.repository;

import edu.cs.ubb.exam.model.Person;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Szilard on 2017. 02. 02..
 */
@Repository
public interface PersonRepository extends CrudRepository<Person, Long> {
    Person findByEmailAndPassword(String email, String password);
    Iterable<Person> findAllByOrderByName();
}
