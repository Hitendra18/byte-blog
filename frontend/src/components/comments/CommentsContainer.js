import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNewComment,
  deleteComment,
  updateComment,
} from "../../services/index/comments";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const CommentsContainer = ({
  className,
  loggedInUserId,
  comments,
  postSlug,
}) => {
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [affectedComment, setAffectedComment] = useState(null);

  const { mutate: mutateNewComment, isPending: isPendingNewComment } =
    useMutation({
      mutationFn: ({ desc, slug, parent, replyOnUser, token }) => {
        return createNewComment({ desc, slug, parent, replyOnUser, token });
      },
      onSuccess: () => {
        toast.success("Your comment is sent successfully");
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });

  const { mutate: mutateUpdateComment } = useMutation({
    mutationFn: ({ desc, commentId, token }) => {
      return updateComment({ desc, commentId, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", postSlug] });
      toast.success("Your comment updated successfully");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const { mutate: mutateDeleteComment } = useMutation({
    mutationFn: ({ commentId, token }) => {
      return deleteComment({ commentId, token });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog", postSlug] });
      toast.success("Your comment deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const addCommentHandler = (value, parent = null, replyOnUser = null) => {
    mutateNewComment({
      desc: value,
      parent,
      replyOnUser,
      token: userState.userInfo.token,
      slug: postSlug,
    });
    setAffectedComment(null);
  };

  const updateCommentHandler = (value, commentId) => {
    mutateUpdateComment({
      desc: value,
      commentId,
      token: userState.userInfo.token,
    });
    setAffectedComment(null);
  };
  const deleteCommentHandler = (commentId) => {
    if (window.confirm("Your comment will be deleted permanently")) {
      mutateDeleteComment({
        commentId,
        token: userState.userInfo.token,
      });
    }
  };

  return (
    <div className={`${className}`}>
      <CommentForm
        btnLabel={"Send"}
        formSubmitHandler={(value) => addCommentHandler(value)}
        loading={isPendingNewComment}
      />
      <div className="space-y-4 mt-8">
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            comment={comment}
            loggedInUserId={loggedInUserId}
            affectedComment={affectedComment}
            setAffectedComment={setAffectedComment}
            addComment={addCommentHandler}
            updateComment={updateCommentHandler}
            deleteComment={deleteCommentHandler}
            replies={comment.replies}
          />
        ))}
      </div>
    </div>
  );
};
export default CommentsContainer;
