// src/pages/PfandGehoertDaneben.tsx
import React, { useState, useEffect } from 'react';
import {
    IonContent,
    IonPage,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle
} from '@ionic/react';
import {
    leafOutline,
    peopleOutline,
    cashOutline,
    arrowForwardOutline,
    trashBinOutline,
    earthOutline,
    informationCircleOutline
} from 'ionicons/icons';
import SiteHeader from '../components/SiteHeader';
import '../scss/PfandGehoertDaneben.scss';

/**
 * This page explains the idea behind the campaign "Pfand gehört daneben" ("Deposit belongs beside the bin")
 * for the Austrian market (deposit starts 2025) and provides quick facts and sources.
 * Texts were translated to English, trimmed for readability on all screen sizes and updated with
 * recent data from trusted newspapers (see sources section).
 *
 * Style‑wise we keep the existing retro‑modern look and the flipping‑card interaction,
 * so *no visual layout is changed*, but all wording is now English‑only.
 */

const PfandGehoertDaneben: React.FC = () => {
    const [flippedCards, setFlippedCards] = useState<{ [key: string]: boolean }>({
        card1: false,
        card2: false,
        card3: false
    });

    const toggleCard = (cardId: string) => {
        setFlippedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
    };

    // Set up source reference link handlers
    useEffect(() => {
        const handleSourceClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (target && target.classList.contains('source-link')) {
                event.preventDefault();
                const refId = target.id;
                const sourceNumber = refId.replace('ref', '');
                const sourceElement = document.getElementById(`source${sourceNumber}`);

                if (sourceElement) {
                    // Scroll to the source
                    sourceElement.scrollIntoView({ behavior: 'smooth' });

                    // Highlight the source temporarily
                    sourceElement.classList.add('highlight-source');
                    setTimeout(() => {
                        sourceElement.classList.remove('highlight-source');
                    }, 2000);
                }
            }
        };

        // Add click event listener to the document
        document.addEventListener('click', handleSourceClick);

        // Clean up the event listener when component unmounts
        return () => {
            document.removeEventListener('click', handleSourceClick);
        };
    }, []);

    return (
        <IonPage className="pfand-page retro-modern">
            <SiteHeader />

            <IonContent fullscreen>
                <div className="pfand-container">
                    {/* HERO */}
                    <div className="pfand-hero">
                        <h1 className="pfand-title">Pfand gehört daneben!</h1>
                        <div className="retro-line"></div>
                        <p className="pfand-subtitle">
                            A small act with a big impact – for people and the planet
                        </p>
                    </div>

                    <IonGrid>
                        {/* STORY SECTION */}
                        <IonRow className="pfand-story-section">
                            <IonCol size="12" sizeMd="6">
                                <div className="impact-section">
                                    <h2>
                                        <IonIcon icon={peopleOutline} />
                                        Social context
                                    </h2>
                                    <p>
                                        Picking up deposit bottles is a legal side hustle for a
                                        surprisingly broad crowd – from students to retirees. Leaving
                                        empties next to (not in) the bin makes collection easier and
                                        keeps everyone's hands clean.
                                    </p>
                                </div>

                                <div className="impact-section">
                                    <h2>
                                        <IonIcon icon={leafOutline} />
                                        Why it matters in Austria
                                    </h2>
                                    <p>
                                        Austria introduces a €0.25 deposit on single‑use plastic bottles
                                        and cans on 1 January 2025.<a href="#source1" className="source-link" id="ref1">[1]</a> Because the
                                        system is brand‑new, real‑world data are still scarce – so we look
                                        to two decades of German experience for guidance.
                                    </p>
                                </div>
                            </IonCol>

                            <IonCol size="12" sizeMd="6">
                                <div className="pfand-image-container">
                                    <div className="pfand-image placeholder-image">
                                        <div className="retro-grid" />
                                        <div className="image-caption">
                                            Deposit bottles placed neatly beside a public bin
                                        </div>
                                    </div>

                                    <IonCard className="retro-card">
                                        <IonCardHeader>
                                            <IonCardTitle>
                                                <IonIcon icon={trashBinOutline} className="card-icon" />
                                                Environmental impact
                                            </IonCardTitle>
                                        </IonCardHeader>
                                        <IonCardContent>
                                            <ul className="impact-list">
                                                <li>
                                                    <span className="impact-icon">✧</span>
                                                    <span className="impact-text">
                                                        <strong>Resource loop:</strong> valuable materials stay in
                                                        circulation instead of ending up as litter.<a href="#source2" className="source-link" id="ref2">[2]</a>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="impact-icon">✧</span>
                                                    <span className="impact-text">
                                                        <strong>High return rate:</strong> Germany sends back
                                                        ~99 % of all deposit containers – that is the benchmark
                                                        Austria aims for.<a href="#source2" className="source-link" id="ref3">[2]</a>
                                                    </span>
                                                </li>
                                                <li>
                                                    <span className="impact-icon">✧</span>
                                                    <span className="impact-text">
                                                        <strong>Less street waste:</strong> a visible deposit value
                                                        makes bottles too valuable to throw away.<a href="#source2" className="source-link" id="ref4">[2]</a>
                                                    </span>
                                                </li>
                                            </ul>
                                        </IonCardContent>
                                    </IonCard>
                                </div>
                            </IonCol>
                        </IonRow>

                        {/* FACT CARDS */}
                        <IonRow className="pfand-facts-section">
                            <IonCol size="12">
                                <h2>
                                    <IonIcon icon={earthOutline} />
                                    Did you know?
                                </h2>
                                <p className="facts-hint">Tap the cards for details</p>
                            </IonCol>

                            {/* CARD 1 */}
                            <IonCol size="12" sizeMd="4">
                                <div
                                    className={`flip-card ${flippedCards.card1 ? 'flipped' : ''}`}
                                    onClick={() => toggleCard('card1')}
                                >
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <div className="fact-card front-card">
                                                <div className="fact-icon-container">
                                                    <IonIcon icon={cashOutline} className="fact-icon" />
                                                </div>
                                                <h3>Deposit value</h3>
                                                <div className="flip-hint">
                                                    <IonIcon icon={informationCircleOutline} />
                                                    <span>Tap for info</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flip-card-back">
                                            <div className="fact-card back-card">
                                                <p>
                                                    From 2025 every eligible bottle or can in Austria carries
                                                    a €0.25 deposit.<a href="#source1" className="source-link" id="ref5">[1]</a>
                                                </p>
                                                <div className="flip-hint">
                                                    <span>Back</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </IonCol>

                            {/* CARD 2 */}
                            <IonCol size="12" sizeMd="4">
                                <div
                                    className={`flip-card ${flippedCards.card2 ? 'flipped' : ''}`}
                                    onClick={() => toggleCard('card2')}
                                >
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <div className="fact-card front-card">
                                                <div className="fact-icon-container">
                                                    <IonIcon icon={trashBinOutline} className="fact-icon" />
                                                </div>
                                                <h3>Return rate</h3>
                                                <div className="flip-hint">
                                                    <IonIcon icon={informationCircleOutline} />
                                                    <span>Tap for info</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flip-card-back">
                                            <div className="fact-card back-card">
                                                <p>
                                                    Germany's system achieves a market‑leading
                                                    98‑99 % return rate.<a href="#source2" className="source-link" id="ref6">[2]</a>
                                                </p>
                                                <div className="flip-hint">
                                                    <span>Back</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </IonCol>

                            {/* CARD 3 */}
                            <IonCol size="12" sizeMd="4">
                                <div
                                    className={`flip-card ${flippedCards.card3 ? 'flipped' : ''}`}
                                    onClick={() => toggleCard('card3')}
                                >
                                    <div className="flip-card-inner">
                                        <div className="flip-card-front">
                                            <div className="fact-card front-card">
                                                <div className="fact-icon-container">
                                                    <IonIcon icon={peopleOutline} className="fact-icon" />
                                                </div>
                                                <h3>Income boost</h3>
                                                <div className="flip-hint">
                                                    <IonIcon icon={informationCircleOutline} />
                                                    <span>Tap for info</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flip-card-back">
                                            <div className="fact-card back-card">
                                                <p>
                                                    Roughly 1 million people in Germany pick up bottles at least
                                                    weekly – usually earning a few euros per day.<a href="#source2" className="source-link" id="ref7">[2]</a>
                                                </p>
                                                <div className="flip-hint">
                                                    <span>Back</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </IonCol>
                        </IonRow>

                        {/* CALL‑TO‑ACTION */}
                        <IonRow className="pfand-cta-section">
                            <IonCol size="12" className="text-center">
                                <div className="cta-content">
                                    <h2>Every bottle counts!</h2>
                                    <p>
                                        One simple habit helps the environment <em>and</em> the community.
                                    </p>
                                    <IonButton
                                        className="learn-more-btn"
                                        fill="solid"
                                        shape="round"
                                        href="https://www.pfand-gehoert-daneben.at"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Learn more
                                        <IonIcon slot="end" icon={arrowForwardOutline} />
                                    </IonButton>
                                </div>
                            </IonCol>
                        </IonRow>

                        {/* SOURCES */}
                        <IonRow className="pfand-sources-section">
                            <IonCol size="12">
                                <h4>Sources</h4>
                                <ol className="sources-list">
                                    <li id="source1">
                                        <a href="https://www.sueddeutsche.de/wirtschaft/oesterreich-pfand-plastikflaschen-dosen-1.5963505" target="_blank" rel="noopener noreferrer">
                                            Süddeutsche Zeitung, 25 Sept 2023: "Österreich: Ab 2025 Pfand
                                            auf Plastikflaschen und Alu‑Dosen".
                                        </a>
                                    </li>
                                    <li id="source2">
                                        <a href="https://taz.de/20-Jahre-Einwegpfand/!5905272/" target="_blank" rel="noopener noreferrer">
                                            Shoko Bethke: "20 Jahre Einwegpfand: Von Menschen und Dosen." taz,
                                            3 Jan 2023.
                                        </a>
                                    </li>
                                </ol>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default PfandGehoertDaneben;