import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppRoutes } from "./routes/app.routes";

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
    return null;
}

function App() {
    return (
        <>
            <ScrollToTop />
            <AppRoutes />
        </>
    );
}

export default App;