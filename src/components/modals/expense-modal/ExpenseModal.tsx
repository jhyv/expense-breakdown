import { IonButton, IonCheckbox, IonCol, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSelect, IonSelectOption, IonToggle, useIonToast, useIonViewDidEnter, useIonViewDidLeave, useIonViewWillLeave } from '@ionic/react';
import './ExpenseModal.css';
import { AppLayout } from '../../layout/AppLayout';
import { useEffect, useState } from 'react';
import { CommonModalProps, Expense, Person } from '../../../models';
import usePersonStore from '../../../store/person/person.store';
import useExpenseStore from '../../../store/expense/expense.store';
import useGroupStore from '../../../store/group/group.store';

interface ExpenseModalProps extends CommonModalProps {
    expense?: Expense | null;
    payers?: Person[];
    onModalClose: () => any;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ state, setState, expense, onModalClose }) => {
    const personList = usePersonStore((state) => state.personList);
    const addExpense = useExpenseStore((state) => state.addExpense);
    const updateExpense = useExpenseStore((state) => state.updateExpense);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [present] = useIonToast();

    const presentToast = (message: string, color: string = 'primary', position: 'top' | 'middle' | 'bottom' = 'top') => {
        present({
            message: message,
            duration: 1500,
            color,
            position: position,
        });
    };

    const [form, setForm] = useState<Expense>({
        title: '',
        type: '',
        amount: 0,
        contributors: personList,
        payer_id: 'all',
        transaction_id: '',
        excludePayer: false,
    });

    const currentGroup = useGroupStore((state) => state.current);

    const onInputChange = (e: any, input: string) => {
        console.log('[onInputChange] e', e);
        if (input === 'payer_id') {
            if (e.target.value !== 'all') {
                setForm((oldVal) => ({
                    ...oldVal,
                    [input]: e.target.value,
                    contributors: []
                }));
            } else {
                setForm((oldVal) => ({
                    ...oldVal,
                    [input]: e.target.value,
                    contributors: personList
                }));
            }

        } else if (input === 'excludePayer') {
            setForm((oldVal) => ({ ...oldVal, [input]: e.detail.checked }));

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
        if (isEdit) {
            if (form.payer_id !== 'all') {
                const payer: Person | undefined = personList.find((item) => item.id === form.payer_id);
                if (payer !== undefined) {
                    const newExpense: Expense = { ...form, payer };
                    updateExpense(newExpense, expense?.id);
                    console.log('[onFormSubmit] submitted', expense);
                }
            } else {
                const newExpense: Expense = { ...form, contributors: personList };
                updateExpense(newExpense, expense?.id);
                console.log('[onFormSubmit] submitted', expense);
            }

            presentToast(`Expense was updated successfully!`);
        } else {

            if (form.payer_id !== 'all') {
                const payer: Person | undefined = personList.find((item) => item.id === form.payer_id);
                if (payer !== undefined) {
                    const expense: Expense = { ...form, payer, transaction_id: currentGroup?.id };

                    addExpense(expense);
                    console.log('[onFormSubmit] submitted', expense);
                }
            } else {
                const expense: Expense = { ...form, contributors: personList, transaction_id: currentGroup?.id };
                addExpense(expense);
                console.log('[onFormSubmit] submitted', expense);
            }

            presentToast(`Expense was saved successfully!`);
        }

        setState(false);
    }

    useIonViewDidEnter(() => {
        console.log('Person Modal did enter', state);
        console.log('[useIonViewDidEnter] form', form);
        console.log('[useIonViewDidEnter] expense', expense);
    });

    useEffect(() => {
        console.log('[useEffect] expense', expense);
        if (expense) {
            setForm(expense);
            setIsEdit(true);
        } else {
            resetForm();
        }
    }, [expense]);

    useIonViewWillLeave(() => {
        resetForm();
    });

    const resetForm = () => {
        setForm((oldState) => {

            setIsEdit(false);
            return {
                title: '',
                type: '',
                amount: 0,
                contributors: personList,
                payer_id: 'all',
                transaction_id: '',
                excludePayer: false,
            };
        });
    }

    const onCloseClick = () => {
        setState(false);
        onModalClose();
    }

    useEffect(() => {
        console.log('form', form);
    }, [form]);

    useEffect(() => {
        if (state) {
            if (expense) {
                setForm(expense);
                setIsEdit(true);
            } else {
                resetForm();
            }
        }
    }, [state]);
    return (
        <IonModal isOpen={state}>
            <AppLayout
                basePage
                classes={['no-border']}
                hasCloseBtn
                title={isEdit ? 'Edit Expense' : 'Add Expense'}
                onCloseClick={onCloseClick}>
                <form onSubmit={onFormSubmit}>
                    <div className='form-container'>
                        <IonItem>
                            <IonLabel position='floating'>Title</IonLabel>
                            <IonInput type='text' value={form.title} onIonInput={(e) => onInputChange(e, 'title')} required />
                        </IonItem>

                        <IonItem>
                            <IonLabel position='floating'>Amount</IonLabel>
                            <IonInput step="0.01" type='number' value={form.amount} onIonInput={(e) => onInputChange(e, 'amount')} clearOnEdit={true}
                            />
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
                        {
                            form.payer_id !== 'all' &&
                            <IonItem>
                                <IonToggle
                                    checked={form.excludePayer}
                                    onIonChange={(e) => onInputChange(e, 'excludePayer')}
                                    labelPlacement='end'>
                                    Exclude <b>payer</b> from contribution
                                </IonToggle>
                            </IonItem>
                        }
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
                                {
                                    isEdit ?
                                        <IonButton type='submit' expand='block'>
                                            Save
                                        </IonButton> :
                                        <IonButton type='submit' expand='block'>
                                            Submit
                                        </IonButton>
                                }
                            </IonCol>
                        </IonRow>
                    </div>
                </form>
            </AppLayout>
        </IonModal>
    );
}