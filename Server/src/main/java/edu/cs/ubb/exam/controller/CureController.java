package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.dao.MedicineDAO;
import edu.cs.ubb.exam.model.Cure;
import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.help_classes.CureActivity;
import edu.cs.ubb.exam.model.help_classes.CureTemplate;
import edu.cs.ubb.exam.service.CureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by Szilu on 2017. 06. 17..
 */
@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/cure")
public class CureController {
    private CureService service;

    @Autowired
    public CureController(CureService service){
        this.service = service;
    }


    @RequestMapping(path = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Cure> findAll(){
        return  service.findAll();
    }
    @RequestMapping(path = "/all/name", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Cure> findAllByName(@RequestBody CureActivity c){
        String alma = "SSS";
        return  service.findAllByPersName(c.getPersname().replace("\"",""), c.getIsactive());
    }
    @RequestMapping( method = RequestMethod.POST)
    public long save(@RequestBody CureTemplate cureTemplate){
        try {
            Cure cure = new Cure();
            cure.setId(cureTemplate.getId());
            cure.setFirstdate(cureTemplate.getFirstdate());
            cure.setDescription(cureTemplate.getDescription());
            cure.setLastdate(cureTemplate.getLastdate());
            cure.setPers(service.getPersonByName(cureTemplate.getPersonName()));
            Date date = new Date();
            String modifiedDate= new SimpleDateFormat("yyyy-MM-dd").format(date);
            if (cureTemplate.getLastdate().compareTo(modifiedDate) >= 0) {
                if (cureTemplate.getFirstdate().compareTo(modifiedDate) <= 0 ){
                    cure.setActive(true);
                } else {
                    cure.setActive(false);
                }
            } else {
                cure.setActive(false);
            }
            cure = service.save(cure);
            return cure.getId();
        } catch (Exception e) {
            return -1;
        }
    }

    @RequestMapping(path = "/delete", method = RequestMethod.DELETE)
    public long deleteById(@RequestBody long id){
        return service.delete(id);
    }
}
