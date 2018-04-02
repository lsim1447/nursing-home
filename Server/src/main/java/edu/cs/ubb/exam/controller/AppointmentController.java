package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.model.Cure;
import edu.cs.ubb.exam.model.Appointments;
import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.help_classes.AddNewAppointment;
import edu.cs.ubb.exam.model.help_classes.DailyCureTemplate;
import edu.cs.ubb.exam.service.DailyCureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/daily_cure")
public class AppointmentController {
    private DailyCureService service;

    @Autowired
    public AppointmentController(DailyCureService service){
        this.service = service;
    }

    @RequestMapping( method = RequestMethod.POST)
    public long save(@RequestBody DailyCureTemplate param){
        ArrayList<Appointments> list = new ArrayList<>();
        try {
            for (int i = 0; i < param.getQuantity().length; i++){
                Appointments dailyCure = new Appointments();
                Cure cure = new Cure();
                cure.setId(param.getCureId());
                dailyCure.setCure(cure);
                dailyCure.setTime(param.getTime()[i]);
                Medicine med = service.getMedicineByNameAndType(param.getMedicinename()[i], param.getMedicinetype()[i]);
                dailyCure.setMed(med);
                dailyCure.setQuantity(param.getQuantity()[i]);
                list.add(dailyCure);
            }
            service.saveAll(list);
            return 1;
        } catch (Exception e) {
            return -1;
        }
    }
    @RequestMapping(path = "/new", method = RequestMethod.POST)
    public Appointments addNew(@RequestBody AddNewAppointment newAppointment){
        Appointments appointment = new Appointments();
        Cure cure = new Cure();
        cure.setId(newAppointment.getCureid());
        appointment.setMed(service.getMedicineByNameAndType(newAppointment.getMedicinename(), newAppointment.getMedicinetype()));
        appointment.setCure(cure);
        appointment.setQuantity(newAppointment.getQuantity());
        appointment.setTime(newAppointment.getTime());
        return service.save(appointment);
    }
    @RequestMapping(path = "/cureid", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Appointments> findAllByName(@RequestBody Long cureid){
        return service.findAppointmentsByCureId(cureid);
    }
    @RequestMapping(path = "/delete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean delete(@RequestBody Long appId){
        return service.delete(appId);
    }

    @RequestMapping(path = "/delete/cureid", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public boolean deleteByCureId(@RequestBody Long cureId){
        return service.delete(cureId);
    }
}
