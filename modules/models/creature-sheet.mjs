import { SYSTEM } from "../config/system.mjs"

const { SchemaField, NumberField, StringField, HTMLField } = foundry.data.fields

export default class npc extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["UNISYSTEM.Actor.creature"]

  /*
    "Actor": {
        "types": ["character", "creature", "cell", "vehicle"],
        "templates": {
            "attributes": {
                "terraprimatecharacterType": 0,
                "afmbecharacterType": 0,
                "witchcraftcharacterType": 0,
                "characterType": 0,
                "armageddoncharacterType": 0,
                "terraprimatecharacterTypes": [
                    "PreHeroic",
                    "Heroic",
                    "Powered"
                ],
                "terraprimatecharacterTypeValues": {
                    "PreHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 5
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "Heroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 35
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "Powered": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 15
                        }
                    }
                },
                "afmbecharacterTypes": [
                    "Norm",
                    "Survivor",
                    "Inspired"
                ],
                "afmbecharacterTypeValues": {
                    "Norm": {
                        "attributePoints": {
                            "value": 0,
                            "max": 14
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 5
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "Survivor": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 35
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "Inspired": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 15
                        }
                    }
                },
                "witchcraftcharacterTypes": [
                    "Gifted",
                    "LesserGifted",
                    "Mundane",
                    "Bast",
                    "Spirit",
                    "Undead"
                ],
                "witchcraftcharacterTypeValues": {
                    "Gifted": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 30
                        }
                    },
                    "LesserGifted": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 15
                        }
                    },
                    "Mundane": {
                        "attributePoints": {
                            "value": 0,
                            "max": 25
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 20
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 35
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "Bast": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 25
                        }
                    },
                    "Spirit": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 20
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 20
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 20
                        }
                    },
                    "Undead": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 25
                        }
                    }
                },
                "characterTypes": ["MundanePreHeroic", "MundaneHeroic", "MundaneVeteran","PsychicNeoTalented", "PsychicTalented", "PsychicTalentedVeteran", "NDDHeroic", "NDDVeteran"],

                "characterTypeValues": {
                    "MundanePreHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 5
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "MundaneHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 35
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "MundaneVeteran": {
                        "attributePoints": {
                            "value": 0,
                            "max": 25
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 45
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "PsychicNeoTalented": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 5
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 5
                        }
                    },
                    "PsychicTalented": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 15
                        }
                    },
                    "PsychicTalentedVeteran": {
                        "attributePoints": {
                            "value": 0,
                            "max": 25
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 25
                        }
                    },
                    "NDDHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 35
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "NDDVeteran": {
                        "attributePoints": {
                            "value": 0,
                            "max": 25
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 45
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    }
                },
                "armageddoncharacterTypes": [
                    "PotentialHeroPreHeroic",
                    "BeginningGiftedPreHeroic",
                    "GiftedHeroic",
                    "LesserGiftedHeroic",
                    "MundaneHeroic",
                    "LesserSupernaturalHeroic",
                    "SuperNaturalLegendary",
                    "GreaterGiftedLegendary",
                    "GreaterSupernaturalMythical",
                    "GiftedMasterMythical"
                ],
                "armageddoncharacterTypeValues": {
                    "PotentialHeroPreHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 5
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "BeginningGiftedPreHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 5
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 5
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 5
                        }
                    },
                    "GiftedHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 30
                        }
                    },
                    "LesserGiftedHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 30
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 15
                        }
                    },
                    "MundaneHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 25
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 20
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 0
                        }
                    },
                    "LesserSupernaturalHeroic": {
                        "attributePoints": {
                            "value": 0,
                            "max": 15
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 10
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 25
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 25
                        }
                    },
                    "SuperNaturalLegendary": {
                        "attributePoints": {
                            "value": 0,
                            "max": 30
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 20
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 40
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 30
                        }
                    },
                    "GreaterGiftedLegendary": {
                        "attributePoints": {
                            "value": 0,
                            "max": 20
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 35
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 50
                        }
                    },
                    "GreaterSupernaturalMythical": {
                        "attributePoints": {
                            "value": 0,
                            "max": 30
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 20
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 60
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 90
                        }
                    },
                    "GiftedMasterMythical": {
                        "attributePoints": {
                            "value": 0,
                            "max": 25
                        },
                        "qualityPoints": {
                            "value": 0,
                            "max": 20
                        },
                        "drawbackPoints": {
                            "value": 0,
                            "max": 15
                        },
                        "skillPoints": {
                            "value": 0,
                            "max": 55
                        },
                        "metaphysicsPoints": {
                            "value": 0,
                            "max": 100
                        }
                    }
                },
                "profession": "",
                "hp": {
                    "value": 0,
                    "max": 0,
                    "loss_toggle": false,
                    "loss_penalty": 0
                },
                "endurance_points": {
                    "value": 0,
                    "max": 0,
                    "loss_toggle": false,
                    "loss_penalty": 0
                },
                "speed": {
                    "value": 0,
                    "max": 0,
                    "loss_toggle": false,
                    "loss_penalty": 0
                },
                "essence": {
                    "value": 0,
                    "max": 0,
                    "loss_toggle": false,
                    "loss_penalty": 0
                },
                "initiative": {
                    "value": 0
                },
                "strength": {
                    "value": 0,
                    "halfValue": 0,
                    "max": 0
                },
                "dexterity": {
                    "value": 0,
                    "max": 0
                },
                "constitution": {
                    "value": 0,
                    "max": 0
                },
                "intelligence": {
                    "value": 0,
                    "max": 0
                },
                "perception": {
                    "value": 0,
                    "max": 0
                },
                "willpower": {
                    "value": 0,
                    "max": 0
                },
                "character_points": {
                    "value": 0,
                    "max": 0
                },
                "encumbrance": {
                    "value": 0,
                    "max": 0,
                    "lifting_capacity": 0,
                    "level": 0
                },
                "drama": {
                    "value": 0,
                    "max": 0
                }
            },
            "bio": {
                "sex": "",
                "age": 0,
                "height": "",
                "weight": 0,
                "hair": "",
                "eyes": "",
                "htmlFields": "",
                "contacts": ""
            },
            "cell_member": {
                "show": false,
                "name": "",
                "lvl": 0,
                "RP": 0,
                "mil": false,
                "int": false,
                "sci": false,
                "crm": false,
                "law": false,
                "med": false,
                "par": false,
                "civ": false
            }
        },
        "character": {
            "templates": ["attributes", "bio"]
        },
        "creature": {
            "templates": ["attributes", "bio"],
            "power": 0
        },

  */

  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true }
    const schema = {}

    // Personnage
    schema.description = new StringField({})
    schema.details = new HTMLField({})
    schema.adversite = new SchemaField({
      valeur: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })
    schema.resilience = new SchemaField({
      valeur: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })
    schema.dissonance = new SchemaField({
      harmonique: new StringField({ required: true, nullable: false, initial: SYSTEM.HARMONIQUES.ame.id, choices: SYSTEM.HARMONIQUES }),
      valeur: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })

    // Actions : sous forme d'un item

    // Intrigues : sous forme d'un item

    return schema
  }
}
