import { SYSTEM } from "../config/system.mjs"

const { HTMLField, NumberField, StringField } = foundry.data.fields

export default class item extends foundry.abstract.TypeDataModel {
  /** @override */
static LOCALIZATION_PREFIXES = ["UNISYSTEM.Item.item"]

  /*
    "Item": {
        "types": ["quality", "drawback", "skill", "power", "aspect", "weapon", "item", "locations", "facilities", "staff", "weaponery", "gear", "vehicles", "science", "medical", "restricted"],
        "htmlFields": ["description"],
        "templates": {
            "weapon": {
                "range": "",
                "damage": 0,
                "damage_cha_multiplier": "none",
                "damage_string": "",
                "ammo_type": "",
                "damage_type": "",
                "damage_types": ["None", "Two-Handed", "Slashing", "Stabbing", "Normal Bullet", "Hollow Point", "Armor Piercing", "Shotgun", "Explosive", "Poison", "Corrosive"],
                "damage_types_obj": {
                    "none": "None",
                    "twoHanded": "Two-Handed",
                    "slashing": "Slashing",
                    "stabbing": "Stabbing",
                    "bullets": "Normal Bullet",
                    "hollowPoint": "Hollow Point",
                    "armorPiercing": "Armor Piercing",
                    "shotgun": "Shotgun",
                    "explosive": "Explosive",
                    "poison": "Poison",
                    "corrosive": "Corrosive"
                },
                "damage_characteristics": {
                    "strength": "Strength",
                    "dexterity": "Dexterity",
                    "constitution": "Constitution",
                    "intelligence": "Intelligence",
                    "perception": "Perception",
                    "willpower": "Willpower"
                },
                "capacity": {
                    "value": 0,
                    "max": 0
                }
            },
            "common": {
                "encumbrance": 0,
                "cost": 0,
                "availability": "",
                "availabilityOptions": ["Common", "Uncommon", "Rare"],
                "description": "",
                "resource_bonus": {
                    "hp": 0,
                    "endurance_points": 0,
                    "speed": 0,
                    "essence": 0,
                    "initiative": 0
                }
            },
            "cell_data": {
                "rp": "",
                "space": "",
                "prerequisite": "",
                "qty": 1,
                "locationOptions": ["Borrowed", "LocationA", "LocationB", "LocationC", "LocationD"],
                "location": "1"
            }
        },
        "quality": {
            "templates": ["common"],
            "types": ["Quality", "Pulling Strings"],
            "type": ""
        },
        "drawback": {
            "templates": ["common"]
        },
        "skill": {
            "templates": ["common"],
            "level": 0
        },
        "power": {
            "templates": ["common"],
            "level": 0,
            "types": ["Other", "Psychic Ability", "Ritual"],
            "type": ""
        },
        "aspect": {
            "templates": ["common"],
            "power": 0
        },
        "weapon": {
            "templates": ["common", "weapon"]
        },
        "item": {
            "templates": ["common"],
            "equipped": false,
            "armor_value": 0,
            "qty": 1
        },
        "locations": {
          "templates": ["common", "cell_data"]
        },
        "facilities": {
            "templates": ["common", "cell_data"]
        },
        "staff": {
            "templates": ["common", "cell_data"]
        },
        "weaponery": {
            "templates": ["common", "cell_data"],
            "types": ["Weapons", "Explosives", "Ammunition", "CombatAccessories"],
            "type": ""
        },
        "gear": {
            "templates": ["common", "cell_data"],
            "types": ["Surveillance", "IntrusionEquipment", "Electronics", "Software", "PersonnelEquipment"],
            "type": ""
        },
        "vehicles": {
            "templates": ["common", "cell_data"],
            "types": ["Vehicles", "VehicleAccessories"],
            "type": ""
        },
        "science": {
            "templates": ["common", "cell_data"]
        },
        "medical": {
            "templates": ["common", "cell_data"]
        },
        "restricted": {
            "templates": ["common", "cell_data"]
        }
    }

  */

  static defineSchema() {

    const schema = {}
    schema.subtype = new StringField({ required: true, nullable: false, initial: SYSTEM.SUBTYPES.other.id, choices: SYSTEM.SUBTYPES })
    schema.reference = new StringField({ required: false })
    schema.technique = new HTMLField({})
    schema.narratif = new HTMLField({})
    schema.quantity = new StringField({ required: true, integer: true, initial: 1, min: 0 })
    schema.weight = new StringField({ required: false, integer: true, initial: 0, min: 0 })
    schema.protection = new StringField({ required: false })
    schema.damage = new StringField({ required: false })
    schema.range = new StringField({ required: false })
    schema.speed = new StringField({ required: false })
    schema.notes = new HTMLField({})

    return schema
  }

  /** @inheritDoc */
  async _preCreate(data, options, user) {
    let updates = {}
    const stats = this.parent._stats

    // Pour un acteur non dupliqué, non provenant d'un compendium et non exporté
    if (!stats.duplicateSource && !stats.compendiumSource && !stats.exportSource) {
      // Image par défaut
      if (!foundry.utils.hasProperty(data, "img")) {
        updates.img = "systems/celestopol1922/images/icons/item.png"
      }
    }
    this.parent.updateSource(updates)
  }
}