import { useMemo } from 'react';
import { Expense, Person } from '../../../models';
import usePersonStore from '../../../store/person/person.store';
import './SummaryContribution.css';
import { IonIcon } from '@ionic/react';
import { arrowForwardOutline } from 'ionicons/icons';

interface SummaryContributionProps {
    list: Expense[]
}

interface Contributor {
    isPaid?: boolean;
    payer?: Person,
    breakdown?: any[];
    newContribution?: number;
}

interface Contribution {
    payer: Person,
    contributors: Person[] & Contributor[],
    contributions: Person[],
    total: number,
    isPaid: boolean,
}

export const SummaryContribution: React.FC<SummaryContributionProps> = ({
    list
}) => {
    const getPerson = usePersonStore((state) => state.getPerson);


    const findAllContributions = (contributions: Contribution[], payer: Person & Contributor, contributor: Person & Contributor) => {
        console.log('[findAllContributions] contributions', contributions);
        const contribution: Contribution | undefined = contributions.find((contribution: Contribution) => contribution.payer.id === payer.id);
        console.log('[findAllContributions] contribution', contribution);

        if (contribution) {
            return contribution.contributors.filter((contr: Person & Contributor) => contr.id === contributor.id);
        }

        return [];
    }


    const contributionSummary = useMemo((): Contribution[] => {
        const expenseList: Expense[] = [...list];
        console.log('[contributionSummary] expenseList', expenseList);

        const payerIdsArr = [...new Set(expenseList.map((el) => el.payer_id))];
        console.log('[contributionSummary] payerIdsArr', payerIdsArr);
        let contributions: Contribution[] = [];
        for (const payer_id of payerIdsArr) {
            if (payer_id != 'all') {
                const payer = getPerson(payer_id);

                const payerHasContributionTo: Expense[] = [];
                const contribution: Contribution = {
                    payer,
                    total: 0,
                    contributors: [],
                    contributions: [],
                    isPaid: false
                };

                // find all expenses paid by payer
                expenseList.forEach((expense) => {
                    if (expense.payer_id === payer_id) {
                        // add all total amount paid by payer
                        contribution.total += parseFloat(expense.amount.toString());

                        // add all expenses total that needs to be paid to payer
                        expense.contributors.forEach((person: Person) => {
                            if (person.id === payer_id) {
                                contribution.contributions.push(person);
                            }

                            // if person is not existing in contributors
                            if (!contribution.contributors.find((p) => p.id === person.id)) {
                                contribution.contributors.push({ ...person, payer, isPaid: false });
                            } else { // if person exists then update total contribution
                                contribution.contributors = contribution.contributors.map((p) => {
                                    if (p.id === person.id) {
                                        const personTemp = { ...p };
                                        if (personTemp.contribution !== undefined && person.contribution !== undefined) { //update contributor's contribution
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

                contributions.push(contribution);
            }
        }
        // find the largest payer
        contributions.sort((a: Contribution, b: Contribution) => b.total - a.total);

        contributions.forEach((contribution: Contribution, index: number) => {
            console.log('[contributionSummary] checking contribution item payer', contribution.payer.name);
            contribution.contributors.forEach((contributor: Person & Contributor) => {
                console.log('[contributionSummary] checking contributor', contributor.name);
                if (contributor.payer?.id == contribution.payer.id && !contributor.isPaid) {
                    console.log(`[contributionSummary] finding contributions of ${contribution.payer.name} to ${contributor.name}`);
                    const conts: Person[] & Contributor[] = findAllContributions(contributions, contributor, contribution.payer);
                    console.log('[contributionSummary] conts', conts);

                    if (conts.length > 0) {
                        const total = conts.map(item => item.contribution ?? 0).reduce((a: number, b: number) => {
                            return a + b;
                        }, 0);
                        if (contributor.contribution! - total >= 0) {
                            contributor.breakdown = conts;
                            contributor.newContribution = contributor.contribution! - total;
                            conts.forEach((item: Person & Contributor) => {
                                item.isPaid = true;
                            });
                        }
                    }
                }
            });
        });
        console.log('[contributionSummary] contributions', contributions);

        return contributions;

    }, [list]);

    return (
        <div>
            {
                contributionSummary.map((contribution, index: number) => (
                    <div className='summary-contribution-wrapper' key={`contributionItem${index}`}>
                        <div>Total amount paid by <b>{contribution.payer.name}</b>:<b> P {contribution.total?.toFixed(2)}</b></div>
                        <br />
                        {
                            contribution.contributors.map((contributor: Person & Contributor, contIndex: number) => (
                                <div className={`contributor-item ${contributor.isPaid && 'contribution-paid'}`} key={`contributorItem${index}${contIndex}`}>
                                    <div>
                                        <b>{contributor.name}</b>
                                        <IonIcon icon={arrowForwardOutline} style={{ margin: '0 15px' }} />
                                        <b>{contribution.payer.name}</b>
                                    </div>

                                    <div className='amount'>
                                        <b className={`${contributor?.newContribution && 'contribution-paid'}`}>P {contributor.contribution?.toFixed(2)}</b>
                                        {
                                            contributor?.newContribution &&
                                            <b className='new-contribution'>P {contributor.newContribution?.toFixed(2)}</b>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    );
}