import { IonButton, IonCol, IonInput, IonItem, IonLabel, IonModal, IonRow, IonSelect, IonSelectOption } from '@ionic/react';
import './PersonModal.css';
import { CommonModalProps, Person } from '../../../models';
import { AppLayout } from '../..';
import { useEffect, useState } from 'react';
import usePersonStore from '../../../store/person/person.store';

interface PersonModalProps extends CommonModalProps { }

export const PersonModal: React.FC<PersonModalProps> = ({
    state,
    setState,
    isEdit
}) => {

    const [form, setForm] = useState<Person>({
        name: '',
        gender: 'M'
    });
    const savePerson = usePersonStore((state) => state.savePerson);

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (!isEdit) {
            savePerson(form);
            setState(false);
        }
    }

    const onInputChange = (e: any, input: string) => {
        setForm((oldVal) => ({ ...oldVal, [input]: e.target.value }));
    }

    useEffect(() => {
        if (state) {
            setForm({
                name: '',
                gender: 'M'
            })
        }
    }, [state])

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
                            <IonInput type='text' onIonInput={(e) => onInputChange(e, 'name')} value={form.name} required />
                        </IonItem>
                        <IonItem>
                            <IonLabel position='floating'>Gender</IonLabel>
                            <IonSelect onIonChange={(e) => onInputChange(e, 'gender')} value={form.gender} aria-required >
                                <IonSelectOption value={'M'}>Male</IonSelectOption>
                                <IonSelectOption value={'F'}>Female</IonSelectOption>
                            </IonSelect>
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