import { useState, useRef } from "react";
import styles from "./createpost.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/UserContext";
import { addMedia } from "../services/firebaseservices";
import { makePost } from "../services/postservices";

function CreatePost() {
  const { groupId } = useParams();

  const [activeTab, setActiveTab] = useState("Text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { theme, user } = useAuth();



  const uploadFiles = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    const newMedia = await addMedia(files)

    setMedia(prev => [...prev, ...newMedia]);
    setUploading(false);

    e.target.value = null;
  };


  const handleCreatePost = async () => {
    let encoded = body.trim();

    encoded += "\n\n";

    media.forEach(m => {
      if (m.type === "video") {
        encoded += `![video](${m.storagePath || m.preview})\n`;
      } else {
        encoded += `![image](${m.storagePath || m.preview})\n`;
      }
    });

    const payload = {
      title: title.trim(),
      description: encoded,
      groupId: groupId
    };


    try {
      const data = await makePost(payload);
      if (data.status) {
        const postId = data.resp.id;
        navigate("/post/" + postId);
      }
      else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Post creation failed:", err);
    }
  };


  return (
    <div className={styles.page} style={theme == "dark" ? { paddingTop: "90px", background: "black", color: "white" } : { paddingTop: "90px" }} >
      <div className={styles.container}>

        <h2>Create post</h2>


        <div className={styles.tabs}>
          {["Text", "Images & Video"].map(tab => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab(tab)}
              style={theme == "dark" ? { color: (activeTab === tab ? "white" : "") } : {}}
            >
              {tab}
            </div>
          ))}
        </div>


        <input
          type="text"
          placeholder="Title*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
          style={{ marginTop: "10px" }}
        />


        {activeTab === "Text" && (
          <textarea
            placeholder="Body text..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            style={{ marginTop: "10px" }}
            className={styles.textarea}
          />
        )}

        {activeTab === "Images & Video" && (
          <div className={styles.uploadBox}>

            {/* Hidden File Input */}
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={uploadFiles}
            />

            {media.length === 0 && (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className={styles.postBtn}
              >
                Upload Images or Videos
              </button>
            )}

            {uploading && <p>Uploading...</p>}

            <div style={{ marginTop: "15px" }}>
              {media.map((m, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "10px",
                    borderRadius: "8px",
                    overflow: "hidden"
                  }}
                >
                  {m.type === "video" ? (
                    <video src={m.preview} controls width="100%" />
                  ) : (
                    <img src={m.preview} alt="preview" width="100%" />
                  )}
                </div>
              ))}

              {media.length > 0 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    marginTop: "10px",
                    padding: "12px",
                    width: "100%",
                    border: "1px dashed #aaa",
                    background: "transparent",
                    cursor: "pointer",
                    borderRadius: "8px"
                  }}
                >
                  + Add More
                </button>
              )}
            </div>

          </div>
        )}

        <div className={styles.footer}>
          <button
            className={styles.postBtn}
            disabled={!title.trim()}
            onClick={handleCreatePost}
          >
            Post
          </button>
        </div>

      </div>
    </div>
  );
}

export default CreatePost;