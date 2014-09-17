var demo = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        light,
        light2,
        ambientLight,
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube,
        cube2,
        plane,
        cubeRotate = true,
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

        camera.position.z = 210;
        camera.position.y = 40;

        scene.add(camera);

        setupGui();

        light = new THREE.SpotLight(itemsToControl.lightColor);
        light.position.set(-30, 100, 0);
        scene.add(light);

        light2 = new THREE.SpotLight(itemsToControl.lightColor);
        light2.position.set(30, 100, 0);
        scene.add(light2);

        ambientLight = new THREE.AmbientLight(itemsToControl.ambientLightColor);
        scene.add(ambientLight);

        cube = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
            new THREE.MeshLambertMaterial({
                color: itemsToControl.baseColor,
                ambient: itemsToControl.ambientColor,
                emissive: itemsToControl.emissiveColor,
            }));

        cube.position.set(-50, 20, 0);
        cube.name = "cube";
        scene.add(cube);

        cube2 = new THREE.Mesh(new THREE.BoxGeometry(40, 40, 40),
            new THREE.MeshPhongMaterial({
                color: itemsToControl.baseColor,
                ambient: itemsToControl.ambientColor,
                specular: itemsToControl.specularColor,
                emissive: itemsToControl.emissiveColor,
                shininess: itemsToControl.shininess,
                shading: THREE.FlatShading,
                side: THREE.DoubleSide
            })
        );

        cube2.position.set(50, 20, 0);
        cube2.name = "cube";
        scene.add(cube2);


        render();
    };

    function setupGui() {

        itemsToControl = new function() {
            this.ambientLightColor = '#0b062f';
            this.color = '#ffffff';
            this.ambientColor = '#ffffff';
            this.specularColor = '#ffffff';
            this.emissiveColor = '#0b062f';
            this.lightColor = '#ffffff';
            this.shininess = 100;
            this.rotateCube = 'Yes';
        };

        var gui = new dat.GUI();

        var baseColor = gui.addColor(itemsToControl, 'color');

        baseColor.onChange(function(value) {
            changeValue('color', value)
        });

        var ambientColor = gui.addColor(itemsToControl, 'ambientColor');

        ambientColor.onChange(function(value) {
            changeValue('ambient', value)
        });

        var emissiveColor = gui.addColor(itemsToControl, 'emissiveColor');

        emissiveColor.onChange(function(value) {
            changeValue('emissive', value)
        });

        var specularColor = gui.addColor(itemsToControl, 'specularColor');

        specularColor.onChange(function(value) {
            changeValue('specular', value)
        });

        var lightColor = gui.addColor(itemsToControl, 'lightColor');

        lightColor.onChange(function(value) {

            light.color = new THREE.Color(value);
            light2.color = new THREE.Color(value);

            cube.material.needsUpdate = true;
            cube2.material.needsUpdate = true;
        });

        var ambientLightColorGui = gui.addColor(itemsToControl, 'ambientLightColor');

        ambientLightColorGui.onChange(function(value) {

            ambientLight.color = new THREE.Color(value);
            ambientLight.color = new THREE.Color(value);

            cube.material.needsUpdate = true;
            cube2.material.needsUpdate = true;
        });


        var shininess = gui.add(itemsToControl, 'shininess', 0, 100);

        shininess.onChange(function(value) {
            changeValue('shininess', value)
        });

        var rotateCube = gui.add(itemsToControl, 'rotateCube', ['Yes', 'No']);

        rotateCube.onChange(function(value) {
            cubeRotate = value == 'Yes';
        });

    }

    function changeValue(valueToChange, newValue) {


        if (cube.material[valueToChange]) {

            if (valueToChange != 'shininess') {
                cube.material[valueToChange] = new THREE.Color(newValue);
            } else {
                cube.material.shininess = newValue;
            }

        }

        if (cube2.material[valueToChange] || valueToChange == 'shininess') {

            if (valueToChange != 'shininess') {
                cube2.material[valueToChange] = new THREE.Color(newValue);
            } else {
                cube2.material.shininess = newValue;
            }

        }

        cube.material.needsUpdate = true;
        cube2.material.needsUpdate = true;
    }

    function render() {

        if (cubeRotate) {
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
        scene: scene,
        cube: cube,
        cube2: cube2
    }

})();