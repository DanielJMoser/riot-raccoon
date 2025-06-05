import { Component, ErrorInfo, ReactNode } from 'react';
import { IonContent, IonButton, IonIcon, IonText } from '@ionic/react';
import { refreshOutline, bugOutline } from 'ionicons/icons';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
    
    // In production, you would send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <IonContent className="ion-padding">
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '50vh',
            textAlign: 'center',
            gap: '1rem'
          }}>
            <IonIcon 
              icon={bugOutline} 
              style={{ fontSize: '4rem', color: 'var(--ion-color-danger)' }}
            />
            
            <h2>Oops! Something went wrong</h2>
            
            <IonText color="medium">
              <p>We encountered an unexpected error. Please try reloading the page.</p>
            </IonText>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                marginTop: '1rem', 
                textAlign: 'left', 
                maxWidth: '100%',
                backgroundColor: 'var(--ion-color-light)',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                  Error Details (Development Mode)
                </summary>
                <pre style={{ 
                  whiteSpace: 'pre-wrap', 
                  fontSize: '12px', 
                  marginTop: '0.5rem',
                  overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {this.state.error.message}
                  {this.state.error.stack && `\n\nStack trace:\n${this.state.error.stack}`}
                  {this.state.errorInfo && `\n\nComponent stack:\n${this.state.errorInfo.componentStack}`}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <IonButton onClick={this.handleReset} fill="outline" color="primary">
                Try Again
              </IonButton>
              
              <IonButton onClick={this.handleReload} color="primary">
                <IonIcon icon={refreshOutline} slot="start" />
                Reload Page
              </IonButton>
            </div>
          </div>
        </IonContent>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;