import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { coords } from "./capMarkers";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export default function LineGeometry() {
  const divRef = useRef();
  //coords are a 1d array of line start end points x, y, z
  function createLines(coords, col) {
    var material = new THREE.LineBasicMaterial({ color: col });
    var geometry = new THREE.BufferGeometry();
    const positions = [];
    for (var i = 0; i < coords.length; i++) {
      positions.push(coords[i]);
    }
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.computeBoundingSphere();
    var center = geometry.boundingSphere.center;

    //rotate from cad style coords to screen coords
    geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
    var lines = new THREE.LineSegments(
      //move to model centre
      geometry.translate(-center.x, -center.y, -center.z),
      material
    );
    return lines;
  }

  useEffect(() => {
    if (divRef.current.innerHTML != "") return;
    var scene = new THREE.Scene();

    var camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      754928
    );

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    divRef.current.appendChild(renderer.domElement);
    let lines = createLines(coords, 0x000000);
    scene.add(lines);

    const controls = new OrbitControls(camera, renderer.domElement);
    //TODO automate intial camera based on object size
    camera.position.x = -10164;
    camera.position.y = -2.81;
    camera.position.z = 55164;
    camera.near = 1;
    controls.update();

    var animate = function () {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      lines.rotation.y += 0.0005;
    };
    animate();
  }, []);
  return <div ref={divRef}></div>;
}
