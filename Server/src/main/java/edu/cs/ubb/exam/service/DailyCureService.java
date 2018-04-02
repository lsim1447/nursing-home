package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.CureDAO;
import edu.cs.ubb.exam.dao.MedTypeDAO;
import edu.cs.ubb.exam.dao.MedicineDAO;
import edu.cs.ubb.exam.model.Appointments;
import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@Service
public class DailyCureService {
    private AppointmentRepository repository;
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
    private CureDAO cureDAO;
    private MedicineDAO medicineDAO;

    @Autowired
    public DailyCureService(AppointmentRepository repository){
        this.repository = repository;
        this.cureDAO = context.getBean(CureDAO.class);
        this.medicineDAO = context.getBean(MedicineDAO.class);
    }

    public Appointments save(Appointments dailyCure){
       return repository.save(dailyCure);
    }

    public Iterable<Appointments> saveAll(Iterable<Appointments> list){
        return repository.save(list);
    }

    public Iterable<Appointments> findAppointmentsByCureId(Long id){
        return cureDAO.findAppointmentsByCureId(id);
    }

    public boolean delete(long appId){
        try{
            repository.delete(appId);
            return  true;
        } catch (Exception e){
            return  false;
        }
    }
    public Medicine getMedicineByNameAndType(String name, String type){
        return medicineDAO.getMedByNameAndType(name, type);
    }

    public long deleteByCureId(long id){
        try{
            cureDAO.deleteByCureId(id);
            return 1;
        } catch (Exception e){
            return -1;
        }
    }
}
