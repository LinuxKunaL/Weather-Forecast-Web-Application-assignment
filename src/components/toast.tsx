import toast from "react-hot-toast";

function Toast(message: string, type: "error" | "success") {
  if (type === "success") {
  }

  if (type === "error") {
    return toast.error(message, {
      style: {
        border: "1px solid rgb(82 82 91 / 0.4)",
        padding: "16px",
        background: "rgb(39 39 42 / 0.5)",
        color: "white",
      },
      iconTheme: {
        primary: "#e5505c",
        secondary: "#FFF",
      },
    });
  }
}

export { Toast };
