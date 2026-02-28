import { useState, useRef } from "react";
import styles from "./createPost.module.css";
import { useNavigate, useParams } from "react-router-dom";

function CreatePost() {
  const { groupId } = useParams();

  const [activeTab, setActiveTab] = useState("Text");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  /* ================= MULTIPLE FILE UPLOAD ================= */

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    const newMedia = [];

    for (let file of files) {
      const formData = new FormData();
      formData.append("files", file);

      try {
        const resp = await fetch("http://localhost:3000/api/posts/upload", {
          method: "POST",
          credentials: "include",
          body: formData
        });

        const data = await resp.json();



        if (data.status) {
          console.log("data url is as follows");
          const url = (data.url.data.path);
          const isVideo = file.type.startsWith("video");

          newMedia.push({
            type: isVideo ? "video" : "image",
            preview: "https://hhccbekozmwipzovsnkk.supabase.co/storage/v1/object/public/hivemind_posts/" + url,
            storagePath: "https://hhccbekozmwipzovsnkk.supabase.co/storage/v1/object/public/hivemind_posts/" + url
          });
        }

      } catch (err) {
        console.error("Upload error:", err);
      }
    }

    setMedia(prev => [...prev, ...newMedia]);
    setUploading(false);

    // Reset input so same file can be re-selected
    e.target.value = null;
  };
  const navigate = useNavigate();

  /* ================= CREATE POST ================= */

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

    console.log("🚀 Final payload:", payload);

    try {
      const res = await fetch("http://localhost:3000/api/posts/createpost", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.status) {
        const postId = data.resp.id;

        navigate("/post/" + postId);

        console.log("✅ Post created");
      }
      else {
        alert(data.message);
      }
    } catch (err) {
      console.error("Post creation failed:", err);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        <h2>Create post</h2>

        {/* Tabs */}
        <div className={styles.tabs}>
          {["Text", "Images & Video"].map(tab => (
            <div
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Title*"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.titleInput}
        />

        {/* TEXT TAB */}
        {activeTab === "Text" && (
          <textarea
            placeholder="Body text..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className={styles.textarea}
          />
        )}

        {/* MEDIA TAB */}
        {activeTab === "Images & Video" && (
          <div className={styles.uploadBox}>

            {/* Hidden File Input */}
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {/* Initial Upload Button */}
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

            {/* PREVIEW */}
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

              {/* Add More Button */}
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

        {/* Footer */}
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