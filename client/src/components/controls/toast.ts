import { toast } from 'react-toastify';

export function toastError(msg: string) {
  toast.error(msg, {
    position: "bottom-right",
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
}
