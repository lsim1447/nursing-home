package edu.cs.ubb.exam.repository;

import edu.cs.ubb.exam.model.StorageMed;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Szilu on 2017. 04. 03..
 */

@Repository
public interface StorageMedRepository extends CrudRepository<StorageMed, Long> {
    @Query("from StorageMed order by med.medicinetype.name, med.name")
    Iterable<StorageMed> findAllOrderByMedicineName();
}
