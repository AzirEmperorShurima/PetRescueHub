import fs from "fs";
import models_list from "../../models/modelsExport.js";

export const createPostsFromJSON = async (jsonPath = "./postSeed.json") => {
    try {
        // Đọc dữ liệu từ file JSON
        const rawData = fs.readFileSync(jsonPath, "utf8");
        const posts = JSON.parse(rawData);

        console.log(`📝 Bắt đầu thêm ${posts.length} bài viết vào cơ sở dữ liệu...`);

        let successCount = 0;
        let errorCount = 0;

        for (const post of posts) {
            try {
                // Tìm tác giả dựa trên email
                const author = await models_list.user.findOne({ email: post.authorEmail });

                if (!author) {
                    console.warn(`❌ Không tìm thấy tác giả với email "${post.authorEmail}". Bỏ qua bài viết "${post.title}"...`);
                    errorCount++;
                    continue;
                }

                // Xác định model dựa trên postType
                let PostModel;
                switch (post.postType) {
                    case "ForumPost":
                        PostModel = models_list.ForumPost;
                        break;
                    case "Question":
                        PostModel = models_list.Question;
                        break;
                    case "FindLostPetPost":
                        PostModel = models_list.FindLostPetPost;
                        break;
                    case "EventPost":
                        PostModel = models_list.EventPost;
                        break;
                    default:
                        console.warn(`⚠️ Loại bài viết không hợp lệ: ${post.postType}. Bỏ qua bài viết "${post.title}"...`);
                        errorCount++;
                        continue;
                }

                // Tạo đối tượng bài viết mới
                const newPost = new PostModel({
                    title: post.title,
                    content: post.content,
                    author: author._id,
                    tags: post.tags || [],
                    violate_tags: post.violate_tags || [],
                    violationDetails: post.violationDetails || [],
                    imgUrl: post.imgUrl || [],
                    commentCount: post.commentCount || 0,
                    favoriteCount: post.favoriteCount || 0,
                    reactions: post.reactions || new Map([
                        ["like", 0],
                        ["love", 0],
                        ["haha", 0],
                        ["wow", 0],
                        ["sad", 0],
                        ["angry", 0],
                    ]),
                    postStatus: post.postStatus || "public",
                    ...(post.postType === "Question" && { questionDetails: post.questionDetails }),
                    ...(post.postType === "FindLostPetPost" && {
                        lostPetInfo: post.lostPetInfo,
                        contactInfo: post.contactInfo,
                    }),
                    ...(post.postType === "EventPost" && {
                        eventStartDate: post.eventStartDate ? new Date(post.eventStartDate) : null,
                        eventEndDate: post.eventEndDate ? new Date(post.eventEndDate) : null,
                        eventLongitude: post.eventLongitude,
                        eventLatitude: post.eventLatitude,
                        eventLocation: post.eventLocation,
                        approvalStatus: post.approvalStatus || "pending",
                        approvedBy: post.approvedBy || null,
                    }),
                    createdAt: post.createdAt ? new Date(post.createdAt) : Date.now(),
                    updatedAt: post.updatedAt ? new Date(post.updatedAt) : Date.now(),
                });

                // Lưu bài viết vào cơ sở dữ liệu
                await newPost.save();
                successCount++;
                console.log(`✅ Đã thêm bài viết: ${post.title} (Tác giả: ${author.username})`);
            } catch (error) {
                console.error(`❌ Lỗi khi thêm bài viết "${post.title}": ${error.message}`);
                errorCount++;
            }
        }

        console.log(`🎉 Hoàn thành! Đã thêm thành công ${successCount}/${posts.length} bài viết. Có ${errorCount} lỗi.`);
    } catch (error) {
        console.error(`❌ Lỗi khi đọc file hoặc xử lý dữ liệu: ${error.message}`);
    }
};