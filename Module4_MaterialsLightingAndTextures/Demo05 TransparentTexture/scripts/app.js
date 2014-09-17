var demo = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        light,
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube;

    function initScene() {

        renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById("webgl-container").appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );

        camera.position.z = 150;
        camera.position.y = 15;

        scene.add(camera);

        light = new THREE.AmbientLight("#ffffff");

        scene.add(light);

        cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
            new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('content/crate.png'), //texture from three.js examples\textures\crate.gif 
                transparent: true,
                side: THREE.DoubleSide
            }));

        cube.position.set(0, 20, 0);
        cube.name = "cube";

        scene.add(cube);
        render();
    };

    function render() {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    return {
        scene: scene
    }

})();