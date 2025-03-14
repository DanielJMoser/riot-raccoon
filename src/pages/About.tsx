import React from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/react';
import { logoInstagram, logoTwitter, mailOutline } from 'ionicons/icons';
import SiteHeader from '../components/SiteHeader';
import '../scss/About.scss';

const About: React.FC = () => {
    return (
        <IonPage className="about-page retro-modern">
            <SiteHeader />

            <IonContent fullscreen>
                <div className="about-container">
                    <div className="about-hero">
                        <h1 className="about-title">About Riot Raccoon</h1>
                        <div className="retro-line"></div>
                    </div>

                    <IonGrid>
                        <IonRow>
                            <IonCol size="12" sizeMd="6">
                                <div className="about-content">
                                    <h2>Our Story</h2>
                                    <p>
                                        Riot Raccoon was born from a passion for unique designs and a love for retro aesthetics
                                        with a modern twist. Founded in 2022, we've been creating clothing and accessories that
                                        blend nostalgia with contemporary style.
                                    </p>
                                    <p>
                                        Our team of designers draws inspiration from early computing, synthwave culture,
                                        and the cyberpunk movement to create pieces that stand out while remaining wearable
                                        in everyday life.
                                    </p>

                                    <h2>Our Mission</h2>
                                    <p>
                                        We believe in creating high-quality, ethically produced items that tell a story.
                                        Each piece in our collection is designed to spark conversation and evoke the feeling
                                        of a digital world gone by, reimagined for today.
                                    </p>
                                    <p>
                                        Our commitment to sustainability means we use eco-friendly materials whenever possible
                                        and ensure fair working conditions throughout our supply chain.
                                    </p>

                                    <h2>Connect With Us</h2>
                                    <div className="social-buttons">
                                        <IonButton fill="solid" color="primary">
                                            <IonIcon slot="start" icon={logoInstagram} />
                                            Instagram
                                        </IonButton>
                                        <IonButton fill="solid" color="primary">
                                            <IonIcon slot="start" icon={logoTwitter} />
                                            Twitter
                                        </IonButton>
                                        <IonButton fill="solid" color="primary">
                                            <IonIcon slot="start" icon={mailOutline} />
                                            Contact Us
                                        </IonButton>
                                    </div>
                                </div>
                            </IonCol>

                            <IonCol size="12" sizeMd="6">
                                <div className="about-image-container">
                                    <div className="about-image placeholder-image">
                                        <div className="retro-grid"></div>
                                        <div className="image-caption">Team Riot Raccoon</div>
                                    </div>

                                    <div className="retro-card">
                                        <h3>Our Values</h3>
                                        <ul className="values-list">
                                            <li>
                                                <span className="value-icon">✧</span>
                                                <span className="value-text">
                                                    <strong>Innovation</strong> - Pushing boundaries in design and technology
                                                </span>
                                            </li>
                                            <li>
                                                <span className="value-icon">✧</span>
                                                <span className="value-text">
                                                    <strong>Quality</strong> - Attention to detail in every product
                                                </span>
                                            </li>
                                            <li>
                                                <span className="value-icon">✧</span>
                                                <span className="value-text">
                                                    <strong>Sustainability</strong> - Ethical production and materials
                                                </span>
                                            </li>
                                            <li>
                                                <span className="value-icon">✧</span>
                                                <span className="value-text">
                                                    <strong>Community</strong> - Building connections with our customers
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </IonCol>
                        </IonRow>
                    </IonGrid>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default About;