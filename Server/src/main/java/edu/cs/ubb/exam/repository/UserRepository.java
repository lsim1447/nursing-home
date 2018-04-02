package edu.cs.ubb.exam.repository;

import edu.cs.ubb.exam.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Szilard on 2017. 02. 05..
 */
@Repository
public interface UserRepository extends CrudRepository<User, Long> {
    User findByEmailAndPassword(String email, String password);
    Iterable<User> findAllByOrderByFullname();
}
