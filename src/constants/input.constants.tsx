import { FaBuilding, FaCartShopping, FaMoneyBills, FaAppleWhole, FaShirt, FaBowlFood } from "react-icons/fa6";

interface GroupIconSelect {
    icon: () => React.ReactNode;
    text: string;
    key: string;
}

export const GROUP_ICON_LIST: GroupIconSelect[] = [
    {
        icon: () => <FaCartShopping />,
        text: 'Grocery',
        key: 'grocery'
    },
    {
        icon: () => <FaBuilding />,
        text: 'Rent',
        key: 'rent'
    },
    {
        icon: () => <FaMoneyBills />,
        text: 'Salary',
        key: 'salary'
    },
    {
        icon: () => <FaBowlFood />,
        text: 'Food',
        key: 'food'
    },
    {
        icon: () => <FaAppleWhole />,
        text: 'Fruits',
        key: 'fruits'
    },
    {
        icon: () => <FaShirt />,
        text: 'Laundry',
        key: 'laundry'
    },

]