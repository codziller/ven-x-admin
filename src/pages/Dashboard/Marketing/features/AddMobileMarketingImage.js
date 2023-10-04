import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import Button from "components/General/Button/Button";
import { Link, useNavigate, useParams } from "react-router-dom";
import CircleLoader from "components/General/CircleLoader/CircleLoader";
import { PRODUCT_MODAL_TYPES } from "utils/appConstant";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import MarketingStore from "../store";
import DetailsModal from "./DetailsModal";
import { observer } from "mobx-react-lite";
import ImagePicker from "components/General/Input/ImagePicker";
import CategoriesStore from "pages/Dashboard/Categories/store";
import { uploadImageToCloud } from "utils/uploadImagesToCloud";
import { FormErrorMessage } from "components/General/FormErrorMessage";
import { flattenCategories } from "utils/functions";
import CategoryDetailsModal from "pages/Dashboard/Categories/features/DetailsModal";
import { isArray, isEmpty } from "lodash";
import { errorToast } from "components/General/Toast/Toast";

const { PRODUCT_CATEGORY, PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;

const Form = observer(() => {
  const { warehouse_id, media_id, position } = useParams();
  const { getCategories, categories } = CategoriesStore;

  const navigate = useNavigate();
  const [formTwo, setFormTwo] = useState({
    modalType: "",
    showFormError: false,
    createLoading: false,
  });

  useEffect(() => {
    getCategories();
  }, []);

  const flattenedCategories = useMemo(
    () => !isEmpty(categories) && flattenCategories(categories),
    [categories]
  );

  const schema = yup.object({});

  const {
    createMobileMarketingImage,
    editMobileMarketingImage,
    mobileMarketingImage,
    loadingMobileMarketingImage,
    createMobileMarketingImageLoading,
    editMobileMarketingImageLoading,
  } = MarketingStore;

  const defaultValues = {
    categoryId: position !== "forYou" ? position : "",
    imageUrl: media_id ? mobileMarketingImage?.imageUrl : [],
  };

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });

  const handleChange = async (prop, val) => {
    setValue(prop, val);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    categoryId: watch("categoryId"),
    imageUrl: watch("imageUrl"),
  };

  const selectedCategory = useMemo(
    () =>
      !isEmpty(flattenedCategories)
        ? flattenedCategories?.find((item) => item?.id === form?.categoryId)
            ?.name
        : "",
    [flattenedCategories, form?.categoryId]
  );

  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await uploadImageToCloud(
        isArray(form?.imageUrl) ? form?.imageUrl?.[0] : form?.imageUrl
      );
      const payload = {
        ...form,
        isForYou: !!(position === "forYou"),
        imageUrl: imagesUrls,
      };

      if (!media_id) {
        await createMobileMarketingImage({
          data: payload,
          onSuccess: () => navigate(`/dashboard/marketing/${warehouse_id}`),
        });
        return;
      } else {
        await editMobileMarketingImage({
          data: { ...payload, id: media_id },
          onSuccess: () => navigate(`/dashboard/marketing/${warehouse_id}`),
        });
        return;
      }
    } catch (error) {
      console.log("error: ", error);
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };

  return loadingMobileMarketingImage ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <>
      <div className="h-full md:pr-4 pt-1">
        <div className="flex flex-col justify-start items-center h-full w-full gap-y-5">
          <div className="flex flex-col md:flex-row md:gap-6 justify-between items-start w-full mb-2">
            <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
              <div className="mb-5">
                <Link
                  to={`/dashboard/marketing/${warehouse_id}`}
                  className="scale-90"
                >
                  <ArrowBack />
                </Link>
              </div>
              {media_id ? (
                <h2 className="section-heading my-8 text-xl">
                  Edit Banner (
                  {position === "forYou" ? "For You" : selectedCategory})
                </h2>
              ) : (
                <h2 className="section-heading mb-3 text-xl">
                  Add Banner (
                  {position === "forYou" ? "For You" : selectedCategory})
                </h2>
              )}

              <form
                onSubmit={handleSubmit(handleOnSubmit)}
                className="flex flex-col md:flex-row justify-start items-start gap-10 w-full overflow-y-auto"
              >
                {/* First section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 h-full">
                  <div className="flex flex-col justify-start items-end gap-1 w-full">
                    {form?.categoryId && <p>{selectedCategory}</p>}
                    <Button
                      onClick={() =>
                        handleChangeTwo("modalType", PRODUCT_CATEGORY_OPTIONS)
                      }
                      text="Select Category"
                      icon={<Plus className="text-black current-svg" />}
                      className=""
                      whiteBg
                      fullWidth
                    />
                    <span
                      onClick={() =>
                        handleChangeTwo("modalType", PRODUCT_CATEGORY)
                      }
                      className="text-sm text-blue flex justify-start items-center gap-1 cursor-pointer"
                    >
                      <Plus className="text-blue current-svg w-[16px]" /> Create
                      Category
                    </span>
                    <div className="h-[13px]">
                      {errors?.categoryId && (
                        <FormErrorMessage type={errors?.categoryId} />
                      )}
                    </div>
                  </div>

                  <ImagePicker
                    label="Select Image "
                    handleDrop={(val) => handleChange("imageUrl", val)}
                    images={form.imageUrl}
                    multiple={false}
                    isMarketingImg
                  />

                  <Button
                    onClick={() =>
                      setFormTwo({ ...formTwo, showFormError: true })
                    }
                    isLoading={formTwo.createLoading}
                    type="submit"
                    text={media_id ? "Save Changes" : "Add"}
                    className="mt-8 mb-5"
                    fullWidth
                  />
                </div>

                {/* Second section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
                {/* Third section */}
                <div className="flex flex-col basis-1/3 justify-start items-start gap-y-3 overflow-y-auto"></div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{
          isSingleCategory: true,
          modalType: PRODUCT_CATEGORY_OPTIONS,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
        type="Post"
      />
      <CategoryDetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY}
        details={{ modalType: "add", isAdd: true }}
        toggler={() => handleChangeTwo("modalType", false)}
      />
    </>
  );
});

const AddHomePagePost = () => {
  const { media_id } = useParams();
  const { loadingMobileMarketingImage, getMobileMarketingImage } =
    MarketingStore;

  useEffect(() => {
    media_id && getMobileMarketingImage({ data: { id: media_id } });
  }, []);
  return loadingMobileMarketingImage ? (
    <div className="w-full flex justify-center items-center min-h-[150px]">
      <CircleLoader blue />
    </div>
  ) : (
    <Form />
  );
};

export default observer(AddHomePagePost);
