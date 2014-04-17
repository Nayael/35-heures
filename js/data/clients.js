var clients = (function() {
    'use strict';

    var clients = {
        "young_woman": {
            "name": "young_woman",
            "displayname": "Jeune femme",
            "intro" : "Bonjour, je viens retirer une commande. Tenez voici le recommandé ainsi que ma carte d'identité",
            "neededtime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responsedelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "scenario": {
                "default": {
                    "computerFakbok": "Vous faites quoi là !?",
                    "default": "Vous croyez que c'est le moment de faire ça"
                },
                "phase_0": {
                    "intro": "Je viens retirer une commande! tenez voici le recommandé ainsi que ma carte d’identité. et vite ...SVP!",
                    "success": "id_card",
                    "id_card": "Tenez voici mes papiers",
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
        },
        "old_woman": {
            "name": "old_woman",
            "displayname": "Vieille femme",
            "intro" : "Bonjour mon petit, je voudrais poster cette lettre.",
            "neededtime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responsedelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "scenario": {
                "default": {
                    "computer": "Je n'y connais rien à ces trucs.",
                    "default": "J'ai pas toute la journée"
                },
                "phase_0": {
                    "intro": "Il vous faut tout ce temps pour une enveloppe !?",
                    "success": "envelope",
                    "envelope": "Merci mon petit"
                },
                "phase_1": {
                    "intro": "J'aimerai vous acheter quelques timbres",
                    "success": "stamp",
                    "stamps": "Merci, aurevoir"
                },
                "fail": "Vous êtes trop lent, Bibiche m'attend dehors, j'espère pour vous qu'il n'a pas pris froid"
            }
        },
        "woman": {
            "name": "woman",
            "displayname": "Mère de famille",
            "intro" : "Bonjour, je souhaiterai envoyer ce colis",
            "neededtime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responsedelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "scenario": {
                "default": {
                    "computer": "Vous foutez quoi ?",
                    "default": "Vous croyez que c'est le moment de faire ça ?"
                },
                "phase_0": {
                    "intro": "Vous ",
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
            "displayname": "Roi Paul",
            "intro" : "Bonjour, j'ai besoin de photocopie jeune péon",
            "neededtime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responsedelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "scenario": {
                "default": {
                    "computer": "Roi Paul est sur FaKebok, il porte sa mighty couronne",
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
            "displayname": "Jean-Jacques",
            "intro" : "J'ai un colis urgent à récupérer.",
            "neededtime" : 3,
            "vulnerability": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "responsedelay": {
                "technology": 0.5,
                "paperwork": 1.5,
                "time": 3,
                "default": 2
            },
            "scenario": {
                "default": {
                    "computer": "Vous foutez quoi ?",
                    "default": "Vous croyez que c'est le moment de faire ça ?"
                },
                "phase_0": {
                    "intro": "Faites attention, c'est un colis fragile",
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
        },
    };

    return clients;

})();