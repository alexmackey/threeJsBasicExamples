var example = (function(){

    "use strict";
    
    var scene=new THREE.Scene(),
    renderer = window.WebGLRenderingContext ? new THREE.WebGLRenderer() : new THREE.CanvasRenderer(),
    light= new THREE.AmbientLight(0xffffff),            
    camera,        
    box;

    function initScene(){

        renderer.setSize(window.innerWidth, window.innerHeight);

        var element = document.getElementById("webgl-container");
        element.appendChild(renderer.domElement);

        scene.add(light);
             
        camera = new THREE.PerspectiveCamera(
        35,
        element.offsetWidth  / element.offsetHeight,
        1,
        1000
        );
                            
        camera.position.z= 100;            
        scene.add( camera );  

        box = new THREE.Mesh(
        new THREE.BoxGeometry(20,20,20),
        new THREE.MeshBasicMaterial({color: 0xFF0000})
        );

        box.name="box";

        scene.add(box);

        render();

    }

    function render() {

        renderer.render(scene, camera); 
        requestAnimationFrame(render);

    };

    window.onload = initScene;

    return {
        scene: scene
    }

})();
