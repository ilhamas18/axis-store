import React, { forwardRef, useImperativeHandle, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, Box } from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";

type ModalInterface = {
  isOpen: boolean;
  onClose: any;
  children: any;
  className?: string;
  animate?: boolean;
  disableScrollLock?: any;
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const CommonModal = ({
  isOpen,
  onClose,
  className,
  animate,
  children,
}: ModalInterface) => {
  const showHideClassName = isOpen
    ? "modal display-block"
    : "modal display-none";
  const [open, setOpen] = useState(true);
  return (
    <>
      {animate ? (
        <Dialog
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          open={isOpen}
          className={className}
        >
          <AnimatePresence>
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
                transition: {
                  delay: 0.3,
                },
              }}
              onClick={() => setOpen(false)}
              className="modal-backdrop"
            >
              <motion.div
                initial={{
                  scale: 0,
                }}
                animate={{
                  scale: 1,
                  transition: {
                    duration: 0.3,
                  },
                }}
                exit={{
                  scale: 0,
                }}
                className="modal-content-wrapper w-[420px] mx:auto"
              >
                <motion.div
                  className="modal-content grow"
                  initial={{
                    x: 100,
                    opacity: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.3,
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    x: 100,
                    opacity: 0,
                  }}
                >
                  {children}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Dialog>
      ) : (
        <Dialog
          open={isOpen}
          TransitionComponent={Transition}
          keepMounted
          className={className}
          onClose={onClose}
          aria-describedby="alert-dialog-slide-description"
          sx={{
            "& .MuiPaper-root": {
              bgcolor: "white",
              maxWidth: "revert",
              borderRadius: "16px",
            },
          }}
        >
          <div className="bg-white w-[80vw] md:w-[40vw] h-auto py-6 px-5 rounded-3xl">
            {/* <Box style={{ backgroundColor: 'white', width: '420px', height: 'auto', borderRadius: '16px', padding }} > */}
            {children}
          </div>
        </Dialog>
      )}
    </>
  );
};

export const CommonModalBotoom = ({
  isOpen,
  onClose,
  className,
  children,
  disableScrollLock,
}: ModalInterface) => {
  return (
    <>
      {className?.includes('wrapper-esim-info') ? (
        <Dialog
          onClose={onClose}
          aria-labelledby="customized-dialog-title"
          open={isOpen}
          className={className}
          disableScrollLock={disableScrollLock}
        >
          <AnimatePresence>
            <motion.div className="modal-content-wrapper w-[420px] mx:auto">
              <motion.div className="modal-content grow">{children}</motion.div>
            </motion.div>
          </AnimatePresence>
        </Dialog>
      ) : (
        <Dialog
          onClose={onClose}
          TransitionComponent={Transition}
          aria-labelledby="customized-dialog-title"
          open={isOpen}
          className={className}
          disableScrollLock={disableScrollLock}
        >
          <AnimatePresence>
            <motion.div className="modal-content-wrapper w-[420px] mx:auto">
              <motion.div className="modal-content grow">{children}</motion.div>
            </motion.div>
          </AnimatePresence>
        </Dialog>
      )}
    </>
  );
};
