import { IonButton, IonIcon } from "@ionic/react";
import './ExpenseBreakdown.css';
import { AppLayout, ExpenseModal, PersonModal } from "../../components";
import { useState } from "react";
import { addOutline } from 'ionicons/icons'

interface ExpenseBreakdownProps { }
export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = () => {
    const [expenseModal, setExpenseModal] = useState(false);
    const [personModal, setPersonModal] = useState(false);

    const onAddExpenseClick = () => {
        setExpenseModal(true);
    }

    const onAddPersonClick = () => {
        setPersonModal(true);
    }

    return (
        <AppLayout title="Expense Breakdown">
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
            </div>
            <ExpenseModal state={expenseModal} setState={setExpenseModal} />
            <PersonModal state={personModal} setState={setPersonModal} />
        </AppLayout>
    );
}