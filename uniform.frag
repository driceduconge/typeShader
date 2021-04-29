// in this example we use a time uniform to drive an animation with a few of glsl's built in math functions
// you can find more info for GLSL functions online
// i like this page http://www.shaderific.com/glsl-functions/

precision mediump float;

// lets grab texcoords just for fun
varying vec2 vTexCoord;

// our time uniform variable coming from p5
uniform float time;
uniform float var1;
uniform float var2;
uniform float alt;


float rand(vec2 n) {
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);

	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}
//	<https://www.shadertoy.com/view/Xd23Dh>
//	by inigo quilez <http://iquilezles.org/www/articles/voronoise/voronoise.htm>
//

vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)),
				   dot(p,vec2(269.5,183.3)),
				   dot(p,vec2(419.2,371.9)) );
	return fract(sin(q)*43758.5453);
}

float iqnoise( in vec2 x, float u, float v ){
    vec2 p = floor(x);
    vec2 f = fract(x);

	float k = 1.0+63.0*pow(1.0-v,4.0);

	float va = 0.0;
	float wt = 0.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2 g = vec2( float(i),float(j) );
		vec3 o = hash3( p + g )*vec3(u,u,1.0);
		vec2 r = g - f + o.xy;
		float d = dot(r,r);
		float ww = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
		va += o.z*ww;
		wt += ww;
    }

    return va/wt;
}

// 	<https://www.shadertoy.com/view/MdX3Rr>
//	by inigo quilez
//
const mat2 m2 = mat2(0.8,-0.6,0.6,0.8);
float fbm( in vec2 p ){
    float f = 0.0;
    f += 0.5000*noise( p ); p = m2*p*2.02;
    f += 0.2500*noise( p ); p = m2*p*2.03;
    f += 0.1250*noise( p ); p = m2*p*2.01;
    f += 0.0625*noise( p );

    return f/0.9375;
}
// Simplex 2D noise
//
vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
           -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
void main() {

  vec2 uv = vTexCoord;


  // the length function returns the square root of the sum of the squared components
  // for instance if you have vec3 abc;
  // length(abc) is the same as sqrt( a*a + b*b + c*c )
  // we can use it with our uv's to generate a circle
  float circle = length(snoise(log(var1)+uv*iqnoise(uv,sin(time*(.02-(var2/10.))+uv.y*uv.y),uv.x))*fbm(uv)*uv.x);

  // lets slow down our time variable by multiplying it by a small number
  // try changing the speed
  float speed = 0.03;
  float slowTime = time * speed;

  // add the time to the circle
  // what happens if you comment out this line
  // what happens if slowTime is subtracted?
  // what happens if slowTime is multiplied
  circle *= slowTime;

  // the fract function is built into glsl
  // it returns the 'fract'ional part of a number (everything to the right of the decimal point)
  float circle1 = circle*noise(uv*(3.0+var2));
	float circle2;
	if(var2<0.5){
  	circle2 = circle*noise(uv*(2.0+var2));
	}
	else{
		circle2 = circle*snoise(uv*iqnoise(uv,sin(slowTime*uv.y*log(uv.y)),uv.x));
	}
  	float circle3 = snoise(uv*iqnoise(uv+var2,sin(slowTime*uv.y*uv.y+(noise(var1*uv)/100.)),uv.x/var2)) ;
		float a = circle;
		float b = circle2;
		float c = circle1;
		if(alt==1.){
			float a = circle3;
			float b = circle2;
			float c = circle1;
		}
		if(alt==2.){
			float a = circle1;
			float b = circle3;
			float c = circle2;
		}
		if(alt>=	3.&&var2>=0.2&&var2<=0.6){
			float a = circle2;
			float b = circle3;
			float c = circle;
		}
		if(alt>=	3.&&var2<=0.2){
			float a = circle3;
			float b = circle;
			float c = circle2;
		}
		if(alt>=	3.&&var2>=0.6&&var2<=0.8){
			float a = circle1;
			float b = circle;
			float c = circle3;
		}
    // make a vec4 out of our circle variable

  vec4 color = vec4(a,b,c, 0.4);

  gl_FragColor = color;
  gl_FragColor.r = color.r *2.5;
	gl_FragColor.g = color.g *2.5;
	gl_FragColor.b = color.b *5.5;

}
