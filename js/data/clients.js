var clients = (function() {
    'use strict';

    var clients = {
        "young_woman": {
            "name": "young_woman",
            "displayName": "Jeune femme",
            "intro" : "Bonjour, je viens retirer une commande. Tenez voici le recommandé",
            "neededTime" : 5,
            "vulnerability": {
                "computer": 3,
                "crayons": 6,
                "small_envelope": 6,
                "envelope_big": 6,
                "tampon": 6,
                "tampon_2": 6,
                "telephone": 5,
                "toffee_bowl": 0.5,
                "keys": 2,
                "access_card": 3,
                "stamps": 6,
                "time": 6
            },
            "scenario": {
                "default": {
                    "time":"Pff, je n'ai pas toute la journée, j'ai du shopping à faire moi",
                    "computer": "Vous vous foutez de moi ! Vous traînez sur FaKebok au lieu de me filer mon colis ! J'en parlerai à la direction !",
                    "default": "Mais qu'est-ce que vous foutez !",
                    "toffee_bowl":"Merci pour les bonbons"
                },
                "phase_0": {
                    "succeed": "computer",
                    "computer": "Tenez voici mes papiers, c'est la commande n° 16546842."
                },
                "phase_1": {
                    "succeed": "keys",
                    "keys": "Merci, salut."
                },
                "fail": "Mon après-midi shopping n'attend pas, je ne vais pas passer ma journée avec des incompétents."
            }
        },
        "old_woman": {
            "name": "old_woman",
            "displayName": "Vieille femme",
            "intro" : "Bonjour mon petit, je voudrais poster cette lettre.",
            "neededTime" : 5,
            "vulnerability": {
                "computer": 2,
                "crayons": 2,
                "small_envelope": 2,
                "envelope_big": 5,
                "tampon": 4,
                "tampon_2": 4,
                "telephone": 3,
                "toffee_bowl": 2,
                "keys": 5,
                "access_card": 5,
                "stamps": 2,
                "time": 2
            },
            "scenario": {
                "default": {
                    "default": "Je ne peux pas laisser Bibiche dehors trop longtemps",
                    "time":"Je ne peux pas laisser Bibiche dehors trop longtemps",
                    "computer": "Je n'y connais rien à ces trucs.",
                    "toffee_bowl": "Merci pour les bonbons mais ça ne va pas m'aider",
                    "envelope_big": "Cette enveloppe est bien trop grande",
                    "telephone": "Raccrochez et donnez-moi mon enveloppe"
                },
                "phase_0": {
                    "succeed": "small_envelope",
                    "small_envelope": "Merci mon petit, Je voudrais aussi quelques timbres"
                },
                "phase_1": {
                    "succeed": "stamps",
                    "stamps": "Merci, aurevoir"
                },
                "fail": "Vous êtes trop lent, Bibiche m'attend dehors, j'espère pour vous qu'il n'a pas pris froid"
            }
        },
        "woman": {
            "name": "woman",
            "displayName": "Mère de famille",
            "intro" : "Bonjour, je souhaiterai envoyer ces papiers, faites moi des photocopies",
            "neededTime" : 3,
            "vulnerability": {
                "computer": 5,
                "crayons": 2,
                "small_envelope": 6,
                "envelope_big": 3,
                "tampon": 4,
                "tampon_2": 2,
                "telephone": 2,
                "toffee_bowl": 0.5,
                "keys": 5,
                "access_card": 2,
                "stamps": 5,
                "time": 5
            },
            "scenario": {
                "default": {
                    "time":"Je dois allez chercher mon fils à l'école, faites vite",
                    "computer": "Vous foutez quoi ?",
                    "default": "Vous croyez que c'est le moment de faire ça ?",
                    "toffee_bowl": "Merci pour les bonbons, je les donnerai à mon fils.",
                    "small_envelope": "Vous êtes idiot ? Ca ne tiendra jamais dans cette enveloppe."

                },
                "phase_0": {
                    "succeed": "access_card",
                    "access_card": "Parfait je voudrais une enveloppe aussi svp",
                },
                "phase_1": {
                    "succeed": "envelope_big",
                    "envelope_big": "Merci, un tampon et c'est poster",
                },
                "phase_2": {
                    "succeed": "tampon_2",
                    "tampon_2": "Merci bonne fin de journée",
                    "tampon": "Ce n'est pas le bon tampon",
                },
                "fail": "Bon je pense que vous n'y mettez pas du votre! j'en parlerais à vos supérieurs, je ne vous souhaite pas le bonsoir monsieur"
            }
        },
        "young_man": {
            "name": "young_man",
            "displayName": "Paul",
            "intro" : "Salut, j'ai besoin de photocopies",
            "neededTime" : 3,            
            "vulnerability": {
                "computer": 5,
                "crayons": 2,
                "small_envelope": 3,
                "envelope_big": 6,
                "tampon": -1,
                "tampon_2": 4,
                "telephone": 2,
                "toffee_bowl": -1,
                "keys": 5,
                "access_card": 2,
                "stamps": 5,
                "time": 3
            },
            "scenario": {
                "default": {
                    "time":"Mec, j'aimerai juste en finir le plus vite possible, alors dépêches-toi.",
                    "computer": "Franchement mec, tu crois vraiment que j'ai le temps pour ça.",
                    "envelope_big": "Cette enveloppe est bien trop grande",
                    "default": "Tu crois que c'est le moment de faire ça ?"
                },
                "phase_0": {
                    "succeed": "access_card",
                    "access_card": "Merci pour ces photocopies mon gars. Tu peux me les mettre dans une petite enveloppe ?",
                },
                "phase_1": {
                    "succeed": "small_envelope",
                    "small_envelope": "Merci vieux, un tampon pour le Brésil et c'est nickel"
                },
                "phase_2": {
                    "succeed": "tampon",
                    "tampon": "Merci vieux, peace !"
                },
                "fail": "Je me casse, t'es vraiment trop lent mec."
            }
        },
        "old_man": {
            "name": "old_man",
            "displayName": "Jean-Jacques",
            "intro" : "J'ai un colis urgent à récupérer.",
            "neededTime" : 3,
            "vulnerability": {
                "computer": 5,
                "crayons": 2,
                "small_envelope": 3,
                "envelope_big": 6,
                "tampon": 2,
                "tampon_2": 4,
                "telephone": 8,
                "toffee_bowl": 1,
                "keys": 5,
                "access_card": 2,
                "stamps": 5,
                "time": 3
            },
            "scenario": {
                "default": {
                    "time":"Vous ne voulez pas agir au lieu de ne rien faire !",
                    "computer": "Vous foutez quoi ?",
                    "default": "Vous croyez que c'est le moment de faire ça ?"
                },
                "phase_0": {
                    "succeed": "access_card",
                    "access_card": "Le colis est cassé !? Contactez donc votre centre de tri."
                },
                "phase_1": {
                    "succeed": "telephone",
                    "telephone": "Mon colis n'est pas assuré !? C'est une honte ! C'est toujours pareil avec la Pauste aujourd'hui, vous êtes des incapables.",
                },
                "fail": "Vous êtes nul, un véritable incapable, de mon temps on n'aurait jamais vu ça"
            }
        }
    };

    return clients;

})();