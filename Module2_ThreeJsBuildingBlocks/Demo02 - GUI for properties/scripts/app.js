var demo = (function(){

    "use strict";
    
    var scene=new THREE.Scene(),
        light= new THREE.AmbientLight(0xffffff),
        light2= new THREE.PointLight(0xffffff),
        camera,
        renderer = new THREE.WebGLRenderer(),
        cube,
        cube2,
        cube3,
        plane,
        ground;

        function initScene(){
                       	
            
            renderer.setSize( window.innerWidth, window.innerHeight );
            document.getElementById("webgl-container").appendChild(renderer.domElement);

            scene.add(light);
                  
            camera = new THREE.PerspectiveCamera(
                    35,
                    window.innerWidth / window.innerHeight,
                    1,
                    1000
                );
                        
            camera.position.z= 100;
            scene.add(camera);

            //ground
            var texture = THREE.ImageUtils.loadTexture('content/grasslight-big.jpg') //texture from three.js examples
            var planeMaterial = new THREE.MeshPhongMaterial( {map: texture, side: THREE.DoubleSide} );
            plane = new THREE.Mesh( new THREE.PlaneGeometry(200, 200), planeMaterial);
            plane.rotation.x = 90 * (Math.PI/180);
            plane.position.y = -10;
            plane.name="plane";
            scene.add(plane);

            //main cube
            cube = new THREE.Mesh(
              new THREE.BoxGeometry(
                20,
                20,
                20),
              new THREE.MeshBasicMaterial({ 
                           
                vertexColors: THREE.VertexColors 
            }));

            cube.name="cube";

            //green child cube
            cube3 = new THREE.Mesh(
              new THREE.BoxGeometry(
                10,
                10,
                10),
              new THREE.MeshBasicMaterial({color: 0x00FF00}));

            cube3.name="cube3";
            cube3.position.y = 30; //offset it from parent so we can see it
            cube.add(cube3);

            //spinning cube
            cube2 = new THREE.Mesh(
              new THREE.BoxGeometry(
                2,
                2,
                2),
              new THREE.MeshBasicMaterial({color: 0xFF0000}));

            cube2.name="cube2";
            cube2.position.x = -50;
            cube2.position.Y = 20;
            cube2.add(light2);

           
            scene.add(cube2);

            assignColorsToCube(cube);

            var cubeAxesHelper = new THREE.AxisHelper(50);
            cube.add(cubeAxesHelper);
            scene.add(cube);


            var axesHelper = new THREE.AxisHelper(300);
            scene.add(axesHelper);  

            setupGui();

            requestAnimationFrame(render);   
        
        };

        function assignColorsToCube(cube){


             var colors = [
                        new THREE.Color("rgb(255,0,0)"),
                        new THREE.Color("rgb(0,255,0)"),
                        new THREE.Color("rgb(0,0,255)"),
                        new THREE.Color("rgb(255,255,0)"),
                        new THREE.Color("rgb(0,255,255)"),
                        new THREE.Color("rgb(255,0,255)")
                    ];

            for (var i = 0; i <12; i+=2) {
                              
                var color = colors[i/2]; 

                //each cube face is made up of 2 triangles & we want same color for each
                cube.geometry.faces[i].color= color;
                cube.geometry.faces[i+1].color=  color;               
            }
        }

        function setupGui(){

            //var cube = scene.getObjectByName('cube');

            //note we could link the various object properties directly to the gui but this would prevent us from being able to modify them e.g. radians to degrees
            var itemsToControl = new function() {

                this.cameraXPos = camera.position.x,
                this.cameraYPos = camera.position.y,
                this.cameraZPos = camera.position.z;
                this.cameraXRotation = camera.rotation.x;
                this.cameraYRotation = camera.rotation.y;
                this.cameraZRotation = camera.rotation.z;
                
                this.cubeXPos = cube.position.x,
                this.cubeYPos = cube.position.y,
                this.cubeZPos = cube.position.z,
                this.cubeXRotation = cube.rotation.x;
                this.cubeYRotation = cube.rotation.y;
                this.cubeZRotation = cube.rotation.z;

                this.cubeXScale = cube.scale.x;
                this.cubeYScale = cube.scale.y;
                this.cubeZScale = cube.scale.z;
                             
            };

            var gui = new dat.GUI();


             //camera            
            var cameraXPos = gui.add(itemsToControl, 'cameraXPos', -200, 200);
            var cameraYPos = gui.add(itemsToControl, 'cameraYPos', -200, 200);
            var cameraZPos = gui.add(itemsToControl, 'cameraZPos', -400, 400);
            var cameraXRotation = gui.add(itemsToControl, 'cameraXRotation', 0, 360);
            var cameraYRotation = gui.add(itemsToControl, 'cameraYRotation', 0, 360);
            var cameraZRotation = gui.add(itemsToControl, 'cameraZRotation', 0, 360);
                      
            cameraXPos.onChange(function(value){move(camera,'x',value)});  
            cameraYPos.onChange(function(value){move(camera,'y',value)});  
            cameraZPos.onChange(function(value){move(camera,'z',value)});
            cameraXRotation.onChange(function(value){rotate(camera, 'x', value)});  
            cameraYRotation.onChange(function(value){rotate(camera, 'y', value)}); 
            cameraZRotation.onChange(function(value){rotate(camera, 'z', value)});          

            //cube            
            var cubeXPos = gui.add(itemsToControl, 'cubeXPos', -200, 200);
            var cubeYPos = gui.add(itemsToControl, 'cubeYPos', -200, 200);
            var cubeZPos = gui.add(itemsToControl, 'cubeZPos', -200, 200);
            var cubeXRotation = gui.add(itemsToControl, 'cubeXRotation', 0, 360);
            var cubeYRotation = gui.add(itemsToControl, 'cubeYRotation', 0, 360);
            var cubeZRotation = gui.add(itemsToControl, 'cubeZRotation', 0, 360);         
            var cubeXScale = gui.add(itemsToControl, 'cubeXScale', 1, 10);
            var cubeYScale = gui.add(itemsToControl, 'cubeYScale', 1, 10);
            var cubeZScale = gui.add(itemsToControl, 'cubeZScale', 1, 10);          
            
            cubeXPos.onChange(function(value){move(cube,'x',value)});  
            cubeYPos.onChange(function(value){move(cube,'y',value)});  
            cubeZPos.onChange(function(value){move(cube,'z',value)});                       
            cubeXRotation.onChange(function(value){rotate(cube, 'x', value)});  
            cubeYRotation.onChange(function(value){rotate(cube, 'y', value)}); 
            cubeZRotation.onChange(function(value){rotate(cube, 'z', value)});      
            cubeXScale.onChange(function(value){scale(cube, 'x', value)});  
            cubeYScale.onChange(function(value){scale(cube, 'y', value)}); 
            cubeZScale.onChange(function(value){scale(cube, 'z', value)});                       
        }

        function rotate(object, axis, value){
            object.rotation[axis] = value * (Math.PI/180);
        }      

        function move(item, axis, value){
            item.position[axis] = value;
        }

         function scale(item, axis, value){
            item.scale[axis] = value;
        }

        function render() {
            moveOrbitingCube(cube2);            

            renderer.render(scene, camera); 
            requestAnimationFrame(render);
        };

        //math from http://stackoverflow.com/questions/10341581/javascript-threejs-equation-to-move-an-object-in-a-circle-around-a-central-y
        function moveOrbitingCube(object){

            var theta = 0.05; //amount to rotate by
            var x = object.position.x;
            var z = object.position.z;

            object.position.x = x * Math.cos(theta) + z * Math.sin(theta);
            object.position.z = z * Math.cos(theta) - x * Math.sin(theta);
        }

        window.onload = initScene;

        return {
            scene: scene
        }

})();
