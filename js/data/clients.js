var clients = (function() {
    'use strict';

    var clients = {
        /*"young_woman": {
            "name": "young_woman",
            "displayName": "Jeune femme",
            "intro" : "Bonjour, je viens retirer une commande. Tenez voici le recommandé ainsi que ma carte d'identité",
            "neededTime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responseDelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 8,
                "default": 2
            },
            "scenario": {
                "default": {
                    "time":"Vous ne voulez pas agir au lieu de ne rien faire !",
                    "computerFakbok": "Vous faites quoi là !?",
                    "default": "Vous croyez que c'est le moment de faire ça"
                },
                "phase_0": {
                    "intro": "Je viens retirer une commande! tenez voici le recommandé ainsi que ma carte d’identité. et vite ...SVP!",
                    "success": "id_card",
                    "id_card": "Tenez voici mes papiers, c'est la commande n° 16546842 elle est arrivé hier",
                    "keys": "Vous ne vérifier pas mon identité ?"
                },
                "phase_1": {
                    "intro": "Bon maintenant que vous avez vérifier mes papiers je veux bien ma commande",
                    "success": "keys",
                    "id_card": "Je vous est déjà donner les papiers",
                    "keys": "Merci, bonne journée"
                },
                "fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
            }
        },*/
        "old_woman": {
            "name": "old_woman",
            "displayName": "Vieille femme",
            "intro" : "Bonjour mon petit, je voudrais poster cette lettre.",
            "neededTime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 4,
                "default": 2
            },
            "responseDelay": {
                "technology": 6,
                "paperwork": 2,
                "time": 8,
                "default": 7
            },
            "scenario": {
                "default": {
                    "time":"Vous ne voulez pas agir au lieu de ne rien faire !",
                    "computer": "Je n'y connais rien à ces trucs.",
                    "default": "J'ai pas toute la journée"
                },
                "phase_0": {
                    "intro": "Il vous faut tout ce temps pour une enveloppe !?",
                    "succeed": "envelope",
                    "envelope": "Merci mon petit, Je voudrais aussi quelques timbres"
                },
                "phase_1": {
                    "intro": "Et ces timbres, c'est pour aujourd'hui ou pour demain",
                    "succeed": "stamps",
                    "stamps": "Merci, aurevoir"
                },
                "fail": "Vous êtes trop lent, Bibiche m'attend dehors, j'espère pour vous qu'il n'a pas pris froid"
            }
        }/*,
        "woman": {
            "name": "woman",
            "displayName": "Mère de famille",
            "intro" : "Bonjour, je souhaiterai envoyer ce colis",
            "neededTime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responseDelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 8,
                "default": 2
            },
            "scenario": {
                "default": {
                    "time":"Vous ne voulez pas agir au lieu de ne rien faire !",
                    "computer": "Vous foutez quoi ?",
                    "default": "Vous croyez que c'est le moment de faire ça ?"
                },
                "phase_0": {
                    "intro": "Prenez ce colis bon dieu!",
                    "success": "keys",
                    "keys": "Tenez voici mes papiers",
                    "getPackage": "Vous ne vérifier pas mon identité ?"
                },
                "phase_1": {
                    "intro": "Bon maintenant que vous avez vérifier mes papiers je veux bien ma commande",
                    "success": "keys",
                    "checkPapers": "Je vous est déjà donner les papiers",
                    "keys": "Merci, bonne journée"
                },
                "fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
            }
        },
        "young_man": {
            "name": "young_man",
            "displayName": "Roi Paul",
            "intro" : "Bonjour, j'ai besoin de photocopies jeune péon",
            "neededTime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responseDelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 8,
                "default": 2
            },
            "scenario": {
                "default": {
                    "time":"Vous ne voulez pas agir au lieu de ne rien faire !",
                    "computer": "Roi Paul est sur FaKebok, il porte sa mighty crown",
                    "default": "Tu crois que c'est le moment de faire ça ?"
                },
                "phase_0": {
                    "intro": "Magnes-toi de faire ces photocopies jeune péon, il m'en faut cinq",
                    "success": "access_card",
                    "access_card": "Merci pour ces photocopies jeune péon",
                },
                "phase_1": {
                    "intro": "J'ai encore un colis pour toi jeune péon",
                    "success": "bad_package",
                    "bad_package": "Il a un blème mon colis ?"
                },
                "fail": "Je me casse, t'es vraiment trop lent."
            }
        },
        "old_man": {
            "name": "old_man",
            "displayName": "Jean-Jacques",
            "intro" : "J'ai un colis urgent à récupérer.",
            "neededTime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responseDelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 8,
                "default": 2
            },
            "scenario": {
                "default": {
                    "time":"Vous ne voulez pas agir au lieu de ne rien faire !",
                    "computer": "Vous foutez quoi ?",
                    "default": "Vous croyez que c'est le moment de faire ça ?"
                },
                "phase_0": {
                    "intro": "Faites attention, c'est un colis fragile, dépéchez vous de me l'apporter",
                    "success": "access_card",
                    "access_card": "Le colis est cassé !?"
                },
                "phase_1": {
                    "intro": "Je veux faire une réclamation, je veux pas de ce colis",
                    "success": "telephone",
                    "telephone": "C'est toujours pareil avec la Pauste aujourd'hui, vous êtes des incapables.",
                },
                "fail": "Vous êtes nul, un véritable incapable, de mon temps on n'aurait jamais vu ça"
            }
        },*/
    };

    return clients;

})();