package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Appointments;
import edu.cs.ubb.exam.model.Cure;
import edu.cs.ubb.exam.model.Dose;
import edu.cs.ubb.exam.model.StorageMed;
import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.help_classes.TotalMedPrice;

import java.util.List;

/**
 * Created by Szilu on 2017. 04. 11..
 */
public interface DoseDAO {
    public boolean save(Dose dose);
    public Iterable<Dose> findAllByName(String name, String firstDate, String lastDate);
    public double getTotalPrice(String name, String firstDate, String lastDate);
    public List<Dose> getAllByPersId(long persid);
    public List<Dose> getAllByMedId(long medid);
    public List<TotalMedPrice> getSummarization(String firstDate, String lastDate);
    public double getQuantityByName(String name);
    public List<Stoor> getConsumption(String firstDate, String lastDate);
    public List<String> getPersonNamesWhoHaveThreatment(String date);
    public List<Cure> getAllCureByName(String name, String date);
    public List<Appointments> getAllDailyCureDataByCureID(long id);
    public List<StorageMed> getAllSM();
    public void updateStorage(StorageMed sm);
    public void deleteStorage(StorageMed sm);
    public void setValidityOfCures(String date);
}
