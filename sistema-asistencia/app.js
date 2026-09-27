<!DOCTYPE html>

<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

```
<title>Control de Asistencia - Peppers Chicken</title>

<link rel="stylesheet" href="style.css">

<style>

    body {
        min-height: 100vh;
        margin: 0;
        padding: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .contenedor {
        width: 100%;
        max-width: 950px;
        margin: auto;
        padding: 20px 25px;
    }

    /* ENCABEZADO */

    .encabezado {
        text-align: center;
        margin-bottom: 12px;
    }

    .encabezado h1 {
        margin: 0;
        font-size: 42px;
    }

    .empresa {
        margin: 3px 0;
        font-size: 24px;
        font-weight: bold;
    }

    #reloj {
        font-size: 25px;
        font-weight: bold;
        margin-top: 5px;
    }

    #fecha {
        font-size: 15px;
        margin-top: 2px;
    }

    /* ÁREA PRINCIPAL */

    .zona-marcacion {
        display: grid;
        grid-template-columns: 0.9fr 1.1fr;
        gap: 25px;
        align-items: center;
    }

    /* DNI */

    .seccion-dni {
        text-align: center;
    }

    .seccion-dni label {
        display: block;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 8px;
    }

    .seccion-dni input {
        width: 100%;
        max-width: 300px;
        height: 58px;
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        letter-spacing: 5px;

        /* DNI AMARILLO */
        background: #ffd43b;
        color: #222;

        border: 3px solid #e0a800;
        border-radius: 10px;
    }

    /* INFORMACIÓN */

    .trabajador-info {
        min-height: 35px;
        margin-top: 10px;
        text-align: center;
        font-size: 17px;
    }

    /* TECLADO */

    .teclado {
        width: 100%;
        max-width: 360px;
        margin: auto;

        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
    }

    .teclado button {
        height: 58px;
        border-radius: 9px;
        font-size: 25px;
        font-weight: bold;
        cursor: pointer;
        touch-action: manipulation;
    }

    /* BOTONES */

    .botones {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        margin-top: 18px;
    }

    .botones button {
        height: 60px;
        border-radius: 10px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        touch-action: manipulation;
    }

    #btnEntrada {
        background: #198754;
        color: white;
        border: none;
    }

    #btnSalida {
        background: #dc3545;
        color: white;
        border: none;
    }

    /* MENSAJE */

    #mensaje {
        margin-top: 12px;
        min-height: 35px;
        text-align: center;
        font-size: 17px;
        font-weight: bold;
    }

    /* PANTALLAS PEQUEÑAS */

    @media (max-width: 700px) {

        body {
            padding: 8px;
        }

        .contenedor {
            padding: 15px;
        }

        .encabezado h1 {
            font-size: 34px;
        }

        .zona-marcacion {
            grid-template-columns: 1fr;
            gap: 12px;
        }

        .teclado {
            max-width: 330px;
        }

        .teclado button {
            height: 52px;
            font-size: 22px;
        }

        .botones button {
            height: 55px;
            font-size: 18px;
        }

    }

</style>
```

</head>

<body>

```
<div class="contenedor">

    <!-- ENCABEZADO -->

    <div class="encabezado">

        <h1>🐥</h1>

        <p class="empresa">
            PEPPERS CHICKEN
        </p>

        <h2>
            CONTROL DE ASISTENCIA
        </h2>

        <div id="reloj">
            00:00:00
        </div>

        <div id="fecha">
            Cargando fecha...
        </div>

    </div>


    <!-- ÁREA DE MARCACIÓN -->

    <div class="zona-marcacion">

        <!-- DNI -->

        <div>

            <div class="seccion-dni">

                <label>
                    INGRESE SU DNI
                </label>

                <input
                    type="text"
                    id="dni"
                    placeholder="--------"
                    maxlength="8"
                    readonly
                >

            </div>


            <!-- INFORMACIÓN DEL TRABAJADOR -->

            <div
                id="trabajadorInfo"
                class="trabajador-info">
            </div>

        </div>


        <!-- TECLADO TÁCTIL -->

        <div class="teclado">

            <button class="numero" data-numero="1">
                1
            </button>

            <button class="numero" data-numero="2">
                2
            </button>

            <button class="numero" data-numero="3">
                3
            </button>

            <button
                class="borrar"
                id="btnBorrar">
                ⌫
            </button>


            <button class="numero" data-numero="4">
                4
            </button>

            <button class="numero" data-numero="5">
                5
            </button>

            <button class="numero" data-numero="6">
                6
            </button>

            <button
                class="limpiar"
                id="btnLimpiar">
                C
            </button>


            <button class="numero" data-numero="7">
                7
            </button>

            <button class="numero" data-numero="8">
                8
            </button>

            <button class="numero" data-numero="9">
                9
            </button>

            <button
                class="numero"
                data-numero="0">
                0
            </button>

        </div>

    </div>


    <!-- BOTONES DE MARCACIÓN -->

    <div class="botones">

        <button id="btnEntrada">
            ✓ ENTRADA
        </button>

        <button id="btnSalida">
            ↪ SALIDA
        </button>

    </div>


    <!-- MENSAJE -->

    <div id="mensaje"></div>

</div>


<script src="app.js"></script>
```

</body>

</html>
