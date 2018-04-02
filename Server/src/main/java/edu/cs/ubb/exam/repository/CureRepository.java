package edu.cs.ubb.exam.repository;

import edu.cs.ubb.exam.model.Cure;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@Repository
public interface CureRepository extends CrudRepository<Cure, Long>{
    Iterable<Cure> findAllByOrderByFirstdate();
}
