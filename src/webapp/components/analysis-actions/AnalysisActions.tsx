import React from "react";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";

import i18n from "$/utils/i18n";

const noop = () => {};

export function useAnalysisActions(props: UseAnalysisActionsProps) {
    const { statusIsCompleted } = props;
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const actions = React.useMemo(() => {
        return [
            {
                multiple: false,
                name: "Analysis",
                icon: <PlayCircleOutlineIcon />,
                text: i18n.t("Start analysis"),
                onClick: noop,
            },
            {
                multiple: true,
                name: statusIsCompleted ? "InProgress" : "Complete",
                icon: statusIsCompleted ? (
                    <AssignmentOutlinedIcon />
                ) : (
                    <AssignmentTurnedInOutlinedIcon />
                ),
                text: statusIsCompleted
                    ? i18n.t("Mark as In Progress")
                    : i18n.t("Mark as Complete"),
                onClick: noop,
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
    }, [statusIsCompleted]);

    return { actions: actions, isDialogOpen: isDialogOpen, setIsDialogOpen: setIsDialogOpen };
}

type UseAnalysisActionsProps = {
    statusIsCompleted: boolean;
};
