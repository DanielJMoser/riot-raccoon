import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

/* Catppuccin Mocha Theme */
import './theme/catppuccin.scss';
import ProductList from "./pages/ProductList";
import ProductDetails from "./pages/ProductDetails";
import { CartProvider } from "./context/CartContext";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import CollectionDetails from "./pages/CollectionDetails";
import Collections from "./pages/Collections";
import PfandGehoertDaneben from "./pages/PfandGehoertDaneben";
import ErrorBoundary from "./components/ErrorBoundary";
import MobileNavigation from "./components/MobileNavigation";

// Import placeholder pages
// These will be replaced with actual implementations later
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div style={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1e1e2e', // Catppuccin base
        color: '#cdd6f4' // Catppuccin text
    }}>
        <h1>{title} Page</h1>
        <p>This is a placeholder for the {title.toLowerCase()} page.</p>
        <a
            href="/"
            style={{
                marginTop: '20px',
                color: '#cba6f7', // Catppuccin mauve
                textDecoration: 'none'
            }}
        >
            Return to Home
        </a>
    </div>
);

setupIonicReact();

const App: React.FC = () => (
    <IonApp>
        <ErrorBoundary>
            <CartProvider>
                <IonReactRouter>
                    <IonRouterOutlet>
                    {/* Main routes */}
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/home">
                        <Redirect to="/" />
                    </Route>

                    {/* Shop section */}
                    <Route exact path="/shop">
                        <ProductList />
                    </Route>
                    <Route exact path="/product/:slug">
                        <ProductDetails />
                    </Route>

                    {/* Pfand Gehoert Daneben section */}
                    <Route exact path="/pfandgehoertdaneben">
                        <PfandGehoertDaneben />
                    </Route>

                    {/* Collection previews */}
                    <Route exact path="/collections">
                        <Collections />
                    </Route>
                    <Route exact path="/collection/:slug">
                        <CollectionDetails />
                    </Route>

                    {/* Lookbook */}
                    <Route exact path="/lookbook">
                        <PlaceholderPage title="Lookbook" />
                    </Route>

                    {/* Information pages */}
                    <Route exact path="/random">
                        <PlaceholderPage title="Random" />
                    </Route>
                    <Route exact path="/about">
                        <About />
                    </Route>
                    <Route exact path="/contact">
                        <PlaceholderPage title="Contact" />
                    </Route>

                    {/* Support pages */}
                    <Route exact path="/faq">
                        <PlaceholderPage title="FAQ" />
                    </Route>
                    <Route exact path="/sizing">
                        <PlaceholderPage title="Sizing" />
                    </Route>
                    <Route exact path="/terms">
                        <PlaceholderPage title="Terms" />
                    </Route>
                    <Route exact path="/privacy">
                        <PlaceholderPage title="Privacy" />
                    </Route>
                    <Route exact path="/shipping">
                        <PlaceholderPage title="Shipping" />
                    </Route>

                    {/* Checkout page */}
                    <Route exact path="/checkout">
                        <Checkout />
                    </Route>

                    {/* Catch all undefined routes */}
                    <Route>
                        <Redirect to="/" />
                    </Route>
                    </IonRouterOutlet>
                </IonReactRouter>
                
                {/* Mobile Navigation - shows only on mobile */}
                <MobileNavigation />
            </CartProvider>
        </ErrorBoundary>
    </IonApp>
);

export default App;