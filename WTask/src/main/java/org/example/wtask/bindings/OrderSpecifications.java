package org.example.wtask.bindings;

import jakarta.persistence.criteria.Expression;
import org.example.wtask.models.Enums.OrderStatus;
import org.example.wtask.models.Order;
import org.hibernate.query.criteria.JpaOrder;
import org.springframework.data.jpa.domain.Specification;

import java.util.Calendar;
import java.util.Date;

public class OrderSpecifications {
    public static Specification<Order> hasStatus(OrderStatus status) {
        return (root, query, builder) -> status == null ? null : builder.equal(root.get("status"), status);
    }

    public static Specification<Order> isUser(String userName) {
        return (root, query, builder) -> userName == null ? null : builder.equal(root.get("user").get("username"), userName);
    }

    public static Specification<Order> sortBy(String fieldName, boolean ascending) {
        return (root, query, builder) -> {
            JpaOrder order = (JpaOrder) (ascending ? builder.asc(root.get(fieldName)) : builder.desc(root.get(fieldName)));
            query.orderBy(order);
            return null;
        };
    }

    public static Specification<Order> deadlineBefore(Date date) {
        return (root, query, builder) -> {
            if (date == null) {
                return null;
            }

            Date truncatedDate = truncateToDateOnly(date);

            return builder.greaterThanOrEqualTo(
                    builder.function("DATE", Date.class, root.get("deadlineDate")),
                    truncatedDate
            );
        };
    }

    private static Date truncateToDateOnly(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }

}
