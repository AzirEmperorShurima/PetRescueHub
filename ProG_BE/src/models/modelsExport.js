import Comments from "./Comments.js";
import ForumPost from "./ForumPost.js";
import Message from "./Message.js";
import Question from "./Question.js";
import Reaction from "./Reaction.js";
import Role from "./Role.js";
import user from "./user.js";
import UserPermissions from "./UserPermissions.js";

const models_list = {
    user,
    Role,
    Message,
    Comments,
    ForumPost,
    Question,
    Reaction,
    Report,
    UserPermissions
}

export default models_list;