import React from "react";
import { IconButton, TextField } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";

import i18n from "$/utils/i18n";
import styled from "styled-components";

export const InputInline: React.FC<InputInlineProps> = React.memo(props => {
    const { value, onSave } = props;
    const [showInput, setShowInput] = React.useState(false);
    const [text, setText] = React.useState(() => value);
    const inputRef = React.useRef<HTMLInputElement>();

    const onDoubleClick = () => {
        setShowInput(true);
    };

    const onCancel = () => {
        setShowInput(false);
    };

    const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            const currentValue = inputRef.current?.value || "";
            setShowInput(false);
            setText(currentValue);
            onSave(currentValue);
        }
    };

    return (
        <>
            {showInput ? (
                <div>
                    <TextField
                        onKeyUp={onKeyUp}
                        autoFocus
                        defaultValue={text}
                        inputRef={inputRef}
                    />
                    <div>
                        <IconButton
                            aria-label={i18n.t("Save")}
                            onClick={() => {
                                setShowInput(false);
                                setText(inputRef.current?.value || "");
                                onSave(inputRef.current?.value || "");
                            }}
                            size="small"
                        >
                            <SaveIcon />
                        </IconButton>
                        <IconButton aria-label={i18n.t("Cancel")} onClick={onCancel} size="small">
                            <CancelIcon />
                        </IconButton>
                    </div>
                </div>
            ) : (
                <CellContainer
                    style={{ height: text.length === 0 ? "70px" : undefined }}
                    onDoubleClick={onDoubleClick}
                    title={i18n.t("Double click to edit")}
                >
                    {text}
                </CellContainer>
            )}
        </>
    );
});

const CellContainer = styled.div`
    border: transparent;
    cursor: pointer;
    &:hover {
        border: 1px solid #e0e0e0;
        transition: border ease-in 0.2s;
    }
`;

type InputInlineProps = { value: string; onSave: (value: string) => void };
