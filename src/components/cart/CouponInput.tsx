// src/components/cart/CouponInput.tsx
import React, { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonIcon, IonChip } from '@ionic/react';
import { checkmarkCircleOutline, closeCircleOutline, pricetag } from 'ionicons/icons';
import { CouponService } from '../../services/couponService';
import './CouponInput.scss';

interface CouponInputProps {
    subtotal: number;
    shippingCost: number;
    onCouponApply: (code: string, discount: number) => void;
    onCouponRemove: () => void;
    appliedCoupon?: string | undefined;
}

const CouponInput: React.FC<CouponInputProps> = ({
    subtotal,
    shippingCost,
    onCouponApply,
    onCouponRemove,
    appliedCoupon
}) => {
    const [couponCode, setCouponCode] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const availableCoupons = CouponService.getAvailableCoupons();

    const handleApplyCoupon = () => {
        const result = CouponService.validateCoupon(couponCode, subtotal, shippingCost);
        
        setValidationMessage(result.message);
        setIsValid(result.isValid);
        
        if (result.isValid && result.discount !== undefined) {
            onCouponApply(couponCode.toUpperCase(), result.discount);
            setShowSuggestions(false);
        }
    };

    const handleRemoveCoupon = () => {
        setCouponCode('');
        setValidationMessage('');
        setIsValid(null);
        onCouponRemove();
    };

    const handleSuggestionClick = (code: string) => {
        setCouponCode(code);
        setShowSuggestions(false);
        setValidationMessage('');
        setIsValid(null);
    };

    if (appliedCoupon) {
        return (
            <div className="coupon-input-container applied">
                <div className="applied-coupon">
                    <IonIcon icon={checkmarkCircleOutline} className="success-icon" />
                    <span className="coupon-code">{appliedCoupon}</span>
                    <IonButton
                        fill="clear"
                        size="small"
                        onClick={handleRemoveCoupon}
                        className="remove-button"
                    >
                        <IonIcon icon={closeCircleOutline} />
                    </IonButton>
                </div>
                <p className="success-message">{validationMessage}</p>
            </div>
        );
    }

    return (
        <div className="coupon-input-container">
            <div className="coupon-header">
                <IonIcon icon={pricetag} className="coupon-icon" />
                <IonLabel>Have a coupon code?</IonLabel>
            </div>
            
            <div className="coupon-form">
                <IonItem className={`coupon-field ${isValid === false ? 'error' : ''} ${isValid === true ? 'success' : ''}`}>
                    <IonInput
                        value={couponCode}
                        onIonChange={e => {
                            setCouponCode(e.detail.value!);
                            setValidationMessage('');
                            setIsValid(null);
                        }}
                        onIonFocus={() => setShowSuggestions(true)}
                        placeholder="Enter code"
                        className="coupon-input"
                    />
                </IonItem>
                
                <IonButton
                    onClick={handleApplyCoupon}
                    className="apply-button"
                    disabled={!couponCode.trim()}
                >
                    Apply
                </IonButton>
            </div>

            {validationMessage && (
                <p className={`validation-message ${isValid ? 'success' : 'error'}`}>
                    {validationMessage}
                </p>
            )}

            {showSuggestions && !appliedCoupon && (
                <div className="coupon-suggestions">
                    <p className="suggestions-label">Available codes:</p>
                    <div className="suggestions-list">
                        {availableCoupons.map(code => (
                            <IonChip
                                key={code}
                                onClick={() => handleSuggestionClick(code)}
                                className="suggestion-chip"
                            >
                                {code}
                            </IonChip>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponInput;