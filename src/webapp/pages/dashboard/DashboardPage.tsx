import React from "react";
import i18n from "$/utils/i18n";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { ObjectsTable } from "@eyeseetea/d2-ui-components";
import { columns, mockRows } from "./mock";
import { ConfirmationDialog } from "@eyeseetea/d2-ui-components";
import { useDashboard } from "./hooks/useDashboard";

type Props = {
    name: string;
};

export const DashboardPage: React.FC<Props> = React.memo(props => {
    const { customFilters, handleSearchChange } = useDashboard();
    const { name } = props;
    const { isDialogOpen, setIsDialogOpen, actions, onDelete } = useDashboard();
    return (
        <>
            <PageHeader title={i18n.t(name)} />
            <ObjectsTable
                rows={mockRows}
                columns={columns}
                allowReorderingColumns={false}
                filterComponents={customFilters}
                searchBoxLabel={i18n.t("Name")}
                onChangeSearch={handleSearchChange}
                actions={actions}
            />
            <ConfirmationDialog
                isOpen={isDialogOpen}
                title={i18n.t("Are you sure you want to delete this?")}
                onSave={onDelete}
                onCancel={() => setIsDialogOpen(false)}
                saveText={i18n.t("Yes, Delete")}
                cancelText={i18n.t("Cancel")}
                fullWidth={true}
                disableEnforceFocus
            />
        </>
    );
});
