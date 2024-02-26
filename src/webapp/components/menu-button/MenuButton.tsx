import i18n from "@eyeseetea/feedback-component/locales";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { memo, useState, MouseEvent } from "react";

type Item = {
    label: string;
    value: string;
};

type Props = {
    label: string;
    items: Item[];
};

export const MenuButton: React.FC<Props> = memo(({ label, items }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={handleClick}
            >
                {i18n.t(label)}
            </Button>
            <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {items.map(item => (
                    <MenuItem key={item.label} onClick={handleClose}>
                        {i18n.t(item.label)}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
});
