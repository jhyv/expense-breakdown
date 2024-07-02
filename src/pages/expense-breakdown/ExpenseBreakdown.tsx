import { IonAvatar, IonButton, IonIcon, IonChip, IonLabel, useIonRouter } from "@ionic/react";
import './ExpenseBreakdown.css';
import { AppLayout, ExpenseItem, ExpenseModal, PersonModal, SummaryContribution } from "../../components";
import { useEffect, useState } from "react";
import { addOutline } from 'ionicons/icons'
import usePersonStore from "../../store/person/person.store";
import defaultImg from "../../assets/img/default.png";
import altImg from "../../assets/img/woman.png";
import useExpenseStore from "../../store/expense/expense.store";
import { Expense, Group } from "../../models";
import useGroupStore from "../../store/group/group.store";

interface ExpenseBreakdownProps { }
export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = () => {
    const [expenseModal, setExpenseModal] = useState(false);
    const [expense, setExpense] = useState<Expense | null>(null);
    const [personModal, setPersonModal] = useState(false);
    const personList = usePersonStore((state) => state.personList);
    const getExpenses = useExpenseStore((state) => state.getExpenses);
    const currentGroup: Group | null = useGroupStore((state) => state.current);
    const router = useIonRouter();
    console.log('routeInfo', router.routeInfo);

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

    useEffect(() => {
        console.log('personList', personList);
        console.log('expenseList', expenseList);
    }, [personList, expenseList]);

    const onExpenseModalClose = () => {
        setExpense(null);
    }

    return (
        <AppLayout title={currentGroup?.title}>
            <div className="page-body">
                <div className="section-title">Actions:</div>
                <div className="section-actions">
                    <IonButton size="small" shape="round" onClick={onAddExpenseClick}>
                        <IonIcon icon={addOutline} slot="start"></IonIcon>
                        Expense
                    </IonButton>
                    <IonButton size="small" shape="round" color="secondary" onClick={onAddPersonClick}>
                        <IonIcon icon={addOutline} slot="start"></IonIcon>
                        Person
                    </IonButton>
                </div>

                <div className="person-list">
                    {
                        personList.map((person, index: number) => (
                            <IonChip className="person-item" key={`personItem${index}-${person.id}`}>
                                <IonAvatar>
                                    <img src={person.gender === 'M' ? defaultImg : altImg} alt='defaultImg' />
                                </IonAvatar>
                                <IonLabel>{person.name}</IonLabel>
                            </IonChip>
                        ))
                    }
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
                <div className="expense-list">
                    {
                        expenseList.map((expense: Expense, index: number) => (
                            <ExpenseItem onEditClick={onEditClick} expense={expense} key={`expenseItem${index}${expense.id}`} />
                        ))
                    }
                </div>
            </div>
            <ExpenseModal onModalClose={onExpenseModalClose} expense={expense} state={expenseModal} setState={setExpenseModal} />
            <PersonModal state={personModal} setState={setPersonModal} />
        </AppLayout>
    );
}