import Reaction from "../../../models/ReactionSchema";

export const validReactionTypes = getEnumValues(Reaction, 'reactionType');