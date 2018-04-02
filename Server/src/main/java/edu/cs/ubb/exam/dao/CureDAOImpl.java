package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Appointments;
import edu.cs.ubb.exam.model.Cure;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;

import java.util.List;

/**
 * Created by Szilu on 2017. 06. 17..
 */
public class CureDAOImpl implements CureDAO {
    private SessionFactory sessionFactory;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Iterable<Cure> findAllByPersName(String persname, boolean active) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = null;
        if (active) {
            query = session.createQuery("from Cure c where c.pers.name = :persname and c.active = '1' order by c.firstdate");
        } else {
            query = session.createQuery("from Cure c where c.pers.name = :persname order by c.firstdate");
        }
        query.setParameter("persname", persname);
        List<Cure> list = query.list();
        tx3.commit();
        session.close();
        return  list;
    }

    @Override
    public Iterable<Appointments> findAppointmentsByCureId(Long cureid) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("from Appointments a where a.cure.id = :cureid  order by a.time");
        query.setParameter("cureid", cureid);
        List<Appointments> list = query.list();
        tx3.commit();
        session.close();
        return  list;
    }

    @Override
    public void deleteByCureId(long id) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("from Appointments a where a.cure.id = :cureid");
        query.setParameter("cureid", id);
        List<Appointments> list = query.list();
        tx3.commit();
        session.close();
        for (Appointments a: list) {
            session.delete(a);
        }
    }
}
