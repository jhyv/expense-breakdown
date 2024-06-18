import { IonAvatar, IonButton, IonIcon, IonChip, IonLabel } from "@ionic/react";
import './ExpenseBreakdown.css';
import { AppLayout, ExpenseModal, PersonModal } from "../../components";
import { useEffect, useState } from "react";
import { addOutline } from 'ionicons/icons'
import usePersonStore from "../../store/person/person.store";
import defaultImg from "../../assets/img/default.png";
import altImg from "../../assets/img/woman.png";

interface ExpenseBreakdownProps { }
export const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = () => {
    const [expenseModal, setExpenseModal] = useState(false);
    const [personModal, setPersonModal] = useState(false);
    const personList = usePersonStore((state) => state.personList);
    const onAddExpenseClick = () => {
        setExpenseModal(true);
    }

    const onAddPersonClick = () => {
        setPersonModal(true);
    }

    useEffect(() => {
        console.log('personList', personList);
    }, [personList])

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
            </div>
            <ExpenseModal state={expenseModal} setState={setExpenseModal} />
            <PersonModal state={personModal} setState={setPersonModal} />
        </AppLayout>
    );
}