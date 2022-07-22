import React, { useEffect } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Toolbar from "./components/Toolbar";
import HomePage from "./pages/HomePage";
import StudentsPages from "./pages/StudentsPage";
import DatesPage from "./pages/DatesPage";
import TakeAttendancePage from "./pages/TakeAttendancePage";
import AdminPage from "./pages/AdminPage";
import { initializeApp } from "firebase/app";
import AddStudentPage from "./pages/AddStudentPage";
const config = {
  apiKey: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_SENDER_ID,
  appId: import.meta.env.SNOWPACK_PUBLIC_FIREBASE_APP_ID,
};
initializeApp(config);

const App = () => {
  const [showToolbar, toggleShowToolbar] = React.useState(false);
  const [loggedIn, toggleLoggedIn] = React.useState(false);
  const [classId, setClassId] = React.useState("");
  const showToolbarAndSetLoggedIn = (loggedInValue, newClassId) => {
    toggleShowToolbar(true);
    toggleLoggedIn(loggedInValue);
    setClassId(newClassId);
  };
  // useEffect(()=>{
  //     if(!loggedIn){

  //     }
  // },[loggedIn])
  return (
    <div className="colorPrimary">
      {showToolbar && <Toolbar classId={classId} />}
      <Switch>
        <Route exact path="/admin" render={()=><AdminPage/>} />
        {loggedIn && (
          <React.Fragment>
            <Route
              exact
              path="/students"
              render={({ history }) => <StudentsPages history={history} />}
            />
            <Route exact path="/dates" component={DatesPage} />
            <Route
              exact
              path="/take_attendance"
              component={TakeAttendancePage}
            />
            <Route
              exact
              path="/add_student"
              render={({ history }) => <AddStudentPage history={history} />}
            />
          </React.Fragment>
        )}
         <Route
          path=""
          render={({ history }) => (
            <HomePage
              toggleLoggedInBar={showToolbarAndSetLoggedIn}
              history={history}
            />
          )}
        />
      </Switch>
    </div>
  );
};

export default App;
