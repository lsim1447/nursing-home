package edu.cs.ubb.exam.dao;


import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.StorageMed;

import java.util.List;

/**
 * Created by Szilu on 2017. 04. 05..
 */
public interface StorageMedDAO {
    public Iterable<Stoor> findAllWithGroupBy();
    public Iterable<String> getMedicinesFromStorage();
    public Iterable<String> getMedicineTypesFromStorage(String name);
    public StorageMed getSimilarRow(String date,  long medid);
    public  boolean isEnough(String medname, double quantity, String type);
    public List<StorageMed> getAllByMedID(long medid);
    public double getQuantityByNameAndType(String name, String type);
}
