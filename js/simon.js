    var simon;
    var caja;
    function Simon() {
        var ranking = new Ranking();
        //la duración del Sonido segun el nivel
    this.nivel = {
        basico: 2000,
        medio: 1000,
        dificil: 500,
    };
    //console.log("basico",Object.keys(this.nivel)[0])
    this.butonJugar;
    this.isClicked = false;
    this.nivelSeleccionado = Object.keys(this.nivel)[0];
    this.turnos = ["simon", "jugador"];
    this.turnoActual;
    this.secuencia = [];
    this.secuenciaJugador = [];
    this.niveles;
    this.pintarTurnoActual;
    this.finJuego = false;
    this.finPresentacion = false;
    this.puntuaciones;
    this.ultimaSecuencia;

    this.pintar = function () {
        //Crear la Estructura del página
        var body = document.querySelector("body");
        body.innerHTML +=`<aside class="leftAside">
                            <div id="clasificacionJugador"> Enhorabuena,te has clasificado en los top 10</div>
                                <div class="formulario">
                                <form>
                                    <label>Introduce tu nombre:</label>
                                    <input type="text" id="nombreUsuario" required>
                                    <button  id="enviar" value="enviar">Enviar</button>
                                </form>
                            </div>
                        </aside> 
                        <div class="space"><div class="turnos" >Es el turno de : <span id="turno"><span></div>
                            <div id="fin"> Has perdido</div></div>
                        <div id="container"></div>`;
        var container = document.querySelector("#container");
        container.innerHTML += `<h1> Bienvenido al Simon</h1>
                                <section class="primeraParte">
                                    <h2> Elige un nivel : <span>(por defecto es el nivel básico)<span></h2>
                                    <div class="opciones"> 
                                        <input type="radio" name="nivel" id="basico"  checked>Básico
                                        <input type="radio" name="nivel" id="medio" >Medio
                                        <input type="radio" name="nivel" id="dificil" >Difícil
                                    </div> 
                                </section>
                                <section class="segundaParte">
                                    <button id="jugar">Jugar</button>
                                    <div id="comenzar"  style="margin-bottom:5px" >Empieza !!!! </div> 
                                </section>`;
        body.innerHTML += `<aside class="rightAside">
                                <h2> Las 10 mejores  puntuaciones </h2>
                                <div class="listaUsuarios">
                                <div class="clasificacion">Clasificación</div><div class="name">Nombre</div><div class="puntos">Rondas</div>
                                </div><div class="puntuaciones">
                                </div>
                            </aside>
                            `;
        var primeraParte = document.querySelector(".primeraParte");
        var segundaParte = document.querySelector(".segundaParte");
        var cajasContainer = document.createElement("DIV");
        cajasContainer.className = "cajas";
        segundaParte.appendChild(cajasContainer);
        // Agregar las 4 cajas del Objeto Caja
        var cajasPintadas = caja.pintar();
        for (var i = 0; i < cajasPintadas.length; i++) {
        cajasContainer.appendChild(cajasPintadas[i]);
        }
        this.butonJugar = document.querySelector("#jugar");
        this.niveles = primeraParte.querySelectorAll('input[name="nivel"]');
        this.pintarTurnoActual = document.querySelector("#turno");
        this.pintarTurnoActual.innerHTML = this.turnoActual;
        this.puntuaciones = document.querySelector(".puntuaciones");
        caja.activarEventos("no");
        this.añadirEventos();
    };

    this.añadirEventos = function () {
        document.querySelector("#jugar").addEventListener("click", function () {
            simon.isClicked = true;
            simon.estadoDelInicio("none",true);
            simon.cambiarVisibility(document.querySelector("#comenzar"),"visible");
        });

        for (var i = 0; i < this.niveles.length; i++) {
            this.niveles[i].addEventListener("change", function () {
                simon.nivelSeleccionado = this.id;
            });
        }
        document.querySelector("#enviar").addEventListener('click',function(event){
            event.preventDefault();
            ranking.añadirAlRanking(simon.ultimaSecuencia-1,simon.puntuaciones);
            simon.cambiarVisibility(document.querySelector(".leftAside"),"hidden");
            simon.cambiarVisibility(document.querySelector(".turnos"),"hidden");
        });
    };
    this.cambiarVisibility=function(elementoHtml,valor){
        elementoHtml.style.visibility = valor;
    }
    this.estadoDelInicio=function(respuesta,estadoButton){
          //asignar una duracion a los sonidos
          caja.duracion = simon.nivel[simon.nivelSeleccionado];
          simon.cambiarVisibility(document.querySelector(".turnos"),"visible");
         //Deshabilitar el button
            simon.butonJugar.disabled = estadoButton;
          //Deshabilitar el evento de cambiar los niveles
          simon.activarDesactivarNiveles(respuesta.toString());
          simon.turnoActual = simon.turnos[0];
            if(simon.isClicked){
                simon.jugar();
            }
    };
    this.activarDesactivarNiveles = function (respuesta) {//Desactivar el cambio de los niveles durante el juego
            for (var i = 0; i < this.niveles.length; i++) {
                this.niveles[i].style.pointerEvents = respuesta.toString();
            }
    };
    
    this.cambiarTurno = function () {//Cambiar el turno
        this.turnoActual === this.turnos[0] ? this.turnoActual = this.turnos[1]: this.turnoActual = this.turnos[0];
    };
    this.configuracionJuego = function () {
        if (!simon.finJuego) {
            simon.cambiarTurno();
            simon.jugar();
        }
    };
    this.jugar = function () {

        var vigilarClickCajas;
        clearInterval(vigilarClickCajas);//para evitar el solapamiento 
        //Pintar el Turno
        simon.pintarTurnoActual.innerHTML = simon.turnoActual;
        var duracionTotal = caja.duracion * simon.secuencia.length +1000;
        caja.activarEventos("no");
        simon.cambiarVisibility(document.querySelector("#comenzar"),"hidden");
        if (simon.turnoActual === this.turnos[0]) {  // Turno de Simon
            /*Comprar si la secuencia del jugador es igual a la del simon */ 
            if (!simon.comprobarsecuencia()) {
                //Guardar la ultima secuencia del Simon para verificar si entra en el ranking o no 
                simon.ultimaSecuencia = simon.secuencia.length;
                simon.finJuego = true;
                simon.finalDelJuego();
            } else {
                simon.flujoDelJuego(caja.duracion);
            }
        } else if (simon.turnoActual === this.turnos[1]) {
        // Turno del jugador
        caja.activarEventos("si");
        //el usuario tiene un tiempo ilimitado antes de hacer un click
        vigilarClickCajas = setInterval(function () {
            if (caja.cajaMarcada) {
                simon.continuarElJuego(duracionTotal);
                clearInterval(vigilarClickCajas);
            }
        }, 2000);//cada 2 segundos verifica si el usuario ha hecho un click o no
        }
    };
    this.flujoDelJuego = function (duracionTotal) {
        /*cada vez añade una secuencia nueva y la reproduce*/ 
        var sonidoAleatorio = Math.floor(Math.random() * 4) + 1;
        this.secuencia.push(sonidoAleatorio);
        this.play(this.secuencia, duracionTotal+430);
    };
    this.continuarElJuego = function (duracionTotal) {
        setTimeout(function () {//Antes de cambiar el turno espera hasta que termine el jugador actual
        simon.configuracionJuego();
        }, duracionTotal);
    };

    this.play = function(secuencia, tiempoRetraso) {
        var i = 0;
        clearInterval(interval);
        var interval = setInterval(function () {
            if (i < secuencia.length) {
                console.log("play",secuencia[i]);
                caja.activarFiltroYSonido(secuencia[i]);
                i++;
            } else {
                    simon.configuracionJuego(1500);
                clearInterval(interval);
            }
        }, tiempoRetraso + 492); //he aumento el tiempo del interval [porque si una secuencia[i]  === secuencia[i-1] no se ejecuta la segunda]
    };
    this.comprobarsecuencia = function () {
        if (!(this.secuencia.length === this.secuenciaJugador.length)) {
             return false;
        } else {
            for (var i = 0; i < this.secuencia.length; i++) {
                if (parseInt(this.secuencia[i]) !== parseInt(this.secuenciaJugador[i])) {
                    return false;
                }
            }
            //vaciar la secuencia del jugador despues de comprobar si esta bien o no para empezar una nueva 
            this.secuenciaJugador = [];
        }
        return true;
    };

    this.finalDelJuego = function () {
        /*Muestra el mensaje "has perdido" y comproba si el jugador actual entra en el ranking y le muestra el formulario sino reinicia el juego*/ 
        caja.activarEventos("no");
        this.cambiarVisibility(document.querySelector("#fin"),"visible");
        if(ranking.comprobarRanking(this.ultimaSecuencia-1)){
            this.cambiarVisibility(document.querySelector(".leftAside"),"visible");
        }
        setTimeout(function(){
            simon.cambiarVisibility(document.querySelector(".turnos"),"hidden");
            simon.cambiarVisibility(document.querySelector("#fin"),"hidden");
        },2000)
        //reiniciar las  variables y estado del juego
        this.isClicked = false;
        this.finJuego = false;
        this.secuencia = [];
        this.secuenciaJugador = [];
        this.nivelSeleccionado = Object.keys(this.nivel)[0];
        this.niveles[0].checked = true;
        this.estadoDelInicio("auto",false);
    };
    }
    
    function Caja() {
    this.cajas = [];
    this.cajitaSimon;
    this.duracion;
    this.cajaMarcada = false;
    this.sonidoActual = null;
    this.sonidoEnReproduccion = false;

    this.pintar = function () {
        for (var i = 1; i <= 4; i++) {
            this.cajitaSimon = document.createElement("DIV");
            this.cajitaSimon.id = `caja${i}`;
            // console.log("id caja ",cajita.id.substring(4,5))
            this.cajitaSimon.className = "caja";
            //creamos un <audio> dentro de cada caja ,para facilitar el acceso al audio
            this.cajitaSimon.audio = document.createElement("audio");
            this.cajitaSimon.audio.id = `audio${i}`;
            this.cajitaSimon.audio.src = `sonido/piano${i}.mp3`;
            this.cajitaSimon.appendChild(this.cajitaSimon.audio);
            this.cajas.push(this.cajitaSimon);
            this.cajitaSimon.addEventListener("click", function () {
                if (simon.turnoActual === simon.turnos[1]) {
                    simon.secuenciaJugador.push(parseInt(this.id.substring(4, 5)));
                    caja.activarFiltroYSonido(this.id.substring(4, 5)); //seleccionar el id de la caja
                    caja.cajaMarcada = true;
                    //Cambiar el estado de la cajaMarcada despues de pasar la secuencia
                    setTimeout(function () {
                        caja.cajaMarcada = false;
                    }, caja.duracion * 4);
                }
            });
        }
        return this.cajas;
    };
    this.activarFiltroYSonido = function (id) {
        var idCajaAudio = parseInt(id) - 1;
        clearTimeout(pausarFilterSonid);
        var cajaActual = caja.cajas[idCajaAudio];
        var audio = cajaActual.audio;
        audio.play();
        cajaActual.style.filter = "opacity(50%) drop-shadow(16px 6px 50px rgb(133, 133, 155)) ";
        //Empieza el sonido y el filtero al mismo tiempo y se desaparecen cuando termina la duración[2segundos/1/0.5s]
        var pausarFilterSonid = setTimeout(function () {
            cajaActual.style.filter = "none";
            audio.pause();
        }, caja.duracion);
    };
    this.activarEventos = function (respuesta) {
        respuesta = respuesta.toString();
        respuesta = respuesta.toLowerCase();
        for (var i = 0; i < this.cajas.length; i++) {
            if (respuesta === "no") {
                this.cajas[i].style.pointerEvents = "none";
            } else {
                this.cajas[i].style.pointerEvents = "auto";
            }
        }
    };
    }
    function Ranking(){
        this.ranking = [];

        this.añadirAlRanking = function(totalRondas,pintarPuntuacion){
            var informacionGanador = {
                nombre: document.querySelector("#nombreUsuario").value,
                ronda:totalRondas,
            }
                //comprobar si la lista no esta llena para añadir informacionGanador al ranking sino eliminamos el último en la lista
                if(this.ranking.length >= 10){
                    this.ranking.pop();
                }else {
                    this.ranking.push(informacionGanador);
                    this.ranking.sort((a, b) =>b.ronda - a.ronda);
                };
                this.pintarListaPuntuacion(pintarPuntuacion);
        };
        this.pintarListaPuntuacion=function(pintarPuntuacion){
            pintarPuntuacion.innerHTML = "";//Limpiar el contenido 
            for(var i = 0; i < this.ranking.length;i++){
                if(this.ranking[i].nombre !== null || this.ranking[i].nombre !== undefined){
                    pintarPuntuacion.innerHTML += `<div>${i+1}</div>
                        <div class="rank">${this.ranking[i].nombre}</div>
                        <div class="rondas"> ${this.ranking[i].ronda}<div>`;
                }
            }
        };
        this.comprobarRanking= function(totalRondas){
              //Comprobar si el jugador actual entra en el top 10
              /*-si el ranking está vacío--> el jugador actual debe superar como minimo la primera ronda.*/ 
              /*-si el ranking no está vació --> el jugador actual entrará al ranking si su puntuación es mayor que la puntuación más baja en el ranking*/
              this.ranking.sort((a,b) => b.ronda - a.ronda); 
               return this.ranking.length === 0 ?  totalRondas >= 1 :totalRondas > this.ranking[0].ronda;
        }
    }


    function init() {
        simon = new Simon();
        caja = new Caja();
        simon.pintar();
    }
    init(); 