package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Types;

/**
 * Created by Szilu on 2017. 05. 01..
 */
public interface MedTypeDAO {
    public Iterable<String> getAllMedicineTypeName();
    public Iterable<String> getAllExistMedicineTypeName();
}
