var clients = (function() {
    'use strict';

    var clients = {
        "young_woman": {
            "Name": "young_woman",
            "DisplayName": "Jeune femme",
            "Intro" : "Bonjour, je viens retirer une commande. Tenez voici le recommandé ainsi que ma carte d'identité",
            "Vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "ResponseDelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "Scenario": {
                "default": {
                    "computerFakbok": "Vous faites quoi là !?",
                    "default": "Vous croyez que c'est le moment de faire ça"
                },
                "phase_0": {
                    "intro": "Je viens retirer une commande! tenez voici le recommandé ainsi que ma carte d’identité. et vite ...SVP!",
                    "success": "checkPapers",
                    "checkPapers": "Tenez voici mes papiers",
                    "getPackage": "Vous ne vérifier pas mon identité ?"
                },
                "phase_1": {
                    "intro": "Bon maintenant que vous avez vérifier mes papiers je veux bien ma commande",
                    "success": "getPackage",
                    "checkPapers": "Je vous est déjà donner les papiers",
                    "getPackage": "Merci, bonne journée"
                },
                "fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
            }
        },
        "old_woman": {
            "Name": "old_woman",
            "DisplayName": "Vieille femme",
            "Intro" : "Bonjour, je viens retirer une commande. Tenez voici le recommandé ainsi que ma carte d'identité",
            "Vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "ResponseDelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "Scenario": {
                "default": {
                    "computerFakbok": "Vous faites quoi là !?",
                    "default": "Vous croyez que c'est le moment de faire ça"
                },
                "phase_0": {
                    "intro": "Je viens retirer une commande! tenez voici le recommandé ainsi que ma carte d’identité. et vite ...SVP!",
                    "success": "checkPapers",
                    "checkPapers": "Tenez voici mes papiers",
                    "getPackage": "Vous ne vérifier pas mon identité ?"
                },
                "phase_1": {
                    "intro": "Bon maintenant que vous avez vérifier mes papiers je veux bien ma commande",
                    "success": "getPackage",
                    "checkPapers": "Je vous est déjà donner les papiers",
                    "getPackage": "Merci, bonne journée"
                },
                "fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
            }
        },
        "woman": {
            "Name": "woman",
            "DisplayName": "Mère de famille",
            "Intro" : "Bonjour, je viens retirer une commande. Tenez voici le recommandé ainsi que ma carte d'identité",
            "Vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "ResponseDelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "Scenario": {
                "default": {
                    "computerFakbok": "Vous faites quoi là !?",
                    "default": "Vous croyez que c'est le moment de faire ça"
                },
                "phase_0": {
                    "intro": "Je viens retirer une commande! tenez voici le recommandé ainsi que ma carte d’identité. et vite ...SVP!",
                    "success": "checkPapers",
                    "checkPapers": "Tenez voici mes papiers",
                    "getPackage": "Vous ne vérifier pas mon identité ?"
                },
                "phase_1": {
                    "intro": "Bon maintenant que vous avez vérifier mes papiers je veux bien ma commande",
                    "success": "getPackage",
                    "checkPapers": "Je vous est déjà donner les papiers",
                    "getPackage": "Merci, bonne journée"
                },
                "fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
            }
        }
    };

    return clients;

})();