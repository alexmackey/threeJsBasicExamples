var demo = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        light,
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube,
        plane;

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
        camera.position.y = -5;

        scene.add(camera);

        var texture = THREE.ImageUtils.loadTexture('content/fire.jpg'); //lava texture from http://opengameart.org/sites/default/files/fire.jpg
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        texture.repeat.set(10, 10);

        plane = new THREE.Mesh(new THREE.PlaneGeometry(3400, 3400),
            new THREE.MeshPhongMaterial({
                emissive: 0xffcb00,
                specular: 0xffcb00,
                shininess: 50,
                map: texture,
                side: THREE.DoubleSide
            })
        );

        plane.rotation.x = 90 * (Math.PI / 180);
        plane.position.y = -10;

        plane.name = "plane";

        scene.add(plane);

        light = new THREE.DirectionalLight(new THREE.Color("#ffee00"));
        light.position.set(0, 50, 0);

        scene.add(light);

        render();
    };

    function alterGeometry() {

        for (var i = 0; i <= plane.geometry.vertices.length - 1; i++) {

            var random = Math.floor((Math.random() * 10) + 1) / 50;
            plane.geometry.vertices[i].z += random;

        };

        plane.geometry.verticesNeedUpdate = true;
        plane.material.needsUpdate = true;
    }

    function render() {

        //this is not a great way to do this and the three.js clock could do this better but we havent covered this yet
        var random = Math.floor((Math.random() * 10) + 1);

        if (random > 9) alterGeometry();

        if (plane) {
            plane.material.map.offset.x += 0.001;
            plane.material.map.offset.y += 0.001;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    return {
        scene: scene
    }

})();