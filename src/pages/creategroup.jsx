import { useState } from "react";
import styles from "./creategroup.module.css";
import { useNavigate } from "react-router-dom";
import { createGroup } from "../services/groupservices";

function CreateCommunity({ setCommWindow }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const [rules, setRules] = useState([
    "Be respectful to others."
  ]);

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };
  const addRule = () => {
    setRules([...rules, ""]);
  };
  const updateRule = (index, value) => {
    const updated = [...rules];
    updated[index] = value;
    setRules(updated);
  };
  const removeRule = (index) => {
    const updated = rules.filter((_, i) => i !== index);
    setRules(updated);
  };


  const handleCreate = async () => {
    const cleanedRules = rules.map(r => r.trim()).filter(r => r.length > 0);

    const encodedDescription = description.trim() + "\n---RULES---\n" + cleanedRules.join("\n");

    const payload = {
      name: title.trim(),
      description: encodedDescription
    };

    const f = await createGroup(payload);
    if (f.status) {
      const grpId = f.resp.id;
      navigate("/group/" + grpId);
    }
    else {
      alert(f.message)
    }

  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.close} onClick={() => setCommWindow(false)}>×</div>




        {step === 1 && (
          <>
            <h2>Name your community</h2>

            <input
              type="text"
              placeholder="Community name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2>Describe your community</h2>

            <textarea
              placeholder="Write a short description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
            />
          </>
        )}

        {step === 3 && (
          <>
            <h2>Community Rules</h2>

            {rules.map((rule, index) => (
              <div key={index} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => updateRule(index, e.target.value)}
                  className={styles.input}
                  placeholder={`Rule ${index + 1}`}
                />

                {rules.length > 1 && (
                  <button
                    onClick={() => removeRule(index)}
                    className={styles.backBtn}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addRule}
              className={styles.nextBtn}
              style={{ marginTop: "10px" }}
            >
              + Add Rule
            </button>
          </>
        )}





        <div className={styles.footer}>
          {step > 1 && (
            <button className={styles.backBtn} onClick={prevStep}>
              Back
            </button>
          )}

          {step < 3 ? (
            <button
              className={styles.nextBtn}
              onClick={nextStep}
              disabled={
                (step === 1 && !title.trim()) ||
                (step === 2 && !description.trim())
              }
            >
              Next
            </button>
          ) : (
            <button
              className={styles.createBtn}
              onClick={(e) => { e.preventDefault(); handleCreate() }}
              disabled={!title.trim() || !description.trim()}
            >
              Create Community
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCommunity;