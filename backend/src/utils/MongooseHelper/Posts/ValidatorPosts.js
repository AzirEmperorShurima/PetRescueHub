import Reaction from "../../../models/ReactionSchema";
import { getEnumValues } from "../ValidatorEnum";

export const validTargetTypes = getEnumValues(Reaction,'targetType');