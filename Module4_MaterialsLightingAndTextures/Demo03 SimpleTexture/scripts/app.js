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

        camera.position.z = 170;
        camera.position.y = 20;

        scene.add(camera);

        light = new THREE.AmbientLight("#ffffff");

        scene.add(light);

        cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
            new THREE.MeshBasicMaterial({
                map: THREE.ImageUtils.loadTexture('content/crate.gif') //texture from three.js examples\textures\crate.gif 
                //,color: '#ff0000'
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