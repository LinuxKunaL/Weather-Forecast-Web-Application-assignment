import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "./pages/Main";
import Temp from "./pages/Temp";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/temp/:id" element={<Temp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
