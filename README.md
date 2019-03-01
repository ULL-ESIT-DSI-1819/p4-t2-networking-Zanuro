# Practica 4 - Sockets


```
En esta practica aprenderemos sobre las conexiones de tipo socket propias de Node.Desarrollaremos los dos puntos de conexion tanto para el servidor como para el cliente, y veremos el protocolo JSON utilizado para la comunicacion cliente/servidor.Tambien se veran cosas sobre la herencia en JavaScript y como relacionar los objetos entre si.
Tambien haremos integracion con testeo haciendo uso de Mocha.
```

```
Primero desarrollaremos el codigo de un simple servidor TCP.
Antes de todo debemos crear una conexion para que luego pueda ser posible transmitir informacion entre dos puntos.(cliente/servidor)
```

```
Vamos a desarrollar una aplicacion que envia datos a los clientes conectados,y luego nos vamos a conectar a este servicio a traves de las herramientas propias de la linea de comandos.

La primera parte de nuestra aplicacion consistira en asignar uno de los puntos de conexion a un puerto mientras que el otro extremo(punto de conexion) se conecta a ese puerto.Una vez que se ha establecido la conexion se puede transmitir informacion.
```

Para hacer que un puerto TCP este escuchando en una conexion hacemos lo siguiente:
(captura)

```
Utilizaremos el modulo net que nos da las funcionalidades para establecer una conexcion TPC/IPC entre servidores y clientes.A la funcion createServer se le pasa una funcion callback que se estara utilizando cada vez que se establezca una conexion y se utilizara para la transferencia de los datos entre los dos extremos.
Finalmente el server listen es para asignarle al servidor el puerto de escucha.Luego los clientes se estaran conectando a este puerto.

Lo siguiente que veremos es como enviar informacion a uno de estos sockets que estara escuchando.
Vamos a estar utilizando funcionalidades del capitulo anterior, tomando acciones cada vez que un fichero que se esta siguiendo cambie.
(captura)

En este ejemplo, se hacen uso de los modulos fs al estar escuchando por todos los cambios que van surgiendo en el fichero y luego el modulo net que nos hara falta para la creacion del servidor tcp,y luego observando la conexion y que ocurrira en caso de que se cierre la conexion, y asignar un puerto de escucha al servidor.

El tercer argumento que se le pasa es el nombre del fichero al que se estara observando y en caso de que no se especifique saltaria el error de que no se ha especificado ningun fichero.(el fichero sera el tercer elemento pasado al ejecutar el programa, el primero siendo el ejecutable de node y el segundo el nombre del programa).

La funcion de callback que se le esta pasando a la creacion del servidor hara lo siguiente:
Cuando se establezca la conexion mandara un mensaje de que se ha establecido la conexion tanto por la consola, como al cliente haciendo uso del connection write diciendo el fichero al que se esta siguiendo.
Lo siguiente que se hara es observar el fichero que se le esta pasando por linea de comandos y en caso de que ocurra algun cambio le manda un mensaje al cliente informandolo de que el fichero ha cambiado.
Cuando se cierra la conexion establecida(el cliente se haya disconectado) imprimira por consola un mensaje y dejara de seguir el fichero.Por ultimo asignara un puerto de escucha al servidor para la conexion de posibles clientes.(en el puerto 60300)
```

```
Para que todo esto funcione vamos a necesitar una consola que actue como el servidor, una como el cliente y otra que haga los cambios en el fichero a seguir.
Para esto ejecutaremos en la primera terminal:
``` watch -n 1 touch target.txt ```

En la segunda terminal ejecutaremos el programa(servidor que estara escuchando por los posibles clientes): ``` node net-watcher.js target.txt ```
El servidor estara escuchando en el puerto 60300,y nos conectamos a el a traves de la herramienta netcat.
En la tercera terminal actuaremos como cliente que se conectara al servidor por el puerto 60300.Hacemos esto : ``` nc localhost 60300 ```

Tambien se puede utilizar telnet en caso de que netcat no funcione.

Una vez que pongamos todo esto en las terminales tal como se ha mencionado veremos lo siguiente:
(captura)
En al consola de la izquiera se ejecuta el comando watch para modificar el fichero que se va a seguir cada cierto tiempo.En la del centro ejecutaremos el programa(servidor) que se pondra a escuchar por posibles conexiones y observar el fichero por posibles cambios.En la de la derecha se conectara el "cliente" al servidor por el puerto 60300 y el servidor le respondera en cuanto se produzcan cambios en el fichero.
Para desconectarnos haremos uso de Ctrl+c.
En caso de telnet ocurrira lo mismo pero para desconectarnos utilizaremos ctrl+j y quit y enter.
(captura)

Por lo tanto el servidor asigna un puerto de escucha(60300) y estara escuchando a los posibles cambios en el fichero seguido.
Podemos abrir varias terminales y conectarnos con varios clientes al puerto 60300 con netcat a traves del mismo puerto del servidor(60300).
Todos los clientes conectados recibiran avisos cuando el fichero seguido se haya cambiado.
(captura)



