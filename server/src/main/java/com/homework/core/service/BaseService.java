package com.homework.core.service;

import java.util.List;

/**
 * �� ���ѩޱ ������ 2015-3-27-0027.
 */
public interface BaseService<T,ID> {
    ID create(T entity);
    boolean delete(T entity);
    boolean update(T entity);
    List<T> getAll();
    T getById(ID id);
}
