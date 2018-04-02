package edu.cs.ubb.exam.dao;

import edu.cs.ubb.exam.model.Appointments;
import edu.cs.ubb.exam.model.Cure;

/**
 * Created by Szilu on 2017. 06. 17..
 */
public interface CureDAO {
    public Iterable<Cure> findAllByPersName(String persname, boolean active);
    public Iterable<Appointments> findAppointmentsByCureId(Long cureid);
    public void deleteByCureId(long id);
}
