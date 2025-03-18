package org.example.wtask.repository;

import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long>  {
    User findByUsername(String username);
    Page<User> findAllByLifeCycle(Pageable pageable, LifeCycle lifeCycle);

    boolean existsByUsernameAndLifeCycle(String userName,LifeCycle lifeCycle);
}
