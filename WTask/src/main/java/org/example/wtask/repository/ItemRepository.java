package org.example.wtask.repository;

import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long>{

    Page<Item> findAllByLifeCycle(Pageable pageable, LifeCycle lifeCycle);
}
