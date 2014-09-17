var demo = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        light,
        light2,
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube,
        cube2,
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
       
        camera.position.z = 200;
        camera.position.y = 20;

        scene.add(camera);
        
        light = new THREE.SpotLight(new THREE.Color("#ffffff"));
        light.position.set(-50, 100, 0);
        scene.add(light);
        
        light2 = new THREE.SpotLight(new THREE.Color("#ffffff"));
        light2.position.set(50, 100, 0);
        scene.add(light2);        

         var ambientLight = new THREE.AmbientLight(0xbbbbbb);
      scene.add(ambientLight);
      
        cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), new THREE.MeshLambertMaterial({Color: '#ffffff',  transparent: true, opacity: 0.2}));
        cube.position.set(-50, 20, 0);
        cube.name = "cube";
        scene.add(cube);      

        cube2 = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40), 
                new THREE.MeshPhongMaterial({
                                color: 0x0088aa,
                                ambient: 0x0088aa,
                                specular: 0x003344,
                                shininess: 100,
                                shading: THREE.FlatShading, 
                                side: THREE.DoubleSide,
                                 transparent: true, 
                                 opacity: 0.75
                            })
            );
        cube2.position.set(50, 20, 0);
        cube2.name = "cube";
        scene.add(cube2);     
               
        render();
    };


    function render() {
        
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;

        cube2.rotation.x += 0.01;
        cube2.rotation.y += 0.01;

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };


    window.onload = initScene;

    return {
        scene: scene
    }

})();