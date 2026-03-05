import { Link, useLocation } from "react-router-dom";

function BackBtn() {

    return (
        <div>
            <button
                style={{
                    backgroundColor: "Green",
                    fontWeight: "bold",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    fontSize: "16px",
                    cursor: "pointer",
                    borderRadius: "5px",
                    marginBottom: "8px",
                }}
                onClick={() => window.history.back()}
            >
                Back
            </button>
        </div>
    );
}

export default BackBtn;
