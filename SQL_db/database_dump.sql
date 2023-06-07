CREATE DATABASE  IF NOT EXISTS `sp_it` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sp_it`;
-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: sp_it
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `categoryid` int NOT NULL AUTO_INCREMENT,
  `categoryname` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`categoryid`),
  UNIQUE KEY `categoryname_UNIQUE` (`categoryname`),
  KEY `categoryid_idx` (`categoryid`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Keyboards','Keyboards for your PCs and Laptops\n'),(2,'Mice','Computer mice of all shapes and sizes'),(3,'Headsets','Headsets for all your needs and purposes'),(4,'Mousepads','Mousepads for wrist support and friction reduction'),(7,'Laptops','High performance laptops'),(9,'Others','Miscellaneous spelt correctly I think');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount`
--

DROP TABLE IF EXISTS `discount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount` (
  `discountid` int NOT NULL AUTO_INCREMENT,
  `discountname` varchar(45) NOT NULL,
  `description` varchar(255) NOT NULL,
  `discountstart` datetime NOT NULL,
  `discountend` datetime NOT NULL,
  `discountpercent` decimal(4,4) NOT NULL,
  `productid` int NOT NULL,
  PRIMARY KEY (`discountid`),
  UNIQUE KEY `discount.pid.discstart.discend.discpercent_UNIQUE` (`productid`,`discountstart`,`discountend`,`discountpercent`),
  KEY `discountstart_idx` (`discountstart`),
  KEY `discountend_idx` (`discountend`),
  CONSTRAINT `discount_productid` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `endDateAfterStartDate` CHECK ((`discountend` > `discountstart`)),
  CONSTRAINT `positivePercent` CHECK ((`discountpercent` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount`
--

LOCK TABLES `discount` WRITE;
/*!40000 ALTER TABLE `discount` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS `product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product` (
  `productid` int NOT NULL AUTO_INCREMENT,
  `productname` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `categoryid` int NOT NULL,
  `brand` varchar(50) NOT NULL,
  `price` decimal(10,4) unsigned NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `imageurl` varchar(255) NOT NULL DEFAULT 'product_image/default_image.jpg',
  PRIMARY KEY (`productid`),
  UNIQUE KEY `productname.brand_idx` (`productname`,`brand`),
  KEY `categoryid_idx` (`categoryid`),
  KEY `productid_idx` (`productid`) /*!80000 INVISIBLE */,
  CONSTRAINT `product_categoryid` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product`
--

LOCK TABLES `product` WRITE;
/*!40000 ALTER TABLE `product` DISABLE KEYS */;
INSERT INTO `product` VALUES (4,'Corsair MM600 Mouse Pad','Low-friction surface that boosts response times',4,'Corsair',29.4000,'2022-01-11 10:42:09','product_image/CorsairMM300MousePad_Corsair-1643963116301-619788773.jpg'),(7,'MX Keys Mini Keyboard Logitech','No Description',1,'Logitech',169.0000,'2022-01-29 20:07:00','product_image/MXKeysMiniKeyboard_Logitech-1643963360874-175365792.jpeg'),(8,'Keyboard 120 Corded Keyboard Logitech','No Description',1,'Logitech',15.0000,'2022-01-29 20:08:12','product_image/K120CordedKeyboard_Logitech-1643963623850-488685201.jpeg'),(112,'K375s Multi-Device Headset','No Description',3,'Logitech',45.0000,'2022-02-04 16:38:13','product_image/K375sMulti-DeviceHeadset_Logitech-1643963894837-3001329.jpeg'),(113,'Razer Pro Glide - XXL Mouse Pad','Thick, high-density rubber foam\n Textured micro-weave cloth surface\n Anti-slip base',4,'Razer',46.0000,'2022-02-04 16:46:04','product_image/RazerProGlide-XXLMousePad_Razer-1643964365547-918389477.jpeg'),(116,'Razer Goliathus Mouse Pad Speed - Medium - Genshin Impact Edition','Have your mouse zip around as effortlessly as Paimon does, as it glides across the soft mat’s smooth micro-textured cloth surface—supported by a non-slip rubber base for stable control.\n Low sense, high sense, laser or optical sensor - whatever your sensitivity setting or preferred gaming mouse, the Razer Goliathus offers total tracking responsiveness for consistently reliable in-game control.\n As our guide in Teyvat, Paimon’s never stopped supporting Travelers on their adventures. But now, she’s here to up your game even further. Enhance your gameplay and experience her magic firsthand with our official Genshin Impact Edition gear. Aren’t you glad you fished her out of that lake?',4,'Razer',29.0000,'2022-02-04 16:50:09','product_image/RazerGoliathusMousePadSpeed-Medium-GenshinImpactEdition_Razer-1643964609880-303792065.jpeg'),(118,'Aurvana Live!2 Headset','Modeled after its award-winning predecessor, the Creative Aurvana Live!2 is designed to deliver true-to-life acoustic performance with tighter bass. The headset is powered by 40mm Bio-Cellulose drivers for impeccable audio while the earcups\' premium protein faux leather cushions with memory-foam provide excellent seal against external noise. They also provide unmatched comfort for extended wear.',3,'Creative',169.0000,'2022-02-04 16:54:26','product_image/AurvanaLive!2Headset_Creative-1643964866803-95841117.jpeg'),(119,'CREATIVE OUTLIER AIR V2 Headset','Introducing the all-new Creative Outlier Air V2-now upgraded with intuitive touch controls, built-in microphone with Qualcomm® cVc™ 8.0 technology for improved call quality and Super X-Fi® READY for the ultimate wire-free listening experience!\n \n The Outlier Air V2 boasts a total playtime of up to 34 hours, a 5.6 mm superior graphene-coated driver diaphragm, and Bluetooth® 5.0 with aptX™ and AAC audio codecs, so you can enjoy immersive audio all day long. It is also certified IPX5 water-resistant with a comfortable all-day fit that\'s perfect for any urbanites with an active lifestyle!',3,'Creative',119.0000,'2022-02-04 16:57:36','product_image/CREATIVEOUTLIERAIRV2Headset_Creative-1643965056951-644811751.jpeg'),(120,'M310T Wireless Mouse','Meet M310t—a full-size wireless mouse designed for hours of comfort and easy navigation. Thanks to the long-lasting battery, broad compatibility, and plug-and-play simplicity, you need just a few seconds to set it up for months of reliable use.',2,'Logitech',15.0000,'2022-02-04 17:00:22','product_image/M310TWirelessMouse_Logitech-1643965224422-964560800.jpeg'),(122,'Predator Triton 300 Laptop acer','11th Gen Intel Core™ i7-11800H (8 Core) processor\n Windows 11 Home\n 15.6\" QHD IPS 165Hz 100%sDCIP3 LED backlit TFT LCD\n NVIDIA GeForce RTX 3080 (8GB GDDR6)\n 32GB DDR4 3200MHz RAM, 1TB PCIe SSD\n Rapid 165Hz refresh rate and 3ms overdrive response time\n 3 Year On-site Local Singapore Warranty',7,'acer',3698.0000,'2022-02-04 17:02:05','product_image/PredatorTriton300Laptop_acer-1643965326414-952947606.jpeg'),(124,'Acer Aspire 5 (A514-54G-74SM) 14\" i7-1165G7 Laptop','The multiple available colors of this fashionable laptop hides a choice of powerful processors and graphics which will help users get the most of the screen its large screen-to-body ratio. As you’d expect from a laptop of this caliber it also includes fast Wi-Fi and plenty of storage and memory.',7,'acer',1398.0000,'2022-02-04 17:03:59','product_image/AcerAspire5(A514-54G-74SM)1422i7-1165G7Laptop_acer-1643965440513-139066828.jpeg'),(125,'Razer DeathAdder V2 - Halo Infinite ','Witness an icon reborn with the Razer DeathAdder V2—an ergonomic mouse designed with deadly curves and killer lines for a weapon that handles like no other. With next-gen sensor and switches packed into a lighter form factor, a new era of high-performance gaming has already taken shape.\nTurn the tide of battle with greatly augmented speed, reflexes, and accuracy as you take hold of an ergonomic form factor that’s every bit as legendary as the Master Chief himself.',2,'Razer',129.9000,'2022-02-04 17:12:16','product_image/_Razer-1643965937671-878485432.png'),(126,'Apple Magic Mouse','\nMagic Mouse is wireless and rechargeable, with an optimised foot design that lets it glide smoothly across your desk. The Multi-Touch surface allows you to perform simple gestures such as swiping between web pages and scrolling through documents.\n\nThe incredibly long-lasting internal battery will power your Magic Mouse for about a month or more between charges. It’s ready to go straight out of the box and pairs automatically with your Mac, and it includes a woven USB-C to Lightning Cable that lets you pair and charge by connecting to a USB-C port on your Mac.',2,'Apple',0.0000,'2022-02-04 17:13:45','product_image/MagicMouse_Apple-1643966026505-845904694.jpeg'),(127,'Apple Macbook Pro','The most powerful MacBook Pro ever is here. With the blazing-fast M1 Pro or M1 Max chip — the first Apple silicon designed for pros — you get groundbreaking performance and amazing battery life. Add to that a stunning Liquid Retina XDR display, the best camera and audio ever in a Mac notebook and all the ports you need. The first notebook of its kind, this MacBook Pro is a beast.',7,'Apple',2999.0000,'2022-02-04 17:15:19','product_image/MacbookPro_Apple-1643966119760-245773080.jpeg');
/*!40000 ALTER TABLE `product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `reviewid` int NOT NULL AUTO_INCREMENT,
  `productid` int NOT NULL,
  `userid` int NOT NULL,
  `rating` tinyint unsigned NOT NULL,
  `review` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewid`),
  UNIQUE KEY `review.uid.prodid_UNIQUE` (`userid`,`productid`) /*!80000 INVISIBLE */,
  KEY `reviewid_idx` (`reviewid`),
  KEY `userid_idx` (`userid`),
  KEY `productid_idx` (`productid`),
  CONSTRAINT `review_productid` FOREIGN KEY (`productid`) REFERENCES `product` (`productid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `reviews_userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (4,4,4,4,'Good product, lov it','2022-01-11 10:42:09'),(54,4,1,0,'No review','2022-01-29 19:38:04'),(72,8,2,4,'Did well for my needs','2022-01-29 22:31:13'),(84,120,19,2,'Love the color on this mouse','2022-02-04 17:43:42'),(89,116,19,5,'This is a cool thing for me~','2022-02-04 17:46:37'),(91,113,19,1,'I love mouse pads and I love this one','2022-02-04 17:48:55'),(92,118,19,1,'I hate headsets and I hate this one','2022-02-04 17:49:12'),(93,127,19,3,'WHy does this cost $3000','2022-02-04 17:50:21'),(94,4,21,3,'Great Item for me and my friends','2022-02-04 17:51:51'),(95,8,20,3,'Awesome product for this','2022-02-04 17:51:51'),(96,8,22,3,'Cool Item for Me and The thing','2022-02-04 17:51:51'),(97,113,23,3,'This is awesome! I loved it','2022-02-04 17:52:50'),(98,113,22,3,'This is not awesome! I hat eit','2022-02-04 17:52:50'),(99,126,19,0,'This is a very cool mouse for all of my friendly friends','2022-02-04 17:55:36'),(100,126,20,3,'COOl for my School','2022-02-04 17:56:50'),(101,126,22,5,'Super duper cool for all of my school','2022-02-04 17:56:50'),(102,120,20,5,'Good Item I give 5 stars','2022-02-04 18:24:13'),(103,120,21,1,'Bad Item I give 1 stars','2022-02-04 18:24:13'),(106,118,4,1,'1 star because They never gave me my item','2022-02-04 19:36:16'),(107,118,2,2,'2 star becayse I only got some things but not all things','2022-02-04 19:36:16');
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `contact` varchar(15) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('Customer','Admin') NOT NULL,
  `profile_pic_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Bevan P','bevan@ichat.sp.edu.sg','211274539','bevanP','Admin','bevan_profile.jpg','2022-01-11 10:42:09'),(2,'U.N. Owen','unowen@whomail.com','21141523','lawWG','Customer','unowen_profile.jpg','2022-01-11 10:42:09'),(4,'Laios T','laios@dungeon.com','12191519','dungeonLord','Customer','laios_profile.jpg','2022-01-11 10:42:09'),(19,'Sofia P','sofia@pmail.com','845156985','picknickerFRLG','Customer','sofia_profile.jpg','2022-02-04 16:16:09'),(20,'Matt Watson','mtwats@mattmail.com','847551924','ouch!','Customer','mtwat_profile.png','2022-02-04 16:16:09'),(21,'Lady Depp','ladyD@deppmail.com','225781562','badabudoop','Customer','depp_profile.png','2022-02-04 16:16:09'),(22,'Carmen Sandiego','carmen@sdmail.com','558498161','whereIsShe','Customer','carmen_profile.jpg','2022-02-04 16:16:09'),(23,'Haley Westernra','haley@westmail.com','989815651','Endless','Customer','western_profile.jpg','2022-02-04 16:20:08');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userinterest`
--

DROP TABLE IF EXISTS `userinterest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userinterest` (
  `interestid` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `categoryid` int NOT NULL,
  PRIMARY KEY (`interestid`),
  UNIQUE KEY `interest.uid.catid_UNIQUE` (`userid`,`categoryid`) /*!80000 INVISIBLE */,
  KEY `userid_idx` (`userid`),
  KEY `categoryid_idx` (`categoryid`),
  CONSTRAINT `userinterest_categoryid` FOREIGN KEY (`categoryid`) REFERENCES `category` (`categoryid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `userinterest_userid` FOREIGN KEY (`userid`) REFERENCES `user` (`userid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=222 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userinterest`
--

LOCK TABLES `userinterest` WRITE;
/*!40000 ALTER TABLE `userinterest` DISABLE KEYS */;
INSERT INTO `userinterest` VALUES (3,2,2),(5,4,4),(27,4,2),(28,4,9),(177,1,3),(186,1,9),(219,19,2);
/*!40000 ALTER TABLE `userinterest` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-04 19:47:57
