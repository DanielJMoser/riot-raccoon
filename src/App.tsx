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

// Import Animation System
import { RouteTransition, withPageTransition } from './animations/RouteTransition';
import './scss/animations/Animations.scss';
import './scss/animations/AnimationUtils.scss';

// Wrap page components with animations
const AnimatedHome = withPageTransition(Home, { animationClass: 'pixelate-in', animationDelay: 300 });
const AnimatedProductList = withPageTransition(ProductList, { animationClass: 'pixelate-in', animationDelay: 300 });
const AnimatedProductDetails = withPageTransition(ProductDetails, { animationClass: 'fade-in-up', animationDelay: 300 });
const AnimatedCollections = withPageTransition(Collections, { animationClass: 'pixelate-in', animationDelay: 300 });
const AnimatedCollectionDetails = withPageTransition(CollectionDetails, { animationClass: 'fade-in-up', animationDelay: 300 });
const AnimatedAbout = withPageTransition(About, { animationClass: 'pixelate-in', animationDelay: 300 });
const AnimatedCheckout = withPageTransition(Checkout, { animationClass: 'glitch', animationDelay: 300 });

// Wrap placeholder component with animation
const AnimatedPlaceholderPage = withPageTransition(({ title }: { title: string }) => (
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
), { animationClass: 'crt-in', animationDelay: 300 });

setupIonicReact({
    // Add animation effect to Ionic's own transitions
    animated: true,
});

const App: React.FC = () => (
    <IonApp>
        <CartProvider>
            <IonReactRouter>
                <RouteTransition>
                    <IonRouterOutlet>
                        {/* Main routes */}
                        <Route exact path="/">
                            <AnimatedHome />
                        </Route>
                        <Route exact path="/home">
                            <Redirect to="/" />
                        </Route>

                        {/* Shop section */}
                        <Route exact path="/shop">
                            <AnimatedProductList />
                        </Route>
                        <Route exact path="/product/:slug">
                            <AnimatedProductDetails />
                        </Route>

                  {/* Pfand Gehoert Daneben section */}
                  <Route exact path="/pfandgehoertdaneben">
                      <PfandGehoertDaneben />
                  </Route>
                        {/* News section */}
                        <Route exact path="/news">
                            <AnimatedPlaceholderPage title="News" />
                        </Route>

                        {/* Collection previews */}
                        <Route exact path="/collections">
                            <AnimatedCollections />
                        </Route>
                        <Route exact path="/collection/:slug">
                            <AnimatedCollectionDetails />
                        </Route>

                        {/* Lookbook */}
                        <Route exact path="/lookbook">
                            <AnimatedPlaceholderPage title="Lookbook" />
                        </Route>

                        {/* Information pages */}
                        <Route exact path="/random">
                            <AnimatedPlaceholderPage title="Random" />
                        </Route>
                        <Route exact path="/about">
                            <AnimatedAbout />
                        </Route>
                        <Route exact path="/contact">
                            <AnimatedPlaceholderPage title="Contact" />
                        </Route>

                        {/* Support pages */}
                        <Route exact path="/faq">
                            <AnimatedPlaceholderPage title="FAQ" />
                        </Route>
                        <Route exact path="/sizing">
                            <AnimatedPlaceholderPage title="Sizing" />
                        </Route>
                        <Route exact path="/terms">
                            <AnimatedPlaceholderPage title="Terms" />
                        </Route>
                        <Route exact path="/privacy">
                            <AnimatedPlaceholderPage title="Privacy" />
                        </Route>
                        <Route exact path="/shipping">
                            <AnimatedPlaceholderPage title="Shipping" />
                        </Route>

                        {/* Checkout page */}
                        <Route exact path="/checkout">
                            <AnimatedCheckout />
                        </Route>

                        {/* Catch all undefined routes */}
                        <Route>
                            <Redirect to="/" />
                        </Route>
                    </IonRouterOutlet>
                </RouteTransition>
            </IonReactRouter>
        </CartProvider>
    </IonApp>
);

export default App;