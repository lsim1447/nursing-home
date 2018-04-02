package edu.cs.ubb.exam.repository;

import edu.cs.ubb.exam.model.Medicine;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

/**
 * Created by Szilu on 2017. 03. 24..
 */
@Repository
public interface MedicineRepository extends CrudRepository<Medicine, Long> {
    @Query("from Medicine order by medicinetype.name, name")
    Iterable<Medicine> findAllOrderByName();
}
