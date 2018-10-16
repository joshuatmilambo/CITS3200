-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 10, 2018 at 11:46 AM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";
CREATE DATABASE `CITS3200`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CITS3200`
--

-- Select CITS3200 database
USE CITS3200;
-- --------------------------------------------------------


-- --------------------------------------------------------

--
-- Table structure for table `Paper`
--

CREATE TABLE `Paper` (
  `paper_id` int(8) NOT NULL,
  `user_id` int(8) NOT NULL,
  `status` varchar(20) NOT NULL,
  `institution` varchar(100) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `assessment` varchar(50) NOT NULL,
  `date` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `Paper` VALUES
(1,1,'done','UWA','PHYS1001','Exam','2018-09-01'),
(2,1,'in process','UWA','PHYS1002','Test','2018-09-02'),
(3,2,'in process','Curtin','PHYS1002','Test','2018-09-02'),
(4,1,'done','UWA','PHYS1003','Assignment','2018-09-02'),
(5,1,'in process','UWA','PHYS1001','Test','2018-09-03'),
(6,3,'in process','ECU','PHYS1002','Exam','2018-09-04'),
(7,1,'in process','Murdoch','PHYS1002','Test','2018-09-02'),
(8,2,'done','ECU','PHYS1004','Exam','2018-09-06'),
(9,2,'in process','UWA','PHYS1004','Exam','2018-09-07'),
(10,2,'done','Murdoch','PHYS1004','Exam','2018-09-06'),
(11,2,'done','Curtin','PHYS1004','Exam','2018-09-06'),
(12,2,'done','ECU','PHYS1005','Exam','2018-09-10'),
(13,3,'done','UWA','PHYS1005','Exam','2018-09-10'),
(14,1,'done','Curtin','PHYS1005','Test','2018-09-10'),
(15,1,'done','Curtin','PHYS1005','Test','2018-09-10'),
(16,2,'in process','ECU','PHYS1006','Assignment','2018-09-11'),
(17,2,'in process','Curtin','PHYS1006','Assignment','2018-09-11'),
(18,2,'in process','UWA','PHYS1007','Assignment','2018-09-13'),
(19,1,'in process','Murdoch','PHYS1007','Assignment','2018-09-13'),
(20,3,'in process','ECU','PHYS1007','Assignment','2018-09-13');


-- --------------------------------------------------------

--
-- Table structure for table `Question`
--

CREATE TABLE `Question` (
  `q_id` int(8) NOT NULL,
  `name` varchar(50) NOT NULL,
  `size` int(10) NOT NULL,
  `type` varchar(20) NOT NULL,
  `zip_path` varchar(100) NOT NULL,
  `preview_path` varchar(100) NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `short_description` varchar(200) DEFAULT NULL,
  `key_words` varchar(100) DEFAULT NULL,
  `update_date` date NOT NULL,
  `video_link` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `Question` VALUES
(1,'light01',500,'zip','zip_path','preview_path','q1','q1','light,electricity,motion','2017-09-10','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(2,'electricity01',500,'zip','zip_path','preview_path','q2','q2','light,electricity,motion','2017-09-10','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(3,'light02',500,'zip','zip_path','preview_path','q3','q3','light,electricity,motion','2017-09-10','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(4,'light03',500,'zip','zip_path','preview_path','q4','q4','light,electricity,motion','2017-09-11','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(5,'motion01',500,'zip','zip_path','preview_path','q5','q5','light,electricity,motion','2017-09-12','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(6,'friction01',500,'zip','zip_path','preview_path','q6','q6','light,electricity,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(7,'mechanic',500,'zip','zip_path','preview_path','q7','q7','dynamics,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(8,'mechanic',500,'zip','zip_path','preview_path','q8','q8','dynamics,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(9,'mechanic',500,'zip','zip_path','preview_path','q9','q9','dynamics,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(10,'mechanic',500,'zip','zip_path','preview_path','q10','q10','dynamics,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(11,'electromagnetism',500,'zip','zip_path','preview_path','q11','q11','circuits,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(12,'electromagnetism',500,'zip','zip_path','preview_path','q12','q12','circuits,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(13,'electromagnetism',500,'zip','zip_path','preview_path','q12','q12','circuits,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(14,'electromagnetism',500,'zip','zip_path','preview_path','q14','q14','circuits,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(15,'electromagnetism',500,'zip','zip_path','preview_path','q15','q15','circuits,vectors,motion','2017-09-20','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(16,'history',500,'zip','zip_path','preview_path','q16','q16','Newton,Einstein,Galileo','2017-09-21','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(17,'history',500,'zip','zip_path','preview_path','q17','q17','Newton,Einstein,Galileo','2017-09-21','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(18,'history',500,'zip','zip_path','preview_path','q18','q18','Newton,Einstein,Galileo','2017-09-21','https://www.youtube.com/watch?v=VYOjWnS4cMY'),
(19,'history',500,'zip','zip_path','preview_path','q19','q19','Newton,Einstein,Galileo','2017-09-21',NULL),
(20,'history',500,'zip','zip_path','preview_path','q20','q20','Newton,Einstein,Galileo','2017-09-21',NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Temp_Paper`
--

CREATE TABLE `Temp_Paper` (
  `paper_id` int(8) NOT NULL,
  `q_id` int(8) NOT NULL,
  `user_id` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO `Temp_Paper` VALUES
(2,1,1),
(2,2,1),
(2,3,1),
(2,4,1),
(2,5,1),
(2,6,2),
(2,7,3),
(2,8,1),
(2,9,1),
(2,10,3),
(2,11,2),
(2,12,1),
(2,13,2),
(2,14,1),
(2,15,3),
(2,16,1),
(2,17,3),
(2,18,2),
(2,19,1),
(2,20,1),
(6,1,3),
(6,2,3),
(6,3,1),
(6,4,2),
(6,5,3),
(6,6,1),
(6,7,2),
(6,8,3),
(6,9,3),
(6,10,3),
(6,11,2),
(6,12,2),
(6,13,3),
(6,14,2),
(6,15,3),
(6,16,2),
(6,17,3),
(6,18,1),
(6,19,3),
(6,20,1);


-- --------------------------------------------------------

--
-- Table structure for table `Question_History`
--

CREATE TABLE `Question_History` (
  `history_key` int(8) NOT NULL,
  `q_id` int(8) NOT NULL,
  `paper_id` int(8) NOT NULL,
  `correct` int(5) DEFAULT NULL,
  `total_student` int(5) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


INSERT INTO  `Question_History` VALUES
(1,1,1,60,100,'note 1'),
(2,2,1,40,100, 'note 2'),
(3,3,1,70,100, 'note 3'),
(4,4,1,40,100,'note 4'),
(5,5,1,40,100,'note 5'),
(6,6,1,40,100,'note 6'),
(7,7,1,40,100,'note 7'),
(8,8,1,40,100,'note 8'),
(9,9,1,40,100,'note 9'),
(10,10,1,40,100,'note 10'),
(11,11,1,40,100,'note 11'),
(12,12,1,40,100,'note 12'),
(13,13,1,40,100,'note 13'),
(14,14,1,40,100,'note 14'),
(15,15,1,40,100,'note 15'),
(16,16,1,40,100,'note 16'),
(17,17,1,40,100,'note 17'),
(18,18,1,40,100,'note 18'),
(19,19,1,40,100,'note 19'),
(20,20,1,40,100,'note 20'),
(21,1,4,60,100,'note 1'),
(22,2,4,40,100, 'note 2'),
(23,3,4,70,100, 'note 3'),
(24,4,4,40,100,'note 4'),
(25,5,4,40,100,'note 5'),
(26,6,4,40,100,'note 6'),
(27,7,4,40,100,'note 7'),
(28,8,4,40,100,'note 8'),
(29,9,4,40,100,'note 9'),
(30,10,4,40,100,'note 10'),
(31,11,4,40,100,'note 11'),
(32,12,4,40,100,'note 12'),
(33,13,4,40,100,'note 13'),
(34,14,4,40,100,'note 14'),
(35,15,4,40,100,'note 15'),
(36,16,4,40,100,'note 16'),
(37,17,4,40,100,'note 17'),
(38,18,4,40,100,'note 18'),
(39,19,4,40,100,'note 19'),
(40,20,4,40,100,'note 20');
-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int(8) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `User` VALUES
(1,'Raymond','student'),
(2,'Sam','student'),
(3,'Lachlan','student');
--
-- Indexes for dumped tables
--



--
-- Indexes for table `Paper`
--
ALTER TABLE `Paper`
  ADD PRIMARY KEY (`paper_id`),
  ADD KEY `fk_paper_user` (`user_id`);

--
-- Indexes for table `Question`
--
ALTER TABLE `Question`
  ADD PRIMARY KEY (`q_id`);

--
-- Indexes for table `Temp_Paper`
--
ALTER TABLE `Temp_Paper`
  ADD KEY `fk_temp_paper` (`paper_id`),
  ADD KEY `fk_cart_question` (`q_id`),
  ADD KEY `fk_cart_user` (`user_id`);

--
-- Indexes for table `Question_History`
--
ALTER TABLE `Question_History`
  ADD PRIMARY KEY (`history_key`),
  ADD KEY `fk_hist_question` (`q_id`),
  ADD KEY `fk_hist_paper` (`paper_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`user_id`);

--
-- Constraints for dumped tables
--

-- Add AUTO_INCREMENT
ALTER TABLE `Paper`
  MODIFY `paper_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `Question`
  MODIFY `q_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `Question_History`
  MODIFY `history_key` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

ALTER TABLE `User`
  MODIFY `user_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;




-- Constraints for table `Paper`
--
ALTER TABLE `Paper`
  ADD CONSTRAINT `fk_paper_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Temp_Paper`
--
ALTER TABLE `Temp_Paper`
  ADD CONSTRAINT `fk_temp_paper` FOREIGN KEY (`paper_id`) REFERENCES `Paper` (`paper_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_question` FOREIGN KEY (`q_id`) REFERENCES `Question` (`q_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Question_History`
--
ALTER TABLE `Question_History`
  ADD CONSTRAINT `fk_hist_paper` FOREIGN KEY (`paper_id`) REFERENCES `Paper` (`paper_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hist_question` FOREIGN KEY (`q_id`) REFERENCES `Question` (`q_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
