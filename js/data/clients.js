var clients = (function() {
	'use strict';

	var clients = {
		"Pro": {
			"Name": "Henry",
			"StartPatience": 60,
			"PhraseIntro": "Bonjour, je viens retirer une commande, tenez voici le recommandé ainsi que ma carte d’identité.",
			"Vulnerability": {
				"technology": 0.5,
				"paperwork": 1.5
			},
			"Scenario": {
				"default": {
					"computerFakbok": {
						"phrase": "Vous faites quoi là !?"
					},
					"phaseDefault": {
						"phrase": "Vous croyez que c'est le moment de faire ça"
					}
				},
				"phase_0": {
					"intro": "Je viens retirer une commande! tenez voici le recommandé ainsi que ma carte d’identité. et vite ...SVP!",
					"success": "checkPapers",
					"checkPapers": {
						"phrase": "Tenez voici mes papier"
					},
					"getPackage": {
						"phrase": "Vous ne vérifier pas mon identité"
					}

				},
				"phase_1": {
					"intro": "Bon maintenant que vous avez vérifier mes papiers je veux bien ma commande",
					"success": "getPackage",
					"checkPapers": {
						"phrase": "Je vous est déjà donner les papiers"
					},
					"getPackage": {
						"phrase": "Merci, bonne journée"
					}
				},
				"fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
			},
		},
		"OldMan": {
			"Name": "Henry",
			"StartPatience": 60,
			"PhraseIntro": "Bonjour, je viens retirer une commande, tenez voici le recommandé ainsi que ma carte d’identité.",
			"Vulnerability": {
				"technology": 0.5,
				"paperwork": 1.5
			},
			"Scenario": {
				"default": {
					"computerFakbok": {
						"phrase": "Vous faites quoi là !?"
					},
					"phaseDefault": {
						"phrase": "Vous croyez que c'est le moment de faire ça"
					}
				},
				"phase_0": {
					"intro": "Je viens retirer une commande! tenez voici le recommandé ainsi que ma carte d’identité. et vite ...SVP!",
					"success": "checkPapers",
					"checkPapers": {
						"phrase": "Tenez voici mes papier"
					},
					"getPackage": {
						"phrase": "Vous ne vérifier pas mon identité"
					}

				},
				"phase_1": {
					"intro": "Bon maintenant que vous avez vérifier mes papiers je veux bien ma commande",
					"success": "getPackage",
					"checkPapers": {
						"phrase": "Je vous est déjà donner les papiers"
					},
					"getPackage": {
						"phrase": "Merci, bonne journée"
					}
				},
				"fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
			},
		}
	};

	return clients;

})();