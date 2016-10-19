$('document').ready(()=>{
  const PI_TIMES_TWO = Math.PI * 2;
  window.requestAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame;
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
      let inputs = $('input')
      inputs.toArray().forEach((input)=>{
        if(!input.value){
          return $(`#${input.id}`).addClass('border-warn');
        } else {
          $(`#${input.id}`).removeClass('border-warn');
        }
      });
      const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 1500;
      canvas.height = 1500;
      let animation = new Animation(canvas, view.get('gravity'));
      animation.addFrame(new Shape((canvas.width / 2), 50));
      let run = function() {
        animation.update(60);
        animation.draw(ctx);
        requestAnimFrame(run);
      };
      $('#results').removeClass('hidden');
      calculate.write();
      run();
    },
    destroy(){
      let inputs = $('input')
      inputs.toArray().forEach((input)=>{
        $(`#${input.id}`).removeClass('border-warn');
      });
      const canvas = document.getElementById('canvas');
      canvas.width = 1500;
      canvas.height = 1500;
      view.clearProperties();
      const ctx = canvas.getContext('2d');
      let animation = new Animation(canvas);
      animation.addFrame(new Shape(-100 ,-100));
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
    mass: null,
    set(str, value){
      return this[str] = value;
    },
    clearProperties(){
      this['height'] = null;
      this['gravity'] = null;
      this['mass'] = null;
      $('#height').val("")
      $('#gravity').val("")
      $('#mass').val("")
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
      $('#mass').on('change', ()=>{
        this.set('mass', this.validateNumber($('#mass').val()));
      });
      $('#gravity').on('change', ()=>{
        this.set('gravity', this.validateNumber($('#gravity').val(), true));
      });
      $('#height').on('change', ()=>{
        this.set('height', this.validateNumber($('#height').val()));
      });
    },
  };

  // Generate Caluclations when properties are ran
  let calculate = {
    write(){
      $("#energy").html(this.energy().toFixed(2));
      $("#force").html(this.impactForce().toFixed(2));
      $('#potential-energy').html(this.potentialEnergyOfGravity().toFixed(2))
      $("#time").html(this.timeUntilImpact().toFixed(2));
      $("#velocity").html(this.velocity().toFixed(2));
    },
    energy(){
      return (parseFloat((1/2)) * parseFloat(view.get('mass')) * Math.pow(parseFloat(view.get('gravity') * 10), 2));
    },
    potentialEnergyOfGravity(){
      return (parseFloat(view.get('mass')) * (parseFloat(view.get('gravity')) * 10) * parseFloat(view.get('height')));
    },
    impactForce(){
      return (parseFloat(view.get('mass')) * (parseFloat(view.get('gravity')) * 10));
    },
    timeUntilImpact(){
      return Math.sqrt(2 * parseFloat(view.get('height')) / (parseFloat(view.get('gravity')) * 10));
    },
    velocity(){
      return Math.sqrt(2 * parseFloat(view.get('height')) * (parseFloat(view.get('gravity')) * 10));
    }
  };

  let Vector = function(x,y) {
    this.x = x || 0;
    this.y = y || 0;
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

  Vector.prototype.length = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.reset = function() {
    this.x = 0;
    this.y = 0;
    return this;
  };

  let Point = function(x, y){
    this.position = new Vector(x, y);
    this.previous = new Vector(x, y);
    this.acceleration = new Vector();
  };

  Point.prototype.force = function(vector) {
    this.acceleration.add(vector);
  };

  Point.prototype.update = function(delta) {
    delta *= delta;
    let x = this.position.x;
    let y = this.position.y;
    this.acceleration.multiply(delta);
    this.previous.x += x - this.previous.x + this.acceleration.x;
    this.position.y += y - this.previous.y + this.acceleration.y;
    this.acceleration.reset();
    this.previous.x = x;
    this.previous.y = y;
  };

  Point.prototype.edge = function(x, y, width, height) {
    this.position.x = Math.max(x + 1, Math.min(width - 1, this.position.x));
    this.position.y = Math.max(y + 1, Math.min(height - 1, this.position.y));
    if (this.position.y >= height - 1){
      this.position.x -= (this.position.x - this.previous.x + this.acceleration.x);
    }
  };

  Point.prototype.draw = function(ctx, size) {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, size * 20, 0, PI_TIMES_TWO, false);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fill();
    ctx.strokeStyle = 'rgb(255,255,255)';
    ctx.stroke();
    ctx.lineWidth = 5;
  };

  let Animation = function(canvas, gravity) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.lineWidth = 1;
    this.width = canvas.width;
    this.height = canvas.height;
    this.points = [];
    this.gravity = new Vector(0, gravity) || new Vector(0, 0.981);
    this.point_size = 2;
  };

  Animation.prototype.draw = function(ctx) {
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let n = this.points.length;
    while(n--){
      this.points[n].draw(ctx, this.point_size);
    }
  };

  Animation.prototype.update = function(iter) {
    iter = iter || 6;
    let delta = 1 / iter;
    let n = iter;
    while(n--) {
      let i = this.points.length;
      while(i--) {
        let point = this.points[i];
        point.force(this.gravity);
        point.update(delta);
        point.edge(0, 0, this.width, this.height);
      }
    }
  };

  Animation.prototype.addFrame = function(shapes) {
    this.points = this.points.concat(shapes.points);
  };

  let Shape = function(x, y) {
    this.points = [
      new Point(x, y)
    ];
  };

  // Initialize Application and Canvas Event Handlers
  app.init();
  view.init();

});
