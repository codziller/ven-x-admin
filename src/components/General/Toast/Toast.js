import { Toaster, ToastBar, toast } from "react-hot-toast";
import { ReactComponent as Success } from "assets/icons/Toast/success.svg";
import { ReactComponent as Error } from "assets/icons/Toast/error.svg";
import { ReactComponent as Warning } from "assets/icons/Toast/warning.svg";
import styled from "styled-components";

const DEFAULT_TOAST_DURATION = 5000;

const defaultConfig = { duration: DEFAULT_TOAST_DURATION };

const ToastLoader = styled.div`
  height: 5px;
  background-color: var(--bani-blue);
  position: absolute;
  left: -200%;
  bottom: 0;
  width: 200%;
  animation: slide-right ${(props) => props.duration / 1000}s ease forwards;

  @keyframes slide-right {
    0% {
    }
    50% {
    }
    100% {
      left: -100%;
    }
  }
`;

const Toast = () => {
  return (
    <Toaster position="top-right">
      {(t) => (
        <ToastBar
          toast={t}
          position="top-right"
          style={{
            width: "396px",
            minHeight: "105px",
            background: "#FFFFFF",
            boxShadow: "0px 0px 10px rgba(225, 231, 242, 0.8)",
            borderRadius: "8px",
            padding: "20px",
            boxSizing: "border-box",
            overflow: "hidden",
          }}
        >
          {({ icon, message }) => {
            const toastIcon =
              t.type === "error" ? (
                <Error />
              ) : t.type === "success" ? (
                <Success />
              ) : message.props.role === "warning" ? (
                <Warning />
              ) : (
                icon
              );
            return (
              <div className="bani-toast">
                <div className="bani-toast-icon mr-[20px]">{toastIcon}</div>
                <div className="bani-toast-message">
                  <span className="bani-toast-header font-700 text-base">
                    {message.props.title}
                  </span>
                  <p className="font-500 text-grey bani-toast-content text-sm mt-[9px]">
                    {message.props.children}
                  </p>
                </div>
                <div className="ml-auto">
                  <p
                    onClick={() => toast.dismiss(t.id)}
                    className="text-blue font-700 text-[12px] cursor-pointer"
                  >
                    Close
                  </p>
                </div>
                <ToastLoader duration={t.duration} />
              </div>
            );
          }}
        </ToastBar>
      )}
    </Toaster>
  );
};

export const warningToast = (title, message) => {
  toast(message, {
    ...defaultConfig,
    ariaProps: {
      role: "warning",
      title,
    },
  });
};

export const successToast = (title, message, config) => {
  toast.success(message, {
    ...defaultConfig,
    ...config,
    ariaProps: {
      role: "success",
      title,
    },
  });
};

export const errorToast = (title, message) => {
  toast.error(message, {
    ...defaultConfig,
    ariaProps: {
      role: "error",
      title,
    },
  });
};

export default Toast;
