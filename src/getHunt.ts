import Hunt, { HUNT_ANNOTATION_KEY } from "./hunt"

/**
 * Gets the [[Hunt]] that was used to find the instance.
 *
 * @param instance Any instance that was fetched from a scorpion.
 */
export default function getHunt(instance: any): Hunt {
  return instance && instance[HUNT_ANNOTATION_KEY]
}
