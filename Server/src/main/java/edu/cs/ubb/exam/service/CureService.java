package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.CureDAO;
import edu.cs.ubb.exam.dao.MedicineDAO;
import edu.cs.ubb.exam.dao.PersonDAO;
import edu.cs.ubb.exam.model.Cure;
import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.Person;
import edu.cs.ubb.exam.repository.CureRepository;
import edu.cs.ubb.exam.util.AutoTreatment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@Service
public class CureService {
    private CureRepository repository;
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
    private MedicineDAO medicineDAO;
    private PersonDAO personDAO;
    private CureDAO cureDAO;
    @Autowired
    public CureService(CureRepository repository){
        this.repository = repository;
        this.medicineDAO = context.getBean(MedicineDAO.class);
        this.personDAO = context.getBean(PersonDAO.class);
        this.cureDAO = context.getBean(CureDAO.class);
    }
    public Cure save(Cure cure){
        return repository.save(cure);
    }

    public Medicine getMedicineByNameAndType(String name, String type){
        return medicineDAO.getMedByNameAndType(name, type);
    }

    public Person getPersonByName(String name){
        return personDAO.getPersonByName(name);
    }

    public Iterable<Cure> findAll(){
        return repository.findAllByOrderByFirstdate();
    }

    public Iterable<Cure> findAllByPersName(String persname, boolean active){
        return cureDAO.findAllByPersName(persname, active);
    }

    public long delete(long id){
        try {
            repository.delete(id);
            return 1;
        } catch (Exception e){
            return -1;
        }
    }
}
