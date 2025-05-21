// This file exports all the models in the project
// It is used to import all the models in the project
import Message from "./Message.js";
import Report from "./Report.js";
import Role from "./Role.js";
import user from "./user.js";
import TransactionHistory from "./TransactionHistory.js";
import Package from "./Package.js";
import FavouriteList from "./FavouriteList.js";
import PetProfile from "./PetProfile.js";
import { ForumPost, Question, FindLostPetPost, EventPost, PostModel } from "./PostSchema.js";
import { CommentModel } from "./CommentsSchema.js";
import Reaction from "./ReactionSchema.js";
import PetRescueMissionHistory from "./PetRescueMissionHistory.js";
import PetGuideSchema from "./PetGuideSchema.js";

const models_list = {
    user,
    Role,
    Message,
    Report,
    PetProfile,
    FavouriteList,
    TransactionHistory,
    // Package,
    PetGuideSchema,
    PostModel,
    CommentModel,
    Reaction,
    ForumPost,
    Question,
    FindLostPetPost,
    EventPost,
    PetRescueMissionHistory
};

export default models_list;