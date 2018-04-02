package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Person;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.util.List;

/**
 * Created by Szilu on 2017. 04. 11..
 */

public class PersonDAOImpl implements PersonDAO {
    private SessionFactory sessionFactory;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Iterable<String> getAllPersonName() {
        Session session = this.sessionFactory.openSession();
        List<String> list = session.createQuery("select p.name from Person p order by p.name").list();
        session.close();
        return  list;
    }

    @Override
    public Person getPersonByName(String name) {
        Session session = this.sessionFactory.openSession();
        Person t = new Person();
        Query query = session.createQuery("from Person where name = :name");
        query.setParameter("name", name);
        List<Person> list = query.list();
        for (Person pers: list) {
           t.setId(pers.getId());
           t.setAssociatedPhoneNumber(pers.getAssociatedPhoneNumber());
           t.setIdentityNumber(pers.getIdentityNumber());
           t.setName(pers.getName());
           break;
        }
        session.close();
        return t;
    }

    @Override
    public Person getUserDataFromPerson(String email, String password) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("from Person where email = :email and password = :password");
        query.setParameter("email", email);
        query.setParameter("password", password);
        List<Person> list = query.list();
        Person pers = new Person();
        for (Person p: list) {
            pers = p;
            break;
        }
        session.close();
        return pers;
    }
}
