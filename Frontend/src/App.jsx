import "react";
import { Routes, Route } from "react-router-dom";
import Start from "./pages/Start";
import Login from "./pages/UserLogin";
import Signup from "./pages/UserSignup";
import UserProtectedWrapper from "./pages/UserProtectedWrapper";
import Home from "./pages/Home";
import Setting from "./pages/Setting";
import Workspace from "./pages/workspace";
import Response from "./pages/Responce";
import Formbots from "./pages/Formbot";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route
          path="/home"
          element={
            <UserProtectedWrapper>
              <Home />
            </UserProtectedWrapper>
          }
        />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route
          path="User/Setting"
          element={
            <UserProtectedWrapper>
              <Setting />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="Workspace/:fileId"
          element={
            <UserProtectedWrapper>
              <Workspace />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/Workspace/:fileId/response/:formId"
          element={
            <UserProtectedWrapper>
              <Response />
            </UserProtectedWrapper>
          }
        />
        <Route path="/Formbot/:fileId" element={<Formbots />} />
      </Routes>
    </div>
  );
};

export default App;
