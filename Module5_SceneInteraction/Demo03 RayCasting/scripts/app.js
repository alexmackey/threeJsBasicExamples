var example = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(),
        light = new THREE.AmbientLight(0xffffff),
        camera,
        objects = [],
        sphere,
        sphere2,
        width = 800,
        height = 600;

    function initScene() {

        renderer.setSize(width, height);

        document.getElementById("webgl-container").appendChild(renderer.domElement);

        scene.add(light);

        camera = new THREE.PerspectiveCamera(
            35,
            width / height,
            1,
            1000
        );

        camera.position.z = 150;
        scene.add(camera);

        sphere = new THREE.Mesh(new THREE.SphereGeometry(20, 16, 16), new THREE.MeshBasicMaterial({
            color: 0xff0000,
        }));

        sphere.position.set(-25, 0, 0);

        objects.push(sphere);

        sphere2 = new THREE.Mesh(new THREE.SphereGeometry(20, 16, 16), new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        }));

        sphere2.position.set(25, 0, 0);

        objects.push(sphere2);

        scene.add(sphere);
        scene.add(sphere2);

        render();
    }

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function onDocumentMouseDown(event) {

        var projector = new THREE.Projector();

        var mouseClickVector =
            new THREE.Vector3(
                (event.clientX / width) * 2 - 1, -(event.clientY / height) * 2 + 1,
                0.5);

        projector.unprojectVector(mouseClickVector, camera);

        var raycaster = new THREE.Raycaster(camera.position,
            mouseClickVector.sub(camera.position).normalize());

        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
        }

    }


    window.onload = initScene;
    window.addEventListener('mousedown', onDocumentMouseDown, false);

    return {
        scene: scene
    }

})();