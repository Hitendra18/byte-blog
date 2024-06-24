import { useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfilePicture } from "../../services/index/users";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { userActions } from "../../store/reducers/userReducers";

const CropEasy = ({ photo, setOpenCrop }) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const userState = useSelector((state) => state.user);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ token, formData }) => {
      return updateProfilePicture({
        token: token,
        formData: formData,
      });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      setOpenCrop(false);
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["profile"]);
      toast.success("Profile picture is updated");
      // console.log(data);
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropImage = async () => {
    try {
      const croppedImg = await getCroppedImg(photo?.url, croppedAreaPixels);
      const file = new File([croppedImg.file], `${photo?.file?.name}`, {
        type: photo?.file?.type,
      });
      const formData = new FormData();
      formData.append("profilePicture", file);
      mutate({ token: userState.userInfo.token, formData: formData });
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <div className="fixed z-[1000] inset-0 bg-black/50 flex justify-center p-5 overflow-auto">
      <div className="bg-white h-fit w-full sm:max-w-[350px] p-5 rounded-lg">
        <h2 className="font-semibold text-dark-hard mb-2">Crop Image</h2>
        <div className="relative w-full aspect-square rounded-lg overflow-hidden">
          <Cropper
            image={photo?.url}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div>
          <label
            htmlFor="zoomRange"
            className="block mt-2 mb-0.5 text-sm font-medium text-gray-900"
          >
            Zoom: {`${Math.round(zoom * 100)}%`}
          </label>
          <input
            type="range"
            id="zoomRange"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(e.target.value)}
            className="w-full h-1 mb-6 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="flex justify-between gap-2 flex-wrap">
          <button
            className="px-5 py-2.5 rounded-lg text-red-500 border border-red-500 text-sm disabled:opacity-70"
            onClick={() => setOpenCrop(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2.5 rounded-lg text-white font-bold border border-blue-500 bg-blue-500 text-sm disabled:opacity-70"
            onClick={handleCropImage}
            disabled={isLoading}
          >
            Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
};
export default CropEasy;
