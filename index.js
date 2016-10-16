$('document').ready(()=>{
  let app = {
    init(){
      $('#run').on('click', (e)=>{
        return this.render();
      });
      $('#clear').on('click', (e)=>{
        return this.destroy();
      });
    },
    render(){
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1500;
      canvas.height = 1500;
      let height = view.get('height');
      let width = view.get('box_width');
      let length = view.get('box_length');
      let animation = new Animation(canvas, view.get('gravity'));
      animation.addFrame(new Rectangle((750 - width), width, length, width));
      let Run = function() {
        animation.update();
        animation.draw(ctx);
        requestAnimFrame(Run);
      };
      calculate.write();
      Run();
      $('#results').removeClass('hidden');
    },
    destroy(){
      const canvas = document.getElementById('canvas');
      canvas.width = 1000;
      canvas.height = 1000;
      view.clearProperties();
      const ctx = canvas.getContext('2d');
      let animation = new Animation(canvas);
      animation.addFrame(new Rectangle());
      let Run = function() {
        animation.draw(ctx);
        requestAnimFrame(Run);
      };
      Run();
      $('#results').addClass('hidden');
    },
  };

  // Dynamic Canvas Properties
  let view = {
    height: null,
    gravity: null,
    box_weight: null,
    box_width: null,
    box_length: null,
    set(str, value){
      return this[str] = value;
    },
    clearProperties(){
      this['height'] = null;
      this['gravity'] = null;
      this['box_width'] = null;
      this['box_length'] = null;
      this['box_weight'] = null;
      $('#height').val("")
      $('#gravity').val("")
      $('#box_width').val("")
      $('#box_length').val("")
      $('#box_weight').val("")
    },
    get(str){
      return this[str];
    },
    validateNumber(value, isGravity){
      let int = parseFloat(value);
      if(isNaN(int)){
        return 0;
      } else {
        if(isGravity){
          return int / 10;
        } else {
          return int;
        }
      }
    },
    init(){
      $('#box_width').on('change', ()=>{
        this.set('box_width', this.validateNumber($('#box_width').val()));
      });
      $('#box_length').on('change', ()=>{
        this.set('box_length', this.validateNumber($('#box_length').val()));
      });
      $('#box_weight').on('change', ()=>{
        this.set('box_weight', this.validateNumber($('#box_weight').val()));
      });
      $('#gravity').on('change', ()=>{
        this.set('gravity', this.validateNumber($('#gravity').val(), true));
      });
      $('#height').on('change', ()=>{
        this.set('height', this.validateNumber($('#height').val()));
      });
    },
  };

  let calculate = {
    write(){
      $("#energy").html(this.energy().toFixed(2));
      $("#force").html(this.impactForce().toFixed(2));
      $("#time").html(this.timeUntilImpact().toFixed(2));
      $("#velocity").html(this.velocity().toFixed(2));
    },
    energy(){
      return (parseFloat((1/2)) * parseFloat(view.get('box_weight')) * parseFloat(view.get('gravity') * 10));
    },
    impactForce(){
      return (parseFloat(view.get('box_weight')) * (parseFloat(view.get('gravity')) * 10) * parseFloat(view.get('height')));
    },
    timeUntilImpact(){
      return Math.sqrt(2 * parseFloat(view.get('height')) / (parseFloat(view.get('gravity')) * 10));
    },
    velocity(){
      return Math.sqrt(2 * parseFloat(view.get('height')) * (parseFloat(view.get('gravity')) * 10));
    }
  }

  // Initialize Application and Canvas Event Handlers
  app.init();
  view.init();
});


const PI_TIMES_TWO = Math.PI * 2;
window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback){window.setTimeout(callback, 1000 / 60);};

let Vector = function(x,y) {
  this.x = x || 0;
  this.y = y || 0;
};

Vector.add = function(a,b) {
  if (b.x != null && b.y != null) {
    return new Vector(a.x + b.x, a.y + b.y);
  } else {
    return new Vector(a.x + b, a.y + b);
  }
};

Vector.subtract = function(a, b) {
  if (b.x != null && b.y != null) {
    return new Vector(a.x - b.x, a.y - b.y);
  } else {
    return new Vector(a.x - b, a.y - b);
  }
};

Vector.multiply = function(a, b) {
  if (b.x != null && b.y != null) {
    return new Vector(a.x * b.x, a.y * b.y);
  } else {
    return new Vector(a.x * b, a.y * b);
  }
};

Vector.divide = function(a, b) {
  if (b.x != null && b.y != null) {
    return new Vector(a.x / b.x, a.y / b.y);
  } else {
    return new Vector(a.x / b, a.y / b);
  }
};

Vector.prototype.subtract = function(vector) {
  if (vector.x != null && vector.y != null) {
    this.x -= vector.x;
    this.y -= vector.y;
  } else {
    this.x -= vector;
    this.y -= vector;
  }
  return this;
};

Vector.prototype.add = function(vector) {
  if(vector.x != null && vector.y != null) {
    this.x += vector.x;
    this.y += vector.y;
  } else {
    this.x += vector;
    this.y += vector;
  }
  return this;
};

Vector.prototype.multiply = function(vector) {
  if (vector.x != null && vector.y != null) {
    this.x *= vector.x;
    this.y *= vector.y;
  } else {
    this.x *= vector;
    this.y *= vector;
  }
  return this;
};

Vector.prototype.divide = function(vector) {
  if (vector.x != null && vector.y != null) {
    this.x /= vector.x;
    this.y /= vector.y;
  } else {
    this.x /= v;
    this.y /= v;
  }
  return this;
};

Vector.prototype.normalize = function() {
  let length = this.length();
  if (length > 0) {
    this.x /= length;
    this.y /= length;
  }
  return this;
};

Vector.prototype.length = function() {
  return Math.sqrt(this.x * this.x + this.y * this.y);
};

Vector.prototype.distance = function(vector) {
  let x = this.x - vector.x;
  let y = this.y - vector.y;
  return Math.sqrt(x * x + y * y);
};

Vector.prototype.reset = function() {
  this.x = 0;
  this.y = 0;
  return this;
};

Vector.prototype.negative = function() {
  this.x *= -1;
  this.y *= -1;
  return this;
};

//-------------------------------------------------

let Point = function(x, y){
  this.pos = new Vector(x, y);
  this.pre = new Vector(x, y);
  this.acc = new Vector();
};

Point.prototype.move = function(vector) {
  this.pos.add(vector);
};

Point.prototype.force = function(vector) {
  this.acc.add(vector);
};

Point.prototype.update = function(delta) {
  if(this.fixed) {
    return;
  } else {
    delta *= delta;
    let x = this.pos.x;
    let y = this.pos.y;
    this.acc.multiply(delta);
    this.pos.x += x - this.pre.x + this.acc.x;
    this.pos.y += y - this.pre.y + this.acc.y;
    this.acc.reset();
    this.pre.x = x;
    this.pre.y = y;
  }
};

Point.prototype.edge = function(x, y, width, height) {
  this.pos.x = Math.max(x + 1, Math.min(width - 1, this.pos.x));
  this.pos.y = Math.max(y + 1, Math.min(height - 1, this.pos.y));
  if (this.pos.y >= height - 1){
    this.pos.x -= (this.pos.x - this.pre.x + this.acc.x);
  }
};

Point.prototype.draw = function(ctx, size) {
  ctx.fillStyle = 'rgba(255,255,255, 0.4)';
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, size * 1, 0, PI_TIMES_TWO, false);
  ctx.fill();
};

//-------------------------------------------------

let Constraint = function(point_one, point_two) {
  this.point_one = point_one;
  this.point_two = point_two;
  this.length = point_one.pos.distance(point_two.pos);
  this.stretch = this.length * 0.15;
};

Constraint.prototype.resolve = function() {
  let distance = Vector.subtract(this.point_two.pos, this.point_one.pos);
  let length = distance.length();
  let difference = length - this.length;
  distance.normalize();
  let frame = distance.multiply(difference * 0.5);
  this.point_one.move(frame);
};

Constraint.prototype.draw = function(ctx) {
  ctx.strokeStyle = 'rgb(255,255,255)';
  ctx.beginPath();
  ctx.moveTo(this.point_one.pos.x, this.point_one.pos.y);
  ctx.lineTo(this.point_two.pos.x, this.point_one.pos.y);
  ctx.stroke();
};

//-------------------------------------------------

let Animation = function(canvas, gravity) {
  this.canvas = canvas;
  this.ctx = canvas.getContext('2d');
  this.ctx.lineWidth = 1;
  this.width = canvas.width;
  this.height = canvas.height;
  this.constraints = [];
  this.points = [];
  this.gravity = new Vector(0, gravity) || new Vector(0, 0.981);
  this.point_size = 5;
};

Animation.prototype.draw = function(ctx) {
  ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  let i = this.points.length;
  while(i--){
    this.points[i].draw(ctx, this.point_size);
  }
};

Animation.prototype.update = function() {
  const iter = 100;
  var delta = 1 / iter;
  let n = iter;
  while(n--) {
    let i = this.points.length;
    while(i--) {
      var point = this.points[i];
      point.force(this.gravity);
      point.update(delta);
      point.edge(0, 0, this.width, this.height);
    }
    i = this.constraints.length;
    while(i--){
      this.constraints[i].resolve();
    }
  }
};

Animation.prototype.addFrame = function(shapes) {
  this.points = this.points.concat(shapes.points);
  this.constraints = this.constraints.concat(shapes.constraints);
};

//-------------------------------------------------

let Rectangle = function(x, y, width, height) {
  this.points = [
    new Point(x, y),
    new Point(x + width, y),
    new Point(x, y + height),
    new Point(x + width, y + height)
  ];
  this.constraints = [
    new Constraint(this.points[0], this.points[1]),
    new Constraint(this.points[1], this.points[2]),
    new Constraint(this.points[2], this.points[3]),
    new Constraint(this.points[3], this.points[0]),
    new Constraint(this.points[0], this.points[2]),
    new Constraint(this.points[1], this.points[3])
  ];
};
