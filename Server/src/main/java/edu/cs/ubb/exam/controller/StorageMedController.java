package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.StorageMed;
import edu.cs.ubb.exam.service.StorageMedService;
import edu.cs.ubb.exam.util.Doubles;
import edu.cs.ubb.exam.util.PostDataConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by Szilu on 2017. 04. 03..
 */

@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/storage/medicine")
public class StorageMedController {
    private StorageMedService service;
    private PostDataConverter postDataConverter = new PostDataConverter();
    private Doubles doubles = new Doubles();

    @Autowired
    public StorageMedController(StorageMedService service){this.service = service;}

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Stoor> getAll() {
        return service.findAllWithGroupBy();
    }

    @RequestMapping(path = "/names", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<String> getAllMedNameFromStorage() {
        return  service.getAllMedicineNameFromStorage();
    }

    @RequestMapping(path = "/types/{typename}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody Iterable<String> getAllTypeFromStorageByName(@PathVariable String typename) {
        return  service.getMedicineTypesFromStorage(typename);
    }

    @RequestMapping(path = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<StorageMed> getAllDetails() {
        return service.findAll();
    }

    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody
    ResponseEntity<StorageMed> save(@RequestBody MultiValueMap params) {
        Map<String,String> parameters = postDataConverter.getData(params);
        StorageMed storageMed = new StorageMed();
        double quant = 0;
        double per = 0;
        String name = "";
        String type = "";
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("name")){
                name = entry.getValue();
            } else if (entry.getKey().equals("id")){
                storageMed.setId(Long.parseLong(entry.getValue()));
            } else if (entry.getKey().equals("date")){
                storageMed.setDate(entry.getValue());
            }else if (entry.getKey().equals("price")){
                storageMed.setPrice(doubles.setPrecisionString(entry.getValue(), 3));
            }else if (entry.getKey().equals("quantity")){
                quant = doubles.setPrecisionString(entry.getValue(), 3);
            } else if (entry.getKey().equals("type")){
                type = entry.getValue();
            }
        }
        Medicine med = service.getMedByNameAndType(name, type);
        storageMed.setMed(med);
        per = med.getQuantity();
        if (storageMed.getId() == null){
            storageMed.setQuantity(doubles.setPrecisionDouble(quant*per, 3));
        }
        //if we want to update one row
        else {
            storageMed.setQuantity(doubles.setPrecisionDouble(quant, 3));
        }
        storageMed.setUnitprice(doubles.setPrecisionDouble(storageMed.getPrice()/per, 3));
        return ResponseEntity.ok().body(service.save(storageMed));
    }

    @RequestMapping(path = "/delete/{deletedId}", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody ResponseEntity<?> delete(@PathVariable long deletedId) {
        try {
            service.deleteById(deletedId);
            return new ResponseEntity<>("succesfull", HttpStatus.OK);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return new ResponseEntity<>("error", HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(path = "/restore", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> restore(@RequestBody MultiValueMap params) {
        Map<String,String> parameters = postDataConverter.getData(params);
        ArrayList<String> response = new ArrayList<String>();
        StorageMed storageMed = new StorageMed();
        String medname = "";
        double quantity = 0;
        String stoordate = "";
        double price = 0;

        String newmed = "";
        double newquant = 0;
        String type = "", newtype = "";
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("medname")){
                medname = entry.getValue();
            } else if (entry.getKey().equals("quantity")){
                quantity = Double.parseDouble(entry.getValue());
            } else if (entry.getKey().equals("stoordate")) {
                stoordate = entry.getValue();
            } else if (entry.getKey().equals("price")){
                price = Double.parseDouble(entry.getValue());
            } else if (entry.getKey().equals("newmed")){
                newmed = entry.getValue();
            } else if (entry.getKey().equals("newquant")){
                newquant = Double.parseDouble(entry.getValue());
            } else if (entry.getKey().equals("type")){
                type = entry.getValue();
            } else if (entry.getKey().equals("newtype")){
                newtype = entry.getValue();
            }
        }
        if (service.isEnough(medname, quantity, newmed, newquant, type, newtype)){
            try {
                service.restoreStorage(medname, quantity, stoordate, price, type);
                response.add("success");
            } catch (Exception e){
                System.out.println(e.getMessage());
                response.add("error");
            }
        } else {
            response.add("notenough");
        }
        return response;
    }
    @RequestMapping(path = "/delete/{id}", method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> deleteFromStorageByMedID(@PathVariable String id) {
        long medid = Long.parseLong(id);
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
}
