import React from "react";

export default function AlertError(props) {
  const { messageError } = props;

  // XỬ LÝ messageError CÓ THỂ LÀ STRING HOẶC OBJECT
  const getErrorMessage = () => {
    if (!messageError) return "Đã có lỗi xảy ra";

    if (typeof messageError === "string") {
      return messageError;
    }

    if (typeof messageError === "object") {
      // TRẢ VỀ message HOẶC content TỪ OBJECT
      return (
        messageError.content ||
        messageError.message ||
        JSON.stringify(messageError)
      );
    }

    return "Đã có lỗi xảy ra";
  };

  return (
    <div>
      <div className="p-5">
        <div>
          <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-md text-red-700 border border-red-300">
            <div slot="avatar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="feather feather-alert-octagon w-5 h-5 mx-2"
              >
                <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" />
                <line x1={12} y1={8} x2={12} y2={12} />
                <line x1={12} y1={16} x2="12.01" y2={16} />
              </svg>
            </div>
            <div className="text-xl font-normal max-w-full flex-initial">
              {getErrorMessage()}
            </div>
            <div className="flex flex-auto flex-row-reverse">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
