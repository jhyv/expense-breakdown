import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar, useIonRouter } from "@ionic/react"
import './AppLayout.css';
import { chevronBack, closeOutline } from "ionicons/icons";

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
    customBtns?: CustomButton[];
    basePage?: boolean;
}
export const AppLayout: React.FC<AppLayoutProps> = ({ children, title, hasCloseBtn, onCloseClick, classes, customBtns, basePage }) => {
    const router = useIonRouter();

    const onBackBtnClick = () => {
        router.goBack();
    }

    return (
        <IonPage>
            <IonHeader className={`appHeader ${classes?.join(' ')}`}>
                <IonToolbar>
                    {
                        !basePage && router.canGoBack() &&
                        <IonButtons slot="start" >
                            <IonButton onClick={onBackBtnClick}>
                                <IonIcon icon={chevronBack} />
                            </IonButton>
                        </IonButtons>
                    }
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