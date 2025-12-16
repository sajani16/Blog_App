import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Trash2, X } from "lucide-react";
import { setIsOpen } from "../redux/slices/commentSlice";
import Avatar from "../utils/Avatar"; // assuming you have an Avatar utility

function Comment({ blogId, blogAuthorId }) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.comment.isOpen);
  const { _id: userId, token } = useSelector((slice) => slice.user);

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const base_url = import.meta.env.VITE_BACKEND_URL;

  // Fetch comments when sidebar opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchComments = async () => {
      try {
        const res = await axios.get(`${base_url}/blog/getcomment/${blogId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComments(res.data.comments || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComments();
  }, [isOpen, blogId, token]);

  // Post new comment
  const submitHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${base_url}/blog/createcomment/${blogId}`,
        { comment: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments((prev) => [res.data.newComment, ...prev]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${base_url}/blog/deletecomment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`fixed top-13 right-0 h-screen bg-white shadow-xl transition-transform duration-300
      ${isOpen ? "translate-x-0" : "translate-x-full"} w-[35%] flex flex-col`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold text-lg">All Comments</h3>
        <button
          className="p-1 rounded hover:bg-gray-100"
          onClick={() => dispatch(setIsOpen(false))}
        >
          <X size={20} />
        </button>
      </div>

      {/* Comment list */}
      <div className="p-4 overflow-y-auto flex-1 space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">No comments yet</p>
        ) : (
          comments.map((c) => {
            const canDelete = c.user?._id === userId || blogAuthorId === userId;

            return (
              <div
                key={c._id}
                className="flex justify-between items-start border-b pb-2"
              >
                {/* Left side: user image + name + comment */}
                <div className="flex gap-2">
                  <img
                    src={c.user?.image ? c.user.image : Avatar(c.user?.name)}
                    alt={c.user?.name || "Author"}
                    className="w-8 h-8 rounded-full object-cover mt-1"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      {c.user?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">{c.comment}</p>
                  </div>
                </div>

                {/* Right side: delete button */}
                {canDelete && (
                  <Trash2
                    className="text-red-500 cursor-pointer hover:text-red-700 mt-1"
                    size={18}
                    onClick={() => deleteHandler(c._id)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add comment */}
      <div className="border-t p-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={submitHandler}
          className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default Comment;
