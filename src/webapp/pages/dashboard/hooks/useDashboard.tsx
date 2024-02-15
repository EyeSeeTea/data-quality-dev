import { useState } from "react";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";
import { useSnackbar } from "@eyeseetea/d2-ui-components";
import i18n from "$/utils/i18n";

export function useDashboard() {
    const [statusIsCompleted, setStatusIsCompleted] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { success } = useSnackbar();

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
    };
}
