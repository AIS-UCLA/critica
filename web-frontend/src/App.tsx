import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ApiKey } from '@innexgo/frontend-auth-api';
import { info } from './utils/api';
import { unwrap } from '@innexgo/frontend-common';

import { AuthenticatedComponentRenderer } from '@innexgo/auth-react-components';

// public pages
import Home from './pages/Home';
import Error404 from './pages/Error404';

// logged in required pages
import Dashboard from './pages/Dashboard';

// public pages
import ArticleSearch from './pages/ArticleSearch';
import ArticleView from './pages/ArticleView';

import DarkAdaptedIcon from "./img/critica_icon_light.png";
import LightAdaptedIcon from "./img/critica_icon_dark.png";

// Bootstrap CSS & JS
import './style/style.scss';
import 'bootstrap/dist/js/bootstrap';

function getPreexistingApiKey() {
  const preexistingApiKeyString = localStorage.getItem("apiKey");
  if (preexistingApiKeyString == null) {
    return null;
  } else {
    try {
      // TODO validate here
      return JSON.parse(preexistingApiKeyString) as ApiKey;
    } catch (e) {
      // try to clean up a bad config
      localStorage.setItem("apiKey", JSON.stringify(null));
      return null;
    }
  }
}

const authAuthenticatorHrefFn = () => info().then(unwrap).then(x => x.authAuthenticatorHref);

function App() {
  const [apiKey, setApiKey_raw] = React.useState(getPreexistingApiKey());

  const setApiKey = (data: ApiKey | null) => {
    localStorage.setItem("apiKey", JSON.stringify(data));
    setApiKey_raw(data);
  };

  const branding = {
    name: "Critica",
    tagline: "Compare GPT3 paragraphs against human ones.",
    homeUrl: "/",
    dashboardUrl: "/dashboard",
    instructionsUrl: "/#instructions",
    darkAdaptedIcon: DarkAdaptedIcon,
    lightAdaptedIcon: LightAdaptedIcon,
  }

  const commonProps = {
    branding,
    apiKey,
    setApiKey,
    authAuthenticatorHrefFn,
  };


  return <BrowserRouter>
    <Routes>
      {/* Our home page */}
      <Route path="/" element={<Home branding={branding} />} />

      {/* Public Article View and Search */}
      <Route path="/article_search" element={<ArticleSearch  branding={branding} />} />
      <Route path="/article_view" element={<ArticleView branding={branding} />} />

      {/* Requires you to be logged in */}
      <Route path="/dashboard" element={<AuthenticatedComponentRenderer component={Dashboard} {...commonProps} />} />

      {/* Error page */}
      <Route path="*" element={<Error404 />} />
    </Routes >
  </BrowserRouter >
}

export default App;
