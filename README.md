PROYECTO ABP7 – NODE, EXPRESS Y POSTGRESQL
Descripción del proyecto
Este proyecto consiste en una API para gestionar usuarios. Incluye operaciones CRUD completas, consultas SQL parametrizadas, transacciones y el uso de Sequelize como ORM.
Se conservaron las rutas originales que utilizan “users” y también se incorporaron las rutas solicitadas con el nombre “usuarios”.

INSTALACIÓN
1. Ejecutar el archivo database/db.sql en PostgreSQL utilizando la base de datos base_de_datos_usuarios.
2. Copiar el archivo .env.example y renombrarlo como .env. Luego, completar las credenciales correspondientes a la base de datos local.
3. Instalar las dependencias del proyecto ejecutando npm install.
4. Iniciar el servidor utilizando npm run dev o npm start.

PRUEBAS CON POSTMAN
Para realizar las pruebas, se debe importar en Postman el archivo ABP7.postman_collection.json, ubicado dentro de la carpeta postman.
La colección contiene once solicitudes y quince validaciones automáticas. Debe ejecutarse respetando el orden establecido y con el servidor activo en la dirección http://localhost:5000.

RUTAS DISPONIBLES
GET /usuarios
Permite obtener la lista de usuarios registrados. También admite filtrado y paginación mediante parámetros como nombre, página y límite.
Ejemplo:
http://localhost:5000/usuarios?name=Rojas&page=1&limit=20
GET /usuarios/:id
Permite obtener la información de un usuario mediante su identificador.
POST /usuarios
Permite registrar un nuevo usuario indicando su nombre y correo electrónico.
PUT /usuarios/:id
Permite actualizar el nombre, el correo electrónico o ambos datos de un usuario existente.
DELETE /usuarios/:id
Permite eliminar un usuario. Antes de realizar la eliminación, el sistema verifica que el identificador exista.
POST /usuarios/transaccion
Permite crear un usuario junto con su historial mediante una transacción. Si alguna de las operaciones falla, todos los cambios son revertidos automáticamente.
GET /usuarios/orm
Permite obtener la lista de usuarios utilizando Sequelize.
GET /usuarios/comparacion
Permite comparar los resultados obtenidos mediante una consulta SQL tradicional con los resultados entregados por Sequelize.
POST /usuarios/:id/pedidos
Permite crear un pedido asociado a un usuario existente.
GET /usuarios/:id/pedidos
Permite obtener la información de un usuario junto con todos sus pedidos relacionados. Para esto se utiliza la opción include de Sequelize.

DEMOSTRACIÓN DE ROLLBACK
Para demostrar el funcionamiento del rollback, se debe realizar una solicitud POST a la ruta:
http://localhost:5000/usuarios/transaccion
La solicitud debe contener los siguientes datos:
Nombre: Valentina Silva
Correo electrónico: rollback.demo@gmail.com
Forzar error: verdadero
