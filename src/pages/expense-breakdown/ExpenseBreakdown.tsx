import { IonAvatar, IonIcon, IonChip, IonLabel, useIonRouter, useIonActionSheet, useIonAlert } from "@ionic/react";
import './ExpenseBreakdown.css';
import { AppLayout, ExpenseItem, ExpenseModal, PersonModal, SummaryContribution } from "../../components";
import { useEffect, useState } from "react";
import { addOutline, closeOutline, createOutline, trashBinOutline } from 'ionicons/icons'
import usePersonStore from "../../store/person/person.store";
import defaultImg from "../../assets/img/default.png";
import newImg from "../../assets/img/new.png";
import altImg from "../../assets/img/woman.png";
import useExpenseStore from "../../store/expense/expense.store";
import { Expense, Group, Person } from "../../models";
import useGroupStore from "../../store/group/group.store";

interface ExpenseBreakdownProps { }
export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = () => {
    const btnActions = [
        {
            icon: addOutline,
            handler: () => {
                onAddExpenseClick();
            }
        }
    ]
    const [expenseModal, setExpenseModal] = useState(false);
    const [expense, setExpense] = useState<Expense | null>(null);
    const [personModal, setPersonModal] = useState(false);
    const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
    const personList = usePersonStore((state) => state.personList);
    const removePerson = usePersonStore((state) => state.removePerson);
    const getExpenses = useExpenseStore((state) => state.getExpenses);
    const expenses = useExpenseStore((state) => state.expenseList);
    const currentGroup: Group | null = useGroupStore((state) => state.current);
    const router = useIonRouter();
    console.log('routeInfo', router.routeInfo);
    const [presentActionSheet] = useIonActionSheet();
    const [presentAlert] = useIonAlert();

    if (currentGroup === null) {
        if (router.canGoBack()) {
            router.goBack();
        } else {

        }
    }

    const expenseList = getExpenses(currentGroup!);

    const onAddExpenseClick = () => {
        setExpense(null);
        setExpenseModal(true);
    }

    const onAddPersonClick = () => {
        setPersonModal(true);
    }

    const onEditClick = (expense: Expense) => {
        setExpense((oldState) => {
            onAddExpenseClick();
            return expense;
        });
    }

    const confirmDeletePerson = (person: Person) => {
        presentAlert({
            header: 'System',
            message: `Are you sure you want to delete ${person.name}?`,
            buttons: [
                {
                    text: 'Confirm',
                    handler: () => {
                        removePerson(person);
                    }
                },
                {
                    text: 'Cancel',
                    role: 'cancel'
                }
            ]
        })
    }

    const onPersonClick = (person: Person) => {
        presentActionSheet({
            header: 'Action',
            buttons: [
                {
                    text: 'Edit',
                    icon: createOutline,
                    handler: () => {
                        setCurrentPerson(person);
                        setPersonModal(true);
                    }
                },
                {
                    text: 'Delete',
                    icon: trashBinOutline,
                    handler: () => {
                        confirmDeletePerson(person);
                    }
                },
                {
                    text: 'Close',
                    icon: closeOutline,
                    role: 'cancel'
                }
            ]
        })
    }

    useEffect(() => {
        console.log('personList', personList);
        console.log('expenseList', expenseList);
        console.log('expenses', expenses);
    }, [personList, expenseList, expenses]);

    const onExpenseModalClose = () => {
        setExpense(null);
    }

    return (
        <AppLayout title={currentGroup?.title} customBtns={btnActions}>
            <div className="page-body">
                <div className="person-list">
                    {
                        personList.map((person, index: number) => (
                            <IonChip className="person-item" key={`personItem${index}-${person.id}`} onClick={() => onPersonClick(person)}>
                                <IonAvatar>
                                    <img src={person.gender === 'M' ? defaultImg : altImg} alt='defaultImg' />
                                </IonAvatar>
                                <IonLabel>{person.name}</IonLabel>
                            </IonChip>
                        ))
                    }
                    <IonChip className="person-item add-btn" onClick={onAddPersonClick}>
                        <IonAvatar>
                            <img src={newImg} alt='newImg' />
                        </IonAvatar>
                        <IonLabel>
                            <IonIcon slot="start" icon={addOutline} />
                        </IonLabel>
                    </IonChip>
                </div>
                {
                    expenseList.length > 0 &&
                    <>
                        <h3>Summary</h3>
                        <div className="summary-list">
                            <SummaryContribution list={expenseList} />
                        </div>
                    </>
                }
                <h3>Expense Breakdown</h3>
                <div className="expense-list">
                    {
                        expenseList.map((expense: Expense, index: number) => (
                            <ExpenseItem onEditClick={onEditClick} expense={expense} key={`expenseItem${index}${expense.id}`} />
                        ))
                    }
                </div>
            </div>
            <ExpenseModal onModalClose={onExpenseModalClose} expense={expense} state={expenseModal} setState={setExpenseModal} />
            <PersonModal state={personModal} setState={setPersonModal} currentPerson={currentPerson} resetPerson={() => setCurrentPerson(null)} />
        </AppLayout>
    );
}