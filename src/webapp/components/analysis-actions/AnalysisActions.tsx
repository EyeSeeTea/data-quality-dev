import React from "react";
import { TableAction } from "@eyeseetea/d2-ui-components";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import AssignmentTurnedInOutlinedIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import AssignmentOutlinedIcon from "@material-ui/icons/AssignmentOutlined";

import i18n from "$/utils/i18n";
import { QualityAnalysis } from "$/domain/entities/QualityAnalysis";
import { Id } from "$/domain/entities/Ref";

const noop = () => {};

export function useAnalysisTableActions(props: UseAnalysisActionsProps) {
    const { onDelete, statusIsCompleted } = props;

    const actions = React.useMemo((): TableAction<QualityAnalysis>[] => {
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
                onClick: ids => {
                    onDelete(ids);
                },
            },
        ];
    }, [statusIsCompleted, onDelete]);

    return { actions: actions };
}

type UseAnalysisActionsProps = {
    statusIsCompleted: boolean;
    onDelete: (ids: Id[]) => void;
};
