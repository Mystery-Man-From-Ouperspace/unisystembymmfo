import * as CELL from "./cell.mjs"
import * as GEAR from "./gear.mjs"
import * as POWER from "./power.mjs"
import * as QUALITY from "./quality.mjs"
import * as VEHICLES from "./vehicles.mjs"
import * as WEAPON from "./weapon.mjs"
import * as WEAPONERY from "./weaponery.mjs"

export const SYSTEM_ID = "unisystembymmfo"

/**
 * Include all constant definitions within the SYSTEM global export
 * @type {Object}
 */
export const SYSTEM = {
  ID: SYSTEM_ID,
  LOCATION: CELL.LOCATION_OPTIONS,
  GEAR: GEAR.GEAR_TYPES,
  POWER: POWER.POWER_TYPES,
  QUALITY: QUALITY.QUALITY_TYPES,
  VEHICLES: VEHICLES.VEHICLES_TYPES,
  DAMAGE: WEAPON.DAMAGE_TYPE,
  WEAPONERY: WEAPONERY.WEAPONERY_TYPES,
  POUVOIR: POUVOIR.POUVOIR_TYPES,
}