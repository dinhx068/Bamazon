/* Schema for SQL database/table. */
DROP DATABASE IF EXISTS bamazon;

/* Create database */
CREATE DATABASE bamazon;
USE bamazon;

/* Create new table with a primary key that auto-increments, and a text field */
CREATE TABLE products (
  item_id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255),
  price DECIMAL(10,2),
  stock INT
);

/* If "ER_NOT_SUPPORTED_AUTH_MODE with auth_socket" shows up then try running the code below */
/* ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY ''; */

SELECT * FROM products;

