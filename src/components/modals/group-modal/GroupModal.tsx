import { IonButton, IonCol, IonInput, IonItem, IonLabel, IonModal, IonRow } from '@ionic/react';
import { CommonModalProps } from '../../../models';
import './GroupModal.css';
import { AppLayout } from '../../layout/AppLayout';
import { useState } from 'react';

interface GroupModalProps extends CommonModalProps {

}

export const GroupModal: React.FC<GroupModalProps> = ({
    state,
    isEdit,
    setState
}) => {

    const [form, setForm] = useState({
        title: '',
    });

    const onInputChange = (e: any, input: string) => {
        setForm((oldVal) => ({
            ...oldVal,
            [input]: e.target.result
        }));
    }
    const onClose = () => {
        setState(false);
    }

    const onFormSubmit = () => {

    }

    return (
        <IonModal isOpen={state}>
            <AppLayout
                classes={['no-border']}
                hasCloseBtn
                title={isEdit ? 'Edit Breakdown' : 'Add Breakdown'}
                onCloseClick={onClose}>
                <form onSubmit={onFormSubmit}>
                    <div className='form-container'>
                        <IonItem>
                            <IonLabel position='floating'>Title</IonLabel>
                            <IonInput type='text' value={form.title} onIonInput={(e) => onInputChange(e, 'title')} required />
                        </IonItem>

                        <IonRow className='ion-justify-content-end'>
                            <IonCol size='5'>
                                <IonButton type='submit' expand='block'>
                                    Submit
                                </IonButton>
                            </IonCol>
                        </IonRow>
                    </div>
                </form>
            </AppLayout>
        </IonModal>
    );
}