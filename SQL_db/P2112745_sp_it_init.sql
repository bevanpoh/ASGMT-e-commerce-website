CREATE DATABASE IF NOT EXISTS `sp_it`;
USE `sp_it`;

DROP TABLE IF EXISTS userinterest, review, product, discount, user, category;

CREATE TABLE `sp_it`.`user` (
  `userid` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(50) NOT NULL,
  `contact` VARCHAR(15) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `type` ENUM('Customer', 'Admin') NOT NULL,
  `profile_pic_url` VARCHAR(255) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE);
  
INSERT INTO user 
(username, email, contact, password, type, profile_pic_url)
VALUES
('Bevan P.', 'bevan@ihat.sp.edu.sg','211274539','bevanP','Admin','bevan_profile.jpg'),
("U.N. Owen", "unowen@whomail.com", "21141523", "lawWG","Customer", "unowen_profile.jpg"),
("M. Marvin", "mecha@museum.com", "13118220", "marvelousmuseum","Customer", "marvin_profile.jpg"),
("Laios T", "laios@dungeon.com", "12191519", "dungeonLord" ,"Customer", "laios_profile.jpg");

SELECT * FROM user;



CREATE TABLE `sp_it`.`category` (
  `categoryid` INT NOT NULL AUTO_INCREMENT,
  `categoryname` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE INDEX `categoryname_UNIQUE` (`categoryname` ASC) VISIBLE,
  INDEX `categoryid_idx` (`categoryid` ASC) VISIBLE );
  
  
INSERT INTO category
(categoryname, description)
VALUES
("Keyboards", "Keyboards for your PCs and Laptops"),
("Mice", "Computer mice of all shapes and sizes"),
("Headsets", "Headsets for all your needs and purposes"),
("Mousepads", "Mousepads for wrist support and friction reduction");

SELECT * FROM category;



CREATE TABLE `sp_it`.`product` (
  `productid` INT NOT NULL AUTO_INCREMENT,
  `productname` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `categoryid` INT NOT NULL,
  `brand` VARCHAR(50) NOT NULL,
  `price` DECIMAL(10,4) UNSIGNED NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`productid`),
  UNIQUE INDEX `productname_UNIQUE` (`productname` ASC) VISIBLE,
  INDEX `categoryid_idx` (`categoryid` ASC) VISIBLE,
  INDEX `productid_idx` (`productid` ASC) VISIBLE,
  CONSTRAINT `product_categoryid`
    FOREIGN KEY (`categoryid`)
    REFERENCES `sp_it`.`category` (`categoryid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
INSERT INTO product 
(productname, description, categoryid, brand, price)
VALUES
("MX Keys Mini", "Minimalist Wireless Illuminated Keyboard", 1, "Logitech", 169.00),
("M190 Full-Size Wireless Mouse", "Countoured Design, essential comfort for mid to large hands", 2, "Logitech", "23.00"),
("Soundcore Life Q20", "Noise Cancelling, Memory Foam, Bluetooth Wireless ever-ear headphones", 3, "Anker", "59.99"),
("Corsair MM600", "Low-friction surface that boosts response times", 4, "Corsair", "29.40");

SELECT * FROM product;



CREATE TABLE `sp_it`.`review` (
  `reviewid` INT NOT NULL AUTO_INCREMENT,
  `productid` INT NOT NULL,
  `userid` INT NOT NULL,
  `rating` TINYINT UNSIGNED NOT NULL,
  `review` TEXT NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  INDEX `reviewid_idx` (`reviewid` ASC) VISIBLE,
  INDEX `userid_idx` (`userid` ASC) VISIBLE,
  INDEX `productid_idx` (`productid` ASC) VISIBLE,
  UNIQUE INDEX `review.uid.prodid_UNIQUE` (`userid`, `productid` ASC) INVISIBLE,
  CONSTRAINT `reviews_userid`
    FOREIGN KEY (`userid`)
    REFERENCES `sp_it`.`user` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `review_productid`
    FOREIGN KEY (`productid`)
    REFERENCES `sp_it`.`product` (`productid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
INSERT INTO review
(productid, userid, rating, review)
VALUES
(1,1,1,"Product never arrived, no follow up message from anyone"),
(2,2,2,"Terrible price, horrible shipping delay"),
(3,3,3,"Fair, nothing special"),
(4,4,4,"Good product, lov it");

SELECT * FROM review;



CREATE TABLE `sp_it`.`userinterest` (
  `interestid` INT NOT NULL AUTO_INCREMENT,
  `userid` INT NOT NULL,
  `categoryid` INT NOT NULL,
  PRIMARY KEY (`interestid`),
  INDEX `userid_idx` (`userid` ASC) VISIBLE,
  INDEX `categoryid_idx` (`categoryid` ASC) VISIBLE,
  UNIQUE INDEX `interest.uid.catid_UNIQUE` (`userid`, `categoryid` ASC) INVISIBLE,
  CONSTRAINT `userinterest_userid`
    FOREIGN KEY (`userid`)
    REFERENCES `sp_it`.`user` (`userid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `userinterest_categoryid`
    FOREIGN KEY (`categoryid`)
    REFERENCES `sp_it`.`category` (`categoryid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
INSERT INTO userinterest
(userid, categoryid)
VALUES
(1,1),
(1,2),
(2,2),
(3,3),
(4,4);

SELECT * FROM userinterest;

CREATE TABLE `sp_it`.`discount` (
  `discountid` INT NOT NULL AUTO_INCREMENT,
  `discountname` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `discountstart` DATETIME NOT NULL,
  `discountend` DATETIME NOT NULL,
  CONSTRAINT endDateAfterStartDate CHECK (discountend > discountstart),
  `discountpercent` DECIMAL(4,4) NOT NULL,
  CONSTRAINT positivePercent CHECK (discountpercent > 0),
  `productid` INT NOT NULL,
  CONSTRAINT `discount_productid`
    FOREIGN KEY (`productid`)
    REFERENCES `sp_it`.`product` (`productid`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  PRIMARY KEY (`discountid`),
  UNIQUE INDEX `discount.pid.discstart.discend.discpercent_UNIQUE` (`productid` ASC, `discountstart` ASC, `discountend` ASC, `discountpercent` ASC) VISIBLE,
  INDEX `discountstart_idx` (`discountstart` ASC) VISIBLE,
  INDEX `discountend_idx` (`discountend` ASC) VISIBLE);

INSERT INTO discount
(discountname, description, discountstart, discountend, discountpercent, productid)
VALUES
('Holiday Special Sale', 'Super cool promotion', 20211101, 20220901, 0.10, 1),
('Super Sale', '30% off items', '20211101',20220901,0.30,1),
('Expired Sale','99% off', 20000101,20000102,0.99,1),
('Super Sale', '30% off items', '20211101',20220901,0.30,2),
('Expired Sale','99% off', 20000101,20000102,0.99,2),
('Future Sale','Limited time deal! Super cool!', 20250101,20250202,0.25,2),
('Future Sale','Limited time deal! Super cool!', 20250101,20250202,0.25,3),
('Expired Sale','99% off', 20000101,20000102,0.99,3);

SELECT * FROM discount;
