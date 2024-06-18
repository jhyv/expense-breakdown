import { IonButton, IonCol, IonInput, IonItem, IonLabel, IonModal, IonRow } from '@ionic/react';
import './PersonModal.css';
import { CommonModal, Person } from '../../../models';
import { AppLayout } from '../..';
import { useEffect, useState } from 'react';
import { PersonStorage } from '../../../storage';

interface PersonModalProps extends CommonModal { }

export const PersonModal: React.FC<PersonModalProps> = ({
    state,
    setState,
    isEdit
}) => {

    const [form, setForm] = useState<Person>({
        name: '',
    });

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (!isEdit) {
            //save person
            if (form.name !== '') {
                (new PersonStorage).save(form);
                setState(false);
            }
        }
    }

    const onInputChange = (e: any, input: string) => {
        setForm((oldVal) => ({ ...oldVal, [input]: e.target.value }));
    }

    useEffect(() => {
        console.log('PersonModal form', form);
    }, [form])

    return (
        <IonModal isOpen={state}>
            <AppLayout
                classes={['no-border']}
                hasCloseBtn
                title={isEdit ? 'Edit Person' : 'Add Person'}
                onCloseClick={() => setState(false)}>
                <form action="" onSubmit={onSubmit}>
                    <div className='form-container'>
                        <IonItem>
                            <IonLabel position='floating'>Name</IonLabel>
                            <IonInput type='text' onIonChange={(e) => onInputChange(e, 'name')} value={form.name} />
                        </IonItem>

                        <IonRow className='ion-justify-content-end'>
                            <IonCol size='5'>
                                <IonButton type='submit' expand='block' disabled={form.name === ''}>
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