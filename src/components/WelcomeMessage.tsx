
import { useEffect, useState } from "react";

export const WelcomeMessage = () => {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((data) => setMessage(data.mensaje))
      .catch((err) => {
        console.error("Error fetching:", err);
        setMessage("Error de conexión con el backend");
      });
  }, []);

  return (
    <div className="text-center text-xl font-semibold mt-4">
      {message ? message : "Cargando..."}
    </div>
  );
};
