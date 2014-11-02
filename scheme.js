function Ball(x) {
	this.left = null;
	this.right = null;
	this.top = null;
	this.bottom = null;
	this.self = x;
}

Ball.prototype.ballWithPath = function() {
	var result = this;
	for (var i = 0; i < arguments.length; i++) {
		var next = arguments[i];
		if (result[next] === null) {
			return null;
		} else {
			result = result[next];
		}
	}
	return result;
};

Ball.prototype.toString = function() {
	var ball = this;
	var simpleBall = {};
	directions.forEach(function(dir) {
		if (ball[dir]) {
			simpleBall[dir] = ball[dir].self;
		} else {
			simpleBall[dir] = "?";
		}
	});

	return ("    " + simpleBall.top + "    \n" 
		+ "    |    \n" 
		+ simpleBall.left + " - " + ball.self + " - " + simpleBall.right + "\n"
		+ "    |    \n" 
		+ "    " + simpleBall.bottom + "    \n");
}

Ball.prototype.connectionsCount = function() {
	var ball = this;
	var result = 0;
	directions.forEach(function(dir) {
		if (ball[dir]) result++;
	});
	return result;
}

function Scheme(n) {
	for (var i = 0; i < n; i++) {
		this[i] = new Ball(i);
	}
	this.count = n;
}

Scheme.prototype.simpleRepresentation = function() {
	var result = {};
	// console.log(this);
	for (var i = 0; i < this.count; i++) {
		var simpleBall = {};
		var ball = this[i];
		// console.log(this[i]);

		directions.forEach(function (dir) {
			if (ball[dir]) {
				simpleBall[dir] = ball[dir].self;	
			} else {
				simpleBall[dir] = "?";
			}
		});
		result[i] = simpleBall;
	}
	return result;
};

Scheme.prototype.toString = function() {
	var result = "";
	for (var i = 0; i < this.count; i++) {
		result += this[i].toString() + "\n\n";
	}
	return result;
}

Scheme.prototype.connectionsCount = function() {
	var result = 0;
	for (var i = 0; i < this.count; i++) {
		result += this[i].connectionsCount();
	}
	return result;
}

Scheme.prototype.copy = function() {
	var copied = new Scheme(this.count);
	for (var i = 0; i < this.count; i++) {
		for (var j = 0; j < directions.length; j++) {
			var dir = directions[j];
			if (!this[i][dir]) copied[i][dir] = null;
				else copied[i][dir] = copied[this[i][dir].self];
		}
	}
	return copied;
}
// Scheme.prototype.getBall = function(number) {
// 	if (number >= 0 && number < this.count) {
// 		return this[number]
// 	}
// };

var directions = ["left", "right", "top", "bottom"];
var opposite = {
	"left": "right",
	"right": "left",
	"top": "bottom",
	"bottom": "top"
};

var pairs = [
	["left", "top"],
	["left", "bottom"],
	["right", "top"],
	["right", "bottom"]
];

function autoFill(ball) {
	// A + x + -x = A
	for (var i = 0; i < directions.length; i++) {
		var dir = directions[i];
		var otherBall = ball[dir];
		if (otherBall) {
			if (otherBall[opposite[dir]] !== null) {
				if (otherBall[opposite[dir]] !== ball) {
					return false;
				}
			} else {
				otherBall[opposite[dir]] = ball;
			}
		}
	}

	// A + x + y = A + y + x
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i];
		var ballX = ball[pair[0]];
		var ballY = ball[pair[1]];
		if (ballX === null || ballY === null) continue;
		var ballXY = ballX[pair[1]];
		var ballYX = ballY[pair[0]];
		if (ballXY === null && ballYX === null) continue;
		if (ballXY !== null && ballYX !== null) {
			if (ballXY !== ballYX) return false;
				else continue;
		} 
		if (ballXY !== null) ballYX = ballXY;
			else ballXY = ballYX;
	}

	return true;
}

function autoFillAll(scheme) {
	// var initialConnectionsCount = scheme.connectionsCount()
	do {
		var lastConnectionsCount = scheme.connectionsCount();
		for (var i = 0; i < scheme.count; i++) {
			var result = autoFill(scheme[i]);
			if (!result) return false;
		}
	} while (lastConnectionsCount != scheme.connectionsCount());

	// if (scheme.connectionsCount != initialConnectionsCount) {
	// 	return autoFillAll(scheme);
	// }
	return true;

}

var s = new Scheme(5);
s[2].left = s[1];
s[2].top = s[3];
s[1].top = s[4];

var s2 = s.copy();
s2[1].top = s2[1];
// s[3].left = s[4];
// s[1].right = s[0];
var result = autoFillAll(s);
console.log(s.toString());
console.log(s2.toString());

// console.log(s.connectionsCount());
