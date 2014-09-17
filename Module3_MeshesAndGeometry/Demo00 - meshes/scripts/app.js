var example = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        renderer = new THREE.WebGLRenderer(),
        light = new THREE.AmbientLight(0xffffff),
        camera,
        itemsToRotate = [];

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

        camera.position.x = -80;
        camera.position.z = 200;
        scene.add(camera);

        var material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true
        });

        var box = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), material);
        box.position.x = -4;
        itemsToRotate.push(box);
        scene.add(box);

        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(10, 10, 20, 32), material);
        cylinder.position.x = -30;
        itemsToRotate.push(cylinder);
        scene.add(cylinder);

        var ring = new THREE.Mesh(new THREE.RingGeometry(1, 10, 32), material);
        ring.position.x = -60;
        itemsToRotate.push(ring);
        scene.add(ring);

        var sphere = new THREE.Mesh(new THREE.SphereGeometry(10, 32, 32), material);
        sphere.position.x = -90;
        itemsToRotate.push(sphere);
        scene.add(sphere);

        var torus = new THREE.Mesh(new THREE.TorusGeometry(10, 3, 16, 100), material);
        torus.position.x = -120;
        itemsToRotate.push(torus);
        scene.add(torus);

        var torusKnot = new THREE.Mesh(new THREE.TorusKnotGeometry(10, 3, 100, 16), material);
        torusKnot.position.x = -150;
        itemsToRotate.push(torusKnot);
        scene.add(torusKnot);

        render();
    };

    function render() {

        for (var i = itemsToRotate.length - 1; i >= 0; i--) {
            itemsToRotate[i].rotation.y += 0.03;
            itemsToRotate[i].rotation.x += 0.03;
        };

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    return {
        scene: scene
    }



})();