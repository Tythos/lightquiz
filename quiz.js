var originalQuestions = {};
var questions = {};
var currentQuestionIndex = 0;
var partInQuestion = 1;
var correctIndex = 0;
var score = 0;
var fails = 0;
var mode = "";

function loadQuiz(data)
{
	originalQuestions = JSON.parse(data).questions;
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

	if (mode == "proof") {
		return "<img src=\"images/" + questions[chosen].id + "-" + 1 + ".png\">";
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
			var content = "";
			if (mode == "proof") {
				content = "<img src=\"images/" + questions[currentQuestionIndex].id + "-" + partInQuestion + ".png\">";
			} else {
				content = questions[currentQuestionIndex].a;
			}

			document.getElementById(options[i]).innerHTML = content;
		} else {
			document.getElementById(options[i]).innerHTML = getRandomAnswer();
		}
	}
}

function practice(what)
{
	score = 0;
	fails = 0;
	renderScoreAndFails();
	mode = what;
	currentQuestionIndex = 0;

	questions = originalQuestions.filter((q) => {
		if (q.type == undefined && mode == "theorem") {
			return true;
		}

		return q.type === mode;
	});

	loadQuestion();
}

function renderScoreAndFails()
{
	document.getElementById("score").innerHTML = "" + score;
	document.getElementById("fails").innerHTML = "" + fails;
}

function answer(num)
{
	document.getElementById("splash").style.visibility = "visible";
	document.getElementById("splash").style.opacity = "0.9";

	if (num == correctIndex) {
		if (partInQuestion < questions[currentQuestionIndex].parts) {
			partInQuestion++;
		} else {
			currentQuestionIndex = randomNumBetween(0, questions.length);
			partInQuestion = 1;
			score += 1;
		}

		loadQuestion();
		document.getElementById("splash").style.backgroundColor = "green";
		document.getElementById("splash").innerHTML = "Correct! 🙂";
	}
	else {
		fails += 1;
		document.getElementById("splash").style.backgroundColor = "red";
		document.getElementById("splash").innerHTML = "Incorrect 😭";
	}

	renderScoreAndFails();

	setTimeout(function () {
		document.getElementById("splash").style.opacity = "0";
		document.getElementById("splash").style.visibility = "hidden";
	}, 700);
}

window.onload = function ()
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			loadQuiz(req.responseText);
			practice("proof");
		}
	};

	req.open("GET", "calculus_questions.json");
	req.send();
};
