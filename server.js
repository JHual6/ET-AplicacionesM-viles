require('dotenv').config({ path: 'server.env' });

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const moment = require('moment');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:;"
  );
  next();
});

// Configuración de la base de datos
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  
});

// Probar conexión con la base de datos
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
  } else {
    console.log('Conectado a la base de datos');
    connection.release();
  }
});

// Endpoints

// Obtener todas las asignaturas
app.get('/asignaturas', (req, res) => {
  db.query('SELECT * FROM asignatura', (err, results) => {
    if (err) {
      console.error('Error al obtener asignaturas:', err); // Log de error para depuración
      return res.status(500).send({ error: 'Error al obtener asignaturas' });
    }
    res.json(results);
  });
});

// Obtener todas las clases
app.get('/clases', (req, res) => {
  db.query('SELECT * FROM clases', (err, results) => {
    if (err) {
      console.error('Error al obtener clases:', err);
      return res.status(500).send({ error: 'Error al obtener clases' });
    }
    res.json(results);
  });
});

// Obtener clases por asignatura
app.get('/clases/asignatura/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'El parámetro ID es requerido' });
  }

  db.query('SELECT * FROM clases WHERE id_asignatura = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'No se encontraron clases para la asignatura especificada' });
    }

    res.json(results);
  });
});

// Obtener asignaturas por profesor
app.get('/asignaturas/profesor/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM asignatura WHERE id_profesor = ?', [id], (err, results) => {
    if (err) {
      console.error('Error al obtener asignaturas por profesor:', err);
      return res.status(500).send({ error: 'Error al obtener asignaturas por profesor' });
    }
    res.json(results);
  });
});

// Obtener asignatura por id de la asignatura y usuario del estudiante
app.get('/asignatura/:id_asignatura/:usuario_estudiante', (req, res) => {
  const { id_asignatura, usuario_estudiante } = req.params;

  if (!usuario_estudiante || !id_asignatura) {
    return res.status(400).send('Faltan parámetros requeridos.');
  }

  const query = `
SELECT 
    estudiantes.usuario_estudiante,
    asignatura.id_asignatura, 
    asignatura.nombre_asignatura, 
    asignatura.color_asignatura, 
    asignatura.color_seccion_asignatura, 
    asignatura.siglas_asignatura, 
    asignatura.seccion_asignatura,
    asignatura.modalidad_asignatura,
    COUNT(CASE WHEN asistencia.asistencia = 1 THEN 1 END) AS count_asistencias,
    COUNT(asistencia.asistencia) AS count_total_asistencias
    FROM asignatura 
    INNER JOIN clases ON clases.id_asignatura = asignatura.id_asignatura
    INNER JOIN asistencia ON asistencia.id_clase = clases.id_clase
    INNER JOIN estudiantes ON estudiantes.id_estudiante = asistencia.id_estudiante 
    WHERE estudiantes.usuario_estudiante = ? 
    AND asignatura.id_asignatura = ?
    GROUP BY asignatura.id_asignatura;
  `;

  db.query(query, [usuario_estudiante, id_asignatura], (err, results) => {
    if (err) {
      console.error('Error ejecutando la consulta:', err);
      return res.status(500).send('Error en el servidor.');
    }

    res.status(200).json(results);
  });
});


// Ruta para obtener asignaturas por nombre de estudiante
app.get('/asignaturas/estudiante/:usuario', (req, res) => {
  const { usuario } = req.params; 
  const query = `
SELECT 
	  estudiantes.usuario_estudiante,
    asignatura.id_asignatura, 
    asignatura.nombre_asignatura, 
    asignatura.color_asignatura, 
    asignatura.color_seccion_asignatura, 
    asignatura.siglas_asignatura, 
    asignatura.seccion_asignatura,
    asignatura.modalidad_asignatura,
    COUNT(CASE WHEN asistencia.asistencia = 1 THEN 1 END) AS count_asistencias,
	  COUNT(asistencia.asistencia) AS count_total_asistencias,
    (COUNT(CASE WHEN asistencia.asistencia = 1 THEN 1 END))/(COUNT(asistencia.asistencia))*100 AS porcentaje_asistencia
    FROM asignatura 
    INNER JOIN clases ON clases.id_asignatura = asignatura.id_asignatura
    INNER JOIN asistencia ON asistencia.id_clase = clases.id_clase
    INNER JOIN estudiantes ON estudiantes.id_estudiante = asistencia.id_estudiante 
    WHERE estudiantes.usuario_estudiante = ?
    GROUP BY asignatura.id_asignatura;
  `;

  db.query(query, [usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener asignaturas por nombre de estudiante:', err);
      return res.status(500).send({ error: 'Error al obtener asignaturas por estudiante' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'No se encontraron asignaturas para el estudiante proporcionado.' });
    }

    res.json(results); 
  });
});


// Obtener estudiantes
app.get('/estudiantes', (req, res) => {
  db.query('SELECT * FROM estudiantes', (err, results) => {
    if (err) {
      console.error('Error al obtener estudiantes:', err);
      return res.status(500).send({ error: 'Error al obtener estudiantes' });
    }
    res.json(results);
  });
});

// Obtener profesores
app.get('/profesores', (req, res) => {
  db.query('SELECT * FROM profesores', (err, results) => {
    if (err) {
      console.error('Error al obtener profesores:', err);
      return res.status(500).send({ error: 'Error al obtener profesores' });
    }
    res.json(results);
  });
});

// Obtener detalle de asistencia por estudiante y clase
app.get('/asistencia/:id_estudiante/:id_clase', (req, res) => {
  const { id_estudiante, id_clase } = req.params;

  db.query(
    'SELECT * FROM asistencia WHERE id_estudiante = ? AND id_clase = ?',
    [id_estudiante, id_clase],
    (err, results) => {
      if (err) {
        console.error('Error al obtener detalle de asistencia:', err);
        return res.status(500).send({ error: 'Error al obtener detalle de asistencia' });
      }
      res.json(results);
    }
  );
});

// Obtener detalle de asistencia por estudiante
app.get('/asistencia/estudiante/:usuario', (req, res) => {
    const { usuario } = req.params;
    console.log("Usuario recibido:", usuario);  
  
    db.query(
      `SELECT * FROM asistencia 
       INNER JOIN estudiantes ON estudiantes.id_estudiante = asistencia.id_estudiante 
       WHERE estudiantes.usuario_estudiante = ?`, 
       [usuario], 
       (err, results) => {
        if (err) {
          console.error('Error al obtener asistencia por estudiante:', err);
          return res.status(500).send({ error: 'Error al obtener asistencia por estudiante' });
        }
        if (results.length === 0) {
          return res.status(404).send({ message: 'No se encontró asistencia para este estudiante' });
        }
        res.json(results);  
      }
    );
});

// Obtener profesor por usuario
app.get('/profesores/usuario/:usuario', (req, res) => {
  const { usuario } = req.params;
  db.query('SELECT * FROM profesores WHERE usuario_profesor = ?', [usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener profesor por usuario:', err);
      return res.status(500).send({ error: 'Error al obtener profesor por usuario' });
    }
    res.json(results);
  });
});

// Obtener estudiante por usuario
app.get('/estudiantes/usuario/:usuario', (req, res) => {
  const { usuario } = req.params;
  db.query('SELECT * FROM estudiantes WHERE usuario_estudiante = ?', [usuario], (err, results) => {
    if (err) {
      console.error('Error al obtener estudiante por usuario:', err);
      return res.status(500).send({ error: 'Error al obtener estudiante por usuario' });
    }
    res.json(results);
  });
});

// Relación de asignaturas, clases y asistencia
app.get('/asignatura-clases-asistencia', (req, res) => {
  const { idProfesor, idAsignatura } = req.query;

  if (!idProfesor || !idAsignatura) {
    return res.status(400).json({ error: 'Los parámetros idProfesor e idAsignatura son requeridos' });
  }

  const query = `SELECT asignatura.*, clases.*, asistencia.* 
                 FROM asignatura 
                 JOIN clases ON asignatura.id_asignatura = clases.id_asignatura 
                 JOIN asistencia ON clases.id_clase = asistencia.id_clase 
                 WHERE asignatura.id_profesor = ? AND asignatura.id_asignatura = ?`;

  db.query(query, [idProfesor, idAsignatura], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).send({ error: 'Error al obtener datos' });
    }
    res.json(results);
  });
});

// Obtener todos los datos de asignaturas
app.get('/asignaturas', (req, res) => {
    db.query('SELECT * FROM asignaturas', (err, results) => {
        if (err) {
            console.error('Error al obtener asignaturas:', err);
            return res.status(500).send({ error: 'Error al obtener asignaturas' });
        }
        if (results.length === 0) {
            return res.status(404).send({ message: 'No se encontraron asignaturas' });
        }
        res.json(results);  
    });
});

// Obtener asignaturas por usuario del profesor
app.get('/asignaturas/profesor/usuario/:usuario', (req, res) => {
    const { usuario } = req.params;
    console.log('Usuario recibido:', usuario); 
  
    const query = `
      SELECT * 
      FROM asignatura a 
      INNER JOIN profesores p 
      ON a.id_profesor = p.id_profesor
      WHERE p.usuario_profesor = ?`;
  
    db.query(query, [usuario], (err, results) => {
      if (err) {
        console.error('Error al obtener asignaturas por usuario del profesor:', err);
        return res.status(500).send({ error: 'Error al obtener asignaturas por usuario del profesor' });
      }
  
      console.log('Resultados de la consulta:', results); 
      res.json(results);
  });
});
  
// Obtener asignatura por ID de la asignatura
app.get('/asignatura/:id', (req, res) => {
    const { id } = req.params;
  
    if (!id) {
      return res.status(400).json({ error: 'El parámetro ID es requerido' });
    }
  
    db.query('SELECT * FROM asignatura WHERE id_asignatura = ?', [id], (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        return res.status(500).json({ error: 'Error interno del servidor' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'No se encontró asignatura con el ID proporcionado' });
      }
  
      res.json(results[0]); // Devuelve la información de la asignatura
  });
}); 
app.post('/insertClase', (req, res) => {
    const { id_asignatura, fecha_clase, codigoqr_clase } = req.body;
  const query = `
    INSERT INTO clases (id_asignatura, fecha_clase, codigoqr_clase)
    VALUES (?, ?, ?)
  `;
  db.query(query, [id_asignatura, fecha_clase, codigoqr_clase], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al insertar la clase' });
    }
    res.status(200).json({ message: 'Clase insertada correctamente', id_clase: result.insertId });
  });
});

// Nueva ruta para obtener los datos con la consulta solicitada
app.get('/asignaturas/:id_asignatura/estudiantes', (req, res) => {
  const idAsignatura = req.params.id_asignatura;

  const query = `
    SELECT *
    FROM asignatura
    INNER JOIN clases ON asignatura.id_asignatura = clases.id_asignatura
    INNER JOIN asistencia ON clases.id_clase = asistencia.id_clase
    INNER JOIN estudiantes ON estudiantes.id_estudiante = asistencia.id_estudiante
    WHERE asignatura.id_asignatura = ?
    GROUP BY estudiantes.id_estudiante
  `;

  db.query(query, [idAsignatura], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    } else {
      res.status(200).json(results);
    }
  });
});
  // Ruta para insertar datos en la tabla 'asistencia'
app.post('/insert/asistencia', (req, res) => {
  const { id_clase, id_estudiante, asistencia, fecha_asistencia } = req.body;

  const query = `
    INSERT INTO asistencia (id_clase, id_estudiante, asistencia, fecha_asistencia)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [id_clase, id_estudiante, asistencia, fecha_asistencia], (err, result) => {
    if (err) {
      console.error('Error al insertar en asistencia:', err);
      res.status(500).json({ error: 'Error al insertar los datos en asistencia' });
    } else {
      res.status(201).json({ message: 'Datos insertados correctamente', id_asistencia: result.insertId });
    }
  });
});

// Endpoint para insertar una asignatura
app.post('/insertAsignatura', (req, res) => {
  const { id_profesor, nombre_asignatura, siglas_asignatura, color_asignatura, color_seccion_asignatura, seccion_asignatura, modalidad_asignatura } = req.body;
  
  const query = `
    INSERT INTO asignatura (id_profesor, nombre_asignatura, siglas_asignatura, color_asignatura, 
                            color_seccion_asignatura, seccion_asignatura, modalidad_asignatura)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, 
    [id_profesor, nombre_asignatura, siglas_asignatura, color_asignatura, color_seccion_asignatura, seccion_asignatura, modalidad_asignatura], 
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al insertar la asignatura' });
      }
      res.status(200).json({ 
        message: 'Asignatura insertada correctamente', 
        id_asignatura: result.insertId 
      });
  });
});













// Ruta para obtener clases por fecha
app.get('/clases/fecha/:fecha', (req, res) => {
  const fechaClase = req.params.fecha;

  // Verificar el formato de la fecha usando moment.js
  if (!moment(fechaClase, 'YYYY-MM-DD', true).isValid()) {
    return res.status(400).json({ error: 'Formato de fecha inválido. Use YYYY-MM-DD.' });
  }

  // Si el formato es válido, convertir la fecha a un objeto Date usando moment.js
  const fechaObj = moment(fechaClase).toDate();

  // Consulta para seleccionar solo id_clase, id_asignatura y fecha_clase
  const query = 'SELECT id_clase, id_asignatura, fecha_clase FROM clases WHERE fecha_clase = ?';

  connection.query(query, [fechaObj], (err, results) => {
    if (err) {
      console.error('Error en la consulta SQL:', err.sqlMessage || err);
      res.status(500).json({
        error: 'Error al obtener clases por fecha',
        detalles: err.sqlMessage || err,
      });
      return;
    }

    console.log('Resultados obtenidos:', results);
    res.json(results); // Enviar solo las columnas seleccionadas
  });
});