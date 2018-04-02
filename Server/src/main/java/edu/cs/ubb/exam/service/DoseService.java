package edu.cs.ubb.exam.service;

import edu.cs.ubb.exam.dao.DoseDAO;
import edu.cs.ubb.exam.dao.MedicineDAO;
import edu.cs.ubb.exam.dao.PersonDAO;
import edu.cs.ubb.exam.dao.StorageMedDAO;
import edu.cs.ubb.exam.model.*;
import edu.cs.ubb.exam.model.help_classes.MultiSave;
import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.help_classes.TotalMedPrice;
import edu.cs.ubb.exam.repository.DoseRepository;
import edu.cs.ubb.exam.repository.StorageMedRepository;
import edu.cs.ubb.exam.util.AutoTreatment;
import edu.cs.ubb.exam.util.Doubles;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * Created by Szilu on 2017. 04. 11..
 */

@Service
public class DoseService {
    private DoseRepository doseRepository;
    private StorageMedRepository storageMedRepository;
    private ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("spring.xml");
    private DoseDAO doseDAO;
    private StorageMedDAO storageMedDAO;
    private MedicineDAO medicineDAO;
    private PersonDAO personDAO;
    private StorageMedService storageMedService;
    private Doubles doubles = new Doubles();
    private AutoTreatment treatment;

    @Autowired
    public DoseService(DoseRepository doseRepository){
        this.doseRepository = doseRepository;
        this.doseDAO = context.getBean(DoseDAO.class);
        this.medicineDAO = context.getBean(MedicineDAO.class);
        this.personDAO = context.getBean(PersonDAO.class);
        this.storageMedDAO = context.getBean(StorageMedDAO.class);
        Calendar calendar = Calendar.getInstance();
        Calendar c = Calendar.getInstance();
        c.add(Calendar.DAY_OF_MONTH, 1);
        c.set(Calendar.HOUR_OF_DAY, 0);
        c.set(Calendar.MINUTE, 0);
        c.set(Calendar.SECOND, 0);
        c.set(Calendar.MILLISECOND, 0);
        long howMany = (c.getTimeInMillis()-System.currentTimeMillis());
        treatment = new AutoTreatment(howMany - 60000, doseDAO, doseRepository);
        treatment.run();
    }

    public void saveDose(Dose dose, StorageMedService storageMedService){
        this.storageMedService = storageMedService;
        double quantity = dose.getQuantity();
        // begin

        // end
        List<StorageMed> list = (List<StorageMed>) storageMedService.findAll();
        for (StorageMed st: list) {
            if (st.getMed().getMedicinetype().getName().equals(dose.getMed().getMedicinetype().getName())
                    && st.getMed().getName().equals(dose.getMed().getName())){
                if (quantity >= st.getQuantity()){
                    quantity -= st.getQuantity();
                    dose.setStoordate(st.getDate());
                    dose.setQuantity(doubles.setPrecisionDouble(st.getQuantity(), 3));

                    Dose temp = new Dose();
                    temp.setStoordate(dose.getStoordate());
                    temp.setQuantity(dose.getQuantity());
                    temp.setPrice(st.getMed().getPrice()*temp.getQuantity());
                    temp.setMed(dose.getMed());
                    temp.setDate(dose.getDate());
                    temp.setPartoftheday(dose.getPartoftheday());
                    temp.setPers(dose.getPers());
                    temp.setId(dose.getId());
                    doseRepository.save(temp);
                    deleteStoor(st);
                } else {
                    st.setQuantity(st.getQuantity()- quantity);
                    storageMedService.save(st);
                    dose.setStoordate(st.getDate());
                    dose.setQuantity(doubles.setPrecisionDouble(quantity, 3));

                    Dose temp = new Dose();
                    temp.setId(dose.getId());
                    temp.setStoordate(dose.getStoordate());
                    temp.setQuantity(dose.getQuantity());
                    temp.setPrice(doubles.setPrecisionDouble(st.getMed().getPrice()*temp.getQuantity(), 3));
                    temp.setMed(dose.getMed());
                    temp.setDate(dose.getDate());
                    temp.setPartoftheday(dose.getPartoftheday());
                    temp.setPers(dose.getPers());

                    doseRepository.save(temp);
                    break;
                }
            }
        }
    }

    public Iterable<Dose> findAll(){
        return doseRepository.findAll();
    }

    public boolean save(Dose dose){
        return doseDAO.save(dose);
    }

    public Medicine getMedicineByName(String name){
        return medicineDAO.getMedicineByName(name);
    }

    public Person getPersonByName(String name){
        return personDAO.getPersonByName(name);
    }

    public void deleteStoor(StorageMed storageMed){storageMedService.delete(storageMed);}

    public Iterable<Dose> findAllByName(String name, String firstDate, String lastDate){
        return doseDAO.findAllByName(name, firstDate, lastDate);
    }

    public double getTotalPrice(String name, String firstDate, String lastDate){
        return doseDAO.getTotalPrice(name, firstDate, lastDate);
    }

    public void deleteByPersId(long id){
        List<Dose> list = doseDAO.getAllByPersId(id);
        for (Dose d: list) {
            doseRepository.delete(d);
        }
    }
    public void deleteByMedId(long medid){
        List<Dose> list = doseDAO.getAllByMedId(medid);
        for (Dose d: list) {
            doseRepository.delete(d);
        }
    }
    public void deleteRowById(long id){
        doseRepository.delete(id);
    }

    public Iterable<TotalMedPrice> getSummarization(String firstDate, String lastDate){
        List<TotalMedPrice> list = doseDAO.getSummarization(firstDate, lastDate);
        for (TotalMedPrice tmp:list) {
            tmp.setPrice(doubles.setPrecisionDouble(tmp.getPrice(), 3));
        }
        return list;
    }

    public double getQuantityByName(String name) {
        return doseDAO.getQuantityByName(name);
    }

    public void saveAllDoses(Iterable<MultiSave> list, StorageMedService storageMedService){
        this.storageMedService = storageMedService;
        for (MultiSave ms: list) {
            Dose dose = new Dose();
            Medicine med = this.getMedByNameAndType(ms.getMedname(), ms.getType());
            Person pers = this.getPersonByName(ms.getPersname());
            dose.setPers(pers);
            dose.setMed(med);
            dose.setPartoftheday(ms.getPartoftheday());
            dose.setDate(ms.getDate());
            dose.setQuantity(ms.getQuantity());
            this.saveDose(dose, this.storageMedService);
        }
    }

    public Iterable<Stoor> getConsumption(String firstDate, String lastDate){
        return doseDAO.getConsumption(firstDate, lastDate);
    }

    public Medicine getMedByNameAndType(String name, String type){
        return medicineDAO.getMedByNameAndType(name, type);
    }

    public double getQuantityByNameAndType(String name, String type){
        return storageMedDAO.getQuantityByNameAndType(name, type);
    }

}
