import React, { useState } from "react";
import Login from "./components/Login.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Dashboard from "./components/Dashboard.jsx";
import { QUICK_START } from "./data/seed.js";

const STAGES = { LOGIN: "login", ONBOARDING: "onboarding", DASHBOARD: "dashboard" };

export default function App() {
  const [stage, setStage] = useState(STAGES.LOGIN);
  const [profile, setProfile] = useState(null);
  const [apiKey, setApiKey] = useState("");

  function handleCreateProfile(key) {
    setApiKey(key);
    setStage(STAGES.ONBOARDING);
  }

  function handleQuickStart(personaId, key) {
    setApiKey(key);
    const p = QUICK_START[personaId];
    setProfile({ ...p, initials: p.initials });
    setStage(STAGES.DASHBOARD);
  }

  function handleOnboardingComplete(builtProfile) {
    setProfile(builtProfile);
    setStage(STAGES.DASHBOARD);
  }

  function handleLogout() {
    setProfile(null);
    setStage(STAGES.LOGIN);
  }

  if (stage === STAGES.LOGIN) {
    return (
      <Login
        onCreateProfile={handleCreateProfile}
        onUseQuickStart={handleQuickStart}
      />
    );
  }

  if (stage === STAGES.ONBOARDING) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
        onBack={() => setStage(STAGES.LOGIN)}
      />
    );
  }

  return <Dashboard profile={profile} apiKey={apiKey} onLogout={handleLogout} />;
}
