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
CREATE DATABASE `CITS3200_2`;


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `CITS3200`
--

-- --------------------------------------------------------

--
-- Table structure for table `Cart_Record`
--

CREATE TABLE `Cart_Record` (
  `cr_id` int(8) NOT NULL,
  `exam_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Paper`
--

CREATE TABLE `Paper` (
  `paper_id` int(8) NOT NULL,
  `user_id` int(8) NOT NULL,
  `institution` varchar(100) NOT NULL,
  `unit` varchar(20) NOT NULL,
  `assessment` varchar(50) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

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
  `update_date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Question_Cart`
--

CREATE TABLE `Question_Cart` (
  `cr_id` int(8) NOT NULL,
  `q_id` int(8) NOT NULL,
  `user_id` int(8) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `Question_History`
--

CREATE TABLE `Question_History` (
  `history_key` int(8) NOT NULL,
  `q_id` int(8) NOT NULL,
  `paper_id` int(8) NOT NULL,
  `correct` int(5) DEFAULT NULL,
  `total_student` int(5) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `user_id` int(8) NOT NULL,
  `user_name` varchar(50) NOT NULL,
  `user_type` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Cart_Record`
--
ALTER TABLE `Cart_Record`
  ADD PRIMARY KEY (`cr_id`);

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
-- Indexes for table `Question_Cart`
--
ALTER TABLE `Question_Cart`
  ADD KEY `fk_cart_record` (`cr_id`),
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

ALTER TABLE `Cart_Record`
  MODIFY `cr_id` int(8) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

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
-- Constraints for table `Question_Cart`
--
ALTER TABLE `Question_Cart`
  ADD CONSTRAINT `fk_cart_question` FOREIGN KEY (`q_id`) REFERENCES `Question` (`q_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_record` FOREIGN KEY (`cr_id`) REFERENCES `Cart_Record` (`cr_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Question_History`
--
ALTER TABLE `Question_History`
  ADD CONSTRAINT `fk_hist_paper` FOREIGN KEY (`paper_id`) REFERENCES `Paper` (`paper_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_hist_question` FOREIGN KEY (`q_id`) REFERENCES `Question` (`q_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;
