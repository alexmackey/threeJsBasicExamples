var example = (function() {

  "use strict";

  var scene = new THREE.Scene(),
    light = new THREE.PointLight(0xffffff),
    camera,
    renderer = new THREE.WebGLRenderer(),
    sphere;


  function initScene() {

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("webgl-container").appendChild(renderer.domElement);

    scene.add(light);

    camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );

    camera.position.z = 80;
    scene.add(camera);

    var material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true
    });

    sphere = new THREE.Mesh(
      new THREE.SphereGeometry(
        20,
        10,
        10),
      material);

    sphere.name = "sphere";

    var exporter = new THREE.GeometryExporter();
    var exportedSphereObject = exporter.parse(sphere.geometry);
    var serializedExportedSphere = JSON.stringify(exportedSphereObject);

    console.log(serializedExportedSphere);
    console.log(JSON.stringify(serializedExportedSphere));

    var loader = new THREE.JSONLoader();
    var model = loader.parse(JSON.parse(serializedExportedSphere));

    var mesh = new THREE.Mesh(model.geometry, material);

    scene.add(mesh);

    //var sceneExporter = new THREE.SceneExporter();
    //var exportedSceneObject = sceneExporter.parse(scene);

    render();
  };

  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  window.onload = initScene;

  return {
    scene: scene,
    sphere: sphere
  }

})();