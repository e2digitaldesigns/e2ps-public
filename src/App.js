import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import jwtDecode from "jwt-decode";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./scss/styles.scss";

import TopHeader from "./components/template/top-header/top-header";
import MainHeader from "./components/template/main-header/main-header";
import PrimaryMenu from "./components/template/primary-menu/primary-menu";

import MainContent from "./components/template/main-content/main-content";

import Footer from "./components/template/footer/footer";
import { fetchSystemInformation } from "./redux/actions/system/systemActions";
import { userStatusCheck } from "./redux/actions/user/userAuth";
import { randomIds } from "./_utils";
import { getUserShoppingCartItems } from "./redux/actions/shopping-cart/shoppingCartActions";

const App = () => {
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state.user.loggedIn);
  const system = useSelector(state => state.system);
  const [documentState, setDocumentState] = useState({ docReady: false });
  const [sessionState, setSessionState] = useState({ error: false });

  useEffect(() => {
    let stillHere = true;

    async function appMount() {
      try {
        const result = await dispatch(fetchSystemInformation());

        if (result.error.errorCode === "0x0" && stillHere === true) {
          setDocumentState(documentState => ({
            ...documentState,
            docReady: true
          }));
        } else {
          throw result;
        }
      } catch (err) {
        console.log("System Error", err);
      }
    }

    appMount();

    return () => {
      stillHere = false;
    };
  }, [dispatch]);

  useEffect(() => {
    async function checkStatus() {
      try {
        const data = await jwtDecode(
          localStorage.getItem(process.env.REACT_APP_JWT_TOKEN)
        );
        await dispatch(userStatusCheck({ status: true, ...data }));
      } catch (error) {
        console.log("Login Error", error);
      }
    }

    checkStatus();
  }, [dispatch, loggedIn]);

  useEffect(() => {
    async function setSessionId() {
      try {
        const theSessionId = await localStorage.getItem(
          process.env.REACT_APP_SESSION_TOKEN
        );

        if (!theSessionId) {
          // const theId = await randomIds();
          localStorage.setItem(
            process.env.REACT_APP_SESSION_TOKEN,
            randomIds()
          );
        }
      } catch (error) {
        setSessionState(sessionState => ({
          ...sessionState,
          error: true
        }));
        console.error(91, error);
      }
    }

    setSessionId();
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        await dispatch(getUserShoppingCartItems("shoppingCart", null));
      } catch (err) {
        console.error(103, err);
      }
    }

    loadData();
  }, [dispatch]);

  if (system.error !== null || sessionState.error) return <>...error</>;

  if (!documentState.docReady) return <>...loading</>;

  return (
    <>
      <React.Fragment>
        <ToastContainer />
        <section>
          <BrowserRouter>
            <div
              id={`css-template-${system.storeFrontSettings.template.cssTemplate}`}
              className="application-wrapper"
            >
              <div className="storefront-template-header">
                <TopHeader />
              </div>

              <div className="storefront-template-main-header">
                <MainHeader />
              </div>

              <div className="storefront-template-primary-menu">
                <PrimaryMenu />
              </div>

              <div className="storefront-template-main-content">
                <MainContent />
              </div>
              <div className="storefront-template-footer">
                <Footer />
              </div>
            </div>
          </BrowserRouter>
        </section>
      </React.Fragment>
    </>
  );
};

export default App;
