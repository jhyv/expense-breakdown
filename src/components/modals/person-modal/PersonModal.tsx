import { IonButton, IonCol, IonInput, IonItem, IonLabel, IonModal, IonRow, IonSelect, IonSelectOption } from '@ionic/react';
import './PersonModal.css';
import { CommonModalProps, Person } from '../../../models';
import { AppLayout } from '../..';
import { useEffect, useState } from 'react';
import usePersonStore from '../../../store/person/person.store';

interface PersonModalProps extends CommonModalProps { 
    currentPerson: Person | null;
    resetPerson: () => any;
}

export const PersonModal: React.FC<PersonModalProps> = ({
    state,
    setState,
    currentPerson,
    resetPerson
}) => {
    const btnOptions = [

    ];
    const [form, setForm] = useState<Person>({
        name: '',
        gender: 'M'
    });
    const [isEdit, setIsEdit] = useState(false);
    const {savePerson, updatePerson} = usePersonStore((state) => ({savePerson:state.savePerson, updatePerson: state.updatePerson}));

    const onSubmit = (e: any) => {
        e.preventDefault();
        if (!isEdit) {
            savePerson(form);
            setState(false);
        } else {
            updatePerson(form, currentPerson?.id);
            setState(false);
        }
    }

    const onInputChange = (e: any, input: string) => {
        setForm((oldVal) => ({ ...oldVal, [input]: e.target.value }));
    }

    const onModalDidOpen = () => {
        if(currentPerson) {
            setForm(currentPerson);
            setIsEdit(true);
        }

    }

    const onModalDidClose = () => {
        setIsEdit(false);
        resetPerson();
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
        <IonModal isOpen={state} onIonModalDidDismiss={onModalDidClose} onIonModalDidPresent={onModalDidOpen}>
            <AppLayout
                basePage
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