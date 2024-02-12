import React from "react";
import i18n from "$/utils/i18n";
import { PageHeader } from "$/webapp/components/page-header/PageHeader";
import { ObjectsTable } from "@eyeseetea/d2-ui-components";
import { columns, mockRows } from "./mock";
import { useDashboard } from "./hooks/useDashboard";

type Props = {
    name: string;
};

export const DashboardPage: React.FC<Props> = React.memo(props => {
    const { customFilters, handleSearchChange } = useDashboard();
    const { name } = props;
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
            />
        </>
    );
});
