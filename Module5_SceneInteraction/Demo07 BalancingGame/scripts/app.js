var demo = (function() {

    "use strict";

    Physijs.scripts.worker = '../../libs/physijs_worker.js';
    Physijs.scripts.ammo = 'ammo.js';

    var scene = new Physijs.Scene(),
        light = new THREE.AmbientLight(0xffffff),
        renderer,
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube,
        stand,
        crossBar,
        ground,
        currentBox = null,
        controls = null;

    var initScene = function() {

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById("webgl-container").appendChild(renderer.domElement);

        scene.add(light);
        scene.setGravity(new THREE.Vector3(0, -30, 0));

        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);

        camera.position.set(0, 50, 70);
        camera.lookAt(scene.position);
        scene.add(camera);

        //stand
        var standMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: 0x888888
            }), {
                restitution: 0,
                friction: 1
            }
        );

        stand = new Physijs.BoxMesh(
            new THREE.CubeGeometry(5, 10, 5),
            standMaterial
        );
        stand.position.y = 5;
        scene.add(stand);

        //crossbar
        var crossBarMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: 0xbb8888
            }),
            0, {
                restitution: 0,
                friction: 1
            }
        );

        crossBar = new Physijs.BoxMesh(
            new THREE.CubeGeometry(50, 3, 3),
            crossBarMaterial
        );
        crossBar.position.y = 12;
        scene.add(crossBar);

        //has crossbar touched the ground?
        crossBar.addEventListener('collision', function(otherObject) {
            
            if (otherObject.name == "ground") {
                alert("Game over!");
            }

        });

        //ground
        var groundMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: 0x008888
            }),
            0.8,
            0.3
        );

        ground = new Physijs.BoxMesh(
            new THREE.CubeGeometry(50, 1, 50),
            groundMaterial,
            0, {
                restitution: 1,
                friction: 1
            }
        );
        ground.position.y = -.5;
        ground.name = "ground";

        scene.add(ground);

        requestAnimationFrame(render);
    };


    function getWorldPosFromMousePos(event) {

        var projector = new THREE.Projector(),
            vector = new THREE.Vector3(
                (event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1,
                0.5),
            dir,
            distance;

        projector.unprojectVector(vector, camera);
        dir = vector.sub(camera.position).normalize();
        distance = -camera.position.z / dir.z;

        return camera.position.clone().add(dir.multiplyScalar(distance));
    }

    function handleMouseDown(event) {

        if (currentBox == null)
            return;

        var boundingCubeMaterial = Physijs.createMaterial(
            new THREE.MeshBasicMaterial({
                color: currentBox.material.color
            }), {
                restitution: 0,
                friction: 1
            }
        );

        var boundingBoxGeometry = currentBox.geometry.clone();

        var boundingBox = new Physijs.BoxMesh(
            boundingBoxGeometry,
            boundingCubeMaterial
        );

        boundingBox.position = currentBox.position.clone();

        scene.remove(currentBox);
        currentBox = null;
        scene.add(boundingBox);

        updateScore();
    }

    function updateScore() {
        var scoreSpan = document.getElementById("score");
        scoreSpan.innerText = parseInt(scoreSpan.innerText) + 1;
    }

    function createBox(event) {

        //position the box the same location as mouse
        var pos = getWorldPosFromMousePos(event);

        //create a random sized box
        var max = 7;
        var min = 4;
        var random = Math.floor(Math.random() * (max - min + 1)) + min;
        var geometry = new THREE.CubeGeometry(random, random, random);

        var material = new THREE.MeshBasicMaterial({
            color: Math.random() * 0xffffff
        });

        var box = new THREE.Mesh(geometry, material);
        box.position = pos;
        box.position.z = 0;
        currentBox = box;

        scene.add(box);

    }

    function handleMouseMove(event) {

        if (currentBox == null) {

            createBox(event);
        }

        //move the box with the mouse
        var newPos = getWorldPosFromMousePos(event);
        currentBox.position = newPos;
    }

    var render = function() {
        scene.simulate(); 
        renderer.render(scene, camera); 
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    var webGl = document.getElementById('webgl-container');
    webGl.addEventListener('mousedown', handleMouseDown, false);
    webGl.addEventListener('mousemove', handleMouseMove, false);

    return {
        scene: scene
    }

})();