<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Smart Presentation</title>
        <!-- <link rel="icon" type="image/x-icon" href="assets/SR_logo_03_red.png"> -->
        <meta charset="UTF-8">

        <script src="https://cdn.jsdelivr.net/npm/gsap@3.2.4/dist/gsap.js"></script>
        <link rel="stylesheet" href="./style/style.css" >
        <script async src="https://unpkg.com/es-module-shims@1.6.3/dist/es-module-shims.js"></script>

        <script type="importmap">
            {
                "imports": {
                "three": "https://unpkg.com/three@0.154.0/build/three.module.js",
                "three/addons/": "https://unpkg.com/three@0.154.0/examples/jsm/"
                }
            }
        </script>
    </head>
    <body>
        <div class="home-page">
            <canvas id="myCanvas">    </canvas>


            <div class="loadingScreenContainer" style="display: none">
                <label for="loadingBar" id='loadingBarLabel'> Loading... </label>
                <progress id='loadingBar' max='100' value='0'></progress>
            </div>

            <script type="module" src="script.js"> </script>
        </div>
    </body>
</html>
