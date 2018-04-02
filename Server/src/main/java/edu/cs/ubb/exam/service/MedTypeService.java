package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.MedTypeDAO;
import edu.cs.ubb.exam.model.Types;
import edu.cs.ubb.exam.repository.MedTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

/**
 * Created by Szilu on 2017. 05. 01..
 */
@Service
public class MedTypeService {
    private MedTypeDAO dao;
    private MedTypeRepository repository;
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");

    @Autowired
    public MedTypeService(MedTypeRepository repository){
        this.repository = repository;
        this.dao = context.getBean(MedTypeDAO.class);
    }

    public Iterable<String> getAllMedicineTypeName(){
        return dao.getAllMedicineTypeName();
    }

    public void save(Types mt){
        Types temp = repository.save(mt);
    }

    public Iterable<Types> findAll(){
        return repository.findAllByOrderByName();
    }

    public Iterable<String> getAllExistMedicineTypeName(){
        return dao.getAllExistMedicineTypeName();
    }
}
