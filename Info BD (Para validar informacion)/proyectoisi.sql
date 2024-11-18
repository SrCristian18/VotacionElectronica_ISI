-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-12-2023 a las 01:18:48
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `proyectoisi`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `candidato`
--

CREATE TABLE `candidato` (
  `id_candidato` int(11) NOT NULL,
  `nombre` text DEFAULT NULL,
  `id_partido` int(11) DEFAULT NULL,
  `candidatura` int(11) NOT NULL,
  `foto` text DEFAULT NULL,
  `id_votacion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `candidato`
--

INSERT INTO `candidato` (`id_candidato`, `nombre`, `id_partido`, `candidatura`, `foto`, `id_votacion`) VALUES
(-1, 'Voto en blanco', -1, 0, 'candidatos/votoblanco.jpg', 13),
(-1, 'Voto en blanco', -1, 1, 'candidatos/votoblanco.jpg', 13),
(-1, 'Voto en blanco', -1, 2, 'candidatos/votoblanco.jpg', 13),
(152364, 'Juana de Arco', 3, 0, 'candidatos/152364.jfif', 13),
(436192, 'Martha', 1, 0, 'candidatos/436192.jfif', 13),
(4851236, 'Maria Fernanda Esalas', 6, 1, 'candidatos/4851236.jfif', 13),
(4851367, 'Lucia', 5, 0, 'candidatos/4851367.jfif', 13),
(4895213, 'Sonia ', 2, 0, 'candidatos/4895213.jfif', 13),
(42335167, 'Emma', 1, 2, 'candidatos/42335167.jfif', 13),
(48513259, 'Milena', 1, 1, 'candidatos/48513259.jfif', 13),
(489515327, 'Sofia', 8, 2, 'candidatos/489515327.jfif', 13);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `candidatura`
--

CREATE TABLE `candidatura` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `candidatura`
--

INSERT INTO `candidatura` (`id`, `nombre`) VALUES
(0, 'Alcalde'),
(1, 'Consejo'),
(2, 'Asamblea');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partido`
--

CREATE TABLE `partido` (
  `id_partido` int(11) NOT NULL,
  `nombre` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `partido`
--

INSERT INTO `partido` (`id_partido`, `nombre`) VALUES
(-1, 'blanco'),
(1, 'PARTIDO LIBERAL'),
(2, 'PARTIDO CONSERVADOR'),
(3, 'PARTIDO CAMBIO RADICAL'),
(4, 'PARTIDO ALIANZA VERDE'),
(5, 'PARTIDO DE LA U'),
(6, 'PARTIDO ASI'),
(7, 'PARTIDO MIRA'),
(8, 'PARTIDO CENTRO DEMOCRATICO'),
(9, 'PARTIDO INDEPENDIENTES'),
(10, 'PARTIDO POLO DEMOCRATICO'),
(13, 'Cruz verde'),
(17, 'Cruz verde'),
(18, 'Rojo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sufragante`
--

CREATE TABLE `sufragante` (
  `cedula` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `celular` varchar(11) NOT NULL,
  `contraseña` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `sufragante`
--

INSERT INTO `sufragante` (`cedula`, `nombre`, `celular`, `contraseña`) VALUES
(1346957, 'Tulio', '4815263927', 45367),
(7691423, 'Keyla', '2614358547', 43976),
(34216589, 'Mariano ', '3214659847', 54838),
(1043634932, 'Greison Rey Castilla Carmona', '3014298420', 18604);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votacion`
--

CREATE TABLE `votacion` (
  `id` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `fecha` date NOT NULL,
  `horainicio` time NOT NULL,
  `horafin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `votacion`
--

INSERT INTO `votacion` (`id`, `nombre`, `fecha`, `horainicio`, `horafin`) VALUES
(13, '2023', '2023-12-04', '08:00:00', '24:00:00');

--
-- Disparadores `votacion`
--
DELIMITER $$
CREATE TRIGGER `votoBlanco` AFTER INSERT ON `votacion` FOR EACH ROW BEGIN
    -- Insertar datos en la tabla_destino
    INSERT INTO candidato VALUES (-1,"Voto en blanco",-1,  0, "candidatos/votoblanco.jpg", (SELECT MAX(id) FROM votacion));
    INSERT INTO candidato VALUES (-1,"Voto en blanco",-1,  1, "candidatos/votoblanco.jpg", (SELECT MAX(id) FROM votacion));
    INSERT INTO candidato VALUES (-1,"Voto en blanco",-1,  2, "candidatos/votoblanco.jpg", (SELECT MAX(id) FROM votacion));
    
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votos`
--

CREATE TABLE `votos` (
  `id` int(11) NOT NULL,
  `voto` int(11) DEFAULT NULL,
  `candidatura` int(11) NOT NULL,
  `votacion` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `votos`
--

INSERT INTO `votos` (`id`, `voto`, `candidatura`, `votacion`, `fecha`) VALUES
(1346957, 4895213, 0, 13, '2023-12-05 18:58:00'),
(1346957, 4851236, 1, 13, '2023-12-05 18:58:00'),
(1346957, 42335167, 2, 13, '2023-12-05 18:58:00'),
(7691423, 436192, 0, 13, '2023-12-05 19:11:37'),
(7691423, 48513259, 1, 13, '2023-12-05 19:11:37'),
(7691423, 489515327, 2, 13, '2023-12-05 19:11:37'),
(34216589, 4895213, 0, 13, '2023-12-05 19:12:06'),
(34216589, -1, 1, 13, '2023-12-05 19:12:06'),
(34216589, 42335167, 2, 13, '2023-12-05 19:12:06'),
(1043634932, 152364, 0, 13, '2023-12-05 17:21:24'),
(1043634932, 4851236, 1, 13, '2023-12-05 17:21:24'),
(1043634932, -1, 2, 13, '2023-12-05 17:21:24');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `candidato`
--
ALTER TABLE `candidato`
  ADD PRIMARY KEY (`id_candidato`,`candidatura`,`id_votacion`),
  ADD KEY `id_partido` (`id_partido`),
  ADD KEY `candidatura` (`candidatura`),
  ADD KEY `id_votacion` (`id_votacion`);

--
-- Indices de la tabla `candidatura`
--
ALTER TABLE `candidatura`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `partido`
--
ALTER TABLE `partido`
  ADD PRIMARY KEY (`id_partido`),
  ADD KEY `nombre_partido` (`nombre`(768));

--
-- Indices de la tabla `sufragante`
--
ALTER TABLE `sufragante`
  ADD PRIMARY KEY (`cedula`),
  ADD UNIQUE KEY `celular` (`celular`),
  ADD KEY `nombre` (`nombre`(768));

--
-- Indices de la tabla `votacion`
--
ALTER TABLE `votacion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `votos`
--
ALTER TABLE `votos`
  ADD PRIMARY KEY (`id`,`votacion`,`candidatura`),
  ADD KEY `candidatura` (`candidatura`),
  ADD KEY `votacion` (`votacion`),
  ADD KEY `voto` (`voto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `partido`
--
ALTER TABLE `partido`
  MODIFY `id_partido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `votacion`
--
ALTER TABLE `votacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `candidato`
--
ALTER TABLE `candidato`
  ADD CONSTRAINT `candidato_ibfk_1` FOREIGN KEY (`id_partido`) REFERENCES `partido` (`id_partido`),
  ADD CONSTRAINT `candidato_ibfk_2` FOREIGN KEY (`candidatura`) REFERENCES `candidatura` (`id`),
  ADD CONSTRAINT `candidato_ibfk_3` FOREIGN KEY (`id_votacion`) REFERENCES `votacion` (`id`);

--
-- Filtros para la tabla `votos`
--
ALTER TABLE `votos`
  ADD CONSTRAINT `votos_ibfk_1` FOREIGN KEY (`candidatura`) REFERENCES `candidatura` (`id`),
  ADD CONSTRAINT `votos_ibfk_2` FOREIGN KEY (`votacion`) REFERENCES `votacion` (`id`),
  ADD CONSTRAINT `votos_ibfk_3` FOREIGN KEY (`voto`) REFERENCES `candidato` (`id_candidato`),
  ADD CONSTRAINT `votos_ibfk_4` FOREIGN KEY (`id`) REFERENCES `sufragante` (`cedula`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
