import { useState } from "react";

const CommentForm = ({
  btnLabel,
  formSubmitHandler,
  formCancelHandler = null,
  initialText = "",
  loading = false,
}) => {
  const [value, setValue] = useState(initialText);

  const submitHandler = (e) => {
    e.preventDefault();
    formSubmitHandler(value);
    setValue("");
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-col items-end border-2 border-primary p-4 rounded-lg">
        <textarea
          rows="5"
          className="w-full focus:outline-none resize-none placeholder:text-sm placeholder:text-[#77808B] bg-transparent"
          placeholder="Leave Your Comment Here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <div className="flex flex-col-reverse items-center gap-x-2 pt-2 min-[420px]:flex-row gap-y-2">
          {formCancelHandler && (
            <button
              onClick={() => formCancelHandler()}
              className="px-6 py-2 rounded-lg border border-red-500 text-red-500"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-primary px-6 py-2 border border-primary rounded-lg text-white font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {btnLabel}
          </button>
        </div>
      </div>
    </form>
  );
};
export default CommentForm;
