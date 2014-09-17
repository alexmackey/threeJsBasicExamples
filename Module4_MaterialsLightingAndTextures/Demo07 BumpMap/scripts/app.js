var demo = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        light,
        directionalLight,
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube,
        cube2,
        cubeRotate=false,
        normalsHelper,
        //textures from trail version of http://www.arroway-textures.com/en/catalog/0/441
        texturePath='content/pavement/pavement-008_d100.png',
        bumpMapPath='content/pavement/pavement-008_b030.png',
        itemsToControl;        

    function initScene() {

        renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById("webgl-container").appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
       
        camera.position.z = 50;
        camera.position.y = 20;

        scene.add(camera);
        
        light = new THREE.AmbientLight("#cccccc");
        
        scene.add(light);

        directionalLight = new THREE.DirectionalLight("#ffffff");
        
        scene.add(directionalLight);

        setupGui();

        cube = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), createMaterialWithBumpMap());
        cube.position.set(-10, 20, 0);
        cube.name = "cube";
        scene.add(cube);  

        cube2 = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), createMaterialWithoutBumpMap());
        cube2.position.set(10, 20, 0);
        cube2.name = "cube2";
        scene.add(cube2);         
        
        render();
    };

    function createMaterialWithoutBumpMap(){
         var materialWithoutBumpMap  = new THREE.MeshPhongMaterial()
        materialWithoutBumpMap.map  = THREE.ImageUtils.loadTexture(texturePath);

        return materialWithoutBumpMap;
    }

     function createMaterialWithBumpMap(){
        var materialWithBumpMap  = new THREE.MeshPhongMaterial()
        materialWithBumpMap.map  = THREE.ImageUtils.loadTexture(texturePath);
        materialWithBumpMap.bumpMap = THREE.ImageUtils.loadTexture(bumpMapPath);
        materialWithBumpMap.bumpScale = itemsToControl.bumpScale;

        return materialWithBumpMap;
    }

      function setupGui() {
        itemsToControl = new function() {
            this.useBumpMap = true;
            this.bumpScale = 2;
            this.rotateCube = 'No';

            this.focusOnBumpCube = function() { 
                camera.position.x = -10
                camera.position.z = 20;
                camera.position.y = 20;
            };
        };

        var gui = new dat.GUI();

        gui.add(itemsToControl, 'focusOnBumpCube');
        
        var useBumpMap =  gui.add(itemsToControl, 'useBumpMap', ['Yes', 'No'] );
        
        useBumpMap.onChange(function(useBumpMap) {
            updateBumpMap(useBumpMap, itemsToControl.bumpScale);
        });

         var rotateCube =  gui.add(itemsToControl, 'rotateCube', ['Yes', 'No'] );
        
        rotateCube.onChange(function(value) {
            cubeRotate = value == 'Yes'
        });

        var bumpScale =  gui.add(itemsToControl, 'bumpScale', 0, 10);
        
        bumpScale.onChange(function(bumpScale) {
            updateBumpMap(itemsToControl.useBumpMap, bumpScale);
        });

    }

    function updateBumpMap(useBumpMap, bumpScale){

        cube.material.bumpScale = bumpScale;

        if(useBumpMap=='No'){

            cube.material = createMaterialWithoutBumpMap();
        }
        else{
            cube.material = createMaterialWithBumpMap();
        }

        cube.material.bumpMap.needsUpdate = true;
        cube.material.needsUpdate=true;
    }

    function render() {
        
        if(cubeRotate){
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            cube2.rotation.x += 0.01;
            cube2.rotation.y += 0.01; 
        }       

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };


    window.onload = initScene;

    return {
        scene: scene
    }

})();