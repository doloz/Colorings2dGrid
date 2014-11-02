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

function Scheme(n) {
	for (var i = 0; i < n; i++) {
		this[i] = new Ball(i);
	}
	this.count = n;
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

var s = new Scheme(5);
s[2].left = s[1];
s[2].top = s[3];
s[1].top = s[4];
// s[1].right = s[0];
var result = autoFill(s[2]);
console.log(result);
