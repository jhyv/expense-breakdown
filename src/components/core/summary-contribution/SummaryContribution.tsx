import { useMemo } from 'react';
import { Expense, Person } from '../../../models';
import usePersonStore from '../../../store/person/person.store';
import './SummaryContribution.css';

interface SummaryContributionProps {
    list: Expense[]
}

interface Contribution {
    payer: Person,
    contributors: Person[],
    total: number,
    isPaid: boolean,
}

export const SummaryContribution: React.FC<SummaryContributionProps> = ({
    list
}) => {
    const getPerson = usePersonStore((state) => state.getPerson);

    const contributionSummary = useMemo((): Contribution[] => {
        const expenseList: Expense[] = [...list];
        console.log('[contributionSummary] expenseList', expenseList);
        const payerIdsArr = [...new Set(expenseList.map((el) => el.payer_id))];
        console.log('[contributionSummary] payerIdsArr', payerIdsArr);
        const contributions: any[] = [];
        for (const payer_id of payerIdsArr) {
            const person = getPerson(payer_id);
            console.log('[contributionSummary] person', person.name);
            const payerHasContributionTo: Expense[] = [];
            const contribution: Contribution = {
                payer: person,
                total: 0,
                contributors: [],
                isPaid: false
            };

            expenseList.forEach((expense) => {
                if (expense.payer_id === payer_id) {
                    contribution.total += parseFloat(expense.amount.toString());
                    expense.contributors.forEach((person: Person) => {
                        if (!contribution.contributors.find((p) => p.id === person.id)) {
                            contribution.contributors.push(person);
                        } else {
                            contribution.contributors = contribution.contributors.map((p) => {
                                if (p.id === person.id) {
                                    const personTemp = { ...p };
                                    if (personTemp.contribution !== undefined && person.contribution !== undefined) {
                                        personTemp.contribution += person?.contribution;
                                    }

                                    return personTemp;
                                }

                                return p;
                            })
                        }

                        if (person.id === payer_id) {
                            payerHasContributionTo.push(expense);
                        }
                    })
                }
            });

            console.log('[contributionSummary] payerHasContributionTo', payerHasContributionTo);

            // check payer if have contributions

            contributions.push(contribution);
        }

        console.log('[contributionSummary] contributions', contributions);



        return contributions;
    }, [list]);

    return (
        <div>
            {
                contributionSummary.map((contribution, index: number) => (
                    <div className='summary-contribution-wrapper' key={`contributionItem${index}`}>
                        <div>Total paid by {contribution.payer.name}: P {contribution.total}</div>
                        {
                            contribution.contributors.map((contributor, contIndex: number) => (
                                <div className='contributor-item' key={`contributorItem${index}${contIndex}`}>
                                    {contributor.name} will pay {contribution.payer.name} P {contributor.contribution?.toFixed(2)}
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
}