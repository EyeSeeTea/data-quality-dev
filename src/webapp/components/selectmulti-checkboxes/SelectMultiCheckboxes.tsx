import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import styled from "styled-components";
import { memo } from "react";

type Option = {
    text: string;
    value: string;
};

type Props = {
    label: string;
    options: Option[];
    value: string[];
    onChange: (values: string[]) => void;
};

export const SelectMultiCheckboxes: React.FC<Props> = memo(
    ({ onChange, options, value, label }) => {
        const onChangeSelector = (event: React.ChangeEvent<{ value: unknown }>) => {
            onChange(event.target.value as string[]);
        };
        return (
            <StyledFormControl>
                <InputLabel id="mutiple-checkbox-label">{label}</InputLabel>
                <Select
                    labelId="mutiple-checkbox-label"
                    id="mutiple-checkbox"
                    multiple
                    value={value}
                    onChange={onChangeSelector}
                    renderValue={selected => (selected as string[]).join(", ")}
                >
                    {options.map(option => (
                        <MenuItem key={option.text} value={option.text}>
                            <Checkbox checked={value.indexOf(option.text) > -1} />
                            <ListItemText primary={option.text} />
                        </MenuItem>
                    ))}
                </Select>
            </StyledFormControl>
        );
    }
);

const StyledFormControl = styled(FormControl)`
    min-width: 7.5rem;
    max-width: 18.75rem;
`;
