uniform sampler2D atlasTexture;
varying vec3 vColor;
varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vColor, 1.0);
  vec4 texColor = texture2D(atlasTexture, vUv);
  // gl_FragColor = texColor;
}
