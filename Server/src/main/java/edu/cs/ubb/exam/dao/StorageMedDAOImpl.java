package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.StorageMed;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Projections;
import org.hibernate.transform.Transformers;

import java.util.List;


/**
 * Created by Szilu on 2017. 04. 05..
 */
public class StorageMedDAOImpl implements StorageMedDAO {
    private SessionFactory sessionFactory;
    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }


    @Override
    public Iterable<Stoor> findAllWithGroupBy() {
        Session session = this.sessionFactory.openSession();
        Criteria criteria = session.createCriteria(StorageMed.class);
        criteria.setProjection(Projections.projectionList()
                .add(Projections.sum("quantity"), "Quantity")
                .add(Projections.groupProperty("med"), "Medicine")  );
        criteria.setResultTransformer(Transformers.aliasToBean(Stoor.class));
        List<Stoor> list = null;

        try {
            list = criteria.list();
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        session.close();
        return (Iterable<Stoor>) list;
    }

    @Override
    public Iterable<String> getMedicinesFromStorage() {
        Session session = this.sessionFactory.openSession();
        List<String> list = session.createQuery("select distinct m.medicinetype.name from Medicine m, StorageMed st where m.id = st.med.id order by m.medicinetype.name").list();
        session.close();
        return (Iterable<String>) list;
    }

    @Override
    public Iterable<String> getMedicineTypesFromStorage(String name) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("select distinct st.med.name from StorageMed st, Medicine m where m.id = st.med.id and st.med.medicinetype.name = :name order by st.med.name");
        query.setParameter("name", name);
        List<String> list = query.list();
        session.close();
        return list;
    }

    @Override
    public StorageMed getSimilarRow(String date,  long medid){
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("from StorageMed sm where sm.med.id = :medid and sm.date = :date");
        query.setParameter("medid", medid);
        query.setParameter("date", date);
        List<StorageMed> list = query.list();
        session.close();
        for (StorageMed st:list) {
            return st;
        }
        return  null;
    }

    @Override
    public boolean isEnough(String medname, double quantity, String type) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("select sum(st.quantity) from StorageMed st, Medicine m where st.med.id = m.id and m.name = :type and m.medicinetype.name = :medname");
        query.setParameter("medname", medname);
        query.setParameter("type", type);

        List<Double> list = query.list();
        session.close();
        for (Double d: list) {
            if (d == null) return false;
            else if (d >= quantity) return true;
            else return false;
        }
        return  false;
    }

    @Override
    public List<StorageMed> getAllByMedID(long medid) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("from StorageMed st where st.med.id = :medid order by st.date");
        query.setParameter("medid", medid);
        List<StorageMed> list = query.list();
        session.close();
        return  list;
    }

    @Override
    public double getQuantityByNameAndType(String name, String type) {
        Session session = this.sessionFactory.openSession();
        Query query = session.createQuery("select sum(st.quantity) from StorageMed st where st.med.medicinetype.name = :name and st.med.name = :type");
        query.setParameter("name", name);
        query.setParameter("type", type);
        List<Double> list = query.list();
        double returnValue = 0;
        for (Double d: list) {
            if (d == null) break;
            returnValue = d;
            break;
        }
        session.close();
        return returnValue;
    }
}
