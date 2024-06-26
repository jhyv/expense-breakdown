import { addOutline } from 'ionicons/icons';
import { AppLayout } from '../../components';
import './Groups.css';
import { GroupModal } from '../../components/modals/group-modal/GroupModal';
import { useState } from 'react';

interface GroupsProps { }

export const Groups: React.FC<GroupsProps> = () => {
    const [groupModal, setGroupModal] = useState(false);

    const btns = [
        {
            icon: addOutline,
            handler: () => {
                setGroupModal(true);
            }
        }
    ]
    return (
        <AppLayout title="List" customBtns={btns}>
            <GroupModal state={groupModal} setState={setGroupModal} />
        </AppLayout>
    );
}