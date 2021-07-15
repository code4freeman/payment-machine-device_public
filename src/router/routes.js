import Error404 from "../pages/error404/index";
import Home from "../pages/home/index";
import Test from "../pages/test/index";
import Scanlist from "../pages/scan-list/index";
import WifiSetting from "../pages/wifi-setting/index";
import Buy from "../pages/buy/index";
import PayDone from "../pages/pay-done/index";

export default append404([
    {
        path: "/",
        component: Home
    },
    {
        path: "/scan-list/:code",
        component: Scanlist
    },
    {
        path: "/wifi-setting",
        component: WifiSetting
    },
    {
        path: "/buy/:orderNumber",
        component: Buy
    },
    {
        path: "/pay-done/:orderNumber",
        component: PayDone
    },
    {
        path: "/test",
        component: Test
    }
]);

function append404 (routes) {
    routes.push({
        path: "*",
        component: Error404
    });
    routes.forEach(({ children }) => {
        if (children && children.length > 0) append404(children);
    });
    return routes;
}