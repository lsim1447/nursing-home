    package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.*;
import edu.cs.ubb.exam.model.help_classes.Stoor;
import edu.cs.ubb.exam.model.help_classes.TotalMedPrice;
import org.hibernate.*;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.Transformers;

import java.util.List;

/**
 * Created by Szilu on 2017. 04. 11..
 */
public class DoseDAOImpl implements DoseDAO {
    private SessionFactory sessionFactory;

    public void setSessionFactory(SessionFactory sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Override
    public boolean save(Dose dose) {
        Double quantity = dose.getQuantity();
        Medicine med = dose.getMed();
        String name = med.getMedicinetype().getName();
        String type = med.getName();
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Criteria criteria = session.createCriteria(StorageMed.class);
        criteria.setProjection(Projections.projectionList()
                .add(Projections.sum("quantity"), "Quantity")
                .add(Projections.groupProperty("med"), "Medicine")  );
        criteria.setResultTransformer(Transformers.aliasToBean(Stoor.class));
        List<Stoor> list = criteria.list();
        tx3.commit();
        session.close();
        if (list.size() == 0) return false;
        boolean nah = false;
        Stoor temp = new Stoor();
        for (Stoor st: list) {
            if (st.getMedicine().getMedicinetype().getName().equals(name) && st.getMedicine().getName().equals(type)){
                temp = st;
                nah = true;
                break;
            }
        }
        if (!nah) return false;
        if (quantity <= temp.getQuantity()) {
            return  true;
        } else {
            return false;
        }
    }

    @Override
    public Iterable<Dose> findAllByName(String name, String firstDate, String lastDate) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query;
        if (name.equals("All")){
            query = session.createQuery("from Dose d where d.date >= :firstdate and d.date <= :lastdate order by d.date");
            query.setParameter("firstdate", firstDate);
            query.setParameter("lastdate", lastDate);
        } else {
            query = session.createQuery("from Dose d where d.pers.name = :name and d.date >= :firstdate and d.date <= :lastdate order by d.pers.name, d.date");
            query.setParameter("name", name);
            query.setParameter("firstdate", firstDate);
            query.setParameter("lastdate", lastDate);
        }
        List<Dose> list = query.list();
        tx3.commit();
        session.close();
        return list;
    }

    @Override
    public double getTotalPrice(String name, String firstDate, String lastDate) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query;
        if (name.equals("All")){
            query = session.createQuery("select sum(d.price) from Dose d where d.date >= :firstdate and d.date <= :lastdate");
            query.setParameter("firstdate", firstDate);
            query.setParameter("lastdate", lastDate);
        } else {
            query = session.createQuery("select sum(d.price) from Dose d, Person p where d.pers.id = p.id and d.pers.name = :name and d.date >= :firstdate and d.date <= :lastdate");
            query.setParameter("name", name);
            query.setParameter("firstdate", firstDate);
            query.setParameter("lastdate", lastDate);
        }
        double price = 0;
        List<Double> list = query.list();
        tx3.commit();
        session.close();
        try {
            for (Double d : list) {
                price = d;
                break;
            }
        } catch (IndexOutOfBoundsException e){
            return 0;
        } catch (NullPointerException e){
            return 0;
        }
        return price;
    }

    @Override
    public List<Dose> getAllByPersId(long persid) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("from Dose d where d.pers.id = :persid order by d.date");
        query.setParameter("persid", persid);
        List<Dose> list = query.list();
        tx3.commit();
        session.close();
        return  list;
    }

    @Override
    public List<Dose> getAllByMedId(long medid) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("from Dose d where d.med.id = :medid order by d.date");
        query.setParameter("medid", medid);
        List<Dose> list = query.list();
        tx3.commit();
        session.close();
        return  list;
    }

    @Override
    public List<TotalMedPrice> getSummarization(String firstDate, String lastDate) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Criteria criteria = session.createCriteria(Dose.class);
        criteria.setProjection(Projections.projectionList()
                .add(Projections.sum("price"), "price")
                .add(Projections.groupProperty("pers"), "person")  );
        criteria.add(Restrictions.le("date", lastDate));
        criteria.add(Restrictions.gt("date", firstDate));
        criteria.setResultTransformer(Transformers.aliasToBean(TotalMedPrice.class));
        List<TotalMedPrice> list = null;

        try {
            list = criteria.list();
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        tx3.commit();
        session.close();
        return  list;
    }

    @Override
    public double getQuantityByName(String name) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("select sum(st.quantity) from StorageMed st where st.med.name = :name");
        query.setParameter("name", name);
        List<Double> list = query.list();
        tx3.commit();
        session.close();

        double quantity = 0;
        try {
            for (Double d : list) {
                quantity = d;
                break;
            }
        } catch (IndexOutOfBoundsException e){
            return 0;
        } catch (NullPointerException e){
            return 0;
        }
        return quantity;
    }
    public List<Stoor> getConsumption(String firstDate, String lastDate){
        Session session = this.sessionFactory.openSession();
        Criteria criteria = session.createCriteria(Dose.class);
        criteria.setProjection(Projections.projectionList()
                .add(Projections.sum("quantity"), "Quantity")
                .add(Projections.groupProperty("med"), "Medicine")  );
        criteria.add(Restrictions.le("date", lastDate));
        criteria.add(Restrictions.ge("date", firstDate));
        criteria.setResultTransformer(Transformers.aliasToBean(Stoor.class));
        List<Stoor> list = null;
        try {
            list = criteria.list();
        } catch (Exception e){
            System.out.println(e.getMessage());
        }
        session.close();
        return list;
    }

    @Override
    public List<String> getPersonNamesWhoHaveThreatment(String date) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("select distinct p.name from Person p, Cure c where c.pers.name = p.name and c.firstdate <= :firstDate and c.lastdate >= :lastDate and c.active = '1'");
        query.setParameter("firstDate", date);
        query.setParameter("lastDate", date);
        List<String> list = query.list();
        tx3.commit();
        session.close();
        return list;
    }

    @Override
    public List<Cure> getAllCureByName(String name, String date) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("from Cure c where c.pers.name = :persname and c.firstdate <= :firstDate and c.lastdate >= :lastDate and c.active = '1'");
        query.setParameter("persname", name);
        query.setParameter("firstDate", date);
        query.setParameter("lastDate", date);
        List<Cure> list = query.list();
        tx3.commit();
        session.close();
        return list;
    }

    @Override
    public List<Appointments> getAllDailyCureDataByCureID(long id) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("from Appointments d where d.cure.id = :cureid");
        query.setParameter("cureid", id);
        List<Appointments> list = query.list();
        tx3.commit();
        session.close();
        return list;
    }

    @Override
    public List<StorageMed> getAllSM() {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        Query query = session.createQuery("from StorageMed");
        List<StorageMed> list = query.list();
        tx3.commit();
        session.close();
        return list;
    }

    @Override
    public void updateStorage(StorageMed sm) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        session.saveOrUpdate(sm);
        tx3.commit();
        session.close();
    }

    @Override
    public void deleteStorage(StorageMed sm) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
        session.delete(sm);
        tx3.commit();
        session.close();
    }

    @Override
    public void setValidityOfCures(String date) {
        Session session = this.sessionFactory.openSession();
        Transaction tx3 = session.beginTransaction();
            Query query = session.createQuery("from Cure where active='1' and lastdate < :date");
            List<Cure> list = query.setParameter("date", date).list();
            for (Cure c : list){
                c.setActive(false);
                session.saveOrUpdate(c);
            }
            query = session.createQuery("from Cure where active='0' and firstdate <= :date and lastdate >= :date");
            list = query.setParameter("date", date).list();
            for (Cure c : list){
                c.setActive(true);
                session.saveOrUpdate(c);
            }
        tx3.commit();
        session.close();
    }
}
