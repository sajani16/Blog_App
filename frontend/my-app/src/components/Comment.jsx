import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Trash2 } from "lucide-react";
import Sidebar from "./Sidebar";

import { setIsOpen } from "../redux/slices/commentSlice";

function Comment({ blogId, blogAuthorId }) {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.comment.isOpen);
  const { _id: userId, token } = useSelector((slice) => slice.user);

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const base_url = import.meta.env.VITE_BACKEND_URL;

  // Fetch comments
  useEffect(() => {
    if (!isOpen) return;

    axios
      .get(`${base_url}/getcomment/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setComments(res.data.comments || []))
      .catch(console.error);
  }, [isOpen, blogId, token]);

  // Post comment
  const submitHandler = async () => {
    if (!text.trim()) return;

    try {
      const res = await axios.post(
        `${base_url}/createcomment/${blogId}`,
        { comment: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Push new comment immediately with populated user
      setComments((prev) => [res.data.newComment, ...prev]);
      setText("");
    } catch (err) {
      console.error(err);
    }
  };

  // Delete comment
  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${base_url}/deletecomment/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 h-screen bg-white shadow-xl transition-transform duration-300
      ${isOpen ? "translate-x-0" : "translate-x-full"} w-[35%]`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">Comments</h3>
        <button className="text-xl" onClick={() => dispatch(setIsOpen(false))}>
          ✕
        </button>
      </div>

      {/* Comment list */}
      <div className="p-4 overflow-y-auto h-[calc(100vh-130px)] space-y-4">
        {comments.length === 0 && (
          <p className="text-gray-500 text-center">No comments yet</p>
        )}

        {comments.map((c) => {
          const isOwner = c.user?._id === userId || blogAuthorId === userId;

          return (
            <div key={c._id} className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-sm">
                  {c.user?.name || "Unknown"}
                </p>
                <p className="text-sm">{c.comment}</p>
              </div>

              {isOwner && (
                <Trash2
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  size={18}
                  onClick={() => deleteHandler(c._id)}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Add comment */}
      <div className="border-t p-3 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 text-sm"
          placeholder="Write a comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={submitHandler}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
}

export default Comment;
