import { Transfer } from "@dhis2/ui";
import { DialogContent } from "@material-ui/core";
import { TableColumnSelector } from "./TableColumnSelector";
import { ReferenceObject, TableColumn } from "./types";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";

interface ColumnSelectorDialogProps<T extends ReferenceObject> {
    columns: TableColumn<T>[];
    visibleColumns: (keyof T)[];
    allowReorderingColumns?: boolean;
    onChange: (visibleColumns: (keyof T)[]) => void;
    onCancel: () => void;
}

export function ColumnSelectorDialog<T extends ReferenceObject>(
    props: ColumnSelectorDialogProps<T>
) {
    const { columns, visibleColumns, onChange, onCancel, allowReorderingColumns = true } = props;
    const sortableColumns = columns.map(({ name, text: label }) => ({ label, value: name }));

    return (
        <ConfirmationDialog
            isOpen={true}
            title={i18n.t("Columns to show in table")}
            onCancel={onCancel}
            cancelText={i18n.t("Close")}
            maxWidth={"lg"}
            fullWidth={true}
            disableEnforceFocus
        >
            <DialogContent>
                {allowReorderingColumns ? (
                    <Transfer
                        options={sortableColumns}
                        selected={visibleColumns.map(String)}
                        enableOrderChange={true}
                        filterable={true}
                        filterablePicked={true}
                        selectedWidth="100%"
                        optionsWidth="100%"
                        height="400px"
                        onChange={({ selected }: { selected: string[] }) =>
                            onChange(selected as (keyof T)[])
                        }
                    />
                ) : (
                    <TableColumnSelector
                        columns={columns}
                        visibleColumns={visibleColumns}
                        onChange={onChange}
                    />
                )}
            </DialogContent>
        </ConfirmationDialog>
    );
}

export default ColumnSelectorDialog;
