var example = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        renderer = new THREE.WebGLRenderer(),
        light = new THREE.AmbientLight(0xffffff),
        camera,
        monster,
        skin;

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

        camera.position.set(0, 10, 100);

        scene.add(camera);

        var loader = new THREE.ColladaLoader();
        loader.options.convertUpAxis = true;

        //note monster model is from three.js examples
        loader.load('models/monster.dae', function(collada) {
            monster = collada.scene;
            scene.add(monster);

            render();
        });

    };

    function render() {

        monster.rotation.y += 0.02;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    return {
        scene: scene
    }

})();