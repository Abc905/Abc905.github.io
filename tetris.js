var NUM_ROWS = 20;
var NUM_COLS = 10;
var PIT_WIDTH = 30;
var PIT_HEIGHT = 30;
var TICK_MS = 800;
var TICK_SHORT = 50;
var SPACE = ' ';
var debug;

function anyOf2(a, b) {
  return random(2) == 1 ? a : b
};

Array.prototype.i1 = function(i) {
  return this[i - 1]
};

function isArray(x) {
  return ((typeof x) === 'object') && Array.isArray(x)
};

Array.prototype.equals = function(a) {
  var l = this.length;
  if(!a || l != a.length)
    return;
  for(var i = 1; i <= l; i++) {
    var ti = this.i1(i), ai = a.i1(i)
    if(isArray(ti) ? !ti.equals(ai) : (ti != ai))
      return;
  };
  return anyOf2(this, a)
};

Array.prototype.pushz = function(a) {
  return a ? this.pusha(a) : this
};

Array.prototype.pusha = function(v) { // returns array
  var a = this;
  a.push(v);
  return a
};

function ify(c, f, a) { // cond func arg
  return c ? f(a) : a
};

Array.prototype.ify = function(c, f) {
  return c ? f.bind(this)() : this
};

Array.prototype.len = function() {
  return this.length
};

Function.prototype.binda = function() {
  return binda(this, ...arguments);
};

function binda(f) { // arg
  var bound = Array.prototype.slice.call(arguments, 1);
  return function() {
    Array.prototype.push.apply(arguments, bound);
    return f.apply(this, arguments);
  }
};

function inc(n) {return ++n};
function dup(n) {return n+n};

function divs(n, d) { // stochastic
  // 12/5 = [2, 2, 2, 3, 3]
  var i = Math.floor(n / d);
  return ify(Math.random() < n / d - i, inc, i)
};

function initx() {
  return divs(NUM_COLS - 4, 2)
};

function revert(p) {
  var r = [];
  for (var i = p.length; i; i--)
    r.push(p[i - 1]);
  return r
};

var pieces2 = [
  [
    [1, 1],
    [1, 1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1],
    [1, 1],
    [0, 1]
  ],
  [
    [0, 1, 1],
    [1, 1, 0]
  ],
  [
    [1, 0, 0],
    [1, 1, 1]
  ]
].reduce(
  function(r, v) {
    var p = revert(v); 
    return r.pushz(v).ify(!p.equals(v), Array.prototype.pusha.binda(p))
  }, 
  []
);

var pieces = pieces2.map(f44);

function newMatrix(hl, vl) {
  var r = new Array(vl);
  for (var v=0; v<vl; v++)
    r[v] = new Array(hl);
  return r
};

function hlen(p) {return p.i1(1).length}; // horizontal
function vlen(p) {return p.length}; // vertical

function rot(p, d) { // piece dir
  var hl = hlen(p), vl = vlen(p), r = newMatrix(vl, hl);
  function f(c, l, d) {return (l+1)*(1-d)/2+c*d}; // coord
  for (var v=1; v<=vl; v++)
    for (var h=1; h<=hl; h++)
      r[f(h,hl,d)-1][f(v,vl,-d)-1] = p[v-1][h-1];
  return r
};

function ror(p) {return rot(p, 1)};
function rol(p) {return rot(p, -1)};

function f44(p) { // fill 4x4
  var r = newMatrix(4, 4), hl = hlen(p), vl = vlen(p), 
    hp = divs(4 - hl, 2) + 1, vp = divs(4 - vl, 2) + 1; // pos
  //return r;
  for (var v=1; v<=4; v++)
    for (var h=1; h<=4; h++)
      r[v-1][h-1] = 0;
  //return r;
  for (var v=1; v<=vl; v++)
    for (var h=1; h<=hl; h++)
      r[vp-1+v-1][hp-1+h-1] = p[v-1][h-1];
  return r
};

function arrayToString(a) {
  return isArray(a) ? '[' + a.map(arrayToString).join(', ') + ']' : a.toString()
};

Array.prototype.toString = function () {
  return arrayToString(this)
};

function d() {
  var tp = pieces[2];
  //return arrayToString([1, 2, 3]);
  //return [1, 2, 3]
  //return revert([1, 2, 3]);
  //return pieces2;
  //return vlen(tp);
  //return hlen(tp);
  //return tp;
  //return rol(tp);
  //return f44(tp);
  //return initx();
  //return divs(11, 10);
  //return revert(pieces[3]);
  //return pieces[3];
  //return [1, 3].length === 2;
  //return [1, 3].len() === 2;
  //return Array.prototype.len.bind([1, 3, 4])() === 3;
  //return Array.prototype.pushz.bind([1])(2).equals([1, 2]);
  //return binda(inc, 1)() === 2;
  //return inc.binda(1)() == 2;
  //return [1].ify(false, binda(Array.prototype.pushz, 2)).equals([1]);
  //return [1].ify(true, binda(Array.prototype.pushz, 2)).equals([1, 2]);
  //return ify(false, function(n) {return ++n}, 1) === 1;
  //return ify(true, function(n) {return ++n}, 1) === 2;
  //return Array.prototype.pushz.call([1], 3).equals([1, 3])
  //return pieces.length
};

function intersects(rows, piece, v, h) {
  for (var i = 4; i; i--)
    for (var j = 4; j; j--)
      if (piece[i-1][j-1])
        if (v+i > NUM_ROWS || !(h+j) || h+j > NUM_COLS || rows[v+i-1][h+j-1])
          return true
};

function apply_piece(rows, piece, y, x) {
  for (var i = 0; i < 4; i++)
    for (var j = 0; j < 4; j++)
      if (piece[i][j])
        rows[y+i][x+j] = 1;
}

function kill_rows(rows) {
  var newRows = [];
  var k = NUM_ROWS;
  for (var i = NUM_ROWS; i --> 0;) {
    for (var j = 0; j < NUM_COLS; j++) {
      if (!rows[i][j]) {
        newRows[--k] = rows[i].slice();
        break;
      }
    }
  }
  for (var i = 0; i < k; i++) {
    newRows[i] = [];
    for (var j = 0; j < NUM_COLS; j++)
      newRows[i][j] = 0;
  }
  return newRows;
}

function random(n) {return Math.floor(Math.random() * n) + 1};
function range0(n) {return [...Array(n).keys()]}; // 0..n-1
function range(n) {return range0(n).map(v => ++v)}; // 1..n
function comp(f, g) {return function() {return f(g(...arguments))}};
function spread(x, n) {return Array(n).fill(x)};
function id(a) {return a};

function convey() {
  return revert([...arguments]).reduce((r, f) => comp(f, r), id)
};

//function m2f(m) { // method func
//  return function() {m.call(...arguments)};
//}

//function f2m(f) { // function method
//  return function() {};
//}

function randomPiece() {
  return convey(...spread(rol, random(4) - 1))(pieces[random(pieces.length) -1])
};

function aGame() {
  this.gameOver;
  this.currentPiece = randomPiece();
  this.pieceY = 0;
  this.pieceX = initx();
  this.rows = [];

  for (var i = 0; i < NUM_ROWS; i++) {
    this.rows[i] = []
    for (var j = 0; j < NUM_COLS; j++) {
      this.rows[i][j] = 0;
    }
  }
}

function event(name) {
  window.dispatchEvent(new Event(name));
};

aGame.prototype.tick = function() {
  if (this.gameOver)
    return;
  if (intersects(this.rows, this.currentPiece, this.pieceY + 1, this.pieceX)) {
    apply_piece(this.rows, this.currentPiece, this.pieceY, this.pieceX);
    this.rows = kill_rows(this.rows);
    var np = randomPiece(), ny = 0, nx = initx(); //new
    if (intersects(this.rows, np, ny, nx))
      this.gameOver = true;
    else {
      this.currentPiece = np;
      this.pieceY = ny;
      this.pieceX = nx;
    }
    event('landed')
  } else {
    this.pieceY++;
  }
}

aGame.prototype.steerHor = function(dir) {
  if (!intersects(this.rows, this.currentPiece, this.pieceY, this.pieceX + dir)) {
    this.pieceX += dir;
    return true
  }
};

aGame.prototype.steerRight = function() {return this.steerHor(1)};
aGame.prototype.steerRightmost = function() {while (this.steerRight()) {}};
aGame.prototype.steerLeft = function() {return this.steerHor(-1)};
aGame.prototype.steerLeftmost = function() {while (this.steerLeft()) {}};

aGame.prototype.steerDown = function() {
  if (!intersects(this.rows, this.currentPiece, this.pieceY + 1, this.pieceX))
    this.pieceY++
};

aGame.prototype.rol = function() {
  var newPiece = rol(this.currentPiece);
  if (!intersects(this.rows, newPiece, this.pieceY, this.pieceX))
    this.currentPiece = newPiece;
}

aGame.prototype.ror = function() {
  var newPiece = ror(this.currentPiece);
  if (!intersects(this.rows, newPiece, this.pieceY, this.pieceX))
    this.currentPiece = newPiece;
  return this;
}

aGame.prototype.get_rows = function() {
  var rows = [];
  for (var i = 0; i < NUM_ROWS; i++)
    rows[i] = this.rows[i].slice();
  apply_piece(rows, this.currentPiece, this.pieceY, this.pieceX);
  return rows;
}

function div() {return document.createElement('div')};

function draw_pit(rows) {
  var pit = div();
  pit.classList.add('pit');
  for (var i = 0; i < NUM_ROWS; i++) {
    var r = div(); // row
    r.classList.add('row');
    for (var j = 0; j < NUM_COLS; j++) {
      var w = div();
      w.classList.add('blockw');
      var b = div();
      b.classList.add('block');
      if (rows[i][j])
        b.classList.add('habitated')
      else {
        var dot = div();
        dot.classList.add('dot');
        b.appendChild(dot);
      };
      //b.style.top = (i * PIT_HEIGHT) + 'px';
      //b.style.left = (j * PIT_WIDTH) + 'px';
      w.appendChild(b);
      r.appendChild(w);
    }
    pit.appendChild(r);
  }
  return pit;
}

function draw_pitPane(game) {
  var e = div();
  e.classList.add('pitPane');
  e.appendChild(draw_pit(game.get_rows()));
  return e;
}

function draw_usage(game) {
  var e = div();
  e.classList.add('usage');
  e.innerHTML = 
    "<p>← → ↓ d f s Space Home End p</p>" +
    "<p>Private <a href=\"https://github.com/Abc905/Abc905.github.io\">software</a></p>" +
    "<p>" + 
    //[1, 2, 3].map(function(v) {return v+1}) + 
    //[3, 4][1] +
    //revert([1, 2, 0, 3]) +
    //[2, 1, 0].reduce(function(r, v){var p = v - 1; if (p) {r.push(p)}; return r}, [])
    //anyOf2(3, 4) +
    //i1([3, 5], 2) +
    //[3, 5].i1(1) +
    //(typeof 1) +
    //[1, 2].equals([1, 2]) +
    //[1, 3].equals([1, 2]) +
    //(typeof [1]) +
    //isArray([1]) +
    //isArray(1) +
    //[[1, 2], [3, 4]].equals([[1, 2], [3, 4]]) +
    //([[1, 2], [3, 4]].equals([[1, 2], [3, 4]]).length == 2) +
    //[[3, 2], [1, 2]].equals([[1, 2], [1, 2]]) +
    //(undefined ? 'd' : 'u') +
    //([1, 2].pusha(3)).join('-') +
    //[1, 2].pushz(4) +
    //[1, 2].pushz(0).pushz(4) +
    //'debug: ' + d() +
    //pieces.length +
    "</p>" +
    (debug ? '<p>debug2: ' + debug + "</p>" : '');
  return e;
}

function redraw(game, e) {
  e.innerHTML = '';
  e.appendChild(draw_pitPane(game));
  e.appendChild(draw_usage(game));
};

function run(ce) {
  var g, handler, speed; // game
  
  function listener(e) {
      var k = e.key, p = (k === 'p'), sp = (k === SPACE);
      var wasSpeed = speed;
      var consumed = true;
      if (k === 'ArrowLeft') {
        g.steerLeft();
      } else if (k === 'Home') {
        g.steerLeftmost();
      } else if (k === 'ArrowRight') {
        g.steerRight();
      } else if (k === 'End') {
        g.steerRightmost();
      } else if (k === 'ArrowDown') {
        g.steerDown();
      } else if (k === 'd' || k === 'ArrowUp') {
        g.rol();
      } else if (k === 'f') {
        g.ror();
      } else if (k === 's') {
        g.ror().ror();
      } else if (sp) {
        speed !== 'quick' ? quick() : leisuret();
      } else if (p) {
        speed ? stop() : leisuret();
      } else {
        consumed = false;
      }
      redraw(g, ce);
      if (consumed) {
        !wasSpeed && !p && !sp && leisure();
        e.preventDefault();
      }
  };

  function tick() {g.tick(); redraw(g, ce)};

  function setHandler(interval) {
    handler && clearHandler();
    handler = setInterval(tick, interval)
  };
  
  function clearHandler() {clearInterval(handler); handler = null};

  function leisure() {speed = 'easy'; setHandler(TICK_MS)};
  function leisuret() {tick(); leisure()};
  function quick() {speed = 'quick'; tick(); setHandler(TICK_SHORT)};
  function stop() {speed = null; clearHandler()};

  g = new aGame();
  redraw(g, ce);
  window.addEventListener('keydown', listener);
  window.addEventListener('landed', leisure);
  leisure();
}