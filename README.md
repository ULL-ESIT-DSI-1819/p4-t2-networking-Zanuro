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


Para la comunicacion entre procesos del mismo ordenador utilizaremos los sockets de Unix en vez de una conexion tcp.

Para esto modificaremos el programa anteriormente creado(servidor) adaptado a que este usando sockets de Unix.
A la funcion listen que anteriormente usabamos para conectarnos al puerto 60300, la modificaremos para que en vez de escuchar al puerto haga uso de /tmp/watcher.sock.

(captura)

Y luego lo ejecutaremos:
(captura)
Sin embargo tenemos el problema de que no existe el fichero watcher.sock(al menos en la maquina local) y el cliente no puede estabalecer la conexion con el servidor.
Los sockets de Unix sin embargo pueden resultar mas rapidos que los sockets TCP ya que no requiren ningunas dependencias en cuanto al hardware de conexion,sino que son propios de la maquina.

Lo siguiente que veremos va a ser como pasar los datos que se reciben en un formato aceptado.
Lo que se ha hecho hasta ahora es mandar mensaje en texto que solo un humano pueda entender pero no la maquina.

Lo que haremos sera establecer una conexion que permita el paso de mensajes de tipo JSON a traves de TCP, y para esto vamos a utilizar un protocolo especial(es decir un conjunto de reglas que permite la comunicacion entre dos extremos).JSON se suele utilizar bastante dentro del ambito de Node y sigue teniendo un formato que lo pueda entender un ser humano.

Vamos a implementar el protocolo del paso de mensajes que hace uso de JSON para serializar los mensajes.Cada mensaje se define como un objeto de tipo JSON que es un hash definido por un par atributo-valor de la siguiente forma:

```
{"key":"value","anotherkey":"anothervalue"}
```

En nuestro caso anterior del net-watcher,pasabamos dos tipos de mensajes :
El primer tipo de mensaje es el que surge al establecer la conexion,el cliente recibe la cadena:

```
Now watching 'target.txt' for changes 

```
El segundo tipo de mensaje es que cada vez que el fichero que se esta siguiendo cambie el cliente recibe una cadena de la siguiente manera:

```
File 'target.txt' changed: 1551459933086
```

Para codificar el primer tipo de mensaje utilizaremos la siguiente notacion:

```
{"type:"watching","file":"target.txt"}

Donde el atributo type indicara que se trata de un mensaje de tipo watching mientras que el atributo file el fichero que se esta siguiendo.

El segundo tipo de mensaje lo codificaremos a formato JSON de la siguiente manera:
```
{"type":"changed","timestamp":1551459933086}
```
En este indicaremos a traves del atributo type que el fichero que estamos siguiendo ha cambiado, y el timestamp nos indicara el numero de segundos que hayan transcurrido a partir del 1 de enero de 1970.Este formato es un formato mas facil para JS con el que puede trabajar facilmente.
JSON no hace uso de saltos de linea y para esto utilizaremos saltos de lineas solamente para separar mensajes.

Con esto explicado vamos a modificar el programa net-watcher para que utilize el protocolo JSON.Luego creamos clientes que reciban e interpretan los mensajes.
Vamos a modificar el programa net-watcher de la siguiente manera,vamos a utilizar JSON.stringify() para codificar para codificar los objetos de tipo mensaje y luego enviarlo a traves de connection.write().JSON.stringify coge un objeto JS y devuelve una cadena representando al objeto en formato JSON.

Modificaremos la primera ocurrencia de connection.write de cuando se conecte el cliente al servidor de la siguiente manera:

```
connection.write(JSON.stringify({type: 'watching', file: filename}) + '\n');
```
Y la segunda ocurrencia:
```
connection.write(JSON.stringify({type: 'changed', timestamp: Date.now()}) + '\n')
```
Esto le dira al usuario el fichero que se esta siguiendo y en caso de que cambie cuando se cambia.

(captura)

En ejecucion:
(captura)


Lo siguiente que haremos es implementar el cliente que recibira los mensajes de tipo JSON del servidor.
(captura)

Este programa crea una conexion del cliente al localhost a traves del puerto 60300 y esperara a que le lleguen datos.
En cuanto lleguen los datos se parsean a traves de JSON.parse y en funcion del atributo type de message imprimira un mensaje u otro.Si el type es watching imprimira por console el Now watching con llamando al atributo file de message para obtener el nombre del fichero.En caso de que el tipo sea changed parseara el valor del timestamp del mensaje a una fecha y la imprimira por consola.En otro caso, ocurre un tipo no esperado e imprimira por consola el tipo de mensaje.

En ejecucion:
(captura)

Al conectarnos con el cliente al servidor y modificar el fichero nos dira cuando el fichero ha cambiado.
Sin embargo este programa no esta del todo completo ya que solo escucha cuando haya eventos que implica datos,en otro caso(de terminacion de la conexion-end o en caso de que surga algun error-error event) no toma ninguna accion pero tambien hay otros problemas en este codigo que veremos a continuacion.

Vamos a desarrollar unos tests para nuestro servidor y cliente,viendo los errores que puede tener el cliente.Para esto veremos varios conceptos de Node tales como:
-extension de las clases del core
-crear y usar modulos creados por nosotros
-EventEmitters

El primer problema que surge en nuestra comunicacion es que como se van pasando mensajes, los mensajes pueden transmitirse de una vez o en partes en distintos eventos data.
En nuestro caso la delimitacion entre mensajes era el uso del caracter de salto de linea.(\n).
Un ejemplo especificando explicitamente los saltos de linea entre mensajes es el siguiente:

```
{"type":"watching","file":"target.txt}\n
{"type":"changed","timestamp":1551459933086}\n
{"type":"changed","timestamp":1551459934090}\n
```
En nuestro ejemplo,cada vez que ocurre un cambio, codifica los datos y los envia a la conexion.Cada entrada corresponde a un unico evento de tipo data de la conexion.Se da el caso de que cada mensaje enviado se corresponde con cada evento de tipo data.
Nuestro cliente se base en parsear los datos cada vez que le llegan directamente.
```
client.on('data', data => {
    const message = JSON.parse(data);
})
```

Pero se podria dar el caso de que el mensaje sea partido por la mitad y que llegue como dos eventos distintos de tipo data.Esto puede ocurrir especialmente si el mensaje a enviar es muy grande.
Por lo tanto se podria dar el caso siguiente:
```
{"type":"changed", time  |  stamp":1551459934090}\n
donde se ha puesto el | para delimitar el posible mensaje en dos mensajes que llegaran como distintos eventos de tipo data.

Vamos a implementar un programa que recibe un mensaje como este y comprobaremos como responde el cliente.