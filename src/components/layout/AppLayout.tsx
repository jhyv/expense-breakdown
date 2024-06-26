import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import './AppLayout.css';
import { closeOutline } from "ionicons/icons";

interface CustomButton {
    id?: string;
    icon: any;
    handler: () => any;
}

interface AppLayoutProps {
    title?: string;
    children?: React.ReactNode;
    hasCloseBtn?: boolean;
    onCloseClick?: any;
    classes?: string[];
    customBtns?: CustomButton[]
}
export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, hasCloseBtn, onCloseClick, classes, customBtns }) => {
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
                    {
                        customBtns && customBtns?.length > 0 &&
                        <IonButtons slot="end" >
                            {
                                customBtns.map((btn, index) => (
                                    <IonButton onClick={btn.handler} key={`customBtn${index}`}>
                                        <IonIcon icon={btn.icon} />
                                    </IonButton>
                                ))
                            }
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