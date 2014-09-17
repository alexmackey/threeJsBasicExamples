var example = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(),
        light = new THREE.AmbientLight(0xffffff),
        camera,
        objects = [],
        plane,
        isObjectSelected,
        box,
        line;

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

        camera.position.z = 450;
        camera.position.y = 50;
        scene.add(camera);

        //ground
        var texture = THREE.ImageUtils.loadTexture('content/grasslight-big.jpg') //texture from three.js examples
        var planeMaterial = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
        });

        plane = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), planeMaterial);
        plane.rotation.x = 90 * (Math.PI / 180);
        plane.position.y = -10;
        plane.name = "plane";
        scene.add(plane);

        objects.push(plane);

        box = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshBasicMaterial({
                color: 0xFF0000
            })
        );

        box.name = "box";
        objects.push(box);

        scene.add(box);

        render();
    }

    function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function onDocumentMouseDown(event) {

        event.preventDefault();

        var projector = new THREE.Projector();

        var mouseClickVector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        projector.unprojectVector(mouseClickVector, camera);

        var raycaster = new THREE.Raycaster(camera.position, mouseClickVector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {

            for (var i = 0; i <= intersects.length - 1; i++) {

                if (!isObjectSelected && intersects[i].object.name == 'box') {
                    intersects[0].object.material.color.setHex(Math.random() * 0xffffff);
                    isObjectSelected = true;
                    return;
                } else if (isObjectSelected && intersects[i].object.name == 'plane') {
                    moveObject(intersects[i].point);
                    isObjectSelected = false;
                    return;
                }
            }
        }
    }

    function moveObject(destinationVector) {

        var geometry = new THREE.Geometry();
        geometry.vertices.push(box.position.clone());
        geometry.vertices.push(destinationVector.clone());

        var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color: 0xffffff
        }));

        scene.add(line);
        var tween = createjs.Tween.get(box.position).to({
            x: destinationVector.x,
            z: destinationVector.z
        }, 500);
    }

    window.onload = initScene;

    document.addEventListener('mousedown', onDocumentMouseDown, false);

    return {
        scene: scene
    }

})();