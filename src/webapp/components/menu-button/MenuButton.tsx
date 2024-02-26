import i18n from "@eyeseetea/feedback-component/locales";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

import { memo, useState, MouseEvent } from "react";
import styled from "styled-components";

type Item = {
    label: string;
    id: string;
    handleClick: () => void;
};

type Props = {
    label: string;
    items: Item[];
};

export const MenuButton: React.FC<Props> = memo(({ label, items }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const onOpenMenu = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Container>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="contained"
                color="primary"
                onClick={onOpenMenu}
                endIcon={anchorEl ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
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
                    <MenuItem key={item.id} onClick={handleClose}>
                        <Button variant="text" color="primary" onClick={item.handleClick}>
                            {i18n.t(item.label)}
                        </Button>
                    </MenuItem>
                ))}
            </Menu>
        </Container>
    );
});

const Container = styled.div`
    margin-inline-start: 1rem;
`;
