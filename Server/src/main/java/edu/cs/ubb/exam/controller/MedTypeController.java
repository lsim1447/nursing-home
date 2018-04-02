package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.model.Types;
import edu.cs.ubb.exam.service.MedTypeService;
import edu.cs.ubb.exam.util.Doubles;
import edu.cs.ubb.exam.util.PostDataConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Created by Szilu on 2017. 04. 30..
 */
@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/med_type")
public class MedTypeController {
    private MedTypeService service;
    private PostDataConverter postDataConverter = new PostDataConverter();
    private Doubles doubles = new Doubles();

    @Autowired
    public MedTypeController(MedTypeService service){this.service = service;}

    @RequestMapping(path = "/names", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<String> getAllMedTypeName() {
        return  service.getAllMedicineTypeName();
    }

    @RequestMapping(path = "/exist_names", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<String> getAllExistMedTypeName() {
        return  service.getAllExistMedicineTypeName();
    }

    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> save(@RequestBody MultiValueMap params) {
        Map<String,String> parameters = postDataConverter.getData(params);
        Types types = new Types();
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("name")){
                types.setName(entry.getValue());
            } else if (entry.getKey().equals("id")){
                types.setId(Long.parseLong(entry.getValue()));
            }
        }
        try {
            service.save(types);
            return new ResponseEntity<>("succesfull", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("error", HttpStatus.BAD_REQUEST);
        }
    }

    @RequestMapping(path = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Types> findAll(){
        return  service.findAll();
    }
}
