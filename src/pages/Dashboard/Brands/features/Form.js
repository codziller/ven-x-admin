import React, { useEffect, useMemo, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import PropTypes from "prop-types";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { ReactComponent as Plus } from "assets/icons/add.svg";
import { ReactComponent as ArrowBack } from "assets/icons/Arrow/arrow-left-black.svg";
import { ReactComponent as Close } from "assets/icons/close-x.svg";
import Button from "components/General/Button/Button";
import Input from "components/General/Input/Input";
import Textarea from "components/General/Textarea/Textarea";
import { Link } from "react-router-dom";
import BrandsStore from "../store";
import Wysiwyg from "components/General/Textarea/Wysiwyg";
import CategoriesStore from "pages/Dashboard/Categories/store";
import ImagePicker from "components/General/Input/ImagePicker";
import { observer } from "mobx-react-lite";
import cleanPayload from "utils/cleanPayload";
import {
  uploadImageToCloud,
  uploadImagesToCloud,
} from "utils/uploadImagesToCloud";
import { errorToast } from "components/General/Toast/Toast";
import { isArray, isEmpty } from "lodash";
import { flattenCategories } from "utils/functions";
import DetailsModal from "./DetailsModal";
import { PRODUCT_MODAL_TYPES } from "utils/appConstant";

const { PRODUCT_CATEGORY_OPTIONS } = PRODUCT_MODAL_TYPES;
const Form = ({ details, toggler }) => {
  const [formTwo, setFormTwo] = useState({
    country: "NG",
    showFormError: false,
    brandDescription: details?.isAdd
      ? ""
      : EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(JSON.parse(details?.brandDescription))
          )
        ),
    // brandDescription: details?.isAdd ? "" : "",
    collapsed: [],
    modalType: "",
    createLoading: false,
  });

  const schema = yup.object({
    brandName: yup.string().required("Please enter brand name"),
    brandLogoUrl: yup
      .array()
      .min(1, "Please select brand logo")
      .required("Please select brand logo"),
    imageUrls: yup
      .array()
      .min(1, "Please select images for this brand")
      .required("Please select images for this brand"),
  });

  const { createBrand, editBrand } = BrandsStore;

  const { categories, loading, getCategories } = CategoriesStore;

  useEffect(() => {
    getCategories();
  }, []);

  const defaultValues = {
    brandName: details?.brandName,
    brandDescription: details?.isAdd ? "" : details?.brandDescription,
    // brandDescription: "",
    brandLogoUrl: details?.brandLogoUrl ? [details?.brandLogoUrl] : [],
    brandName: details?.brandName,
    brandShortText: details?.brandShortText,
    categoryId: details?.categoryId,
    imageUrls: details?.imageUrls || [],
    videoUrls: details?.videoUrls || [],
  };

  console.log("defaultValues: ", defaultValues);

  const {
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    trigger,
    watch,
  } = useForm({
    defaultValues,
    mode: "onSubmit",
    resolver: yupResolver(schema),
  });
  const handleChange = async (prop, val, rest, isFormTwo, isWysywyg) => {
    isFormTwo && setFormTwo({ ...formTwo, [prop]: val });
    const updatedVal = isWysywyg
      ? JSON.stringify(draftToHtml(convertToRaw(val?.getCurrentContent())))
      : rest
      ? [...val, ...rest]
      : val;
    setValue(prop, updatedVal);
    await trigger(prop);
  };

  const handleChangeTwo = async (prop, val) => {
    setFormTwo({ ...formTwo, [prop]: val });
  };

  const form = {
    brandName: watch("brandName"),
    brandDescription: watch("brandDescription"),
    brandLogoUrl: watch("brandLogoUrl"),
    brandShortText: watch("brandShortText"),
    categoryId: watch("categoryId"),
    imageUrls: watch("imageUrls"),
    videoUrls: watch("videoUrls"),
  };

  console.log("form: ", form);
  const handleOnSubmit = async () => {
    handleChangeTwo("createLoading", true);

    try {
      const imagesUrls = await Promise.all([
        uploadImageToCloud(
          isArray(form?.brandLogoUrl)
            ? form?.brandLogoUrl?.[0]
            : form?.brandLogoUrl
        ),
        uploadImagesToCloud(form?.imageUrls),
        uploadImagesToCloud(form?.videoUrls),
      ]);

      if (details?.isAdd) {
        const payload = {
          ...form,
          brandLogoUrl: imagesUrls?.[0],
          imageUrls: imagesUrls?.[1],
          videoUrls: imagesUrls?.[2],
        };

        cleanPayload(payload);

        await createBrand({ data: payload, onSuccess: () => toggler?.() });
        return;
      } else {
        const payload = {
          ...form,
          id: details?.id,
          brandLogoUrl: imagesUrls?.[0],
          imageUrls: imagesUrls?.[1],
          videoUrls: imagesUrls?.[2],
        };

        await editBrand({ data: payload, onSuccess: () => toggler?.() });
        return;
      }
    } catch (error) {
      console.log("imagesUrls error: ", error);
      errorToast(
        "Error!",
        "Error encountered uploading images. Kindly Check the image format."
      );
    } finally {
      handleChangeTwo("createLoading", false);
    }
  };
  const removeFile = (file, prop, files) => {
    let updatedFiles = [...files];
    updatedFiles = updatedFiles.filter(
      (_) => (_?.name || _) !== (file?.name || file)
    );
    handleChange(prop, updatedFiles);
  };

  const flattenedCategories = useMemo(
    () => !isEmpty(categories) && flattenCategories(categories),
    [categories]
  );
  const selectedCategory = useMemo(
    () =>
      !isEmpty(flattenedCategories)
        ? flattenedCategories?.find((item) => item?.id === form?.categoryId)
            ?.name
        : "",
    [flattenedCategories, form?.categoryId]
  );

  return (
    <>
      <div className="gap-y-4 py-4 w-full h-full pb-4 overflow-y-auto">
        {details?.link ? (
          <div className="">
            <Link to={details?.link} className="scale-90">
              <ArrowBack />
            </Link>
          </div>
        ) : (
          <button onClick={() => toggler?.()} className="scale-90 ">
            <Close />
          </button>
        )}

        {details?.isAdd ? (
          <h2 className="section-heading mb-3 text-xl">Add New Brand</h2>
        ) : (
          <h2 className="section-heading mb-3 text-xl  ">Edit Brand</h2>
        )}

        <form
          onSubmit={handleSubmit(handleOnSubmit)}
          className="flex flex-col justify-start items-start gap-5 w-full overflow-y-auto"
        >
          <Input
            label="Brand Name"
            value={form?.brandName}
            onChangeFunc={(val) => handleChange("brandName", val)}
            placeholder="Enter Brand Name"
            formError={errors.brandName}
            showFormError={formTwo?.showFormError}
            required
          />
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

            <div className="h-[13px]">
              {errors?.categoryId && (
                <FormErrorMessage type={errors?.categoryId} />
              )}
            </div>
          </div>
          <Wysiwyg
            label="Brand Description"
            editorState={formTwo?.brandDescription}
            onEditorStateChange={(val) => {
              handleChange("brandDescription", val, false, true, true);
            }}
            placeholder="Enter brand description"
            formError={errors.brandDescription}
            showFormError={formTwo?.showFormError}
          />

          <Textarea
            label="Brand Short Text"
            value={form?.brandShortText}
            onChangeFunc={(val) => handleChange("brandShortText", val)}
            placeholder="Enter a short text for this brand"
            formError={errors.brandShortText}
            showFormError={formTwo?.showFormError}
            required
          />

          <ImagePicker
            label=" Add Brand Logo"
            handleDrop={(val) => handleChange("brandLogoUrl", val)}
            removeImage={(file) =>
              removeFile(file, "brandLogoUrl", form.brandLogoUrl)
            }
            images={form.brandLogoUrl}
            formError={errors.brandLogoUrl}
            showFormError={formTwo?.showFormError}
            multiple={false}
          />
          <ImagePicker
            label=" Add Brand Images"
            handleDrop={(val) => handleChange("imageUrls", val, form.imageUrls)}
            images={form.imageUrls}
            formError={errors.imageUrls}
            showFormError={formTwo?.showFormError}
            removeImage={(file) =>
              removeFile(file, "imageUrls", form.imageUrls)
            }
            multiple
          />
          <ImagePicker
            label=" Add Brand Videos "
            showFormError={formTwo?.showFormError && errors.videoUrls}
            handleDrop={(val) => handleChange("videoUrls", val, form.videoUrls)}
            images={form.videoUrls}
            type="video"
            removeImage={(file) =>
              removeFile(file, "videoUrls", form.videoUrls)
            }
            multiple
          />
          <Button
            onClick={() => setFormTwo({ ...formTwo, showFormError: true })}
            isLoading={formTwo.createLoading}
            type="submit"
            text={details?.isAdd ? "Add Brand" : "Save Changes"}
            className="mb-5 "
            fullWidth
          />
        </form>
      </div>

      <DetailsModal
        active={formTwo?.modalType === PRODUCT_CATEGORY_OPTIONS}
        details={{
          isSingleCategory: true,
          modalType: PRODUCT_CATEGORY_OPTIONS,
          isSideModal: true,
        }}
        toggler={() => handleChangeTwo("modalType", false)}
        handleChange={handleChange}
        form={form}
        type="Post"
      />
    </>
  );
};
Form.propTypes = {
  toggler: PropTypes.func,
  details: PropTypes.object,
};

export default observer(Form);
