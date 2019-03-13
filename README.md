# Practica 4 - Sockets


Travis status: [![Build Status](https://travis-ci.org/ULL-ESIT-DSI-1819/p4-t2-networking-Zanuro.png)](https://travis-ci.org/ULL-ESIT-DSI-1819/p4-t2-networking-Zanuro)


En esta practica aprenderemos sobre las conexiones de tipo socket propias de Node.Desarrollaremos los dos puntos de conexion tanto para el servidor como para el cliente, y veremos el protocolo JSON utilizado para la comunicacion cliente/servidor.Tambien se veran cosas sobre la herencia en JavaScript y como relacionar los objetos entre si.
Tambien haremos integracion con testeo haciendo uso de Mocha.



Primero desarrollaremos el codigo de un simple servidor TCP.
Antes de todo debemos crear una conexion para que luego pueda ser posible transmitir informacion entre dos puntos.(cliente/servidor)



Vamos a desarrollar una aplicacion que envia datos a los clientes conectados,y luego nos vamos a conectar a este servicio a traves de las herramientas propias de la linea de comandos.

La primera parte de nuestra aplicacion consistira en asignar uno de los puntos de conexion a un puerto mientras que el otro extremo(punto de conexion) se conecta a ese puerto.Una vez que se ha establecido la conexion se puede transmitir informacion.


Para hacer que un puerto TCP este escuchando en una conexion hacemos lo siguiente:

![ccap8](https://user-images.githubusercontent.com/25621400/54161007-da298900-4448-11e9-9ad8-3b5fc5661829.png)


Utilizaremos el modulo net que nos da las funcionalidades para establecer una conexcion TPC/IPC entre servidores y clientes.A la funcion createServer se le pasa una funcion callback que se estara utilizando cada vez que se establezca una conexion y se utilizara para la transferencia de los datos entre los dos extremos.
Finalmente el server listen es para asignarle al servidor el puerto de escucha.Luego los clientes se estaran conectando a este puerto.

Lo siguiente que veremos es como enviar informacion a uno de estos sockets que estara escuchando.
Vamos a estar utilizando funcionalidades del capitulo anterior, tomando acciones cada vez que un fichero que se esta siguiendo cambie.

![ccap7](https://user-images.githubusercontent.com/25621400/54161005-d85fc580-4448-11e9-9880-b1d724578224.png)

En este ejemplo, se hacen uso de los modulos fs al estar escuchando por todos los cambios que van surgiendo en el fichero y luego el modulo net que nos hara falta para la creacion del servidor tcp,y luego observando la conexion y que ocurrira en caso de que se cierre la conexion, y asignar un puerto de escucha al servidor.

El tercer argumento que se le pasa es el nombre del fichero al que se estara observando y en caso de que no se especifique saltaria el error de que no se ha especificado ningun fichero.(el fichero sera el tercer elemento pasado al ejecutar el programa, el primero siendo el ejecutable de node y el segundo el nombre del programa).

La funcion de callback que se le esta pasando a la creacion del servidor hara lo siguiente:
Cuando se establezca la conexion mandara un mensaje de que se ha establecido la conexion tanto por la consola, como al cliente haciendo uso del connection write diciendo el fichero al que se esta siguiendo.
Lo siguiente que se hara es observar el fichero que se le esta pasando por linea de comandos y en caso de que ocurra algun cambio le manda un mensaje al cliente informandolo de que el fichero ha cambiado.
Cuando se cierra la conexion establecida(el cliente se haya disconectado) imprimira por consola un mensaje y dejara de seguir el fichero.Por ultimo asignara un puerto de escucha al servidor para la conexion de posibles clientes.(en el puerto 60300)



Para que todo esto funcione vamos a necesitar una consola que actue como el servidor, una como el cliente y otra que haga los cambios en el fichero a seguir.
Para esto ejecutaremos en la primera terminal:

``` watch -n 1 touch target.txt ```

En la segunda terminal ejecutaremos el programa(servidor que estara escuchando por los posibles clientes): 

``` node net-watcher.js target.txt ```

El servidor estara escuchando en el puerto 60300,y nos conectamos a el a traves de la herramienta netcat.
En la tercera terminal actuaremos como cliente que se conectara al servidor por el puerto 60300.Hacemos esto : 

``` nc localhost 60300 ```

Tambien se puede utilizar telnet en caso de que netcat no funcione.

Una vez que pongamos todo esto en las terminales tal como se ha mencionado veremos lo siguiente:

![cap3](https://user-images.githubusercontent.com/25621400/54158101-ae56d500-4441-11e9-9de1-39cc0a823dcf.png)

En al consola de la izquiera se ejecuta el comando watch para modificar el fichero que se va a seguir cada cierto tiempo.En la del centro ejecutaremos el programa(servidor) que se pondra a escuchar por posibles conexiones y observar el fichero por posibles cambios.En la de la derecha se conectara el "cliente" al servidor por el puerto 60300 y el servidor le respondera en cuanto se produzcan cambios en el fichero.
Para desconectarnos haremos uso de Ctrl+c.
En caso de telnet ocurrira lo mismo pero para desconectarnos utilizaremos ctrl+j y quit y enter.


![cap4](https://user-images.githubusercontent.com/25621400/54158102-af880200-4441-11e9-931e-fb41413c64c2.png)

Por lo tanto el servidor asigna un puerto de escucha(60300) y estara escuchando a los posibles cambios en el fichero seguido.
Podemos abrir varias terminales y conectarnos con varios clientes al puerto 60300 con netcat a traves del mismo puerto del servidor(60300).
Todos los clientes conectados recibiran avisos cuando el fichero seguido se haya cambiado.

![cap5](https://user-images.githubusercontent.com/25621400/54158105-b0b92f00-4441-11e9-87e1-ab93eac7c98e.png)

Para la comunicacion entre procesos del mismo ordenador utilizaremos los sockets de Unix en vez de una conexion tcp.

Para esto modificaremos el programa anteriormente creado(servidor) adaptado a que este usando sockets de Unix.
A la funcion listen que anteriormente usabamos para conectarnos al puerto 60300, la modificaremos para que en vez de escuchar al puerto haga uso de /tmp/watcher.sock.

![cap6](https://user-images.githubusercontent.com/25621400/54158107-b282f280-4441-11e9-8710-ea4ee4f1b3ed.png)

Y luego lo ejecutaremos:

![ccap60](https://user-images.githubusercontent.com/25621400/54158187-d80ffc00-4441-11e9-9f8b-cce6e755a42b.png)

Sin embargo tenemos el problema de que no existe el fichero watcher.sock(al menos en la maquina local) y el cliente no puede estabalecer la conexion con el servidor.(Haria falta reiniciar la maquina para que funcione).
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
```

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

![cap7](https://user-images.githubusercontent.com/25621400/54158112-b44cb600-4441-11e9-8dd0-554a8fc52198.png)

En ejecucion:

![cap8](https://user-images.githubusercontent.com/25621400/54158113-b57de300-4441-11e9-86fe-35ce52bb04e0.png)


Lo siguiente que haremos es implementar el cliente que recibira los mensajes de tipo JSON del servidor.
![ccap1](https://user-images.githubusercontent.com/25621400/54158889-84061700-4443-11e9-9587-150eed12ee8f.png)

Este programa crea una conexion del cliente al localhost a traves del puerto 60300 y esperara a que le lleguen datos.
En cuanto lleguen los datos se parsean a traves de JSON.parse y en funcion del atributo type de message imprimira un mensaje u otro.Si el type es watching imprimira por console el Now watching con llamando al atributo file de message para obtener el nombre del fichero.En caso de que el tipo sea changed parseara el valor del timestamp del mensaje a una fecha y la imprimira por consola.En otro caso, ocurre un tipo no esperado e imprimira por consola el tipo de mensaje.

En ejecucion:
![cap9](https://user-images.githubusercontent.com/25621400/54158116-b6167980-4441-11e9-8bea-ce4e715b888d.png)

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
```

donde se ha puesto el | para delimitar el posible mensaje en dos mensajes que llegaran como distintos eventos de tipo data.

Vamos a implementar un programa que recibe un mensaje como este y comprobaremos como responde el cliente.El servicio que quieremos implementar puede separar mensajes en varios chunks.

![cap11](https://user-images.githubusercontent.com/25621400/54158121-b878d380-4441-11e9-8ef2-16aa24bc3163.png)

Este servidor difiere en unos cuantos sentidos del servidor previamente creado.Una de las diferencias seria que no estamos siguiendo a ningun fichero esperando a que cambie para parsear la entrada y mandarle un mensaje al usuario de que el fichero ha cambiado.En este ejemplo lo unico que hacemos es mandar un primer chunk del mensaje al cliente, tras establecer la conexion y despues de cierto tiempo enviamos el segundo chunk esperando un cierto tiempo antes de enviar el chunk.

Finalmente cuando se haya terminado la conexion se hace un clearTimeout del tiempo del timer que hemos establecido para esperar antes de mandar el chunk y por lo tanto esto hara que surgan errores en cuanto se llame a connection.write().

![cap10](https://user-images.githubusercontent.com/25621400/54158117-b747a680-4441-11e9-85a0-e32f020e8914.png)

En este ejemplo vemos como corremos el servidor, y al conectarse el cliente nos dice Subscriber connected.El cliente al conectarse se le respondera con undefined:1 y luego el primer chunk.Luego surge el error the unexpected end of JSON input,que el mensaje que se ha recibido no es un mensaje valido de JSON.El cliente ha intentado mandar un mensaje a medias a JSON.parse() que solo coge mensajes completos y validos de tipo JSON.

Lo siguiente que haremos es mejorar el cliente para que pueda trabajar con mensajes a medias.Lo que haremos es que el programa guarde los data que reciben en mensajes y que pueda manejar cualquier mensaje en cuanto llegue.
Vamos a crear un modulo que maneja los chunks que le llegan para que en un final el programa principal solo reciba mensajes completos.

Primero vemos un ejemplo de herencia en Node.

```javascript

const EventEmitter = require ('events').EventEmitter;
class LDJClient extends EventEmitter {
    constructor(stream){
        super();
    }
}

```

LDJClient es una clase que hereda de EventEmitter, lo que significa que es necesario llamar a  new LDJClient(stream) para obtener una instancia de este.El parametro stream se utiliza para emitir ciertos eventos de tipo data.Dentro del constructor llamamos a super() para invocar al constructor propio de EventEmitter.Cada vez que implementamos una clase que extiende otra clase necesitamos llamar a super().
JS hace uso de prototypal inheritance para establecer la relacion entre LDJClient y EventEmitter.

```javascript
const client = new LDJClient(networkStream);
client.on('message', message =>{
    // take action
});
```

Para utilizar el LDJClient.

Este codigo funciona, sin embargo no hemos implementado un programa que guarde los data events en Node.

Para intentar guardar los eventos de data en el buffer utilizaremos el parametro stream en LDJClient para manejarnos con el buffer.El objetivo es coger data sin parsear del stream y convertirla en eventos de mensajes conteniendo los objetos de mensajes parseados.

![ccap2](https://user-images.githubusercontent.com/25621400/54159443-e57ab580-4444-11e9-8c6a-7460d180295c.png)


En este trozo de codigo lo que hacemos es coger los chunks que le llegan y los mete en un buffer y va buscando algunos \n que significarian el fin del mensaje.
Primero en el constructor del stream lo que hacemos es llamar a super y luego crear un buffer en el que iremos guardando los chunk que nos llegan.A continuacion lo que haremos es llamar al stream para manejar los eventos de tipo data.En este manejador lo que haremos es coger los chunks de data y meterlos en el buffer y luego iremos buscando desde principio el signo que va a delimitar los mensajes, el \n, y cogiendo el index.Luego mientras que el index sea diferente de 0,cogemos lo que hay hasta el delimitador y luego deja en el buffer lo que se encuentra a partir del delimitador.Lo que cogemos como input lo metemos para parsearslo tal como hemos hecho anteriormente con JSON.parse() y lo enviamos.
De esta manera nos aseguramos de que si el mensaje llega dividido en 5 trozos o en un unico trozo, podemos saber con certeza de que lo vera como un mensaje entero y no dara problemas al parsearlo.
Para esto lo que haremos es meterlo dentro de un modulo Node.js para que pueda ser utilizado por nuestro cliente.


Antes de proseguir vamos a hablar un poco de como hubiese sido hacer el codigo de la clase LDJClient sin hacer uso de constructor() o super(), o class().

```javascript
const EventEmitter = require('events').EventEmitter;
const util = require('util');

function LDJClient(stream){
    EventEmitter.call(this);
}
util.inherits(LDJClient, EventEmitter);
```


En este codigo utilizaremos la funcion de LDJClient que actuara tal como actuaba la clase LDJClient y el constructor en el codigo anterior.Y en vez de hacer uso de super invocamos al EventEmitter con this.Luego hacemos uso de util.inherits para hacer el LDJClient objeto padre del prototipado el prototipado del EventEmitter.Basicamente lo que hacemos es decirle que si se esta buscando una propiedad en LDJClient y no lo encuentra que la vaya buscando en EventEmitter.
Si por ejemplo creamos una instancia cliente de la clase LDJClient y luego lo llamamos con el metodo on, como no existe este metodo dentro de las funcionalidades de esta clase, estara buscando el metodo on en la clase EventEmitter y si por ejemplo tampoco lo encuentra en la clase EventEmitter lo estara buscando en la clase Object y ira asi buscando en los padres hasta que lo encuentre.


![cap20](https://user-images.githubusercontent.com/25621400/54158123-b9aa0080-4441-11e9-96ea-29fdd9278f19.png)

Este codigo es una combinacion de los fragmentos anteriores de codigos de LDJClient mas un metodo estatico del final-connect- que se encuentra directamente definido en la clase LDJClient y se ha definido meramente para que los usuarios no tengan que utilizar el new cada vez que quieren crear una instancia de LDJClient.El module.exports = LDJClient lo utilizaremos para exportar nuestra clase como un modulo y para que la gente lo pueda exportar como un modulo.

Para utilizar el modulo haremos lo siguiente:

```javascript
const LDJClient = require('../lib/ldj-client2.js');
const client = new LDJClient(networkStream);
```

O directamente haciendo uso del connect sin que tengamos que poner el new:

```javascript
const client = require('../lib/ldj-client2.js').connect(networkStream);
```

En los dos casos se utiliza la ruta relativa para obtener el codigo del modulo ya que no es un modulo oficial,subido a npm como es el caso de fs.

Vamos a proceder a extender el codigo del cliente para que pueda usar el modulo.

![cap21](https://user-images.githubusercontent.com/25621400/54158125-bb73c400-4441-11e9-8c2b-0382130d6359.png)

Este codigo es similar al codigo anteriormente creado en net-watcher-json-client.js, la unica diferencia siendo que en vez de pasar los trozos de datos que les llegan directamente al parseador asi obteniendo el mensaje, ahora el programa se basa en el modulo creado LDJClient para que le de datos sobre el tipo de mensaje.

Para verlo en funcionamiento primero ejecutariamos el servicio,el servidor y luego en otra terminal el cliente que hemos hecho anteriormente en otra terminal.Con esto nos aseguramos de que el cliente se puede comunicar con el servidor de una manera segura.

![cap25](https://user-images.githubusercontent.com/25621400/54158138-c3336880-4441-11e9-903d-470bcb157b00.png)

De esta manera el servidor aunque tenga los trozos de mensajes de tipo JSON separados por un \n, nustro nuevo modulo es capaz de entender estas divisiones y juntar el codigo para que al usuario se le transforme este objeto JSON a un mensaje que se pueda leer.

## Mocha
Lo siguiente que veremos es como desarrollar tests unitarios con Mocha.Es un framework de testeo, multiparadigma bastante utilizado.Primero instalamos Mocha con npm,y luego desarrollaremos una unidad de testeo para LDJClient.
Como npm se suele guiar por un fichero de configuracion,vamos a crear el fichero package.json de configuracion.
Para esto ejecutamos:

```javascript
npm init -y
```
Con esto inicializaremos el fichero de configuracion por defecto y con la opcion -y le decimos de que ponga todas las opciones las por defecto a yes.
El fichero resultante:

![cap26](https://user-images.githubusercontent.com/25621400/54158142-c4649580-4441-11e9-99c8-19f38da4abf2.png)

Luego instalamos Mocha:

```javascript
npm install --save-dev --save-exact mocha@3.4.2

```
Al hacer esto instalamos Mocha y podemos ver que se nos crea un directorio llamado node_modules que contendra Mocha y sus dependencias ya que se ha instalado Mocha localmente en el directorio que estamos utilizando y no globalmente a nivel de maquina.
Tambien se debe actualizar el package.json para que incluya las devdependencies que sera las dependencias instaladas con sus versiones.En nuestro caso:

```javascript
"devDependencies":{
    "mocha": "3.4.2"
}
```

En Node hay dos tipos de dependencias:dependencias regulares que se usan en el momento de ejecucion al hacer uso del require() para cargar los modulos y las dependencias de dev,que tu proyecto utiliza durante el desarrollo y para esto se utiliza save-dev para guardarlo como una devDependencies.
Ambos tipos de dependencias se instalan con el comando: npm install.
Si se quiere instalar solo las dependencias regulares utilizaremos: npm install --production, o modificando la variable de entorno NODE_ENV a production.
npm tambien crea un package-lock.json que contendra las versiones de todos los modulos de los que depende Mocha.

![ccap3](https://user-images.githubusercontent.com/25621400/54159761-abf67a00-4445-11e9-830d-7021506e0de2.png)
Esto es solo una parte del package.json.

-Las versiones semanticas de los paquetes:

Al utilizar la opcion --save-exact al instalar un modulo le decimos a npm que instale una version concreta pero por defecto npm utiliza semantic versioning para encontrar la mejor version disponible del modulo.La version semantica es un concepto muy importante que se representa con un numero de version dividido en tres partes: la primera es la version-major,la segunda es la version-minor,y la tercera es la version-patch.Estan separadas por un ".".


La version PATCH se ira modificando cada vez que se modifica el codigo pero no se anade ninguna nueva(o no se quita) funcionalidad.
La version MINOR se ira modificando cada vez que se modifica el codigo y se introducen nuevas funcionalidades pero no se quitan o modifican las funcionalidades existentes.Al incrementarse tambien se resetea el patch.
La version MAJOR se ira modificando cada vez que se modifica el codigo y cambian las funcionalidades existentes.Tambien se resetean el minor y el patch.


Podemos obviar poner el save-exact o el numero de version si se quiere instalar la ultima version disponible.


Si se obvia la opcion save-exact al instalar el modulo con npm se anadira al package-json la version con un "^".Es decir si se quiere instalar la version 1.2.3 de un modulo si no se le especifica el save-exact se guardara como "^1.2.3" lo que significa que utilizara la version minor existente mayor o igual que la especificada.
Es decir si sale otra version mejorando el minor a : 1.4.0 y alguien quiere descargar un modulo que tiene como dependencia el "^1.2.3" se le descargara automaticamente el 1.4.0.Esto solo funciona para las versiones minor.
Otro ejemplo en el que se podria estar mas estricto seria fijar la version a ~1.2.3 y si sale un patch de 1.2.4 los usuarios descargaran la nueva 1.2.4 pero no podran obtener la nueva version minor por ejemplo la 1.3.0
De esta manera haciendo uso de la ~, como lo unico que se acepta es un cambio de patch,se supone que en los patch solo se deben introducir cambios que no modificaran las funcionalidades existentes del codigo.

Aunque la comunidad suele seguir esta version semantica no siempre es asi y es recomendable hacer uso del --save-exact para obtener la version que nosostros quieramos al instalar paquetes y tendremos que especificar y actualizar las dependencias que nos haran falta para un modulo que quieramos pero al menos no corremos el riesgo de instalar un modulo que no siga esta version semantica.

Tambien podemos meter el package-lock.json al control de versiones, para que luego podamos utilizar npm outdated que nos mostrara los modulos de los cuales dependemos que tengan versiones mejoradas.Al instalar la ultima version tambien se actualizara en el package-lock.json.

-Tests con Mocha
Para desarrollar los tests vamos a crear una carpeta test, que es la carpeta por defecto que Mocha mira por los tests.
Para esto anadimos el siguiente test:

![cap27](https://user-images.githubusercontent.com/25621400/54158143-c4fd2c00-4441-11e9-9a03-e96b6cb9e982.png)


En este codigo lo primero que hacemos es 'importar' los modulos que necesitamos:el modulo assert para la comparacion de valores, event para los data event que vamos a manejar y nuestro modulo creado LDJClient.
Luego creamos a traves del metodo propio de Mocha-describe unos test-LDJClient, y tiene una callback con los datos de ese test.
Se declara una variable para la instancia que vamos a utilizar de la clase LDJClient-client y otra variable para la instancia de la clase EventEmitter-stream y luego para cada uno de las variables se le asigna una nueva instancia de la clase respectiva.
Finalmente se llama al metodo it para testear un comportamiento especifico de la clase.Ponemos un manejador de eventos de tipo mensajes en el cliente, y con el metodo deepEqual() comprobamos que lo que se ha recibido coincide con lo que quieramos.Finalmente se llama al metodo done() para avisar cuando el test haya terminado.Luego le decimos a nuestro stream que emita los datos.


Para correr el test primero necesitamos anadir al package.json lo siguiente:

```javascript
"scripts": {
    "test": "mocha"
  },
```

Las entradas de scripts siendo comandos que se pueden invocar desde la linea de comandos a traves del npm run.En nuestro caso si ejecutamos:

```javascript
npm run test
```

Correra mocha.(Y tambien se puede omitir el run y ejecutar directamente: $ npm test)

En ejecucion:

![cap30](https://user-images.githubusercontent.com/25621400/54158147-c6c6ef80-4441-11e9-99bf-238f3ce389a6.png)

Ahora procederemos a mejorar el test-json-service.js para que sea un test de verdad.

Para esto primero modificamos el ldj-client-test.js de la siguiente manera(en el metodo describe):

```javascript
it('should emit a message event from split data events', done => {
    client.on('message', message => {
        assert.deepEqual(message, {foo: 'bar'});
        done();
    });
    stream.emit('data', '{"foo":')});
    process.nextTick(() => stream.emit('data', '"bar"}\n'));
});
```

El test lo que hace es dividir el mensaje en dos partes para que pueda ser emitido por el stream uno despues de otro.En el process.nextTick lo que hacemos es poner que el codigo del callback se ejecute tan pronto como termina el codigo actual en ejecutarse.Es decir tan pronto como de ejecutarse los procesos en el event loop,en la siguiente iteracion se decide emitir el siguiente trozo de datos.Este process.nextTick() es similar al otro metodo de javascript llamado setTimeout(callback,tiempo(ms)), es que el process tick ejecutara el callback en la siguiente iteracion del bucle de eventos mientras que el setTimeout(callback,tiempo) esperara a que se acabe el event loop y todos los callback que estaban en la cola que se ejecuten para luego ejecutar la callback(o un cierto codigo) que se le pasa como primer argumento despues de un cierto perido de ms especificado como segundo argumento.
Podriamos utilizar cualquiera de los dos metodos para enviar un trozo de datos despues de otro mientras que el tiempo de espera que le ponemos sea menor que el timeout de Mocha.(por defecto el tiempo de timeout es de 2000ms)

Podemos modificar el timeout para los tests con la opcion --timeout n ms. Si ponemos 0 ms significa que lo quieremos desactivar.
Si quieremos un tiempo determinado para un test concreto puedes hacer lo siguiente:

```javascript
it('should finish within 5 seconds', done => {
    setTimeout(done,4500);
}).timeout(5000);
```

En este caso llamamos el timeout directamente al objeto retornado por el metodo it.
Tambien se puede llamar el timeout para una serie de tests del describe.


--Resumiendo

En este capitulo hemos visto aplicaciones de red con sockets en Node.js.Hemos desarrollado una comunicacion cliente-servidor y un protocolo JSON para que se puedan comunicar.
Al ver los problemas que han surgido al hacer uso del protocolo y que el mensaje transmitido puede o no llegar del todo en el mismo momento han surgido problemas que hemos resuelto creando un modulo de la clase LDJClient extendiendo la clase de EventEmitter.
Tambien se ha visto Mocha y se ha usado para desarrollar tests y como se maneja todo el tema de la semantic versioning y por que es util/


# Testability

 Hemos desarrollado un test para la clase LDJClient,emitiendo un mensaje que ha llegado como un unico evento de datos.Surgen las siguientes preguntas

   1.Add a unit test for a single message that is split over two(or more) data events from the stream.
   
   En este caso anadimos la prueba que anade el salto de linea al stream que se usa como delimitador de los eventos dedatos.
    
   ![cap40](https://user-images.githubusercontent.com/25621400/54158148-c890b300-4441-11e9-9d83-cb58405c166c.png)
   
   En ejecucion:
   
   ![cap41](https://user-images.githubusercontent.com/25621400/54158152-c9294980-4441-11e9-9c3b-3a9579f15420.png)
    
   2.Add a unit test that passes in null to the LDJClient constructor and asserts that an error is thrown.Then make the test pass by modifying the constructor to accept null: the semantic being that the created stream behaves as /dev/null in Unix.

   Primero creamos la prueba en nuestro describe LDJClient y salta con un assert si al constructor se le ha pasado null.Modificaremos nuestro LDJClient para que el constructor acepte null.En caso de que el constructor reciba null lanzara un error.
   
   ![cap42](https://user-images.githubusercontent.com/25621400/54158154-ca5a7680-4441-11e9-9559-85739fbd5ae6.png)
   
   Modificamos la clase LDJClient para que acepte null:
   
   ![ccap4](https://user-images.githubusercontent.com/25621400/54160177-c5e48c80-4446-11e9-888f-10f27f49e87a.png)
   
   Test:
   
   ![cap43](https://user-images.githubusercontent.com/25621400/54158159-cb8ba380-4441-11e9-8889-e6e260f87d77.png)
   
   
# Robustness
   Extender la clase LDJClient.

   1.The LDJClient already handles the case in which a properly formatted JSON string is split over multiply lines. What happen if the incoming data is not a properly formatted JSON string?

   Si el mensaje que vendria no estaria formadeado como una cadena de tipo JSON, el JSON.parse no seria capaz de construir el objeto de tipo JSON desde la cadena lo cual implicaria un fallo, pero si por ejemplo se le pasaria una cadena en formato '" mensaje "\n', el JSON lo parsearia de manera que devolveria el objeto que contenga el " mensaje " , lo cual implicaria que el JSON lo leeria tal cual y lo devolveria igual al no tratarse de un objeto tipo JSON, pero como se le ha enganado poniendo la combinacion de '" "', creeria al principio de que es uno tipo JSON pero no es asi.Cabe destacar que es esencial poner el '\n' es lo unico por el que se esta guiando el programa para separar los mensajes.
   
 ![cap45](https://user-images.githubusercontent.com/25621400/54158160-ccbcd080-4441-11e9-9d9c-b0eb2719020e.png)
 
 Los tests:
 
 ![ccap5](https://user-images.githubusercontent.com/25621400/54160411-5b801c00-4447-11e9-9432-f7355c79a475.png)

 2.Write a test case that sends a data event that is not JSON. What do you think on how to manage this case?

 Anadiremos una prueba que emita un stream de datos que no se trata de un mensaje tipo JSON correctamente formateado.En la clase LDJClient anadiremos un bloque try-catch que emita el mensaje parseandolo como un mensaje tipo JSON correcto y en caso de que coga un error lanze un error de que el mensaje emitido no es un mensaje tipo JSON.
 
![cap47](https://user-images.githubusercontent.com/25621400/54158166-cf1f2a80-4441-11e9-93aa-554ebee403d7.png)

Modificar la clase LDJClient para tratar los casos en caso de que coga un error lanza un como error un mensaje:

![cap49](https://user-images.githubusercontent.com/25621400/54158168-d0e8ee00-4441-11e9-8bd7-f8f2e6c9c94b.png)

Tests:

![cap48](https://user-images.githubusercontent.com/25621400/54158167-cfb7c100-4441-11e9-86da-e4a96cf68497.png)

 3.What happens if the last data event completes a a JSON message, but without the trailing new line?

 Saltaria un error ya que el stream de data estara siempre buscando el indice del '\n' mientras haya datos en el stream, y el limite que esta poniendo y por el cual se esta guiando es el indice en el que se halla el '\n', si no existe el '\n' no se podria delimitar el mensaje en caso de que venga en diferentes momentos y seria un problema.
   
   Prueba:
   
   ![cap50](https://user-images.githubusercontent.com/25621400/54158170-d1818480-4441-11e9-9ea7-dfc1b7009ddd.png)
   
   Test:
   
   ![cap51](https://user-images.githubusercontent.com/25621400/54158174-d34b4800-4441-11e9-85ac-95f8cbadcf4b.png)

 4.Write a case where the stream object sends a data event containing JSON but no newline, followed by a close event. How will you manage this case?
    Creamos una nueva prueba que emita unos datos en formato tipo JSON con las "{" y "}" del comienzo y en final pero sin el delimitador que se estaba utilizado antes, es decir el "\n" y modificamos la clase LDJClient para que en caso de que el stream reciba un evento de tipo close, coga como delimitador el "}" que va a ser el ultimo caracter del mensaje, y lo parsee a formato JSON y lo manda.En caso de que si faltase del final el "}" entonces lanzaria un error de que le falta el "}" para finalizar.
    
   Prueba:
    
  ![cap55](https://user-images.githubusercontent.com/25621400/54158180-d47c7500-4441-11e9-8522-268de3c36242.png)
    
  Extension de la clase LDJClient para anadir un stream en case de que el tipo de evento sea close:
  
  ![cap56](https://user-images.githubusercontent.com/25621400/54158182-d5150b80-4441-11e9-8caf-db952d8e29d6.png)
  
  Test:
  
  ![cap57](https://user-images.githubusercontent.com/25621400/54158183-d6463880-4441-11e9-9cda-254fdfe79c94.png)

  5.Should LDJClient emit a close event for its listeners?

  No es estrictamente necesario que LDJClient emita un evento de cierre a los que estan escuchando si los listeners estan enviando datos, pero si lo podria hacer en caso de que no esten enviando datos.
  Tambien se podria emitir cuando el listener haya avisado del cierre de la conexion.


# Gulpfile

Tambien se ha anadido tareas para facilitar la ejecucion de ciertos programas.

![cap61](https://user-images.githubusercontent.com/25621400/54158185-d6decf00-4441-11e9-82c0-6b85dc6de718.png)

Alguna prueba:

![ccap10](https://user-images.githubusercontent.com/25621400/54162854-fcbea080-444e-11e9-927f-2fbf68512522.png)

# Travis 

Tambien se ha utilizado Travis para integracion continua utilizado para construir y testear proyectos que se encuentran alojados en Github.
Para esto es necesario incluir un fichero .travis.yml en el que incluimos el lenguage que se utiliza principalmente en el proyecto(en nuestro caso node.js) y la version que se va a utilizar para testear el codigo escrito en node.js.Una vez que tengamos linkeado Travis con nuestro proyecto en github, Travis detectara automaticamente cada vez que se hace un nuevo commit(y si tenemos el .travis.yml en el repo) y cada vez que ocurre esto, Travis intentara "construir" el proyecto y probara a hacer distintos tests para el proyecto.Tambien es necesario que hagamos el repositorio publico para que Travis funcione.
Travis es bastante util ya que podemos comprobar si nuestros tests han resultado exitosos y en caso de que no, Travis nos dira.

![ccap12](https://user-images.githubusercontent.com/25621400/54164550-f7fceb00-4454-11e9-9d5e-b9b4ae4540b7.png)

![ccap11](https://user-images.githubusercontent.com/25621400/54162856-fdefcd80-444e-11e9-8a5f-89717d51dc2f.png)

Tambien se puede observar el badge que nos dice de que la integracion continua con Travis ha resultado exitosa

# Reto
El reto propuesto fue crear un chat multiusuario.Es decir creamos un servidor donde los diferentes usuarios sean capaces de conectarse con netcat a un puerto definido y comunicarse entre ellos.
El codigo es el siguiente:

![ccap20](https://user-images.githubusercontent.com/25621400/54275226-00067900-4582-11e9-9aac-ae3b018a7d1a.png)

Esto es una ejecucion y el funcionamiento propio del chat:

![ccap21](https://user-images.githubusercontent.com/25621400/54275228-0137a600-4582-11e9-84db-378a33a2858a.png)

