import { images } from "../../constants";
import { FiMessageSquare } from "react-icons/fi";
import { BiSolidPencil } from "react-icons/bi";
import { MdDeleteOutline } from "react-icons/md";
import CommentForm from "./CommentForm";

const Comment = ({
  comment,
  loggedInUserId,
  affectedComment,
  setAffectedComment,
  addComment,
  updateComment,
  deleteComment,
  replies,
  parentId = null,
}) => {
  const isUserLoggedIn = Boolean(loggedInUserId);
  const commentBelongsToUser = loggedInUserId === comment.user._id;
  const isReplying =
    affectedComment &&
    affectedComment._id === comment._id &&
    affectedComment.type === "replying";
  const isEditing =
    affectedComment &&
    affectedComment._id === comment._id &&
    affectedComment.type === "editing";

  const repliedCommentId = parentId ? parentId : comment._id;
  const replyOnUserId = comment.user._id;

  return (
    <div
      id={`comment-${comment?._id}`}
      className="flex flex-nowrap items-start gap-x-3 bg-[#F2F4F5] p-3 rounded-lg"
    >
      <img
        className="w-9 h-9 rounded-full object-cover"
        src={
          comment?.user?.avatar
            ? process.env.REACT_APP_UPLOAD_FOLDER_BASE_URL + comment.user.avatar
            : images.PostProfileImage
        }
        alt="profile"
      />
      <div className="flex-1 flex flex-col">
        <h5 className="font-bold text-dark-hard text-xs">
          {comment.user.name}
        </h5>
        <span className="mt-1 text-[10px] text-[#77808B] font-roboto">
          {new Date(comment.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
          })}
        </span>

        {!isEditing && (
          <p className="mt-2.5 text-xs text-[#77808B]">{comment.desc}</p>
        )}
        {isEditing && (
          <CommentForm
            btnLabel="Update"
            formSubmitHandler={(value) => updateComment(value, comment._id)}
            formCancelHandler={() => setAffectedComment(null)}
            initialText={comment.desc}
          />
        )}
        <div className="flex items-center gap-x-3 text-dark-light font-roboto mt-3 mb-3 text-xs">
          {isUserLoggedIn && (
            <button
              className="flex items-start space-x-1 hover:opacity-70"
              onClick={() =>
                setAffectedComment({ type: "replying", _id: comment._id })
              }
            >
              <FiMessageSquare className="w-4 h-auto" />
              <span className="leading-[1.1]">Reply</span>
            </button>
          )}
          {commentBelongsToUser && (
            <>
              <button
                className="flex items-start space-x-1 hover:opacity-70"
                onClick={() =>
                  setAffectedComment({ type: "editing", _id: comment._id })
                }
              >
                <BiSolidPencil className="w-4 h-auto" />
                <span>Edit</span>
              </button>
              <button
                className="flex items-start space-x-1 hover:opacity-70"
                onClick={() => deleteComment(comment._id)}
              >
                <MdDeleteOutline className="w-4 h-auto" />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
        {isReplying && (
          <CommentForm
            btnLabel="Reply"
            formSubmitHandler={(value) => {
              addComment(value, repliedCommentId, replyOnUserId);
            }}
            formCancelHandler={() => setAffectedComment(null)}
          />
        )}
        {replies.length > 0 && (
          <div>
            {replies.map((reply) => (
              <Comment
                key={reply._id}
                addComment={addComment}
                affectedComment={affectedComment}
                setAffectedComment={setAffectedComment}
                comment={reply}
                deleteComment={deleteComment}
                loggedInUserId={loggedInUserId}
                replies={[]}
                updateComment={updateComment}
                parentId={comment._id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Comment;
