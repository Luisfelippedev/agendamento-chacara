import React, { ReactNode } from "react";
import Button from "@mui/material/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  // eslint-disable-next-line no-undef
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AppConfirmDialogProps = {
  dialogTitle: string | ReactNode;
  open: boolean;
  onDeny: (isOpen: boolean) => void;
  title: string | ReactNode;
  onConfirm: () => void;
  reverseButtons?: boolean; // Adiciona a prop opcional
};

const AppConfirmDialog: React.FC<AppConfirmDialogProps> = ({
  open,
  onDeny,
  onConfirm,
  title,
  dialogTitle,
  reverseButtons = false, // Define o valor padrão como false
}) => {
  return (
    <Dialog
      TransitionComponent={Transition}
      open={open}
      onClose={() => onDeny(false)}
    >
      <DialogTitle>
        <Typography
          sx={{
            mb: 3,
            fontWeight: 400,
          }}
          id="alert-dialog-title"
        >
          {dialogTitle}
        </Typography>
      </DialogTitle>
      <DialogContent
        sx={{ color: "text.secondary", fontSize: 14 }}
        id="alert-dialog-description"
      >
        {title}
      </DialogContent>
      <DialogActions
        sx={{
          pb: 5,
          px: 6,
        }}
      >
        {reverseButtons ? (
          <>
            <Button
              variant="contained"
              sx={{
                fontWeight: 600,
                width: 100,
              }}
              onClick={() => onDeny(false)}
              color="error"
            >
              NÃO
            </Button>
            <Button
              variant="contained"
              sx={{
                fontWeight: 600,
                width: 100,
              }}
              onClick={onConfirm}
              color="primary"
              autoFocus
            >
              SIM
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              sx={{
                fontWeight: 600,
                width: 100,
              }}
              onClick={onConfirm}
              color="primary"
              autoFocus
            >
              SIM
            </Button>
            <Button
              variant="contained"
              sx={{
                fontWeight: 600,
                width: 100,
              }}
              onClick={() => onDeny(false)}
              color="error"
            >
              NAO
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AppConfirmDialog;
