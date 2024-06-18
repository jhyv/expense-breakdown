import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import './AppLayout.css';
import { closeOutline } from "ionicons/icons";

interface AppLayoutProps {
    title?: string;
    children?: React.ReactNode;
    hasCloseBtn?: boolean;
    onCloseClick?: any;
    classes?: string[];
}
export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, hasCloseBtn, onCloseClick, classes }) => {
    return (
        <IonPage>
            <IonHeader className={`appHeader ${classes?.join(' ')}`}>
                <IonToolbar>
                    <IonTitle>{title}</IonTitle>
                    {
                        hasCloseBtn &&
                        <IonButtons slot="end" >
                            <IonButton onClick={onCloseClick}>
                                <IonIcon icon={closeOutline} />
                            </IonButton>
                        </IonButtons>
                    }
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {children}
            </IonContent>
        </IonPage>
    )
}