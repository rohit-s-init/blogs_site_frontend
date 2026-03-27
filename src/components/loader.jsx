import styles from "./loader.module.css";

function Loader({ size = 32 }) {
    return (
        <div style={{display: "flex", justifyContent: "center", paddingTop: "30vh"}}>
            <div
                className={styles.loader}
                style={{ width: size, height: size }}
            />
        </div>
    );
}

export default Loader;