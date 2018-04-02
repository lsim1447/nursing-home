package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.model.Person;
import edu.cs.ubb.exam.model.help_classes.ChangePassword;
import edu.cs.ubb.exam.service.PersonService;
import edu.cs.ubb.exam.util.SHAHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import edu.cs.ubb.exam.util.PostDataConverter;
import java.util.*;

/**
 * Created by Szilard on 2017. 02. 02..
 */
@CrossOrigin(origins = "http://localhost:8090")
@RestController
@RequestMapping("/person")
public class PersonController {
    private PersonService service;
    private PostDataConverter postDataConverter = new PostDataConverter();
    private SHAHash shaHash;

    @Autowired
    public PersonController(PersonService service) {
        this.service = service;
        try {
            this.shaHash = SHAHash.getInstance();
        } catch (Exception e){
            System.out.println("SHA problem.");
        }
    }

    @RequestMapping(path = "/getallname", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<String> getAllPersonName(){
        return  service.getAllPersonName();
    }

    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public Iterable<Person> getAll() {
        return service.findAll();
    }

    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> save(@RequestBody MultiValueMap params) {
        Map<String,String> parameters = postDataConverter.getData(params);
        Person person = new Person();
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("name")){
                person.setName(entry.getValue());
            } else if (entry.getKey().equals("identityNumber")){
                person.setIdentityNumber(entry.getValue());
            } else if (entry.getKey().equals("associatedPhoneNumber")){
                person.setAssociatedPhoneNumber(entry.getValue());
            } else if (entry.getKey().equals("id")){
                person.setId(Long.parseLong(entry.getValue()));
            } else if (entry.getKey().equals("email")){
                person.setEmail(entry.getValue());
            } else if (entry.getKey().equals("password")){
                person.setPassword(shaHash.encryption(entry.getValue()));
            }
        }
        ArrayList<String> returnValue = new ArrayList<>();
        try {
            Person p = service.save(person);
            returnValue.add("success");
        } catch (Exception e){
            System.out.println(e.getMessage());
            returnValue.add("This identity number is existing!");
        }
        return returnValue;
    }
    @RequestMapping(path = "/delete/{persid}", method = RequestMethod.DELETE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public @ResponseBody Iterable<String> delete(@PathVariable long persid) {
        ArrayList<String> returnValue = new ArrayList<>();
        try {
            service.deleteById(persid);
            returnValue.add("success");
        } catch (Exception e){
            System.out.println(e.getMessage());
            returnValue.add("This deletion wasn't successfull!");
        }
        return returnValue;
    }

    @RequestMapping(path = "/change_password", method = RequestMethod.PUT)
    public Iterable<String> changePassword(@RequestBody ChangePassword chgpass){
        ArrayList<String> response = new ArrayList<>();
        try {
            Person person = service.getPersonByEmailAndPassword(chgpass.getEmail(), shaHash.encryption(chgpass.getOldPassword()));
            if (person != null){
                person.setPassword(shaHash.encryption(chgpass.getPassword()));
                person.setEmail(chgpass.getEmail());
                person.setName(chgpass.getFullname());
                service.save(person);
                response.add("success");
            } else {
                response.add("bad password");
            }
        } catch (Exception e){
            response.add("error");
        }
        return response;
    }
}
