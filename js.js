var wins=0, aiWins=0, score=0, draws=0;
var elements = ['Water','Air','Earth','Fire','Spirit'];
var weaknesses = [];
var playerLives = [];
var AILives = [];
var root = this;
var startingLives = 5;

function el(id){
	return document.getElementById(id);
}

function removeSplash(){
//	el('splash').classList.add('removed');
	el('container').style.visibility = 'visible';
	el('battlefieldplayer').style.visibility = 'visible';
	el('battlefieldAI').style.visibility = 'visible';
	el('cv').style.visibility = 'visible';
}

// function addSplash(message){
// 	el('splash').classList.remove('removed');
// 	el('container').style.visibility = 'hidden';
// 	el('battlefieldplayer').style.visibility = 'hidden';
// 	el('battlefieldAI').style.visibility = 'hidden';
// 	el('splashText').innerHTML = message;

// }

function updateScore() {
	el('score').innerHTML = 'Balance: ' + score;
	el('wins').innerHTML = 'Wins: ' + wins;
	el('losses').innerHTML = 'Losses: ' + aiWins;
	el('draws').innerHTML = 'Draws: ' + draws;

	updateBattlefield('AI');
	updateBattlefield('player');
}

function updateBattlefield(owner){

	var i = 0;

	while(i < 5) {

		var element = elements[i];
		el(owner + element).innerHTML = root[owner + 'Lives'][element];

		i++;
	}

}

function createPieces(owner) {

	root[owner + 'Lives'][0] = 0;
	var i = 0;

	while(i < 5) {

		var element = elements[i];

		root[owner + 'Lives'][0] += startingLives;
		root[owner + 'Lives'][element] = startingLives;
		
		var thisElement = document.createElement('div');
		thisElement.className = element + ' piece';
		thisElement.id = owner + element;
		thisElement.innerHTML = startingLives;

		el('battlefield' + owner).appendChild(thisElement);

		i++;
	}
}

function createToolTips(){

	var i = 0;

	while(i < 5) {
		var element = elements[i];
		var tip = element + ' is weak against ' + weaknesses[element].join(' and ') + '.';
		el(element + 'Button').title = tip;
		i++;
	}
}

function init() {	
	removeSplash();
	addCanvas();

	weaknesses['Water'] 	= ['Air', 'Spirit'];
	weaknesses['Air'] 		= ['Fire', 'Spirit'];
	weaknesses['Fire'] 		= ['Water', 'Earth'];
	weaknesses['Earth'] 	= ['Air', 'Water'];
	weaknesses['Spirit'] 	= ['Earth', 'Fire'];

	createPieces('player');
	createPieces('AI');
	createToolTips();

	updateScore();
	
}


function addCanvas() {
	var canvas = el("cv");
	var ctx = canvas.getContext("2d");
	canvas.width = 512;
	canvas.height = 480;
	canvas.style.backgroundcolor = 'blue';
	document.body.appendChild(canvas);
}

function submit(element){

	var verbs = ['destroys','annihilates','beats','thrashes','crushes','is victorious over','wins against','decimates','kills']
	
	// What each element loses against
	

	// Choose an element for the AI
	aiElement = elements[Math.floor(Math.random()*5)];
	while (AILives[aiElement] <= 0) {
		aiElement = weaknesses[Math.floor(Math.random()*5)];
	}
	var verb = verbs[ Math.floor(Math.random() * verbs.length) ];

	var currentBattle = document.createElement('p');
	var aiSpan = '<span class="' + aiElement + 'Text">' + aiElement + '</span>';
	var elementSpan = '<span class="' + element + 'Text">' + element + '</span>';

	if(element === aiElement){
		currentBattle.innerHTML = aiSpan + ' counters ' + elementSpan + '.';
		draws++;
		attack(element, 'AI', 'player');
		attack(element, 'player', 'AI');
	}else if(weaknesses[element].indexOf(aiElement) > -1){
		//The computer's element beats yours
		currentBattle.innerHTML = aiSpan + ' ' + verb + ' ' + elementSpan + '. You lose.';
		aiWins++;
		score--;
		attack(element, 'AI', 'player');
	}else{
		//Your element wins!
		currentBattle.innerHTML = elementSpan + ' ' + verb + ' ' + aiSpan + '. You win!';
		wins++;
		score++;
		attack(aiElement, 'player', 'AI');
	}

	updateScore();
	var log = el('log');
	log.appendChild(currentBattle);
	log.scrollTop = log.scrollHeight;

}

function attack(element, attacker, defender) {

	root[defender + 'Lives'][element] --;

	if(root[defender + 'Lives'][element] <= 0) {
		el(defender + element).className += ' disabled';

		if(defender === 'player') {
			el(element + 'Button').className += ' disabled';
			el(element + 'Button').onclick = '';
		}
	}

	var lives = root[defender + 'Lives'][0]--;
	console.log(defender+" lives : "+lives);
	if( lives === 1 ) {
		if(attacker === 'player'){
			addSplash('Congratulations, you have defeated the elemental forces!');
		}else{
			addSplash('You have been defeated by the Chaos elementals!');
		}
	}

}