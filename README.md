# Configuración del archivo .env.example

El archivo .env.example es una plantilla que indica qué datos necesita el proyecto para conectarse a la base de datos.

## ¿Qué hay que hacer?

En la carpeta principal del proyecto, buscá el archivo .env.example.

Creá una copia y llamala .env (quitando .example).

Abrí el archivo .env y completá los datos de conexión.

La configuración debería quedar así:

```bash
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=sistema_gym
DB_USER=postgres
DB_PASSWORD=tu_contraseña
```

DB_HOST: se deja como localhost.

DB_PORT: normalmente es 5432 o 5433. Si PostgreSQL está configurado con otro puerto, hay que colocar ese.

DB_NAME: nombre de la base de datos que creaste para el proyecto.En nuestro caso se llama => sistema_gym.

DB_USER: es el usuario de PostgreSQL que puede ser => postgres.

DB_PASSWORD: reemplazá tu_contraseña por la contraseña que configuraste al instalar PostgreSQL.

**Importante:** no cambies los nombres de las variables, solo sus valores si es necesario.

# SistemaGYM — Guía de instalación y ejecución

Esta guía explica cómo preparar el entorno de desarrollo de SistemaGYM desde cero, crear la base de datos, cargar datos ficticios e iniciar la aplicación.

Está pensada para Windows y contempla PostgreSQL, Node.js, Express y el frontend web.

## 1. Requisitos previos

Antes de ejecutar el proyecto, es necesario instalar:

- PostgreSQL: sistema gestor de bases de datos.
- pgAdmin 4: herramienta gráfica para administrar PostgreSQL. Normalmente puede instalarse junto con PostgreSQL.
- Node.js: entorno necesario para ejecutar el backend.
- Un editor de código, como Visual Studio Code.
- Git, si se va a descargar el proyecto desde GitHub.

## 2. Instalar PostgreSQL

### Paso 1. Descargar PostgreSQL

Ingresar al sitio oficial:

[https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)

Seguir las instrucciones de descarga e instalación para Windows.

### Paso 2. Ejecutar el instalador

Durante la instalación:

1. Seleccionar los componentes necesarios, incluyendo PostgreSQL Server y pgAdmin 4.
2. Definir una contraseña para el usuario administrador `postgres`.
3. Mantener anotada la contraseña elegida, ya que será necesaria para conectarse al servidor.
4. Dejar el puerto predeterminado `5432`, salvo que exista un conflicto con otra instalación.
5. Completar la instalación.

**Importante:** la contraseña que cada integrante elija en su computadora puede ser diferente. No es necesario que todos utilicen la misma.

### Paso 3. Comprobar la instalación

Abrir pgAdmin 4 desde el menú Inicio.

Conectarse al servidor PostgreSQL instalado utilizando la contraseña definida durante la instalación.

Si la conexión funciona, PostgreSQL está listo para utilizarse.

## 3. Crear la base de datos y cargar los datos

Antes de comenzar, abrí el proyecto en **Visual Studio Code**. Desde allí, abrí una terminal en la carpeta principal del proyecto.

### Paso 1. Crear la base de datos

Ejecutá el siguiente comando:

```bash
psql -U postgres -d postgres -c "CREATE DATABASE sistema_gym;"
```

PostgreSQL te va a pedir una contraseña. Ingresá la que configuraste durante su instalación.

### Paso 2. Crear las tablas

Una vez creada la base de datos, ejecutá:

```bash
psql -U postgres -d sistema_gym -f "data/schema.sql"
```

Este comando ejecuta el archivo `schema.sql`, ubicado en la carpeta `data` del proyecto, y crea las tablas y sus relaciones.

### Paso 3. Cargar los datos de prueba

Por último, ejecutá:

```bash
psql -U postgres -d sistema_gym -f "data/seed.sql"
```

Este comando ejecuta `seed.sql` y carga los datos de prueba necesarios para utilizar el sistema.

**¡Listo!** Ya tenés la base de datos creada, las tablas configuradas y los datos cargados.

### Paso 4. Comprobar las tablas

En pgAdmin, desplegar:

`Databases` → nombre de la base → `Schemas` → `public` → `Tables`

Deberían aparecer las tablas definidas por el proyecto, como `socios`, `planes`, `cuotas`, `pagos` y `detalle_pago`, según el esquema definitivo.

## 4. Cargar los datos ficticios (seed)

Una vez creada la estructura de la base de datos, se pueden cargar los datos ficticios para probar el sistema.

El seed contiene registros de ejemplo, como planes, socios, cuotas y pagos relacionados entre sí.

### Paso 1. Localizar el archivo seed

Buscar el archivo SQL destinado a insertar los datos de prueba, por ejemplo, `seed.sql`.

No confundirlo con el script de estructura: el esquema crea las tablas y el seed carga los registros.

### Paso 2. Ejecutar el seed

1. Abrir pgAdmin y seleccionar la base de datos del proyecto.
2. Abrir `Tools` → `Query Tool`.
3. Abrir el archivo `seed.sql`.
4. Ejecutarlo.
5. Comprobar que la operación haya finalizado correctamente.

### Paso 3. Verificar los datos

Ejecutar consultas de comprobación en pgAdmin:

```sql
SELECT * FROM planes;
SELECT * FROM socios;
SELECT * FROM cuotas;
SELECT * FROM pagos;
SELECT * FROM detalle_pago;
```

Si aparecen registros, los datos se cargaron correctamente.

**Precaución:** ejecutar el seed solo en la base de desarrollo. Antes de ejecutarlo nuevamente, comprobar si está preparado para repetirse sin duplicar registros.

## 5. Instalar Node.js

### Paso 1. Descargar Node.js

Ingresar al sitio oficial:

[https://nodejs.org/](https://nodejs.org/)

Descargar una versión LTS compatible con el proyecto y completar la instalación.

### Paso 2. Comprobar la instalación

Abrir CMD o una terminal y ejecutar:

```bash
node -v
npm -v
```

Ambos comandos deberían mostrar sus respectivas versiones.

Si Windows indica que no reconoce los comandos, comprobar que Node.js se haya instalado correctamente y que esté disponible en el PATH.

## 6. Preparar el backend

### Paso 1. Obtener el proyecto

Si se utiliza Git, clonar el repositorio en la computadora:

```bash
git clone URL_DEL_REPOSITORIO
```

Después, ingresar a la carpeta del proyecto.

Si se trabaja con un archivo ZIP, extraerlo y abrir la carpeta correspondiente.

### Paso 2. Abrir una terminal en el backend

En CMD, ingresar a la carpeta donde se encuentra el `package.json` del backend.

Por ejemplo:

```bash
cd C:\ruta\al\proyecto\SistemaGYM
```

La ruta es ilustrativa: debe reemplazarse por la ubicación real del proyecto.

### Paso 3. Instalar las dependencias

Ejecutar:

```bash
npm install
```

Este comando instala las dependencias declaradas en `package.json` y utiliza `package-lock.json` para mantener las versiones registradas cuando corresponde.

No es necesario copiar la carpeta `node_modules` desde otra computadora. Cada integrante debe instalar sus propias dependencias.

Si el proyecto incluye `package-lock.json`, conviene conservarlo en Git para que todos instalen versiones consistentes.

### Paso 4. Configurar las variables de entorno

Revisar si el backend utiliza un archivo `.env` para conectarse a PostgreSQL.

Si existe un archivo de ejemplo, como `.env.example`, copiarlo con el nombre `.env` y completar los valores locales necesarios.

Por ejemplo, una configuración podría incluir:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=SistemaGYM
DB_USER=postgres
DB_PASSWORD=CONTRASEÑA_LOCAL
```

Los nombres de las variables deben coincidir con los que realmente utiliza el proyecto. Este ejemplo no reemplaza la configuración existente.

Cada integrante debe colocar sus propias credenciales. El archivo `.env` no debe subirse al repositorio si contiene contraseñas.

### Paso 5. Iniciar el backend

Revisar los scripts disponibles en `package.json`. Por ejemplo:

```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  }
}
```

El ejemplo anterior es ilustrativo; se deben utilizar los scripts reales del proyecto.

Si existe un script `dev`, iniciar el servidor con:

```bash
npm run dev
```

Si solo existe `start`, utilizar:

```bash
npm start
```

Dejar abierta la terminal mientras se utiliza la aplicación.

## 7. Comprobar la conexión con PostgreSQL

Una vez iniciado el backend, revisar la terminal.

Si la conexión está correctamente configurada, el servidor debería iniciar sin errores de conexión a PostgreSQL.

Si la API dispone de rutas para consultar socios, planes o alertas, probarlas desde el navegador o Postman.

Por ejemplo, si el servidor utiliza el puerto 3000 y tiene configurada esa ruta:

```text
http://localhost:3000/api/socios
```

La URL es ilustrativa: utilizar el puerto y los endpoints reales del proyecto.

## 8. Ejecutar el frontend

Si el frontend está separado del backend, también debe iniciarse o abrirse por separado.

1. Abrir la carpeta del frontend en Visual Studio Code.
2. Utilizar la extensión Live Server si el proyecto está preparado para ejecutarse de esa manera.
3. Abrir el archivo HTML principal con Live Server.
4. Verificar que el frontend utilice la URL correcta de la API.

Por ejemplo, el frontend podría abrirse en:

`http://127.0.0.1:5500`

Mientras que el backend escucha en:

`http://localhost:3000`

Son direcciones y puertos diferentes, por lo que ambos deben estar funcionando al mismo tiempo.

## 9. Orden correcto para iniciar el proyecto

En las siguientes sesiones de trabajo no es necesario repetir toda la instalación.

El procedimiento habitual es:

1. Iniciar o comprobar que PostgreSQL esté funcionando.
2. Abrir la carpeta del backend.
3. Ejecutar `npm run dev` o el comando configurado.
4. Abrir el frontend con Live Server.
5. Utilizar la aplicación desde el navegador.

Solo será necesario ejecutar nuevamente `npm install` cuando se incorporen dependencias nuevas o se prepare el proyecto por primera vez en otra computadora.

Tampoco es necesario volver a ejecutar el script de estructura ni el seed cada vez que se inicia la aplicación.

## 10. Problemas frecuentes

### Error de conexión con PostgreSQL

Comprobar que el servidor PostgreSQL esté iniciado, que el nombre de la base de datos sea correcto y que las credenciales coincidan con la configuración local.

### Error indicando que falta un módulo

Desde la carpeta del backend, ejecutar:

```bash
npm install
```

Comprobar también que se está trabajando en la carpeta que contiene el `package.json` correcto.

### Error de puerto ocupado

Puede que otra aplicación esté utilizando el puerto configurado. Revisar qué proceso está en ejecución antes de cambiar la configuración.

### El frontend no muestra datos

Comprobar que el backend esté iniciado, que la URL de la API sea correcta y que las peticiones no estén devolviendo errores.

### Las tablas existen, pero no aparecen registros

Verificar que se haya ejecutado el seed en la base de datos correcta y que no haya errores de inserción.

---

## Resumen

Para preparar el proyecto por primera vez:

1. Instalar PostgreSQL y pgAdmin.
2. Crear la base de datos.
3. Ejecutar el script de estructura.
4. Ejecutar el seed con datos ficticios.
5. Instalar Node.js.
6. Obtener el proyecto.
7. Ejecutar `npm install`.
8. Configurar el archivo `.env`.
9. Iniciar el backend.
10. Iniciar el frontend.

Con estos pasos, el entorno local debería quedar preparado para trabajar con SistemaGYM.
