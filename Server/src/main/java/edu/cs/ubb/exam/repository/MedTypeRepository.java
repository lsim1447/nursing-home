package edu.cs.ubb.exam.repository;

import edu.cs.ubb.exam.model.Types;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Szilu on 2017. 05. 01..
 */
@Repository
public interface MedTypeRepository extends CrudRepository<Types, Long>{
    Iterable<Types> findAllByOrderByName();
}
