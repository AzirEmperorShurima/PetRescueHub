import Comments from "./Comments.js";
import ForumPost from "./ForumPost.js";
import Message from "./Message.js";
import Question from "./Question.js";
import Reaction from "./CommentReaction.js";
import Report from "./Report.js";
import Role from "./Role.js";
import user from "./user.js";
import UserPermissions from "./UserPermissions.js";
import PostReaction from "./PostReaction.js";
import TransactionHistory from "./TransactionHistory.js";
import Package from "./Package.js";

const models_list = {
    user,
    Role,
    Message,
    Comments,
    ForumPost,
    Question,
    Reaction,
    Report,
    UserPermissions,
    PostReaction,
    TransactionHistory,
    Package
}

export default models_list;