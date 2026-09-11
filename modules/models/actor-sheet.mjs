import { SYSTEM } from "../config/system.mjs"

const { SchemaField, NumberField, StringField, ArrayField, BooleanField } = foundry.data.fields

export default class Character extends foundry.abstract.TypeDataModel {
  /** @override */
  static LOCALIZATION_PREFIXES = ["UNISYSTEM.Actor.character"]

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

  */

  static defineSchema() {
    const requiredInteger = { required: true, nullable: false, integer: true }
    const schema = {}

    // Personnage
    schema.description = new StringField({})
    schema.peuple = new StringField({ required: true, nullable: false, initial: SYSTEM.PEUPLES.ameAccouchee.id, choices: SYSTEM.PEUPLES })
    schema.cle = new StringField({ required: true, nullable: false, initial: SYSTEM.HARMONIQUES.ame.id, choices: SYSTEM.HARMONIQUES })
    schema.potentiel = new SchemaField({
      pouvoirs: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      atouts: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      maitrises: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })

    // Harmoniques
    const harmoniqueField = (label) => {
      const schema = {
        valeur: new StringField({
          required: true,
          nullable: false,
          initial: SYSTEM.HARMONIQUE_VALEURS.D4,
          choices: Object.fromEntries(Object.entries(SYSTEM.HARMONIQUE_VALEURS).map(([key, value]) => [value, { label: `${value}` }])),
        }),
      }
      return new SchemaField(schema, { label })
    }

    schema.harmoniques = new SchemaField(
      Object.values(SYSTEM.HARMONIQUES).reduce((obj, harmonique) => {
        obj[harmonique.id] = harmoniqueField(harmonique.label)
        return obj
      }, {}),
    )

    // Conscience
    schema.conscience = new SchemaField({
      valeur: new NumberField({
        ...requiredInteger,
        initial: 7,
        min: 0,
      }),
      max: new NumberField({
        ...requiredInteger,
        initial: 7,
        min: 0,
        max: 25,
      }),
      jetons: new ArrayField(
        new SchemaField({
          statut: new StringField({
            required: true,
            nullable: false,
            choices: SYSTEM.JETON_STATUTS,
          }),
        }),
        {
          initial: () => {
            let initJetons = Array.from({ length: 7 }, () => ({ statut: SYSTEM.JETON_STATUTS.actif.id }))
            initJetons.push(...Array.from({ length: 18 }, () => ({ statut: SYSTEM.JETON_STATUTS.perdu.id })))
            return initJetons
          },
        },
      ),
      complications: new SchemaField({
        une: new SchemaField(this.createComplication()),
        deux: new SchemaField(this.createComplication()),
        trois: new SchemaField(this.createComplication()),
        quatre: new SchemaField(this.createComplication()),
      }),
    })

    // Timbre (Règles avancées)
    schema.timbre = new SchemaField({
      description: new StringField(),
      statut: new StringField({
        required: true,
        nullable: false,
        initial: SYSTEM.TIMBRES.harmonieux.id,
        choices: SYSTEM.TIMBRES,
      }),
      peste: new StringField(),
      cle: new BooleanField({ initial: false }),
      note1: new BooleanField({ initial: false }),
      note2: new BooleanField({ initial: false }),
      note3: new BooleanField({ initial: false }),
      note4: new BooleanField({ initial: false }),
    })

    // Pouvoirs : sous forme d'un item

    // Atouts : sous forme d'un item

    schema.atouts = new ArrayField(
      new SchemaField({
        description: new StringField({}),
        valeur: new NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
      }),
    )

    // Maîtrises magiques
    schema.maitrises = new ArrayField(
      new SchemaField({
        description: new StringField({}),
        harmonique: new StringField({
          required: true,
          nullable: false,
          initial: SYSTEM.HARMONIQUES.ame.id,
          choices: SYSTEM.HARMONIQUES,
        }),
        prerequis: new StringField({}),
        niveau: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 5 }),
      }),
    )

    return schema
  }

  /**
   * Helper pour créer le schéma d'une complication
   */
  static createComplication() {
    return {
      description: new StringField({
        required: true,
        nullable: false,
        blank: true,
      }),
      valeur: new NumberField({
        required: true,
        nullable: false,
        initial: 0,
        min: 0,
        max: 3,
      }),
    }
  }

  /** @override */
  prepareBaseData() {
    // Définition de la gamme en fonction du peuple
    switch (this.peuple) {
      case SYSTEM.PEUPLES.gnome.id:
      case SYSTEM.PEUPLES.nain.id:
      case SYSTEM.PEUPLES.centaure.id:
        this.gamme = SYSTEM.GAMMES.auberon.id
        break
      case SYSTEM.PEUPLES.meduse.id:
      case SYSTEM.PEUPLES.satyre.id:
      case SYSTEM.PEUPLES.minotaure.id:
        this.gamme = SYSTEM.GAMMES.horla.id
        break
      case SYSTEM.PEUPLES.ameAccouchee.id:
      case SYSTEM.PEUPLES.opalinDeLaRomance.id:
      case SYSTEM.PEUPLES.danseurAffranchi.id:
        this.gamme = SYSTEM.GAMMES.diamantin.id
        break
      case SYSTEM.PEUPLES.banshee.id:
      case SYSTEM.PEUPLES.feeNoire.id:
      case SYSTEM.PEUPLES.sirene.id:
        this.gamme = SYSTEM.GAMMES.melusine.id
        break
      case SYSTEM.PEUPLES.humain.id:
      case SYSTEM.PEUPLES.ogre.id:
      case SYSTEM.PEUPLES.geant.id:
        this.gamme = SYSTEM.GAMMES.grangousier.id
        break
    }

    // Définition du ton en fonction du peuple
    switch (this.peuple) {
      case SYSTEM.PEUPLES.banshee.id:
      case SYSTEM.PEUPLES.centaure.id:
      case SYSTEM.PEUPLES.minotaure.id:
      case SYSTEM.PEUPLES.ogre.id:
      case SYSTEM.PEUPLES.opalinDeLaRomance.id:
        this.ton = SYSTEM.TONS.capitan.id
        break
      case SYSTEM.PEUPLES.danseurAffranchi.id:
      case SYSTEM.PEUPLES.geant.id:
      case SYSTEM.PEUPLES.gnome.id:
      case SYSTEM.PEUPLES.satyre.id:
      case SYSTEM.PEUPLES.sirene.id:
        this.ton = SYSTEM.TONS.mascarille.id
        break
      case SYSTEM.PEUPLES.ameAccouchee.id:
      case SYSTEM.PEUPLES.feeNoire.id:
      case SYSTEM.PEUPLES.humain.id:
      case SYSTEM.PEUPLES.meduse.id:
      case SYSTEM.PEUPLES.nain.id:
        this.ton = SYSTEM.TONS.cassandre.id
        break
    }
  }

  /** @inheritDoc */
  async _preCreate(data, options, user) {
    const allowed = await super._preCreate(data, options, user)
    if (allowed === false) return false

    // Mise à jour du token prototype pour qu'il soit lié à l'acteur et ait la vision activée
    const updates = {
      prototypeToken: {
        actorLink: true,
        disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
        sight: {
          enabled: true,
          visionMode: "basic",
        },
      },
    }
    this.parent.updateSource(updates)
  }

  /** @override */
  async _preUpdate(changed, options, user) {
    if (foundry.utils.hasProperty(changed, "system.conscience.max")) {
      // Si le nouveau max est inférieur à l'ancien max, il faut remettre tous les jetons intermédiaires au statut perdu
      if (changed.system.conscience.max < this.conscience.max) {
        const jetons = foundry.utils.duplicate(this.conscience.jetons)
        for (let i = changed.system.conscience.max; i <= this.conscience.max && i < jetons.length; i++) {
          jetons[i].statut = SYSTEM.JETON_STATUTS.perdu.id
        }
        foundry.utils.setProperty(changed, "system.conscience.jetons", jetons)
      }
      // Si la valeur de conscience est supérieure à la nouvelle valeur max, on la met à jour
      if (this.conscience.valeur > changed.system.conscience.max) {
        foundry.utils.setProperty(changed, "system.conscience.valeur", changed.system.conscience.max)
      }
    }
    return super._preUpdate(changed, options, user)
  }

  get hasAtouts() {
    return this.atouts.length > 0
  }

  get nbJetonsRestants() {
    const jetonsConscience = this.conscience.jetons.filter((jeton) => jeton.statut === SYSTEM.JETON_STATUTS.actif.id).length
    return jetonsConscience
  }

  async depenserJetons(nbJetons) {
    // Parcours de l'objet pour mettre à jour nbJetons
    let nbJetonsModifies = 0
    const jetons = { ...this.conscience.jetons }
    for (const key of Object.keys(jetons)) {
      if (nbJetonsModifies >= nbJetons) break
      if (jetons[key].statut === SYSTEM.JETON_STATUTS.actif.id) {
        jetons[key] = { ...jetons[key], statut: SYSTEM.JETON_STATUTS.inactif.id }
        nbJetonsModifies++
      }
    }
    if (nbJetonsModifies > 0) {
      await this.parent.update({ "system.conscience.jetons": jetons })
    }
  }

  /**
   * Retire un jeton du pool de conscience, en privilégiant les jetons inactifs.
   * Si aucun jeton inactif n'est trouvé, retire un jeton actif à la place.
   * Le jeton retiré voit son statut passé à "perdu" et est déplacé en fin de tableau.
   * Si un jeton est perdu, la valeur de conscience diminue de 1 (minimum 0).
   * Met à jour l'objet parent avec la nouvelle valeur de conscience et le tableau de jetons.
   */
  async perdreUnJeton() {
    const jetons = foundry.utils.duplicate(this.conscience.jetons)
    let conscienceActuelle = this.conscience.valeur

    let jetonPerdu = false
    // On cherche d'abord un jeton inactif à perdre
    for (let i = 0; i < jetons.length; i++) {
      if (jetons[i].statut === SYSTEM.JETON_STATUTS.inactif.id) {
        const jetonSupprime = jetons.splice(i, 1)[0]
        jetonSupprime.statut = SYSTEM.JETON_STATUTS.perdu.id
        jetons.push(jetonSupprime)
        jetonPerdu = true
        break
      }
    }
    // Si pas de jeton inactif, on perd un jeton actif
    if (!jetonPerdu) {
      for (let i = 0; i < jetons.length; i++) {
        if (jetons[i].statut === SYSTEM.JETON_STATUTS.actif.id) {
          const jetonSupprime = jetons.splice(i, 1)[0]
          jetonSupprime.statut = SYSTEM.JETON_STATUTS.perdu.id
          jetons.push(jetonSupprime)
          jetonPerdu = true
          break
        }
      }
    }
    // Si un jeton a été perdu, on baisse la conscience de 1
    if (jetonPerdu) {
      const newConscience = Math.max(conscienceActuelle - 1, 0)
      await this.parent.update({ "system.conscience.valeur": newConscience, "system.conscience.jetons": jetons })
    }
  }
}
