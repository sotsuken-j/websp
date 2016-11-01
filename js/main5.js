(function() {

	var camera, scene, renderer, material;
	//
	var controls, effect;
	//
	
	var fov = 70,
		texture_placeholder,
		isUserInteracting = false,
		onMouseDownMouseX = 0,
		onMouseDownMouseY = 0,
		lon = 0,
		onMouseDownLon = 0,
		lat = 0,
		onMouseDownLat = 0,
		phi = 0,
		theta = 0;
		
	var ua = navigator.userAgent;
	
	init();
	animate();

	function init() {

		var container, mesh;

		container = document.getElementById('container');

		camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 1, 1100);
		camera.target = new THREE.Vector3(0, 0, 0);
		camera.position.set(0, 0, 100);

		scene = new THREE.Scene();

		var geometry = new THREE.SphereGeometry(500, 60, 40);
		geometry.applyMatrix(new THREE.Matrix4().makeScale(-1, 1, 1));

		material = new THREE.MeshBasicMaterial({
			map: THREE.ImageUtils.loadTexture('2294472375_24a3b8ef46_o.jpg')
		});

		mesh = new THREE.Mesh(geometry, material);

		scene.add(mesh);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		//
		
		controls = new THREE.DeviceOrientationControls(camera);
		
		
		effect = new THREE.StereoEffect(renderer);
		//

		window.addEventListener('resize', onWindowResize, false);

	}

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	function animate() {

		requestAnimationFrame(animate);
		render();

	}

	function render() {
		
		//controls.update();

		lat = Math.max(-85, Math.min(85, lat));
		phi = THREE.Math.degToRad(90 - lat);
		theta = THREE.Math.degToRad(lon);

		camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
		camera.target.y = 500 * Math.cos(phi);
		camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

		//camera.lookAt(camera.target);
		//OrbitControlsを使うとlookAt関数が使えなくなる

		/*
				// distortion
				camera.position.x = - camera.target.x;
				camera.position.y = - camera.target.y;
				camera.position.z = - camera.target.z;
				*/
		controls.update();
		//renderer.render(scene, camera);
		effect.render(scene, camera);
	}
	
	/*function fullscreen() {
		if (container.requestFullscreen) {
			container.requestFullscreen();
		} else if (container.msRequestFullscreen) {
			container.msRequestFullscreen();
		} else if (container.mozRequestFullScreen) {
			container.mozRequestFullScreen();
		} else if (container.webkitRequestFullscreen) {
			container.webkitRequestFullscreen();
		}
	}*/

	/**
	 *画像Drag＆Drop処理
	 */

	function cancelEvent(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handllerDroppedFile(e) {
		//単一ファイルの想定
		var file = e.dataTransfer.files[0];

		if (!file.type.match('image.*')) {
			alert('imageファイルにしてね');
			cancelEvent(e);
		}

		var img = document.createElement("img");
		var fileReader = new FileReader();
		fileReader.onload = function(e) {
			img.src = e.target.result;
			material.map = new THREE.Texture(img);
			material.map.needsUpdate = true;
		};
		fileReader.readAsDataURL(file);
		//デフォルトのイベントキャンセルしないとブラウザでイメージが表示されてしまう
		cancelEvent(e);
	}

	var droppable = document.getElementById('container');
	droppable.addEventListener('dradenter', cancelEvent);
	droppable.addEventListener('dragover', cancelEvent);
	droppable.addEventListener('drop', handllerDroppedFile);
	
})();
