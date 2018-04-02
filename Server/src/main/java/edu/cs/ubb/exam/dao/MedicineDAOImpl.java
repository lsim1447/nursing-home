package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Medicine;
import edu.cs.ubb.exam.model.Types;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import java.util.List;

/**
 * Created by Szilu on 2017. 04. 03..
 */

public class MedicineDAOImpl implements  MedicineDAO{
    private SessionFactory sessionFactory;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public Medicine getMedicineByName(String name) {
        Session session = this.sessionFactory.openSession();
        Medicine temp = new Medicine();
        Query query = session.createQuery("from Medicine where name = :name");
        query.setParameter("name", name);
        List<Medicine> list = query.list();
        for (Medicine med: list) {
            temp.setId(med.getId());
            temp.setUnit(med.getUnit());
            temp.setQuantity(med.getQuantity());
            temp.setName(med.getName());
            temp.setPrice(med.getPrice());
            break;
        }
        session.close();
        return temp;
    }

    @Override
    public Types getTypesByName(String name) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("from Types where name = :name");
        query.setParameter("name", name);
        List<Types> list = query.list();
        Types types = new Types();
        for (Types t: list) {
            types = t;
            break;
        }
        session.close();
        return  types;
    }

    @Override
    public Iterable<String> getAllTypesByName(String name) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("select m.name from Medicine m where m.medicinetype.name = :name order by m.name");
        query.setParameter("name", name);
        List<String> list = query.list();
        session.close();
        return  list;
    }

    @Override
    public Iterable<String> getAllMedName() {
        Session session = this.sessionFactory.openSession();
        List<String> list = session.createQuery("select m.name from Medicine m order by m.name").list();
        session.close();
        return  list;
    }

    @Override
    public Medicine getMedByNameAndType(String name, String type) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("from Medicine m where m.name = :type and m.medicinetype.name = :name");
        query.setParameter("name", name);
        query.setParameter("type", type);
        Medicine medicine = new Medicine();
        List<Medicine> list = query.list();
        for (Medicine med: list) {
            medicine = med;
            break;
        }
        session.close();
        return  medicine;
    }
}
