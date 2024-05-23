import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  BoxGeometry,
  ShaderMaterial,
  Color,
  Vector2,
  Vector3,
  Raycaster,
  Object3D,
  MathUtils,
  LoadingManager,
  CanvasTexture,
  MeshBasicMaterial
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

// Remove this if you don't need to load any 3D model
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { InstancedUniformsMesh } from 'three-instanced-uniforms-mesh'

import Stats from 'stats.js'
import { gsap } from 'gsap'

const stats = new Stats()
document.body.appendChild(stats.dom)

class App {
  constructor(container) {
    this.container = document.querySelector(container)

    this.hover = false

    this.rotationSpeed = 0.5
    
    this.colors = [
      new Color(0xEAE0DA),
      new Color(0xFFF8E3),
      new Color(0xF1F1F1),
      new Color(0xF2EFE5),
      // new Color(0x7286D3)
      new Color(0xFD8A8A)
    ]

    this.uniforms = {
      uHover: 0
    }

    this._resizeCb = () => this._onResize()
    this._mousemoveCb = e => this._onMousemove(e)
    this._mouseclick = e => this._onMouseClick(e)
  }

  init() {
    this._createScene()
    this._createCamera()
    this._createRenderer()
    this._createRaycaster()
    this._createLoader()
    this._createControls()
    this._createLabelRenderer()

    this._checkMobile()

    this._loadModel().then(() => {
      this._addListeners()
      // this._labelModel()

      this.renderer.setAnimationLoop(() => {
        stats.begin()

        this._update()
        this._render()

        stats.end()
      })
      
      console.log(this)
    })
  }

  destroy() {
    this.renderer.dispose()
    this._removeListeners()
  }

  _update() {
    this.camera.lookAt(0, 0, 0)
    // this.camera.position.z = this.isMobile ? 2.3 : 1.2
    this.labelRenderer.render(this.scene, this.camera)
    this.controls.update()
  }

  _render() {
    this.renderer.render(this.scene, this.camera)
  }

  _createScene() {
    this.scene = new Scene()
  }

  _createControls(){
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = this.rotationSpeed
  }

  _createCamera() {
    this.camera = new PerspectiveCamera(100, this.container.clientWidth / this.container.clientHeight, 0.1, 100)
    this.camera.position.set(0, 0, 1.2)
  }

  _createRenderer() {
    this.renderer = new WebGLRenderer({
      alpha: true,
      antialias: window.devicePixelRatio === 1
    })

    this.container.appendChild(this.renderer.domElement)

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.physicallyCorrectLights = true
  }

  _createLabelRenderer(){
    this.labelRenderer = new CSS2DRenderer()
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight)
    this.labelRenderer.domElement.style.position = 'absolute'
    this.labelRenderer.domElement.style.pointerEvents = 'none'
    this.labelRenderer.domElement.style.top = '0px'
    document.body.appendChild(this.labelRenderer.domElement)
  }

  _createLoader() {
    this.loadingManager = new LoadingManager()

    this.loadingManager.onLoad = () => {
      document.documentElement.classList.add('model-loaded')
    }

    this.gltfLoader = new GLTFLoader(this.loadingManager)
  }

  /**
   * Load the 3D model and position a set of `InstancedMesh` on each vertex.
   */
  _loadModel() {
    return new Promise(resolve => {
      this.gltfLoader.load('./brain.glb', gltf => {
        // The brain model is not added to the scene because is not necessary
        // for the raycaster to work.
        this.brain = gltf.scene.children[0]

        // Create the `InstancedMesh`
        const geometry = new BoxGeometry(0.004, 0.004, 0.004, 1, 1, 1)

        const material = new ShaderMaterial({
          vertexShader: require('./shaders/brain.vertex.glsl'),
          fragmentShader: require('./shaders/brain.fragment.glsl'),
          wireframe: true,
          uniforms: {
            uPointer: { value: new Vector3() },
            uColor: { value: new Color() },
            uRotation: { value: 0 },
            uSize: { value: 0 },
            uHover: { value: this.uniforms.uHover },
            atlasTexture: { value: this.textureAtlas }
          }
        })

        this.instancedMesh = new InstancedUniformsMesh(geometry, material, this.brain.geometry.attributes.position.count)

        // Add the `InstancedMesh` to the scene
        this.scene.add(this.instancedMesh)

        // Scale the model
        const scaleFactor = 1; // Change this value to scale the model
        this.instancedMesh.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Dummy `Object3D` that will contain the matrix of each instance
        const dummy = new Object3D()

        // Get the X, Y and Z values of each vertex of the geometry and use them to
        // set the position of each instance.
        // Also set the `uColor` and `uRotation` uniforms.
        const positions = this.brain.geometry.attributes.position.array
        for (let i = 0; i < positions.length; i += 3) {
          dummy.position.set(
            positions[i + 0],
            positions[i + 1],
            positions[i + 2]
          )
          this.instanceLocations.push([positions[i + 0], positions[i + 1], positions[i + 2]])
          dummy.updateMatrix()

          this.instancedMesh.setMatrixAt(i / 3, dummy.matrix)
          this.instancedMesh.setUniformAt('uRotation', i / 3, MathUtils.randFloat(-1, 1))
          this.instancedMesh.setUniformAt('uSize', i / 3, MathUtils.randFloat(0.3, 3))

          const colorIndex = MathUtils.randInt(0, this.colors.length - 2)
          this.instancedMesh.setUniformAt('uColor', i / 3, this.colors[colorIndex])
        }

        const progress = this.instancedMesh.count * 0.5
        for(let i = 0; i < progress; i++){
          let j = MathUtils.randInt(0, this.instancedMesh.count)
          this.instancedMesh.setUniformAt('uColor', i, this.colors[4])
          this.instanceIndexes.push(i)
        }

        resolve()
      })
    })
  }

  // _labelModel(){
  //   let skills = ["Python", "Java", "JavaScript", "C++", "SQL"]
  //   for(let i = 0; i < this.instanceIndexes.length; i++){
  //     const p = document.createElement('p')
  //     p.className = 'skill hide'
  //     const pContainer = document.createElement('div')
  //     pContainer.appendChild(p)
  //     const cPointLabel = new CSS2DObject(pContainer)
  //     this.scene.add(cPointLabel)

  //     p.textContent = skills[MathUtils.randInt(0, skills.length - 1)]
  //     cPointLabel.position.set(this.instanceLocations[i][0], this.instanceLocations[i][1], this.instanceLocations[i][2])
  //     this.pElementLabels.push(p)
  //   }
  // }

  _createRaycaster() {
    this.mouse = new Vector2()
    this.raycaster = new Raycaster()
    this.intersects = []
    this.point = new Vector3()
    this.instanceLocations = []
    this.instanceIndexes = []
    this.pElementLabels = []
  }

  _addListeners() {
    window.addEventListener('resize', this._resizeCb, { passive: true })
    window.addEventListener('mousemove', this._mousemoveCb, { passive: true })
    window.addEventListener('click', this._mouseclick, { passive: false })
  }

  _removeListeners() {
    window.removeEventListener('resize', this._resizeCb, { passive: true })
    window.removeEventListener('mousemove', this._mousemoveCb, { passive: true })
    window.removeEventListener('click', this._mouseclick, { passive: false })
  }

  _onMouseClick(e){
    console.log("Clicked")
    const x = e.clientX / this.container.offsetWidth * 2 - 1
    const y = -(e.clientY / this.container.offsetHeight * 2 - 1)
    this.mouse.set(x, y)

    const intersects = this.raycaster.intersectObjects(this.instancedMesh, true);

    if (intersects.length > 0) {
      console.log("Clicked object ID:", intersects[0].object.customId);
    }
  }

  _onMousemove(e) {
    const x = e.clientX / this.container.offsetWidth * 2 - 1
    const y = -(e.clientY / this.container.offsetHeight * 2 - 1)

    this.mouse.set(x, y)

    this.raycaster.setFromCamera(this.mouse, this.camera)
    // Check if the ray casted by the `Raycaster` intersects with the brain model
    this.intersects = this.raycaster.intersectObject(this.brain)
    // this.intersects = this.raycaster.intersectObject(this.instancedMesh)
    if (this.intersects.length === 0) { // Mouseleave
      if (this.hover) {
        this.hover = false
        this._animateHoverUniform(0)
      }
    } else { // Mouseenter
      if (!this.hover) {
        this.hover = true
        this._animateHoverUniform(1)
      }

      // Tween the point to project on the brain mesh
      gsap.to(this.point, {
        x: () => this.intersects[0]?.point.x || 0,
        y: () => this.intersects[0]?.point.y || 0,
        z: () => this.intersects[0]?.point.z || 0,
        overwrite: true,
        duration: 0.3,
        onUpdate: () => {
          for (let i = 0; i < this.instancedMesh.count; i++) {
            if(this.instanceIndexes.includes(i)){
              this.instancedMesh.setUniformAt('uPointer', i, this.point)
            }
          }
        }
      })
    }
  }

  _animateHoverUniform(value) {
    gsap.to(this.uniforms, {
      uHover: value,
      duration: 0.25,
      onUpdate: () => {
        for (let i = 0; i < this.instancedMesh.count; i++) {
          if(this.instanceIndexes.includes(i)){
            this.instancedMesh.setUniformAt('uHover', i, this.uniforms.uHover)
            // this.pElementLabels[i].className = "skill show"
          }
        }
      }
    })
  }

  _checkMobile() {
    this.isMobile = window.innerWidth < 767
  }

  _onResize() {
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.labelRenderer.setSize(this.window.innerWidth, this.window.innerHeight)
    this._checkMobile()
  }
}

const app = new App('#app')
app.init()
