package com.ecommerce.service;

import com.ecommerce.dto.Purchase;
import com.ecommerce.dto.PurchaseResponse;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.Order;
import com.ecommerce.entity.OrderItem;
import com.ecommerce.repo.CustomerRepo;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class CheckoutServiceImpl implements  CheckoutService {

    private CustomerRepo customerRepo;
    public CheckoutServiceImpl(CustomerRepo customerRepo){
        this.customerRepo = customerRepo;
    }
    @Override
    public PurchaseResponse placeOrder(Purchase purchase) {
        // Retrieve The Order Info Frm Dto
        Order order = purchase.getOrder();

        //Generate Tracking Number
        String orderTrackingNumber = generateOrderTracingnumber();
        order.setOrderTrackingNumber(orderTrackingNumber);

        // Populate Order With OrderItem
        Set<OrderItem> orderItems = purchase.getOrderItems();
        orderItems.forEach(item ->order.add(item));

        //Populate Order With shippingAddress And BillingAddress
        order.setShippingAddress(purchase.getBillingAddress());
        order.setBillingAddress(purchase.getBillingAddress());

        //Populate Customer With Order
        Customer customer = purchase.getCustomer();
        customer.add(order);

        // Save To The Database
        customerRepo.save(customer);

        //Return A Response

        return new PurchaseResponse(orderTrackingNumber);
    }

    private String generateOrderTracingnumber(){
        //Generate A Random UUID (UUID Version-4)
        return UUID.randomUUID().toString();
    }












}
