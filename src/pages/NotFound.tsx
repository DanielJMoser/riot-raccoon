// src/pages/NotFound.tsx
import React, { useEffect, useState } from 'react';
import {
    IonContent,
    IonPage,
    IonButton,
    IonIcon,
    IonRouterLink
} from '@ionic/react';
import { homeOutline, arrowBackOutline, shuffleOutline } from 'ionicons/icons';
import SiteHeader from '../components/SiteHeader';
import '../scss/NotFound.scss';

const NotFound: React.FC = () => {
    const [glitchText, setGlitchText] = useState('404');
    const [currentArt, setCurrentArt] = useState(0);

    // ASCII Art variations for 404
    const asciiArts = [
        `
    ██╗  ██╗ ██████╗ ██╗  ██╗
    ██║  ██║██╔═══██╗██║  ██║
    ███████║██║   ██║███████║
    ╚════██║██║   ██║╚════██║
         ██║╚██████╔╝     ██║
         ╚═╝ ╚═════╝      ╚═╝
        `,
        `
    ░▄▀█▀█▄░▄█░░░▄▀█▀█▄
    ▀░▀▄▄▄▀▀░▀█▀░▀░▀▄▄▄▀▀
    ░░░░▀▄▄▄▀░░░░░░▀▄▄▄▀░░
        `,
        `
         .-..-. .-.   .-.
        : .; :: :   : :
        :   .: :   : :
        : ; :: :___: :
        :___.':\`.___.;
        `,
        `
    ┌─┐┬ ┬┬┌┬┐  ┌─┐┬ ┬┌┬┐  ┌─┐┌─┐  ┌─┐┌─┐┌┬┐┌─┐
    └─┐├─┤│ │   │ ││ │ │   │ │├┤   ├─┤├┬┘ │ └─┐
    └─┘┴ ┴┴ ┴   └─┘└─┘ ┴   └─┘└    ┴ ┴┴└─ ┴ └─┘
        `
    ];

    const errorMessages = [
        "Page not found in the digital void",
        "This endpoint has been consumed by the machine",
        "Error 404: Reality.exe has stopped working",
        "The raccoons ate this page",
        "Lost in the neon maze of cyberspace",
        "Page deleted by the corporate overlords"
    ];

    const [currentMessage, setCurrentMessage] = useState(0);

    useEffect(() => {
        // Glitch effect for 404 text
        const glitchInterval = setInterval(() => {
            const glitchChars = ['4', '0', '4', '█', '▓', '░', '╣', '║', '╗'];
            const randomGlitch = Array.from({ length: 3 }, () => 
                glitchChars[Math.floor(Math.random() * glitchChars.length)]
            ).join('');
            
            setGlitchText(randomGlitch);
            
            setTimeout(() => setGlitchText('404'), 100);
        }, 3000);

        // Cycle through ASCII art
        const artInterval = setInterval(() => {
            setCurrentArt((prev) => (prev + 1) % asciiArts.length);
        }, 8000);

        // Cycle through error messages
        const messageInterval = setInterval(() => {
            setCurrentMessage((prev) => (prev + 1) % errorMessages.length);
        }, 4000);

        return () => {
            clearInterval(glitchInterval);
            clearInterval(artInterval);
            clearInterval(messageInterval);
        };
    }, []);

    const handleRandomPage = () => {
        const pages = ['/shop', '/collections', '/about', '/contact'];
        const randomPage = pages[Math.floor(Math.random() * pages.length)];
        window.location.href = randomPage;
    };

    return (
        <IonPage className="not-found-page retro-modern">
            <SiteHeader />
            
            <IonContent className="not-found-content">
                <div className="error-container">
                    {/* Animated background grid */}
                    <div className="retro-grid-bg"></div>
                    
                    {/* Main error display */}
                    <div className="error-display">
                        <div className="glitch-text">
                            <span className="error-code" data-text={glitchText}>
                                {glitchText}
                            </span>
                        </div>

                        {/* ASCII Art Display */}
                        <div className="ascii-art">
                            <pre className="ascii-text">
                                {asciiArts[currentArt]}
                            </pre>
                        </div>

                        {/* Error Message */}
                        <div className="error-message">
                            <p className="message-text typewriter">
                                {errorMessages[currentMessage]}
                            </p>
                        </div>

                        {/* Navigation Options */}
                        <div className="error-actions">
                            <IonRouterLink routerLink="/">
                                <IonButton fill="outline" className="cta-button home-btn">
                                    <IonIcon icon={homeOutline} slot="start" />
                                    Return to Base
                                </IonButton>
                            </IonRouterLink>

                            <IonButton 
                                fill="solid" 
                                className="cta-button back-btn"
                                onClick={() => window.history.back()}
                            >
                                <IonIcon icon={arrowBackOutline} slot="start" />
                                Go Back
                            </IonButton>

                            <IonButton 
                                fill="clear" 
                                className="cta-button random-btn"
                                onClick={handleRandomPage}
                            >
                                <IonIcon icon={shuffleOutline} slot="start" />
                                Random Page
                            </IonButton>
                        </div>

                        {/* Terminal-style help text */}
                        <div className="terminal-help">
                            <div className="terminal-line">
                                <span className="prompt">riot@raccoon:~$</span>
                                <span className="command">help</span>
                            </div>
                            <div className="terminal-output">
                                <p>Available commands:</p>
                                <p>• /shop - Browse products</p>
                                <p>• /collections - View collections</p>
                                <p>• /about - Learn more</p>
                                <p>• /contact - Get in touch</p>
                            </div>
                        </div>
                    </div>

                    {/* Floating particles for atmosphere */}
                    <div className="particles">
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div 
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 5}s`,
                                    animationDuration: `${3 + Math.random() * 4}s`
                                }}
                            ></div>
                        ))}
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default NotFound;