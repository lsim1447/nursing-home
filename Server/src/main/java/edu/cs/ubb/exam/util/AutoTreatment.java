package edu.cs.ubb.exam.util;


import edu.cs.ubb.exam.dao.DoseDAO;
import edu.cs.ubb.exam.model.Cure;
import edu.cs.ubb.exam.model.Appointments;
import edu.cs.ubb.exam.model.Dose;
import edu.cs.ubb.exam.model.StorageMed;
import edu.cs.ubb.exam.repository.DoseRepository;
import edu.cs.ubb.exam.service.StorageMedService;

import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by Szilu on 2017. 06. 17..
 */
public class AutoTreatment extends Thread {
    private long period;
    private DoseDAO doseDAO;
    private DoseRepository doseRepository;
    private boolean first = true;
    private Doubles doubles;

    public void setPeriod(long period){
        this.period = period;
        first = true;
        doubles = new Doubles();
    }
    public AutoTreatment(long period, DoseDAO doseDAO, DoseRepository doseRepository){
        this.period = 10000;
        this.doseDAO = doseDAO;
        this.doseRepository = doseRepository;
    }

    public void saveDose(Dose dose){
        double quantity = dose.getQuantity();
        // begin

        // end
        List<StorageMed> list = doseDAO.getAllSM();
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
                    doseDAO.deleteStorage(st);
                } else {
                    st.setQuantity(st.getQuantity()- quantity);
                    doseDAO.updateStorage(st);
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

    public void startTimer(){
        Timer t = new Timer();
        t.schedule(new TimerTask() {
            @Override
            public void run() {
                if (!first) {
                    Date date = new Date();
                    String modifiedDate= new SimpleDateFormat("yyyy-MM-dd").format(date);
                    doseDAO.setValidityOfCures(modifiedDate);
                    List<String> list = doseDAO.getPersonNamesWhoHaveThreatment(modifiedDate);
                    for (String str: list) { // in serial for all person
                        List<Cure> cures = doseDAO.getAllCureByName(str, modifiedDate);
                        for (Cure c: cures) {   // in serial  the actual persons cures
                            List<Appointments> dailyCures = doseDAO.getAllDailyCureDataByCureID(c.getId());
                            for (Appointments d: dailyCures) {
                                Dose dose = new Dose();
                                try {
                                    dose.setQuantity(d.getQuantity());
                                    dose.setDate(modifiedDate);
                                    dose.setPartoftheday(d.getTime());
                                    dose.setPers(c.getPers());
                                    dose.setMed(d.getMed());
                                }  catch (NullPointerException nullpointer){
                                    System.out.println(nullpointer.toString());
                                }
                                try {
                                    boolean oke = doseDAO.save(dose);
                                    if (oke) {
                                        System.out.println(dose.getPers().getName());
                                        saveDose(dose);
                                    }
                                } catch (NullPointerException np){
                                    System.out.println(np.getMessage());
                                } catch (Exception e){
                                    System.out.println(e.getMessage());
                                }
                            }
                        }
                    }
                    setPeriod(10000);
                }
                t.cancel();
                startTimer();
                first = false;
            }
        }, period, 1000);
    }
    @Override
    public void run() {
        startTimer();
    }
}
