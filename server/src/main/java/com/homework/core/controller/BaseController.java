package com.homework.core.controller;

import com.homework.core.Result;

import java.util.List;

/**
 * �� ���ѩޱ ������ 2015-3-27-0027.
 */
public interface BaseController<T,ID> {
    Result create(T entity);
    Result delete(T entity);
    Result update(T entity);
    Result getAll();
    Result getById(ID id);
}
