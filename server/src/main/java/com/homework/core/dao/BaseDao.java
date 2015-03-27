package com.homework.core.dao;

import java.util.List;

/**
 * �� ���ѩޱ ������ 2015-3-27-0027.
 */
public interface BaseDao<T, ID> {
    ID create(T entity);
    boolean delete(T entity);
    boolean update(T entity);
    List<T> getAll();
    T getById(ID id);
}
