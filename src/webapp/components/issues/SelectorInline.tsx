import React from "react";
import { Button, Menu } from "@material-ui/core";
import { MenuItem } from "material-ui";
import i18n from "$/utils/i18n";

export const SelectorInline: React.FC<SelectorInlineProps> = React.memo(props => {
    const { value, items, onChange } = props;
    const [text, setText] = React.useState(value);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const onOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleClick = (item: Item) => {
        onChange(item.id);
        setText(item.label);
    };

    return (
        <>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                variant="text"
                onClick={onOpenMenu}
                title={i18n.t("Double click to edit")}
                style={{ height: text.length === 0 ? "70px" : undefined }}
            >
                {text}
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
                        <Button variant="text" color="primary" onClick={() => handleClick(item)}>
                            {item.label}
                        </Button>
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
});

type Item = { id: string; label: string };
type SelectorInlineProps = { items: Item[]; value: string; onChange: (value: string) => void };
