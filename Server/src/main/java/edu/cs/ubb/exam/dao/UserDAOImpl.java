package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.User;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import java.util.List;

/**
 * Created by Szilu on 2017. 03. 30..
 */
public class UserDAOImpl implements  UserDAO{
    private SessionFactory sessionFactory;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public void save(User user) {
        Session session = this.sessionFactory.openSession();
        Transaction tx = session.beginTransaction();
        session.persist(user);
        tx.commit();
        session.close();
    }

    @Override
    public boolean checkUser(String email, String password) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("from User where email = :email and password = :password");
        query.setParameter("email", email);
        query.setParameter("password", password);
        List<User> userList = query.list();
        session.close();
        if (userList.size() == 0) {
            return false;
        }
        return true;
    }

    @Override
    public List<User> list() {
        Session session = this.sessionFactory.openSession();
        List<User> userList = session.createQuery("from User u order by u.fullname").list();
        session.close();
        return userList;
    }
}
