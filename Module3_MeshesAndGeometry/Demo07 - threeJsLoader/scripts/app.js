var example = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        renderer = new THREE.WebGLRenderer(),
        light = new THREE.AmbientLight(0xffffff),
        camera,
        monkey;

    function initScene() {

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("webgl-container").appendChild(renderer.domElement);

        scene.add(light);

        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );

        camera.position.set(0, 0, 5);

        scene.add(camera);

        var loader = new THREE.JSONLoader();

        loader.load("models/monkey.js", function(geometry, materials) {

            var material = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                wireframe: true
            });

            monkey = new THREE.Mesh(geometry, material);

            scene.add(monkey);
            render();

        });

    };

    function render() {

        monkey.rotation.y += 0.02;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    return {
        scene: scene
    }

})();