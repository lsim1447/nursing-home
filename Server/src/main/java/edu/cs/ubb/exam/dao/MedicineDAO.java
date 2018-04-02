package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.Types;

/**
 * Created by Szilu on 2017. 04. 03..
 */
public interface MedicineDAO {
    public Iterable<String> getAllMedName();
    public Medicine getMedicineByName(String name);
    public Types getTypesByName(String name);
    public Iterable<String> getAllTypesByName(String name);
    public Medicine getMedByNameAndType(String name, String types);
}
