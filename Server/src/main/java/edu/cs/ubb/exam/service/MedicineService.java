package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.MedicineDAO;
import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.Types;
import edu.cs.ubb.exam.repository.MedicineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

/**
 * Created by Szilu on 2017. 03. 24..
 */

@Service
public class MedicineService {
    private MedicineRepository medicineRepository;
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
    private MedicineDAO medicineDAO;

    @Autowired
    public MedicineService(MedicineRepository medicineRepository){
        this.medicineRepository = medicineRepository;
        this.medicineDAO = context.getBean(MedicineDAO.class);
    }

    public Iterable<Medicine> findAll(){
        return  medicineRepository.findAllOrderByName();
    }

    public Medicine save(Medicine medicine){
        return medicineRepository.save(medicine);
    }

    public Iterable<String> getAllMedName(){
        return medicineDAO.getAllMedName();
    }

    public void deleteById(long medid){
        medicineRepository.delete(medid);
    }

    public Types getTypesByName(String name){ return medicineDAO.getTypesByName(name);}

    public Iterable<String> getAllTypesByName(String name){ return medicineDAO.getAllTypesByName(name);}
}
