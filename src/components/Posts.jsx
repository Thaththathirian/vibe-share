import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { IoMdCreate } from "react-icons/io";
import { LiaEdit } from "react-icons/lia";
import { MdDelete } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import CryptoJS from "crypto-js";
import { decryptLoggedInUser } from "../utils/utils";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [editPost, setEditPost] = useState(null);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const loggedInUser = decryptLoggedInUser();
  const navigate = useNavigate();

  useEffect(() => {
    const encryptedPosts = localStorage.getItem("posts");
    if (encryptedPosts) {
      try {
        const bytes = CryptoJS.AES.decrypt(
          encryptedPosts,
          import.meta.env.VITE_SECRET_KEY
        );
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8).trim();

        if (!decryptedText.trim())
          throw new Error("Decryption resulted in an empty string");

        const decryptedPosts = JSON.parse(decryptedText);

        if (!Array.isArray(decryptedPosts)) {
          throw new Error("Decrypted Data is not an array");
        }
        setPosts(decryptedPosts);
      } catch (err) {
        console.error("Error decrypting posts:", err);
        localStorage.removeItem("posts");
      }
    }
  }, []);

  const savePostsToLocalStorage = (updatedPosts) => {
    try {
      const encryptedPosts = CryptoJS.AES.encrypt(
        JSON.stringify(updatedPosts),
        import.meta.env.VITE_SECRET_KEY
      ).toString();
      localStorage.setItem("posts", encryptedPosts);
      setPosts(updatedPosts);
    } catch (err) {
      console.error("Error decrypting posts:", err);
    }
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!loggedInUser) {
      alert("Login before posting your vibes!");
      navigate("/login");
      return;
    }

    const newPostData = {
      id: uuidv4(),
      content: newPost,
      authorName: loggedInUser.username,
      authorEmail: loggedInUser.email,
      isPublic,
      createdAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };

    const updatedPosts = [...posts, newPostData];
    savePostsToLocalStorage(updatedPosts);
    setNewPost("");
    setShowCreatePost(false);
  };

  const handleEditPost = (post) => {
    setEditPost(post);
    setNewPost(post.content);
    setIsPublic(post.isPublic);
    setShowCreatePost(true);
  };

  const handleDeletePost = (id) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    savePostsToLocalStorage(updatedPosts);
  };

  const handleUpdatePost = (e) => {
    e.preventDefault();
    const updatedPosts = posts.map((post) =>
      post.id === editPost.id ? { ...post, content: newPost, isPublic } : post
    );
    savePostsToLocalStorage(updatedPosts);
    setEditPost(null);
    setNewPost("");
    setShowCreatePost(false);
  };

  return (
    <div className="posts">
      <div className="topic">
        <h2>Vibe Feed</h2>
        <p>Welcome {loggedInUser.username}</p>
        {!showCreatePost && (
          <button
            onClick={() => setShowCreatePost(true)}
            className="create-btn"
          >
            Create Vibes <IoMdCreate />
          </button>
        )}
      </div>
      {showCreatePost && (
        <form
          onSubmit={editPost ? handleUpdatePost : handleSubmitPost}
          className="create-post"
        >
          <textarea
            placeholder="Express your vibes..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            required
          />
          <div>
            <label>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
              />
              Public
            </label>
          </div>
          <div className="buttons">
            <button type="submit" className="post-btn">
              {editPost ? "Update Post" : "Post Now"}
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setShowCreatePost(false);
                setNewPost("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="display-post">
        {posts.length > 0 ? (
          posts
            .filter(
              (post) =>
                post.isPublic || post.authorEmail === loggedInUser?.email
            )
            .map((post) => (
              <div key={post.id} className="post">
                <div className="post-line-1">
                  <p>
                    {post.authorName}{" "}
                    <span className="lock-icon">
                      {post.isPublic ? "" : <FaLock />}
                    </span>
                  </p>
                  {post.authorEmail === loggedInUser?.email && (
                    <div>
                      <button onClick={() => handleEditPost(post)}>
                        <LiaEdit />
                      </button>
                      <button onClick={() => handleDeletePost(post.id)}>
                        <MdDelete />
                      </button>
                    </div>
                  )}
                </div>
                <p>{post.content}</p>
                <small>{post.createdAt}</small>
              </div>
            ))
        ) : (
          <div className="no-post">
            <p>No Vibes Posted yet...</p>
            <div className="instructions">
              <p>
                <strong>Instructions</strong>
              </p>
              <ul>
                <li>
                  This site uses <strong>localStorage</strong> to securely
                  manage user accounts, posts, and authentication.
                </li>
                <li>
                  You can <strong>sign up</strong> with different test accounts,{" "}
                  <strong>log in</strong>, and <strong>log out</strong> anytime.
                </li>
                <li>
                  Create and share posts, switch between accounts to see how
                  they appear.
                </li>
                <li>
                  <strong>Private posts</strong> are only visible to the account
                  that created them, ensuring privacy.
                </li>
                <li>
                  The system functions similarly to a social media app, but{" "}
                  <strong>all data is securely stored on your browser</strong>.
                </li>
                <li>
                  Your information remains{" "}
                  <strong>private and accessible only from your device</strong>.
                </li>
              </ul>
              <p>
                <strong>Try posting your vibes here!</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;
