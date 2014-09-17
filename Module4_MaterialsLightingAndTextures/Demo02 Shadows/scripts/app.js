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
        renderer.shadowMapEnabled = true;

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

        plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200),
            new THREE.MeshPhongMaterial({
                color: 0x0088aa,
                ambient: 0x0088aa,
                specular: 0x003344,
                shininess: 100,
                shading: THREE.FlatShading,
                side: THREE.DoubleSide
            }));

        plane.rotation.x = 90 * (Math.PI / 180);
        plane.position.y = -10;

        plane.name = "plane";
        plane.receiveShadow = true;

        scene.add(plane);

        light = new THREE.DirectionalLight(new THREE.Color("#ffffff"));
        light.position.set(0, 50, 0);
        light.castShadow = true;

        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;

        scene.add(light);

        cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshLambertMaterial({
                Color: '#ffffff'
            }));
        
        cube.position.y = 10;
        cube.name = "cube";
        cube.castShadow = true;

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