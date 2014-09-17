var demo = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        light = new THREE.AmbientLight(0xffffff),
        ambientLight,
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube,
        lightCube,
        plane,
        itemsToControl,
        rotateCube = true,
        showShadowCastSetting = false,
        ground;

    function initScene() {

        renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById("webgl-container").appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        renderer.shadowMapEnabled = true;
        renderer.shadowMapSoft = true;

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

        light.position.y = 50;

        setupGui();

        changeLight('directional');

        lightCube = new THREE.Mesh(
            new THREE.BoxGeometry(4, 4, 4),
            new THREE.MeshBasicMaterial({
                color: itemsToControl.cubeColor
            }));

        lightCube.name = "lightCube";
        light.add(lightCube);

        createCube();
        render();
    };


    function setupGui() {

        itemsToControl = new function() {

            this.lightType = 'ambient';
            this.cubeMaterial = 'lambert';
            this.cubeRotate = 'Yes';
            this.ambientLight = 'No';
            this.showShadowCast = 'No';
            this.lightColor = "#ffffff";
            this.cubeColor = "#ffffff";

            this.cubeColor = "#ffffff";
            this.ambientColor = '#ffffff';
            this.specularColor = '#ffffff';
            this.emissiveColor = '#0b062f';

            this.lightIntensity = 1;
            this.lightDistance = 100;
            this.lightAngle = Math.PI / 3;

            this.cameraXPos = camera.position.x,
            this.cameraYPos = camera.position.y,
            this.cameraZPos = camera.position.z;

            this.lightXPos = light.position.x,
            this.lightYPos = light.position.y,
            this.lightZPos = light.position.z
        };

        var gui = new dat.GUI();

        var lightType = gui.add(itemsToControl, 'lightType', ['directional', 'point', 'spot']);
        lightType.onChange(function(value) {
            changeLight(value)
        });

        var cubeRotate = gui.add(itemsToControl, 'cubeRotate', ['Yes', 'No']);
        cubeRotate.onChange(function(value) {
            rotateCube = value == 'Yes';
        });

        var showShadowCast = gui.add(itemsToControl, 'showShadowCast', ['Yes', 'No']);
        showShadowCast.onChange(function(value) {
            light.shadowCameraVisible = value == 'Yes';
        });

        var ambientLight = gui.add(itemsToControl, 'ambientLight', ['Yes', 'No']);
        ambientLight.onChange(function(value) {
            if (value == 'No') {
                if (ambientLight) scene.remove(ambientLight);
            } else {
                ambientLight = new THREE.AmbientLight('#ffffff');
                scene.add(ambientLight);
            }
        });

        //light
        var lightColor = gui.addColor(itemsToControl, 'lightColor');
        lightColor.onChange(function(value) {
            changeLightColor(value);
        });

        var lightIntensity = gui.add(itemsToControl, 'lightIntensity', 0, 10);
        lightIntensity.onChange(function(value) {
            changeLightIntensity(value);
        });

        var lightDistance = gui.add(itemsToControl, 'lightDistance', 0, 200);
        lightDistance.onChange(function(value) {
            changeLightDistance(value);
        });

        var lightAngle = gui.add(itemsToControl, 'lightAngle', 0, 180);
        lightAngle.onChange(function(value) {
            changeLightAngle(value);
        });

        //cube
        var cubeMaterial = gui.add(itemsToControl, 'cubeMaterial', ['phong', 'lambert']);
        cubeMaterial.onChange(function(value) {
            changeCubeMaterial(value);
        });

        var cubeColor = gui.addColor(itemsToControl, 'cubeColor');
        cubeColor.onChange(function(value) {
            changeCubeColor('color', value);
        });

        var specularColor = gui.addColor(itemsToControl, 'specularColor');
        specularColor.onChange(function(value) {
            changeCubeColor('specular', value);
        });

        var ambientColor = gui.addColor(itemsToControl, 'ambientColor');
        ambientColor.onChange(function(value) {
            changeCubeColor('ambient', value);
        });

        var emissiveColor = gui.addColor(itemsToControl, 'emissiveColor');
        emissiveColor.onChange(function(value) {
            changeCubeColor('emissive', value);
        });

        //camera            
        var cameraXPos = gui.add(itemsToControl, 'cameraXPos', -200, 200);
        var cameraYPos = gui.add(itemsToControl, 'cameraYPos', -200, 200);
        var cameraZPos = gui.add(itemsToControl, 'cameraZPos', -400, 400);

        cameraXPos.onChange(function(value) {
            move(camera, 'x', value)
        });
        cameraYPos.onChange(function(value) {
            move(camera, 'y', value)
        });
        cameraZPos.onChange(function(value) {
            move(camera, 'z', value)
        });

        //light position            
        var lightXPos = gui.add(itemsToControl, 'lightXPos', -200, 200);
        var lightYPos = gui.add(itemsToControl, 'lightYPos', -200, 200);
        var lightZPos = gui.add(itemsToControl, 'lightZPos', -200, 200);

        lightXPos.onChange(function(value) {
            move(light, 'x', value)
        });
        lightYPos.onChange(function(value) {
            move(light, 'y', value)
        });
        lightZPos.onChange(function(value) {
            move(light, 'z', value)
        });
    }

    function changeCubeMaterial(materialType) {
        if (cube) scene.remove(cube);
        var material;

        if (materialType == 'phong') {

            material = new THREE.MeshPhongMaterial({
                specular: itemsToControl.specularColor,
                color: itemsToControl.cubeColor,
                ambient: itemsToControl.ambientColor,
                emissive: itemsToControl.emissiveColor,
                shininess: 100
            });
        } else {

            material = new THREE.MeshLambertMaterial({
                Color: '#ffffff'
            });
        }

        createCube(material);
    }

    function createCube(material) {

        if (!material) material = new THREE.MeshLambertMaterial({
            Color: '#ffffff'
        });

        cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), material);
        cube.position.y = 10;
        cube.name = "cube";
        cube.castShadow = true;
        cube.material.needsUpdate = true;

        scene.add(cube);
    }

    function changeCubeColor(colorType, color) {
        cube.material[colorType] = new THREE.Color(color);
        cube.material.needsUpdate = true;
    }

    function changeLightColor(color) {
        light.color = new THREE.Color(color);
        cube.material.needsUpdate = true;
    }

    function changeLightIntensity(intensity) {
        light.intensity = intensity;
        cube.material.needsUpdate = true;
    }

    function changeLightDistance(value) {
        light.distance = value;
        cube.material.needsUpdate = true;
    }

    function changeLightAngle(value) {
        light.angle = value * (Math.PI / 180);
        cube.material.needsUpdate = true;
    }

    function changeLight(lightType) {

        scene.remove(light);

        if (lightType == "ambient") {
            light = new THREE.AmbientLight(new THREE.Color(itemsToControl.lightColor))
        } else if (lightType == "directional") {
            light = new THREE.DirectionalLight(new THREE.Color(itemsToControl.lightColor));
            light.position.set(itemsToControl.lightXPos, itemsToControl.lightYPos, itemsToControl.lightZPos);
            light.castShadow = true;
        } else if (lightType == "point") {
            light = new THREE.PointLight(new THREE.Color(itemsToControl.lightColor), itemsToControl.lightIntensity, itemsToControl.lightDistance);
            light.position.set(itemsToControl.lightXPos, itemsToControl.lightYPos, itemsToControl.lightZPos);
        } else if (lightType == "spot") {
            light = new THREE.SpotLight(new THREE.Color(itemsToControl.lightColor));
            light.position.set(itemsToControl.lightXPos, itemsToControl.lightYPos, itemsToControl.lightZPos, itemsToControl.lightAngle);
            light.castShadow = true;
        }

        light.shadowCameraVisible = showShadowCastSetting;
        light.shadowMapWidth = 2048;
        light.shadowMapHeight = 2048;

        if (cube) cube.material.needsUpdate = true;
        if (plane) plane.material.needsUpdate = true;

        light.add(lightCube);
        scene.add(light);
    }

    function move(item, axis, value) {
        item.position[axis] = value;
    }

    function render() {

        if (rotateCube) {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
        }

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    };

    window.onload = initScene;

    return {
        scene: scene
    }

})();