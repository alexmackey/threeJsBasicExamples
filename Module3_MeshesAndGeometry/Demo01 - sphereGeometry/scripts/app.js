var example = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        light = new THREE.PointLight(0xffffff),
        camera,
        renderer = new THREE.WebGLRenderer(),
        sphere,
        stats;


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

        camera.position.z = 80;
        scene.add(camera);

        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });

        sphere = new THREE.Mesh(
            new THREE.SphereGeometry(
                15,
                50,
                50),
            material);

        sphere.name = "sphere";

        scene.add(sphere);

        stats = new Stats();
        stats.setMode(0);

        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);

        render();
    };

    function render() {

        sphere.rotation.y += 0.005;

        renderer.render(scene, camera);
        requestAnimationFrame(render);

        stats.update();
    };

    window.onload = initScene;

    return {
        scene: scene,
        sphere: sphere
    }

})();