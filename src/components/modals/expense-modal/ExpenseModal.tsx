import { IonButton, IonCheckbox, IonCol, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, useIonViewDidEnter } from '@ionic/react';
import './ExpenseModal.css';
import { AppLayout } from '../../layout/AppLayout';
import { useEffect, useState } from 'react';
import { CommonModal, Expense, Person } from '../../../models';
import usePersonStore from '../../../store/person/person.store';

interface ExpenseModalProps extends CommonModal {
    isEdit?: boolean;
    payers?: Person[];
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ state, setState, isEdit }) => {
    const personList = usePersonStore((state) => state.personList);

    const [form, setForm] = useState<Expense>({
        title: '',
        type: '',
        amount: 0,
        contributors: personList,
        payer_id: 'all',
        transaction_id: ''
    });

    const onInputChange = (e: any, input: string) => {
        if (input === 'payer_id') {
            if (e.target.value !== 'all') {
                setForm((oldVal) => ({
                    ...oldVal,
                    [input]: e.target.value,
                    contributors: oldVal.contributors.filter((item) => item.id !== e.target.value)
                }));
            } else {
                setForm((oldVal) => ({
                    ...oldVal,
                    [input]: e.target.value,
                    contributors: personList
                }));
            }

        } else {
            setForm((oldVal) => ({ ...oldVal, [input]: e.target.value }));
        }
    }

    const onContributorClick = (item: Person) => {
        const personIndex = form?.contributors?.findIndex((i: Person) => i.id === item.id);
        if (personIndex !== undefined && personIndex >= 0) {
            setForm((oldVal) => ({
                ...oldVal,
                contributors: oldVal.contributors.filter((i, index) => index !== personIndex)
            }));
        } else {
            setForm((oldVal) => ({
                ...oldVal,
                contributors: [...oldVal.contributors, item]
            }));
        }
    }

    const onFormSubmit = (e: any) => {
        e.preventDefault();
    }

    useIonViewDidEnter(() => {
        console.log('Person Modal did enter');
        if (state) {
            setForm({
                title: '',
                type: '',
                amount: 0,
                contributors: [],
                payer_id: 'all',
                transaction_id: ''
            });
        }
    });

    useEffect(() => {
        console.log('form', form);
    }, [form]);

    return (
        <IonModal isOpen={state}>
            <AppLayout
                classes={['no-border']}
                hasCloseBtn
                title={isEdit ? 'Edit Expense' : 'Add Expense'}
                onCloseClick={() => setState(false)}>
                <form onSubmit={onFormSubmit}>
                    <div className='form-container'>
                        <IonItem>
                            <IonLabel position='floating'>Title</IonLabel>
                            <IonInput type='text' value={form.title} onIonInput={(e) => onInputChange(e, 'title')} required />
                        </IonItem>

                        <IonItem>
                            <IonLabel position='floating'>Amount</IonLabel>
                            <IonInput type='number' value={form.amount} onIonInput={(e) => onInputChange(e, 'amount')} required />
                        </IonItem>

                        <IonItem>
                            <IonLabel position='floating'>Payed by</IonLabel>
                            <IonSelect onIonChange={(e) => onInputChange(e, 'payer_id')} value={form.payer_id}>
                                <IonSelectOption value={'all'}>
                                    All
                                </IonSelectOption>
                                {
                                    personList.length > 0 && personList.map((person, index) => (
                                        <IonSelectOption key={`payedBySelectOption${index}`} value={person.id}>
                                            {person.name}
                                        </IonSelectOption>
                                    ))
                                }
                            </IonSelect>
                        </IonItem>
                        <hr />
                        <IonLabel>Contributors</IonLabel>
                        <IonList>
                            {
                                personList.length > 0 && personList.map((person, index) => (
                                    <IonItem key={`personContributorItem${index}`}>
                                        <IonCheckbox
                                            disabled={form.payer_id === person.id}
                                            checked={!!form.contributors.find((item) => item.id == person.id) || form.payer_id === 'all'}
                                            onIonChange={(e) => onContributorClick(person)}>
                                            {person.name}
                                        </IonCheckbox>
                                    </IonItem>
                                ))
                            }
                        </IonList>

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