const removeHide = (array) => {
	array.forEach(element => {
		element.classList.remove('hide');
	});
}

// Création de la grille
const createGrid = () => {
	
	let tour = document.getElementById('tour');
	let menu = document.getElementById('menu');
	let example = document.getElementById('example');
	removeHide([tour,menu,example])

	// Variable Global
	NOMBRE_LIGNE = Number(document.getElementById("nbLigne").value);
	NOMBRE_COLONNE = Number(document.getElementById("nbColonne").value);
	NB_TOUR = 0;
	INTERVAL = 180;
	continueSimu = true;
	grilleMasquer = false;
	lancer = false;

	// Taille des cases
	const SIZE_BOX = "20px";

	// Racourci
	let RCboxesApp = document.getElementById("boxesApp");

	// Si Colonne ou ligne négatif alors quitter
	if(NOMBRE_LIGNE < 0 || NOMBRE_COLONNE < 0)
		return;

	// Remettre grille à 0 si taille changée
	RCboxesApp.innerHTML="";

	// Effacer Menu de la grille après validation
	document.getElementById("menuGrille").innerHTML="";
	
	// Création des cases de la grilles
	for (let i = 1; i <= NOMBRE_LIGNE; i++) {

		let ligneBox = document.createElement("tr");

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			let box = document.createElement("td");

			box.classList.add("boxesL"+i);
			box.classList.add("whiteBG");
			box.classList.add("whiteBorder");
			box.style.width = SIZE_BOX;
			box.style.height = SIZE_BOX;
			box.setAttribute("onclick", "clickSurCase(\""+ ("boxesL"+i) +"\", "+j+")");

			ligneBox.appendChild(box);
		}
		RCboxesApp.appendChild(ligneBox);
	}

	// Création d'un tableau
	gridCase = new Array(NOMBRE_LIGNE);
	for(i=1;i<=NOMBRE_LIGNE;i++)
		gridCase[i] = new Array(NOMBRE_COLONNE);

	// Association de chaque cases avec un indice du tableau (ligne/caseLigne)
	for (let i = 1; i <= NOMBRE_LIGNE; i++)
		for (let j = 1; j <= NOMBRE_COLONNE; j++)		
			gridCase[i][j] = document.getElementsByClassName("boxesL"+i)[j-1];
}

// Inversion mort/naissance au clic sur la case
const clickSurCase = (elt, j) => {
	let tmp = document.getElementsByClassName(elt);
	let eltToInvert = tmp[j-1];

	if(eltToInvert.classList.contains("whiteBG")) {
		switchWhiteToBlackColor([eltToInvert]);
	} else if(eltToInvert.classList.contains("blackBG")) {
		switchBlackToWhiteColor([eltToInvert]);
	}
}

const countNbVoisinAndAddClassMortNaissance = () => {
	// Nouveau tour
	NB_TOUR++;
	document.getElementById("nbTour").innerHTML = NB_TOUR;

	// Calcule du nombre de voisine pour chaque cases 
	let nbVoisine=0;

	for (var i = 1; i <= NOMBRE_LIGNE; i++) {

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			nbVoisine=0;
			
			//Voisine de gauche
			if(j!=1 && gridCase[i][j-1].classList.contains("blackBG")) nbVoisine++;

			//Voisine de droite
			if(j!=NOMBRE_COLONNE && gridCase[i][j+1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du haut
			if(i!=1 && gridCase[i-1][j].classList.contains("blackBG")) nbVoisine++;

			//Voisine du bas
			if(i!=NOMBRE_LIGNE && gridCase[i+1][j].classList.contains("blackBG")) nbVoisine++;

			//Voisine du haut-gauche
			if(j!=1 && i!=1 && gridCase[i-1][j-1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du haut-droite
			if(i!=1 && j!=NOMBRE_COLONNE && gridCase[i-1][j+1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du bas-gauche
			if(j!=1 && i!=NOMBRE_LIGNE && gridCase[i+1][j-1].classList.contains("blackBG")) nbVoisine++;

			//Voisine du bas-droite
			if(i!=NOMBRE_LIGNE && j!=NOMBRE_COLONNE && gridCase[i+1][j+1].classList.contains("blackBG")) nbVoisine++;

			// Règles du jeu && attribution mort/naissance

			// Ajouter class mort
			if(gridCase[i][j].classList.contains("blackBG") && nbVoisine != 2 && nbVoisine != 3) gridCase[i][j].classList.add("mort");

			// Ajouter class naissance
			if(gridCase[i][j].classList.contains("whiteBG") && nbVoisine == 3) gridCase[i][j].classList.add("naissance");
				
		}
	}
}
const ActualisationDeLaGrille = () => {
	// Actualisation de la grille
	for (var i = 1; i <= NOMBRE_LIGNE; i++) {

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			if(gridCase[i][j].classList.contains("mort")) {

				gridCase[i][j].classList.replace("blackBG", "whiteBG");
				gridCase[i][j].classList.replace("blackBorder", "whiteBorder");
				gridCase[i][j].classList.remove("mort");
			}
			
			if(gridCase[i][j].classList.contains("naissance")) {

				gridCase[i][j].classList.replace("whiteBG", "blackBG");
				gridCase[i][j].classList.replace("whiteBorder", "blackBorder");
				gridCase[i][j].classList.remove("naissance");
			}
		}
	}	
}

// Lance la simulation
const lancerSimu = () => {

	countNbVoisinAndAddClassMortNaissance();

	ActualisationDeLaGrille();
}

// Lance la simulation automatique
const autoSimu = () => {
	lancer = true;

	if(continueSimu) {

		simu = setInterval("lancerSimu()", INTERVAL);
		document.getElementById("autoOn").innerHTML = "ON";
		document.getElementById("autoOn").style.color = "green";
		continueSimu = false;

	}
	else{

		clearInterval( simu );
		document.getElementById("autoOn").innerHTML = "OFF";
		document.getElementById("autoOn").style.color = "red";
		continueSimu = true;
	}
}

// Tue toutes les cellules
const clearGrid = () => {
	NB_TOUR = 0;
	document.getElementById("nbTour").innerHTML = NB_TOUR;
	for (var i = 1; i <= NOMBRE_LIGNE; i++) {

		for (let j = 1; j <= NOMBRE_COLONNE; j++) {

			if(gridCase[i][j].classList.contains("mort")) {				
				gridCase[i][j].classList.remove("mort");
			}
			
			else if(gridCase[i][j].classList.contains("naissance")) {
				gridCase[i][j].classList.remove("naissance");
			}

			if(gridCase[i][j].classList.contains("blackBG")) {				
				gridCase[i][j].classList.replace("blackBG", "whiteBG");
				gridCase[i][j].classList.replace("blackBorder", "whiteBorder");
			}	
		}
	}
	continueSimu = false;
	autoSimu();
}

// Masque la grille
const hideGrid = () => {

	if(grilleMasquer) {

		for (var i = 1; i <= NOMBRE_LIGNE; i++) {

			for (let j = 1; j <= NOMBRE_COLONNE; j++) {		

					if(gridCase[i][j].classList.contains("whiteBG")) {
						gridCase[i][j].classList.add("whiteBorder");
					}
					else if(gridCase[i][j].classList.contains("blackBG")) {
						gridCase[i][j].classList.add("blackBorder");
					}
					grilleMasquer = false;
			}
		}
	}
	else {

		for (var i = 1; i <= NOMBRE_LIGNE; i++) {

			for (let j = 1; j <= NOMBRE_COLONNE; j++) {		

					if(gridCase[i][j].classList.contains("whiteBG")) {
						gridCase[i][j].classList.remove("whiteBorder");
					}
					else if(gridCase[i][j].classList.contains("blackBG")) {
						gridCase[i][j].classList.remove("blackBorder");
					}
					grilleMasquer = true;
			}
		}
	}
}

// Augmente la vitesse auto
const increaseSpeed = () => {
	if(!lancer)
		return;

	continueSimu = false;
	autoSimu();
	INTERVAL -= 10;
	document.getElementById("idVitesse").innerHTML = (-INTERVAL/10)+18;
}

// Diminue la vitesse auto
const decreaseSpeed = () => {
	if(!lancer)
		return;

	continueSimu = false;
	autoSimu();
	INTERVAL += 10;
	document.getElementById("idVitesse").innerHTML = (-INTERVAL/10)+18;
}

// Exemples d'essemble de cellules complexes
const exCanon = () => {
	let array = [
		gridCase[5][1],
		gridCase[5][2],
		gridCase[6][1],
		gridCase[6][2],
		gridCase[5][11],
		gridCase[6][11],
		gridCase[7][11],
		gridCase[4][12],
		gridCase[3][13],
		gridCase[3][14],
		gridCase[8][12],
		gridCase[9][13],
		gridCase[9][14],
		gridCase[6][15],
		gridCase[4][16],
		gridCase[8][16],
		gridCase[5][17],
		gridCase[6][17],
		gridCase[7][17],
		gridCase[6][18],
		gridCase[3][21],
		gridCase[4][21],
		gridCase[5][21],
		gridCase[3][22],
		gridCase[4][22],
		gridCase[5][22],
		gridCase[2][23],
		gridCase[6][23],
		gridCase[1][25],
		gridCase[2][25],
		gridCase[6][25],
		gridCase[7][25],
		gridCase[3][35],
		gridCase[4][35],
		gridCase[3][36],
		gridCase[4][36],
		gridCase[5][1],
		gridCase[5][2],
		gridCase[6][1],
		gridCase[6][2],
		gridCase[5][11],
		gridCase[6][11],
		gridCase[7][11],
		gridCase[4][12],
		gridCase[3][13],
		gridCase[3][14],
		gridCase[8][12],
		gridCase[9][13],
		gridCase[9][14],
		gridCase[6][15],
		gridCase[4][16],
		gridCase[8][16],
		gridCase[5][17],
		gridCase[6][17],
		gridCase[7][17],
		gridCase[6][18],
		gridCase[3][21],
		gridCase[4][21],
		gridCase[5][21],
		gridCase[3][22],
		gridCase[4][22],
		gridCase[5][22],
		gridCase[2][23],
		gridCase[6][23],
		gridCase[1][25],
		gridCase[2][25],
		gridCase[6][25],
		gridCase[7][25],
		gridCase[3][35],
		gridCase[4][35],
		gridCase[3][36],
		gridCase[4][36]
	];
	switchWhiteToBlackColor(array);
}

const exClignotant = () => {	
	let array = [
		gridCase[2][1],
		gridCase[2][2],
		gridCase[2][3],
		gridCase[2][1],
		gridCase[2][2],
		gridCase[2][3]
	];
	switchWhiteToBlackColor(array);
}

const exPlaneur = () => {	
	let array = [
		gridCase[2][1],
		gridCase[3][2],
		gridCase[1][3],
		gridCase[2][3],
		gridCase[3][3],
		gridCase[2][1],
		gridCase[3][2],
		gridCase[1][3],
		gridCase[2][3],
		gridCase[3][3]
	];
	switchWhiteToBlackColor(array);
}

const exRuche = () => {	
	let array = [
		gridCase[2][1],
		gridCase[2][2],
		gridCase[2][3],
		gridCase[2][4],
		gridCase[2][1],
		gridCase[2][2],
		gridCase[2][3],
		gridCase[2][4]
	];
	switchWhiteToBlackColor(array);
}

const ex4Ruche = () => {
	let array = [
		gridCase[8][5],
		gridCase[7][6],
		gridCase[7][7],
		gridCase[7][8],
		gridCase[8][8],
		gridCase[9][6],
		gridCase[9][7],
		gridCase[8][5],
		gridCase[7][6],
		gridCase[7][7],
		gridCase[7][8],
		gridCase[8][8],
		gridCase[9][6],
		gridCase[9][7]
	];
	switchWhiteToBlackColor(array);
}

const ex4Clignotant = () => {	
	let array = [
		gridCase[5][3],
		gridCase[5][4],
		gridCase[5][5],
		gridCase[5][6],
		gridCase[5][7],
		gridCase[5][3],
		gridCase[5][4],
		gridCase[5][5],
		gridCase[5][6],
		gridCase[5][7]
	];
	switchWhiteToBlackColor(array);
}

const exOieCanada = () => {
	let array = [
		gridCase[14][1],
		gridCase[13][2],
		gridCase[13][3],
		gridCase[14][3],
		gridCase[14][4],
		gridCase[14][5],
		gridCase[15][5],
		gridCase[15][6],
		gridCase[17][5],
		gridCase[18][4],
		gridCase[20][2],
		gridCase[20][3],
		gridCase[19][5],
		gridCase[19][6],
		gridCase[20][5],
		gridCase[21][5],
		gridCase[21][6],
		gridCase[15][9],
		gridCase[15][10],
		gridCase[16][9],
		gridCase[18][8],
		gridCase[18][9],
		gridCase[19][8],
		gridCase[20][8],
		gridCase[19][10],
		gridCase[20][10],
		gridCase[21][11],
		gridCase[22][11],
		gridCase[23][11],
		gridCase[22][10],
		gridCase[23][10],
		gridCase[14][12],
		gridCase[13][13],
		gridCase[12][13],
		gridCase[12][12],
		gridCase[12][11],

		gridCase[14][1],
		gridCase[13][2],
		gridCase[13][3],
		gridCase[14][3],
		gridCase[14][4],
		gridCase[14][5],
		gridCase[15][5],
		gridCase[15][6],
		gridCase[17][5],
		gridCase[18][4],
		gridCase[20][2],
		gridCase[20][3],
		gridCase[19][5],
		gridCase[19][6],
		gridCase[20][5],
		gridCase[21][5],
		gridCase[21][6],
		gridCase[15][9],
		gridCase[15][10],
		gridCase[16][9],
		gridCase[18][8],
		gridCase[18][9],
		gridCase[19][8],
		gridCase[20][8],
		gridCase[19][10],
		gridCase[20][10],
		gridCase[21][11],
		gridCase[22][11],
		gridCase[23][11],
		gridCase[22][10],
		gridCase[23][10],
		gridCase[14][12],
		gridCase[13][13],
		gridCase[12][13],
		gridCase[12][12],
		gridCase[12][11]
	];
	switchWhiteToBlackColor(array)
}

const switchWhiteToBlackColor = (elt) => {
	elt.forEach(element => {
		element.classList.replace("whiteBG", "blackBG");
		element.classList.replace("whiteBorder", "blackBorder");
	});
};

const switchBlackToWhiteColor = (elt) => {
	elt.forEach(element => {
		element.classList.replace("blackBG", "whiteBG");
		element.classList.replace("blackBorder", "whiteBorder");
	});
};