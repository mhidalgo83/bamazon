DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR (100) NOT NULL,
    department_name VARCHAR (100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT default 0,
    PRIMARY KEY (item_id)
    );
    
    INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Shake Weight", "Athletics", 15.99, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Slap Chop", "Home Goods", 6.59, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("ShamWOW!!", "Home Goods", 2.49, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Louisville Slugger", "Athletics", 9.99, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Emeril's BAM!! spice", "Home Goods", 12.59, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("BIC razors", "Hygiene", 1.99, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Gillete shave gel", "Hygiene", 4.99, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Colgate Toothpaste", "Hygiene", 3.99, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("Pull Up Bar", "Athletics", 24.99, 100);
    
	INSERT INTO products (product_name, department_name, price, stock_quantity)
    VALUES ("VIZIO 84 in. 4K TV", "Home Goods", 899.99, 100);