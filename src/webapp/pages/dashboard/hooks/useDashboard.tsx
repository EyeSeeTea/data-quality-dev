import { Dropdown } from "@eyeseetea/d2-ui-components";
import { useState } from "react";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";
import { useCallback } from "react";
import { MenuButton } from "$/webapp/components/menu-button/MenuButton";

export function useDashboard() {
    const [statusIsCompleted, setStatusIsCompleted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { success } = useSnackbar();

    const dropdownItems = [
        {
            value: "READY",
            text: i18n.t("Ready"),
        },
        {
            value: "RUNNING",
            text: i18n.t("Running"),
        },
        {
            value: "FAILURE",
            text: i18n.t("Failure"),
        },
        {
            value: "DONE",
            text: i18n.t("Done"),
        },
    ];

    const valueChange = (e: any) => {
        alert(`Valor cambiado: ${e.target.value}`);
    };

    const handleSearchChange = useCallback((newSearch: string) => {
        alert(newSearch);
    }, []);

    const menuButtonItems = [
        {
            label: "Module 1",
            id: "module-1",
            handleClick: () => alert("Module 1"),
        },
        {
            label: "Module 2",
            id: "module-2",
            handleClick: () => alert("Module 2"),
        },
    ];

    const customFilters = (
        <>
            <Dropdown
                key={"level-filter"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("Dataset")}
            />
            <Dropdown
                key={"level-filter1"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("Start Date")}
            />
            <Dropdown
                key={"level-filter2"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("End Date")}
            />
            <Dropdown
                key={"level-filter3"}
                items={dropdownItems}
                onChange={valueChange}
                value={"somevalue"}
                label={i18n.t("Status")}
            />
            <MenuButton label={"New Data Quality"} items={menuButtonItems} />
        </>
    );

    const onDelete = () => {
        alert("delete element");
        setIsDialogOpen(false);
        success("Selected element deleted successfully");
    };

    const onToggleStatus = () => {
        alert("status changed");
        setIsDialogOpen(false);
        success("Status changed");
    };

    const onStartingAnalysis = () => {};

    const actions = [
        {
            multiple: false,
            name: "Analysis",
            icon: <PlayCircleOutlineIcon />,
            text: i18n.t("Start analysis"),
            onClick: onStartingAnalysis,
        },
        {
            multiple: true,
            name: statusIsCompleted ? "InProgress" : "Complete",
            icon: statusIsCompleted ? (
                <AssignmentOutlinedIcon />
            ) : (
                <AssignmentTurnedInOutlinedIcon />
            ),
            text: statusIsCompleted ? i18n.t("Mark as In Progress") : i18n.t("Mark as Complete"),
            onClick: onToggleStatus,
        },
        {
            multiple: true,
            name: "Delete",
            icon: <DeleteOutlinedIcon />,
            text: i18n.t("Delete"),
            onClick: () => {
                setIsDialogOpen(true);
            },
        },
    ];

    return {
        isDialogOpen,
        setIsDialogOpen,
        actions,
        onDelete,
        customFilters,
        handleSearchChange,
    };
}
