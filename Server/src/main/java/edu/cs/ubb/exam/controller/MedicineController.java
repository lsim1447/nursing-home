package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.Types;
import edu.cs.ubb.exam.service.MedicineService;
import edu.cs.ubb.exam.util.Doubles;
import edu.cs.ubb.exam.util.PostDataConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.Map;

/**
 * Created by Szilu on 2017. 03. 24..
 */

@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/medicine")
public class MedicineController {
    private MedicineService medicineService;
    private PostDataConverter postDataConverter = new PostDataConverter();
    private Doubles doubles = new Doubles();

    @Autowired
    public MedicineController(MedicineService medicineService){
        this.medicineService = medicineService;
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Medicine> findAll(){
        return  medicineService.findAll();
    }

    @RequestMapping(path = "/getallname", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<String> getAllMedName(){
        return  medicineService.getAllMedName();
    }

    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> save(@RequestBody MultiValueMap params) {
        Map<String,String> parameters = postDataConverter.getData(params);
        Medicine medicine = new Medicine();
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("id")){
                medicine.setId(Long.parseLong(entry.getValue()));
            } else if (entry.getKey().equals("name")){
                Types t = medicineService.getTypesByName(entry.getValue());
                medicine.setMedicinetype(t);
            } else if (entry.getKey().equals("unit")){
                medicine.setUnit(entry.getValue());
            } else if (entry.getKey().equals("quantity")){
                medicine.setQuantity(doubles.setPrecisionString(entry.getValue(), 3));
            }  else if (entry.getKey().equals("price")){
                medicine.setPrice(doubles.setPrecisionString(entry.getValue(), 3));
            }  else if (entry.getKey().equals("type")){
                medicine.setName(entry.getValue());
            }
        }
        try {
            medicine = medicineService.save(medicine);
            return new ResponseEntity<>("succesfull", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("error", HttpStatus.BAD_REQUEST);
        }
    }
    @RequestMapping(path = "/delete/{medid}", method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> delete(@PathVariable long medid) {
        ArrayList<String> returnValue = new ArrayList<>();
        try {
            medicineService.deleteById(medid);
            returnValue.add("success");
        } catch (Exception e){
            System.out.println(e.getMessage());
            returnValue.add("This deletion wasn't successfull!");
        }
        return returnValue;
    }
        @RequestMapping(path = "/typenamesbyname/{medname}", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> getMedicineTypes(@PathVariable String medname) {
        return medicineService.getAllTypesByName(medname);
    }
}
