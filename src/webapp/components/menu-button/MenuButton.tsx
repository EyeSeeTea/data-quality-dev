import i18n from "@eyeseetea/feedback-component/locales";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { memo, useState, MouseEvent } from "react";
import styled from "styled-components";

type Item = {
    label: string;
    id: string;
};

type Props = {
    label: string;
    items: Item[];
    handleClick: () => void;
};

export const MenuButton: React.FC<Props> = memo(({ label, items, handleClick }) => {
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
                    <MenuItem key={item.label}>
                        <Button variant="text" color="primary" onClick={handleClick}>
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
