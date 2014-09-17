var example = (function() {

    "use strict";

    var scene = new THREE.Scene(),
        renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(),
        light = new THREE.AmbientLight(0xffffff),
        camera,
        box,
        box2,
        width=800,
        height=600;

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

        camera.position.z = 200;
        scene.add(camera);

        box = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshBasicMaterial({
                color: 0xFF0000
            })
        );

        box.name = "box";
        box.geometry.computeBoundingBox()

        box2 = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshBasicMaterial({
                color: 0x00FF00
            })
        );

        box2.name = "box2";
        box2.position.x = 40;
        box2.geometry.computeBoundingBox();

        scene.add(box);
        scene.add(box2);

        render();
    }

    function render() {

        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }

    function checkKey(e) {

        var left = 37,
            up = 38,
            right = 39,
            down = 40,
            increment = 5;

        e = e || window.event;
      
        if (e.keyCode == up) {
            box.position.z -= increment;
        } else if (e.keyCode == down) {
            box.position.z += increment;
        } else if (e.keyCode == left) {
            box.position.x -= increment;
        } else if (e.keyCode == right) {
            box.position.x += increment;
        }
       
        checkForCollision();
    }

    function checkForCollision(){

        var boxPosition = new THREE.Box3().setFromObject( box );
        var box2Position = new THREE.Box3().setFromObject( box2 );

        if(boxPosition.isIntersectionBox(box2Position)){
            document.querySelector('h1').textContent='Boxes touching';
        }
        else{
            document.querySelector('h1').textContent='Boxes not touching';
        }
    }

    window.onload = initScene;
    window.onkeydown = checkKey;

    return {
        scene: scene,
        box: box,
        box2: box2
    }

})();