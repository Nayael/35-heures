var clients = (function() {
	'use strict';

	var clients = {
		"Pro": {
			"Name" : "Henry",
			"StartPatience" : 60,		
			"PhraseIntro" : "Bonjour, je viens retirer une commande, tenez voici le recommandé ainsi que ma carte d’identité.",
			"Vulnerability" : {
								"technology" : 0.5,
								"paperwork" : 1.5
							  },
			"Action" : {
								"phaseOne" :{
									"action" : "computerFakbok",
									"phrase" : "Vous faites quoi là !?",
									"result" : false
								},
								"checkPapers" :{
									"phrase" : "Ce sont les bons papiers, pas la peine de vérifier",
									"success" : false
								},
								"getPackage" :{
									"phrase" : "Merci, bonne journée",
									"success" : true
								},
								"phaseDefault" : {
									"phrase" : "Vous croyez que c'est le moment de faire ça",
									"success" : false
								}

			},
		},
		"OldMan": {
			"Name" : "Jean-Jacques",
			"Phrases" : {	"type" : "technology",
							"phrase" : "Bonjour, je m’en occupe tout de suite."
						},
			"Patience" : 100
			"Vulnerability" : {
								"technology" : 3,
								"paperwork" : 0.8
							  },
			"Action" : {
								"computerFakbok" : {
									"phrase" : ""
									"success" : true
								},
								"computerInfo" : {
									"phrase" : ""
									"success" : true
								},
								"computerKey" : {
									"phrase" : ""
									"success" : true
								},
								"stampFail" :{
									"phrase" : ""
									"success" : false
								},
								"closeFail" :{
									"phrase" : ""
									"success" : false
								},
								"tamponWrong" :{
									"phrase" : ""
									"success" : false
								},
								"tamponFail" :{
									"phrase" : ""
									"success" : false
								},
								"staplerEmpty" :{
									"phrase" : ""
									"success" : false
								},
								"default" : {
									"phrase" : "J'ai pas envie de pourrir ici moi !",
									"success" : false
								}

			},
		}
	};

	return clients;

})();