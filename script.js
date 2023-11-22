const myCanvas = document.querySelector("#myCanvas");
// var myText = document.getElementById("myText").textContent;

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import {
	CSS2DRenderer,
	CSS2DObject,
} from "three/addons/renderers/CSS2DRenderer.js";

// ----------------------------------- SCENE BACKGROUND COLOR -----------------------------------
export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x283148);

// ------------------------------------------- CAMERA -------------------------------------------
export const camera = new THREE.PerspectiveCamera(
	45,
	myCanvas.offsetWidth / myCanvas.offsetHeight
);
camera.position.set(5, 3, -3);

// ----------------------------------------- GRID HELPER ----------------------------------------
const size = 50;
const divisions = 50;
const colorCenterLine = 0x000000;
const colorGrid = 0x000000;

const grid = new THREE.GridHelper(size, divisions, colorCenterLine, colorGrid);
grid.position.y = -1;
grid.name = "grid";
scene.add(grid);

// ------------------------------------------ LIGHTNING -----------------------------------------
/*
	Light in 3D scene
	set(x,y,z)
		+x front
		+y up
		+z left
*/

// ---------------------------------- LIGHTNING CUSTOM: AMBIENT ---------------------------------
const ambientLight = new THREE.HemisphereLight(
	"white", // bright sky color
	"grey", // dim ground color
	0 // intensity
);
ambientLight.name = "ambientLight";
scene.add(ambientLight);

// -------------------------------- LIGHTNING CUSTOM: DIRECTIONAL -------------------------------
var dirLight = new THREE.DirectionalLight(0x404040, 0);
dirLight.name = "dirLight";
dirLight.position.set(100, 100, -10);
dirLight.castShadow = true;
scene.add(dirLight);

// --------------------------- LIGHTNING DEFAULT: FRONT ABOVE CENTER ----------------------------
const r = 20;
const light1 = new THREE.PointLight(0xffffff, 1, 0);
light1.name = "light1";
light1.position.set(r, r, 0);
light1.shadowMapVisible = true;
scene.add(light1);

// ----------------------------- LIGHTNING DEFAULT: BACK ABOVE LEFT -----------------------------
const light2 = new THREE.PointLight(0xffffff, 1, 0);
light2.name = "light2";
light2.position.set(-0.5 * r, r, 0.866 * r);
scene.add(light2);

// ---------------------------- LIGHTNING DEFAULT: BACK ABOVE RIGHT -----------------------------
const light3 = new THREE.PointLight(0xffffff, 1, 0);
light3.name = "light3";
light3.position.set(-0.5 * r, r, -0.866 * r);
scene.add(light3);

// --------------------------- LIGHTNING DEFAULT: CENTER BELOW CENTER ---------------------------
const light4 = new THREE.PointLight(0xffffff, 1, 0);
light4.name = "light4";
light4.position.set(0, -r, 0);
scene.add(light4);

// ----------------=-------------------------- RENDERER ------------------=----------------------
const renderer = new THREE.WebGLRenderer({ canvas: myCanvas });
renderer.setClearColor(0xff0000, 1.0);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(myCanvas.offsetWidth, myCanvas.offsetHeight);

// --------------------------------------- ORBIT CONTROLS ---------------------------------------
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.zIndex = 1;
labelRenderer.domElement.style.top = "0px";
document.body.appendChild(labelRenderer.domElement);

export const orbitControls = new OrbitControls(
	camera,
	labelRenderer.domElement
);

// --------------------------------------- 3D FILE LOADER ---------------------------------------
const loadingScreenBar = document.getElementById("loadingBar");
const loadingScreenContainer = document.querySelector(
	".loadingScreenContainer"
);
const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = function () {
	loadingScreenContainer.style.display = "flex";
};

loadingManager.onProgress = function (url, loaded, total) {
	loadingScreenBar.value = (loaded / total) * 100;
};

loadingManager.onLoad = function () {
	loadingScreenBar.value = 0;
	loadingScreenContainer.style.display = "none";
};

export const loader = new GLTFLoader(loadingManager);
// export const loader = new DRACOLoader();
loader.name = "loader";

// let path = "files/" + "testing12.glb";
// let path = "files/" + "Hokkaido Crushing Plant - Compressed.glb";
// let path = "files/" + "MSD700_bucket_MCLA007A_00.glb";
let path = "files/" + "Microhydro System 2.glb";
// let path = "files/" + "Hokkaido Crushing Plant.glb";
// let path = "files/" + "MSD700_ブレードモデル_MCLA15A.glb";
// let path = "files/" + "VSI Gyropactor.glb";
let file3D;

loader.load(
	path,
	function (gltf) {
		file3D = gltf.scene;
		file3D.name = "file3D";
		scene.add(file3D);

		workingTree(file3D);

		file3D.position.set(0, -0.95, 0);
	},
	undefined,
	function (error) {
		console.error(error);
	}
);

// ----------------------------------------- RENDER LOOP ----------------------------------------
renderer.setAnimationLoop(() => {
	orbitControls.update();
	labelRenderer.render(scene, camera);
	renderer.render(scene, camera);
});

// ---------------------------------------- RESIZE CANVAS ---------------------------------------
myCanvas.style.width = window.innerWidth + "px";
myCanvas.style.height = window.innerHeight + "px";
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

window.addEventListener("resize", () => {
	myCanvas.style.width = window.innerWidth + "px";
	myCanvas.style.height = window.innerHeight + "px";
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	labelRenderer.setSize(window.innerWidth - 0.5, window.innerHeight - 0.5);
});

// ------------------------------------------- CREATE WORKING TREE -------------------------------------------
const parts_container = document.querySelector(".parts-container");
function workingTree(file3D) {
	let object_children = file3D.children;

	let out = "";

	object_children.forEach((child) => {
		out = writeParts(child, out, 0);
		// if (child.name == "20230202_北陸Insuline_2") {
		// 	child.visible = false;
		// }
		let part = scene.getObjectByName("20230202_北陸Wall_2");
		if (part) {
			part.visible = false;
		}
		part = scene.getObjectByName("20230202_北陸Insuline_Wall");
		if (part) {
			part.visible = false;
		}
	});

	parts_container.innerHTML = out;
	updateKonten();
}

function writeParts(part, out, iteration) {
	// let whiteSpace = "&nbsp;".repeat(5 * iteration);
	let indent = iteration * 20;

	if (part.children.length > 0) {
		out += `<div  style="margin-left:${indent}px;"> <img src="./assets/right-arrow.png"/> <p class="konten-page" > ${part.name} </p> </div>`;
		part.children.forEach((child) => {
			out = writeParts(child, out, iteration + 1);
		});
	} else {
		out += `<div style="margin-left:${indent}px;"> <p   class="konten-page"> ${part.name} </p> </div>`;
		
	}

	return out;
}

//  Wall_2

function updateKonten() {
	const parts_container_content = document.querySelectorAll(".konten-page");

	parts_container_content.forEach((content) => {
		content.addEventListener("click", (e) => {
			// console.log(content);
			let partName = e.target.textContent.trim();

			let part = scene.getObjectByName(partName);
			if (part) {
				part.visible = !part.visible;
			}
		});
	});
}
