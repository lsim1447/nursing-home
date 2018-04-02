package edu.cs.ubb.exam.controller;

import edu.cs.ubb.exam.dao.UserDAO;
import edu.cs.ubb.exam.model.LoginSecurity;
import edu.cs.ubb.exam.model.User;
import edu.cs.ubb.exam.model.help_classes.ChangePassword;
import edu.cs.ubb.exam.model.message_classes.UserMsg;
import edu.cs.ubb.exam.service.LoginSecurityService;
import edu.cs.ubb.exam.service.UserService;
import edu.cs.ubb.exam.util.PostDataConverter;
import edu.cs.ubb.exam.util.SHAHash;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.http.MediaType;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Map;

/**
 * Created by Szilard on 2017. 02. 05..
 */

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:8090")
public class UserController {
    private UserService service;
    private LoginSecurityService loginSecurityService;
    private PostDataConverter postDataConverter;
    private SHAHash shaHash;

    @Autowired
    public UserController(UserService service, LoginSecurityService loginSecurityService){
        this.service = service;
        this.loginSecurityService = loginSecurityService;
        try {
            this.shaHash = SHAHash.getInstance();
        } catch (Exception e){
            System.out.println("SHA problem.");
        }
        this.postDataConverter = new PostDataConverter();
    }

    @RequestMapping(path = "/all", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ArrayList<UserMsg> getAllUsers(){
        Iterable<User> temp = service.findAllUser();
        ArrayList users = new ArrayList<UserMsg>();
        for (User u:temp) {
            UserMsg msg = new UserMsg(u);
            users.add(msg);
        }
        return users;
    }

    @RequestMapping(path = "/login", method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public LoginSecurity loginAuthentication(@RequestBody MultiValueMap params){
        String email = "", password = "";
        Map<String,String> parameters = postDataConverter.getData(params);
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("email")){
                email = entry.getValue();
            } else if (entry.getKey().equals("password")){
                password = shaHash.encryption(entry.getValue());
            }
        }

        User user = service.loginMyUser(email, password);
        LoginSecurity security = null;
        if (user != null ) security = loginSecurityService.checkLogin(user);
        else {
            user = service.getUserDataFromPerson(email, password);
            security = loginSecurityService.checkLogin(user);
        }
        return  security;
    }
    @RequestMapping(path = "/update", method = RequestMethod.PUT)
    public Iterable<String> update(@RequestBody UserMsg msg){
        ArrayList<String> response = new ArrayList<>();
        try {
            User u = service.findUserById(msg.getId());
            String password = u.getPassword();
            u = msg.toEntity();
            u.setPassword(password);
            service.save(u);
            response.add("success");
        } catch (Exception e){
            response.add("error");
        }
        return response;
    }
    @RequestMapping(path = "/change_password", method = RequestMethod.PUT)
    public Iterable<String> changePassword(@RequestBody ChangePassword chgpass){
        ArrayList<String> response = new ArrayList<>();
        try {
            User user = service.findUserById(chgpass.getId());
            if (user.getPassword().equals(shaHash.encryption(chgpass.getOldPassword()))){
                user = new User();
                user.setId(chgpass.getId());
                user.setEmail(chgpass.getEmail());
                user.setFullname(chgpass.getFullname());
                user.setAlvl(chgpass.getAlvl());
                user.setPassword(shaHash.encryption(chgpass.getPassword()));
                service.save(user);
                response.add("success");
            } else {
                response.add("bad password");
            }
        } catch (Exception e){
            response.add("error");
        }
        return response;
    }
    @RequestMapping(path = "/{id}", method = RequestMethod.DELETE)
    public Iterable<String> delete(@PathVariable long id){
        ArrayList<String> response = new ArrayList<>();
        try {
            service.deleteById(id);
            response.add("success");
        } catch (Exception e){
            response.add("error");
        }
        return response;
    }
    @RequestMapping(method = RequestMethod.POST,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE,
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public Iterable<String> save(@RequestBody MultiValueMap params) {
        Map<String,String> parameters = postDataConverter.getData(params);
        User user = new User();
        user.setAlvl("user");
        for (Map.Entry<String, String> entry : parameters.entrySet())
        {
            if (entry.getKey().equals("email")){
                user.setEmail(entry.getValue());
            } else if (entry.getKey().equals("password")){
                user.setPassword(shaHash.encryption(entry.getValue()));
            } else if (entry.getKey().equals("fullname")){
                user.setFullname(entry.getValue());
            }
        }
        ArrayList<String> temp = new ArrayList<>();
        try {
            service.save(user);
            temp.add("success");
        }catch (Exception e){
            System.out.println("The error: " + e.getMessage());
            temp.add("This username/email is already existing!");
            return temp;
        }
        return temp;
    }
}
