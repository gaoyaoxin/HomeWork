package com.homework.service;

import com.homework.core.dao.BaseDao;
import com.homework.core.service.BaseServiceImpl;
import com.homework.dao.UserDao;
import com.homework.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * �� ���ѩޱ ������ 2015-3-27-0027.
 */
@Service
@Transactional
public class UserService extends BaseServiceImpl<User,String> {
    @Autowired
    UserDao userDao;

    @Override
    public <D extends BaseDao<User, String>> D getDao() {
        return (D) userDao;
    }
}
