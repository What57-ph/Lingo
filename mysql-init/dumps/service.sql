-- MySQL dump 10.13  Distrib 8.0.20, for Linux (x86_64)
--
-- Host: localhost    Database: attemptservice
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attempt_section_results`
--

DROP TABLE IF EXISTS `attempt_section_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attempt_section_results` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `correct_answers` int DEFAULT NULL,
  `max_possible_score` double DEFAULT NULL,
  `section_score` double DEFAULT NULL,
  `total_questions` int DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempt_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1m5v43s3p163xjeowkk0c3dm3` (`attempt_id`),
  CONSTRAINT `FK1m5v43s3p163xjeowkk0c3dm3` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`attempt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attempt_section_results`
--

LOCK TABLES `attempt_section_results` WRITE;
/*!40000 ALTER TABLE `attempt_section_results` DISABLE KEYS */;
INSERT INTO `attempt_section_results` VALUES (1,0,9,0,40,'Reading',1),(2,0,9,0,40,'Reading',2),(3,0,9,0,40,'Reading',3),(4,0,9,0,40,'Reading',4),(5,0,9,0,40,'Reading',5),(6,0,9,0,40,'Reading',6);
/*!40000 ALTER TABLE `attempt_section_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attempts`
--

DROP TABLE IF EXISTS `attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attempts` (
  `attempt_id` bigint NOT NULL AUTO_INCREMENT,
  `quiz_id` bigint DEFAULT NULL,
  `score` bigint DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `time_taken` bigint DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`attempt_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attempts`
--

LOCK TABLES `attempts` WRITE;
/*!40000 ALTER TABLE `attempts` DISABLE KEYS */;
INSERT INTO `attempts` VALUES (1,1,0,'2025-11-06 09:27:58.222000',3600,'IELTS','f2b1f962-805f-489d-8450-708170a1ed7a'),(2,1,0,'2025-11-06 09:35:37.303000',3600,'IELTS','f2b1f962-805f-489d-8450-708170a1ed7a'),(3,1,0,'2025-11-06 09:46:35.251000',3600,'IELTS','f2b1f962-805f-489d-8450-708170a1ed7a'),(4,1,0,'2025-11-06 09:58:17.302000',3600,'IELTS','f2b1f962-805f-489d-8450-708170a1ed7a'),(5,1,0,'2025-11-06 10:00:29.588000',3600,'IELTS','f2b1f962-805f-489d-8450-708170a1ed7a'),(6,1,0,'2025-11-06 10:03:04.295000',3600,'IELTS','f2b1f962-805f-489d-8450-708170a1ed7a');
/*!40000 ALTER TABLE `attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_answers`
--

DROP TABLE IF EXISTS `user_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `correct` bit(1) NOT NULL,
  `correct_answer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `question_id` bigint DEFAULT NULL,
  `user_answer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `attempt_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKihhi8di3m8mdjksjy31dd48gt` (`attempt_id`),
  CONSTRAINT `FKihhi8di3m8mdjksjy31dd48gt` FOREIGN KEY (`attempt_id`) REFERENCES `attempts` (`attempt_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_answers`
--

LOCK TABLES `user_answers` WRITE;
/*!40000 ALTER TABLE `user_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_answers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-06 10:15:58
