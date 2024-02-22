var questions = {};
var currentQuestionIndex = 0;
var correctIndex = 0;
var score = 0;
var fails = 0;

function loadQuiz(data)
{
	questions = JSON.parse(data).questions;
	currentQuestionIndex = 0;
	loadQuestion();
}

function randomNumBetween(start, end)
{
	return Math.floor(start + Math.random() * (end - start));
}

function getRandomAnswer()
{
	var chosen = 0;

	while (true) {
		chosen = randomNumBetween(0, questions.length);
		if (chosen != currentQuestionIndex) {
			break;
		}
	}

	return questions[chosen].a;
}

function loadQuestion()
{
	document.getElementById("question").innerHTML = questions[currentQuestionIndex].q;
	options = ["first", "second", "third", "fourth"];
	correctIndex = randomNumBetween(0, options.length);

	for (var i = 0; i < options.length; i++) {
		if (i == correctIndex) {
			document.getElementById(options[i]).innerHTML = questions[currentQuestionIndex].a;
		} else {
			document.getElementById(options[i]).innerHTML = getRandomAnswer();
		}
	}
}

function answer(num)
{
	if (num == correctIndex) {
		currentQuestionIndex = randomNumBetween(0, questions.length);
		score += 1;
		document.getElementById("score").innerHTML = "" + score;
		loadQuestion();
		document.body.style.backgroundColor = "green";
	}
	else {
		fails += 1;
		document.getElementById("fails").innerHTML = "" + fails;
		document.body.style.backgroundColor = "red";
	}

	setTimeout(function () {
		document.body.style.backgroundColor = "white";
	}, 300);
}

window.onload = function ()
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			loadQuiz(req.responseText);
		}
	};

	req.open("GET", "calculus_questions.json");
	req.send();
};
