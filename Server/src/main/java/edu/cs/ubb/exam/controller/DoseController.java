package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.model.*;
import edu.cs.ubb.exam.model.help_classes.MultiSave;
import edu.cs.ubb.exam.model.help_classes.Stock;
import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.help_classes.TotalMedPrice;
import edu.cs.ubb.exam.service.DoseService;
import edu.cs.ubb.exam.service.StorageMedService;
import edu.cs.ubb.exam.util.Doubles;
import edu.cs.ubb.exam.util.PostDataConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * Created by Szilu on 2017. 04. 11..
 */
@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/doses")
public class DoseController {
    private DoseService service;
    private StorageMedService storageMedService;
    private PostDataConverter postDataConverter = new PostDataConverter();
    private Doubles doubles = new Doubles();

    @Autowired
    public DoseController(DoseService service, StorageMedService storageMedService){
        this.storageMedService = storageMedService;
        this.service = service;
    }

    @RequestMapping(path = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Dose> findAll(){
        return  service.findAll();
    }

    @RequestMapping(path = "/all", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public Iterable<Dose> findAllByName(@RequestBody MultiValueMap params){
        Map<String,String> parameters = postDataConverter.getData(params);
        String name = "";
        String firstDate = "";
        String lastDate = "";
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("selectedname")) {
                name = entry.getValue();
            } else if (entry.getKey().equals("firstDate")){
                firstDate = entry.getValue();
            } else if (entry.getKey().equals("lastDate")){
                lastDate = entry.getValue();
            }
        }
        return  service.findAllByName(name, firstDate, lastDate);
    }

    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public Iterable<String> save(@RequestBody MultiValueMap params){
        Map<String,String> parameters = postDataConverter.getData(params);
        Dose dose = new Dose();
        Double price = 1.0;
        String type = "";
        String name = "";
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("id")){
                dose.setId(Long.parseLong(entry.getValue()));
            } else if (entry.getKey().equals("partoftheday")){
                dose.setPartoftheday(entry.getValue());
            }  else if (entry.getKey().equals("quantity")){
                dose.setQuantity(doubles.setPrecisionString(entry.getValue(), 3));
            } else if (entry.getKey().equals("date")){
                dose.setDate(entry.getValue());
            } else if (entry.getKey().equals("medname")){
                name = entry.getValue();
            } else if (entry.getKey().equals("persname")){
                Person pers = service.getPersonByName(entry.getValue());
                dose.setPers(pers);
            } else if (entry.getKey().equals("type")){
                type = entry.getValue();
            }
        }
        Medicine m = service.getMedByNameAndType(name, type);
        dose.setMed(m);
        boolean ok = false;
        ArrayList<String> ret = new ArrayList<String>();
        try{
            ok = service.save(dose);
            if (ok){
                service.saveDose(dose, storageMedService);
                ret.add("success");
            } else {
                ret.add("Not enough medicine(" + dose.getMed().getName() + ")!");
            }
        } catch (Exception e){
            System.out.println(e.getMessage());
            ret.add("Error! Please try again!");
        }
        return ret;
    }

    @RequestMapping(path = "/saveall", method = RequestMethod.POST)
    public Iterable<String> saveAll(@RequestBody Iterable<MultiSave> list){
        double q = 0;
        ArrayList<Stock> stocks = new ArrayList<>();
        for (MultiSave ms: list) {
            Stock s = new Stock();
            s.setName(ms.getMedname());
            s.setType(ms.getType());
            s.setQuantity(service.getQuantityByNameAndType(ms.getMedname(), ms.getType()));
            stocks.add(s);
        }
        for (MultiSave ms: list) {
            for (Stock s: stocks) {
                if (ms.getMedname().equals(s.getName()) && ms.getType().equals(s.getType())){
                    s.setQuantity(s.getQuantity() - ms.getQuantity());
                }
            }
        }
        boolean error = false;
        String errName = "", errType= "";
        for (Stock s: stocks) {
            if (s.getQuantity() < 0) {
                error = true;
                errName = s.getName();
                errType = s.getType();
            }
        }
        ArrayList<String> response = new ArrayList<>();
        if (error){
            response.add("Not enough " + errName + " from " + errType);
        } else {
            response.add("success");
            service.saveAllDoses(list, storageMedService);
        }
        return response;
    }

    @RequestMapping(path = "/total_price", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public double getTotalPrice(@RequestBody MultiValueMap params){
        Map<String,String> parameters = postDataConverter.getData(params);
        String firstDate = "";
        String lastDate = "";
        String name = "";
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("selectedname")){
                name = entry.getValue();
            } else if (entry.getKey().equals("firstDate")){
                firstDate = entry.getValue();
            } else if (entry.getKey().equals("lastDate")){
                lastDate = entry.getValue();
            }
        }
        double price = service.getTotalPrice(name, firstDate, lastDate);
        return doubles.setPrecisionDouble(price, 3);
    }
    @RequestMapping(path = "/delete_pers/{persid}", method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> delete(@PathVariable long persid) {
        ArrayList<String> returnValue = new ArrayList<>();
        try {
            service.deleteByPersId(persid);
            returnValue.add("success");
        } catch (Exception e){
            System.out.println(e.getMessage());
            returnValue.add("This deletion wasn't successfull!");
        }
        return returnValue;
    }
    @RequestMapping(path = "/delete_med/{medid}", method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> deleteByMedID(@PathVariable Long medid) {
        ArrayList<String> returnValue = new ArrayList<>();
        try {
            service.deleteByMedId(medid);
            returnValue.add("success");
        } catch (Exception e){
            System.out.println(e.getMessage());
            returnValue.add("This deletion wasn't successfull!");
        }
        return returnValue;
    }
    @RequestMapping(path = "/delete/{id}", method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> deleteByID(@PathVariable Long id) {
        ArrayList<String> returnValue = new ArrayList<>();
        try {
            service.deleteRowById(id);
            returnValue.add("success");
        } catch (Exception e){
            System.out.println(e.getMessage());
            returnValue.add("This deletion wasn't successfull!");
        }
        return returnValue;
    }

    @RequestMapping(path = "/summarization", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public Iterable<TotalMedPrice> getSummarization(@RequestBody MultiValueMap params){
        Map<String,String> parameters = postDataConverter.getData(params);
        String firstDate = "";
        String lastDate = "";
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("firstDate")){
                firstDate = entry.getValue();
            } else if (entry.getKey().equals("lastDate")){
                lastDate = entry.getValue();
            }
        }
        return service.getSummarization(firstDate, lastDate);
    }

    @RequestMapping(path = "/consumption", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public Iterable<Stoor> getConsumption(@RequestBody MultiValueMap params){
        Map<String,String> parameters = postDataConverter.getData(params);
        String firstDate = "";
        String lastDate = "";
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("firstDate")){
                firstDate = entry.getValue();
            } else if (entry.getKey().equals("lastDate")){
                lastDate = entry.getValue();
            }
        }
        return service.getConsumption(firstDate, lastDate);
    }
}
