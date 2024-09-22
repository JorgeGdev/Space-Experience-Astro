uniform float uTime; // Añadimos el tiempo como uniforme para animar el bamboleo
varying vec2 vUv;

void main()
{
    vec3 wobblePosition = position; // Copiamos la posición original

    // Añadimos el efecto de bamboleo en los ejes X e Y
    float wobble = sin(uTime + position.y * 5.0) * 0.1; // Ajusta la intensidad con el multiplicador
    wobblePosition.x += wobble; // Bamboleo en el eje X
    wobblePosition.y += wobble; // Bamboleo en el eje Y

    vec4 modelPosition = modelMatrix * vec4(wobblePosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;

    vUv = uv; // Pasamos las coordenadas UV a los fragment shaders
}
