package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.MedicineDAO;
import edu.cs.ubb.exam.dao.StorageMedDAO;
import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.StorageMed;
import edu.cs.ubb.exam.repository.StorageMedRepository;
import edu.cs.ubb.exam.util.Doubles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Created by Szilu on 2017. 04. 03..
 */
@Service
public class StorageMedService {
    private StorageMedRepository repository;
    private MedicineDAO medicineDAO;
    private StorageMedDAO storageMedDAO;
    private Doubles doubles = new Doubles();
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");

    @Autowired
    public StorageMedService(StorageMedRepository repository){
        this.repository = repository;
        this.medicineDAO = context.getBean(MedicineDAO.class);
        this.storageMedDAO = context.getBean(StorageMedDAO.class);
    }

    public Medicine getMedicineByNameAndType(String name, String type){
        return medicineDAO.getMedByNameAndType(name, type);
    }

    public StorageMed save(StorageMed storageMed){
        return repository.save(storageMed);
    }

    public Iterable<StorageMed> findAll(){
        return repository.findAllOrderByMedicineName();
    }

    public Iterable<Stoor> findAllWithGroupBy(){
        return storageMedDAO.findAllWithGroupBy();
    }

    public void delete(StorageMed storageMed){ repository.delete(storageMed);}

    public void deleteById(Long id){ repository.delete(id);}

    public  Iterable<String> getAllMedicineNameFromStorage(){
        return storageMedDAO.getMedicinesFromStorage();
    }

    public void restoreStorage(String medname, double quantity, String stoordate, double price, String type){
        Medicine med = this.getMedicineByNameAndType(medname, type);
        StorageMed st = storageMedDAO.getSimilarRow(stoordate, med.getId());
        if (st != null){
            st.setQuantity(st.getQuantity() + quantity);
        } else {
            st = new StorageMed();
            st.setQuantity(quantity);
            st.setUnitprice(doubles.setPrecisionDouble(price/quantity, 3));
            st.setPrice(doubles.setPrecisionDouble(med.getQuantity() * med.getPrice(), 3));
            st.setDate(stoordate);
            st.setMed(med);
        }
        repository.save(st);
    }
    public boolean isEnough(String medname, double quantity, String newmed, double newquant, String type, String newtype){
        if (quantity >= newquant && newmed.equals(medname) && type.equals(newtype)) return true;
        else if (medname.equals(newmed) && type.equals(newtype)){
            return  storageMedDAO.isEnough(newmed, newquant-quantity, newtype);
        } else {
            return storageMedDAO.isEnough(newmed, newquant, newtype);
        }
    }

    public void deleteByMedId(long medid){
        List<StorageMed> list = storageMedDAO.getAllByMedID(medid);
        for (StorageMed st: list) {
            repository.delete(st);
        }
    }
    public Medicine getMedByNameAndType(String name, String type){
        return medicineDAO.getMedByNameAndType(name, type);
    }

    public Iterable<String> getMedicineTypesFromStorage(String name){
        return storageMedDAO.getMedicineTypesFromStorage(name);
    }
}
