package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Types;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.util.List;

/**
 * Created by Szilu on 2017. 05. 01..
 */
public class MedTypeDAOImpl implements MedTypeDAO {
    private SessionFactory sessionFactory;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Iterable<String> getAllMedicineTypeName() {
        Session session = this.sessionFactory.openSession();
        List<String> list = session.createQuery("select t.name from Types t order by t.name").list();
        session.close();
        return list;
    }

    @Override
    public Iterable<String> getAllExistMedicineTypeName() {
        Session session = this.sessionFactory.openSession();
        List<String> list = session.createQuery("select distinct t.name from Types t, Medicine m where t.id = m.medicinetype.id order by t.name").list();
        session.close();
        return list;
    }
}
