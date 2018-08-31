import Hunt, { HUNT_ANNOTATION_KEY } from "./hunt"

export default function getHunt(instance: any): Hunt {
  return instance && instance[HUNT_ANNOTATION_KEY]
}
