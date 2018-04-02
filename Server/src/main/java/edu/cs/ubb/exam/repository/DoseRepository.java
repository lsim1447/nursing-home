package edu.cs.ubb.exam.repository;

import edu.cs.ubb.exam.model.Dose;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Szilu on 2017. 04. 11..
 */
@Repository
public interface DoseRepository extends CrudRepository<Dose, Long>{

}
