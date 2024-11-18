const express = require("express");
const mysql = require("mysql");
const app = express();
const multer = require("multer");
const path = require('path');
const fs = require("node:fs");
const { error } = require("console");
const pdf = require("jspdf");

const upload = multer({
    dest: "uploads/"
})

let conexion = mysql.createConnection({
    host: "localhost",
    database: "proyectoisi",
    user: "root",
    password: ""
});

function getFileExtension1(filename) {
    return (/[.]/.exec(filename)) ? /[^.]+$/.exec(filename)[0] : undefined;
}

function saveImage(file, nombre) {
    let ext = getFileExtension1(file.originalname);
    const newpath = `./uploads/${nombre}.${ext}`;
    fs.renameSync(file.path, newpath);
    return `${nombre}.${ext}`;
}

function renderAdmin(req, res, noti = "") {
    let qpartidos = "SELECT * FROM partido where id_partido > 0";
    let qcandidatura = "SELECT * FROM candidatura";
    let qvotacion = "SELECT * FROM votacion WHERE fecha > CURRENT_DATE;"
    conexion.query(qpartidos, (error, result) => {
        if (error) {
            throw error;
        } else {
            conexion.query(qcandidatura, (err, q) => {
                if (err) {
                    throw err;
                } else {
                    conexion.query(qvotacion, (er, v) => {
                        if (er) {
                            throw er
                        } else {
                            res.render("admin", {
                                partido: result, candidatura: q, mensaje: noti,
                                votacion: v
                            });
                        }
                    });

                }
            });
        }
    });
}

function renderIndex(req, res, noti = "") {
    let qfecha = "SELECT * FROM votacion WHERE fecha = CURRENT_DATE AND horafin > CURRENT_TIME;";
    let qhora = "SELECT TIMEDIFF(horafin,CURRENT_TIME) AS tiempo FROM votacion WHERE fecha = CURRENT_DATE";

    conexion.query(qfecha, (error, result) => {
        if (error) {
            throw error;
        } else {
            conexion.query(qhora, (error, resul2) => {
                if (error) {
                    throw error;
                } else {
                    res.render("index", { tiempo: result, real: resul2, mensaje: noti });
                }
            });
        }
    });
}

function renderVotar(req, res, votante) {
    let candidatos = `SELECT * FROM candidato WHERE id_votacion = (SELECT id FROM votacion WHERE fecha = CURRENT_DATE) order by id_partido;`
    let candidaturas = `SELECT * FROM candidatura`;
    let partido = `SELECT * FROM partido`;

    conexion.query(candidatos, (error, result) => {
        if (error) {
            throw error;
        } else {
            conexion.query(candidaturas, (err, resu) => {
                if (err) {
                    throw err;
                } else {
                    conexion.query(partido, (er, re)=>{
                        if(er){
                            throw er;
                        }else{
                            res.render("votar", { candidatos: result, can: resu, votante: votante, partido:re});
                        }
                    });
                }
            });

        }
    });
}

function renderVerResultados(req, res) {
    let qcandidatura = `select * from candidatura`;

    let qvotos = `SELECT v.voto, v.candidatura, v.votacion, COUNT(v.candidatura) as nVotos, 
    (SELECT nombre FROM candidato WHERE id_candidato = v.voto GROUP BY id) as nombre FROM votos AS 
    v GROUP BY v.candidatura, v.voto, v.votacion ORDER BY nVotos desc;`;

    let qvotacion = `SELECT * FROM votacion WHERE (horafin < CURRENT_TIME and fecha<=CURRENT_DATE) OR fecha < CURRENT_DATE`;

    conexion.query(qcandidatura, (error, result) => {
        if (error) {
            throw error;
        } else {
            if (result.length > 0) {
                conexion.query(qvotos, (err, resu) => {
                    if (err) {
                        throw err;
                    } else {
                        if (resu.length > 0) {
                            conexion.query(qvotacion, (er, resul) => {
                                if (er) {
                                    throw er;
                                } else {
                                    if (resul.length > 0) {
                                        res.render("verResultados", { votacion: resul, candidatura: result, votos: resu });
                                    } else {
                                        renderIndex(req, res, "No hay votaciones registradas");
                                    }
                                }
                            });
                        } else {
                            renderIndex(req, res, "No hay votos registrados");
                        }
                    }
                });
            } else {
                renderIndex(req, res, "No hay candidaturas");
            }
        }
    });
}

function Gpdf(votante, votacion){
    let doc = new pdf.jsPDF();

    doc.setFontSize(22);
    doc.text(20, 20, `Votacion: ${votacion[0].nombre}`);

    doc.setFontSize(16);
    doc.text(20, 30, `Se certifica que el señor/a ${votante[0].nombre}, con numero` );
    doc.text(20, 36, `de documento ${votante[0].cedula} cc participo en las votaciones realizadas`);
    doc.text(20, 42, `el dia ${votacion[0].fecha.toLocaleDateString()}`);
    doc.text(20, 60, `Firma:________________________`)

    doc.save(`./uploads/${votante[0].cedula}.pdf`);
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
    renderIndex(req, res, "");
});

app.get("/admin", function (req, res) {
    renderAdmin(req, res, "");
});

app.get("/verResultados", function (req, res) {
    renderVerResultados(req, res);
});

app.post("/certificado", function (req, res) {
    let datos = req.body;
    let id = datos.id;
    let votacion = datos.votacion;

    console.log(datos);

    let qid = `select * from sufragante where cedula = ${id}`;
    let qvotacion = `select * from votacion where id = ${votacion}`;

    conexion.query(qid, (err, result) => {
        if (err) {
            throw err;
        } else {
            conexion.query(qvotacion, (er, resu) => {
                if (er) {
                    throw er;
                } else {
                    Gpdf(result, resu);
                    console.log(id);
                }

            });
        }
    });
    res.download(`./uploads/${id}.pdf`, (err) => {
        console.error("Error al descargar el archivo", err);
    });
});

app.post("/inicio", function (req, res) {

    let datos = req.body;
    let id = datos.id;
    let codigoV = datos.codigoV;
    let eleccion = datos.eleccion;
    let qsufragante = `select * from sufragante where cedula = ${id} `;
    let qvoto = `SELECT * FROM votos WHERE id = ${id} AND votacion = (SELECT id FROM votacion WHERE fecha = CURRENT_DATE)`;
    let qvotacion = `SELECT v.votacion, (SELECT nombre FROM votacion WHERE id = v.votacion) as nombre FROM votos as v WHERE id = ${id} GROUP BY votacion`;

    conexion.query(qsufragante, (err, result) => {
        if (err) {
            throw err;
        } else {
            if (result.length > 0) {
                if (result[0].contraseña == codigoV) {
                    if (eleccion == 0) {
                        conexion.query(qvoto, (error, resu) => {
                            if (error) {
                                throw error;
                            } else {
                                if (resu.length > 0) {
                                    renderIndex(req, res, "Usted ya ha votado");
                                } else {
                                    renderVotar(req, res, result);
                                }
                            }
                        });
                    } else {
                        conexion.query(qvotacion, (e, r) => {
                            if (e) {
                                throw e;
                            } else {
                                console.log(r);
                                res.render("generarCertificado", { votante: result, votacion: r });
                            }
                        })

                    }
                } else {
                    renderIndex(req, res, "Contraseña incorrecta");
                }
            } else {
                renderIndex(req, res, "Este sufragante no se encuentra registrado");
            }
        }
    });
});

app.post("/votar", function (req, res) {
    let datos = req.body;
    let id = datos.id;

    let voto = [datos.Alcalde, datos.Consejo, datos.Asamblea];

    console.log(voto);

    let qvotacion = "SELECT * FROM votacion WHERE fecha = CURRENT_DATE;";
    let con = 0;

    conexion.query(qvotacion, (err, result) => {
        if (err) {
            throw err;
        } else {
            for (let x = 0; x < 3; x++) {
                let q = `insert into votos values (${id}, ${voto[x]},${x}, ${result[0].id}, CURRENT_TIMESTAMP)`;

                conexion.query(q, (error, r) => {
                    if (error) {
                        throw error;
                    } else {
                        con++;
                    }
                });
            }
            renderIndex(req, res, "Su voto fue recibido correctamente");
        }
    });

});

app.post("/registrarC", upload.single('foto'), function (req, res) {
    const datos = req.body;
    let nombre = datos.nombre;
    let cedula = datos.cedula;
    let partido = datos.partidos;
    let candidatura = datos.candidatura;
    let votacion = datos.votacion;

    let foto = req.file;
    let ruta = saveImage(foto, "candidatos/" + cedula);

    let verificar = `select id_candidato from candidato where id_candidato = ${cedula} and id_votacion = ${votacion}`;

    conexion.query(verificar, function (error, row) {
        if (error) {
            throw error;
        } else {

            if (row.length > 0) {
                renderAdmin(req, res, "Esta cedula ya fue registrada");
            } else {
                let registrar = `insert into candidato values(${cedula}, "${nombre}", ${partido}, ${candidatura}, "${ruta}", ${votacion});`;
                conexion.query(registrar, function (error2) {
                    if (error2) {
                        throw error2;
                    } else {
                        renderAdmin(req, res, "registro exitoso");
                    }
                });
            }

        }

    });

});

app.post("/registrarS", function (req, res) {
    const datos = req.body;
    let nombre = datos.nombre;
    let cedula = datos.cedula;
    let celular = datos.celular;

    let verificar = `select cedula from sufragante where cedula = ${cedula}`;
    let verificarC = `SELECT celular FROM sufragante WHERE celular ="${celular}"`;

    conexion.query(verificar, function (error, row) {
        if (error) {
            throw error;
        } else {

            if (row.length > 0) {
                renderAdmin(req, res, "Este sufragante ya fue registrado previamente");
            } else {
                conexion.query(verificarC, function (error2, row2) {
                    if (error2) {
                        throw error2;
                    } else {
                        if (row2.length > 0) {
                            renderAdmin(req, res, "Este celular ya fue registrado previamente");
                        } else {
                            let registrar = `insert into sufragante values(${cedula}, "${nombre}", "${celular}", ROUND(RAND() * 89999 + 10000, 0));`;
                            conexion.query(registrar, function (error3) {
                                if (error3) {
                                    throw error3;
                                } else {
                                    renderAdmin(req, res, "Registro exitoso");
                                }
                            });
                        }
                    }
                });
            }
        }
    });

});

app.post("/registrarP", function (req, res) {
    const datos = req.body;
    let partido = datos.nombre;
    console.log(datos);
    let query = `insert INTO partido VALUES(null, "${partido}")`;

    conexion.query(query, function (err, row) {
        if (err) {
            throw err;
        } else {
            renderAdmin(req, res, "Se ha registrado el partido correctamente");
        }
    })
})

app.post("/registrarV", function (req, res) {
    const datos = req.body;
    let nombre = datos.nombre;
    let fecha = datos.fecha;
    let horaI = datos.inicio;
    let horaF = datos.fin;

    let query = `INSERT INTO votacion VALUES(null, "${nombre}", cast("${fecha}" AS date), 
        cast("${horaI}" AS time),cast("${horaF}" AS time))`;

    let verificar = `select * from votacion where fecha = cast("${fecha}" as date)`;
    conexion.query(verificar, function (err, result) {
        if (err) {

        } else {
            if (result.length > 0) {
                renderAdmin(req, res, "La fecha indicada ya tiene una votacion establecida");
            } else {
                conexion.query(query, function (err, row) {
                    if (err) {
                        throw err;
                    } else {
                        renderAdmin(req, res, "Se ha registrado la votacion correctamente");
                    }
                });
            }
        }

    });

});

app.use(express.static("public"));

app.listen(3000, function () {
    console.log("el servidor es http://localhost:3000");
});